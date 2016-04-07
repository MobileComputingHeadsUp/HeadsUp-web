/**
* Don't really need endpoints for a Beacon.
* Will never be creating beacons on their own from the web.
* Will only be adding/modifiying/editing beacons to a space,
* which will be saved automatically since Beacon is a subdocument of Space.
* This controller will be used mainly to interact with beacons from the app.
 */

'use strict';

import _ from 'lodash';
import Beacon from '../beacon/beacon.model';
import Space from '../space/space.model'
import User from '../user/user.model'
import async from 'async';
var ResponseHandler = require('../utilities/response.handlers.js');


// Middleware function which takes a request made from the android app,
// Finds the associated user in the DB and attatches it to the request.
export function attatchUserFromGoogleID(req, res, next) {
    const googleID = req.body.google_id;
    console.log('the google id is: ');
    console.log(googleID);
    User.findOne({'google.id': googleID}).exec()
        .then(user => {
            req.user = user;
            next();
        })
        .catch(ResponseHandler.handleError(res));
}

// Silly test endpoint.
export function testResponse(req, res) {
    res.status(200).json({msg: 'hello world!'});
}

// Function called when endpoint of the following format is hit:
// Endpoint: '/api/beacons/:identifier'
// This is what is called when you interact with a beacon via the mobile app.
// Currently, this function only has the capability to facilitate interactions
// with a beacon of type "entry".
// If a user is already in the space, it does nothing.
// If a user is not in the space of this beacon, it adds the user to the space,
// and responds with the required user space profile that the user will then fill out
// on the app.
export function hitBeacon(req, res) {
    // Init some useful variables
    const user = req.user;
    const identifier = req.params.identifier;

    // Find the space that this beacon is in
    // Then, do cool shit
    return spaceByBeaconIdentifier(identifier)
        .then(space => {
            // Get the beacon document we hit
            const beacon = space.beacons.find(beacon => beacon.identifier === identifier);

            // Check for user. TODO: will remove this in future.
            // To interact, you must be signed in on the android app.
            if (user === undefined) return {msg: "hey!! sign in you knucle head!"};

            // Check if beacon is an entry beacon
            if (beacon.entry) {
                // Check if this user is in the spaces, returns a boolean
                const inSpace = space.usersInSpace.indexOf(user._id) > -1;

                // If user is in space already, just return it...
                // dont need to do anything else, since this is an entry beacon
                if (inSpace) {
                    return {msg: "Hey, you're in this space already silly!!"};
                }
                // Else, add the user to the space,
                // and respond with the Space profile they need to create.
                else {
                    space.usersInSpace.push(user._id);
                    return space.save()
                        .then(saved => {
                            const requiredData = saved.requriedUserInfo;
                            requiredData.spaceID = saved._id;
                            return requiredData;
                        })
                        .catch(ResponseHandler.handleError(res));
                }
            }
            // Else, this is not an entry beacon
            // TODO: Implement other types of beacons
            else {
                return {msg: 'Hey... we havent implemented non-entry beacons yet. Please try to interact with an entry beacon ;)'};
            }
        })
        .then(ResponseHandler.handleEntityNotFound(res))
        .then(ResponseHandler.respondWithResult(res))
        .catch(ResponseHandler.handleError(res));
}

// Finds a Space that contains a beacon with a certain identifier
// Returns a promise
export function spaceByBeaconIdentifier(identifier) {
    return Space.findOne({'beacons.identifier': identifier}).exec();
}

// Finds a Space that contains a beacon with a certain mongo id
// Returns a promise
export function spaceByBeaconID(id) {
    return Space.find({'beacons._id': id}).exec();
}
