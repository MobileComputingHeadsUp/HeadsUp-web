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




// Silly test endpoint.
export function testResponse(req, res) {
  res.status(200).json({
    msg: 'hello world!'
  });
}

// Helper function for determing if user profile info is required
export function userInfoRequired(user, space) {
  // Check to see if the users version of the space profile is up to Date.
  let spaceProfiles = user.spaceProfiles;
  if (spaceProfiles != undefined) {
    spaceProfiles.forEach(profile => {
      if (profile.spaceID == space._id &&
        profile.requiredUserInfoVersion ==
         space.requiredUserInfo.requiredUserInfoVersion) {
        return false;
      }
    });
  }
  return true;
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
  const identifier = req.body.beacon_identifier;

  // Find the space that this beacon is in
  // Then, do cool shit
  return spaceByBeaconIdentifier(identifier)
    .then(space => {

      if (space == undefined) {
        return {
          msg: "Could not find space.",
          action: "NONE"
        };
      }
      // Get the beacon document we hit
      const beacon = space.beacons.find(beacon => beacon.identifier === identifier);

      // Check for user. TODO: will remove this in future.
      // To interact, you must be signed in on the android app.
      if (user === undefined) return {
        msg: "hey!! sign in you knucle head!",
        action: "SIGN_IN"
      };

      // Check if beacon is an entry beacon
      if (beacon.entry) {

        // Determine if user info is requiredData
        let userInfoNeeded = userInfoRequired(user, space);

        // Check if this user is in the spaces, returns a boolean
        const inSpace = space.usersInSpace.indexOf(user._id) > -1;

        // For testing I want to always get the space stuff
        // const inSpace = false;

        // If user is in space already, just return it...
        // dont need to do anything else, since this is an entry beacon
        if (inSpace) {
          if (userInfoNeeded) {
            console.log("SPACE" + space);
            let requiredAction = "REQUIRED_USER_INFO";
            return {
              data: space.requiredUserInfo,
              spaceID: space._id,
              action: requiredAction
            };
          } else {
            return {
              msg: "Hey, you're in this space already silly!!",
              action: "NONE"
            };
          }
        }
        // Else, add the user to the space,
        // and respond with the Space profile they need to create.
        else {
          space.usersInSpace.push(user._id);
          return space.save()
            .then(saved => {
              let requiredAction = userInfoNeeded ? "REQUIRED_USER_INFO" : "SPACE_DASH";
              return {
                data: saved.requiredUserInfo,
                spaceID: saved._id,
                action: requiredAction
              }
            })
            .catch(ResponseHandler.handleError(res));
        }
      }
      // Else, this is not an entry beacon
      // TODO: Implement other types of beacons
      else {
        return {
          msg: 'Hey... we havent implemented non-entry beacons yet. Please try to interact with an entry beacon ;)',
          action: "NONE"
        };
      }
    })
    .then(ResponseHandler.handleEntityNotFound(res))
    .then(ResponseHandler.respondWithResult(res))
    .catch(ResponseHandler.handleError(res));
}

// Finds a Space that contains a beacon with a certain identifier
// Returns a promise
export function spaceByBeaconIdentifier(identifier) {
  return Space.findOne({
    'beacons.identifier': identifier
  }).exec();
}

// Finds a Space that contains a beacon with a certain mongo id
// Returns a promise
export function spaceByBeaconID(id) {
  return Space.find({
    'beacons._id': id
  }).exec();
}
