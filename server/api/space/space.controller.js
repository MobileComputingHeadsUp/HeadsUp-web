/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/spaces              ->  index
 * POST    /api/spaces              ->  create
 * GET     /api/spaces/:id          ->  show
 * PUT     /api/spaces/:id          ->  update
 * DELETE  /api/spaces/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Space from './space.model';
const ResponseHandler = require('../utilities/response.handlers.js');
var matching = require('../utilities/matching.js');

// Gets a list of Spaces
export function index(req, res) {
  return Space.find().populate('beacons').exec()
    .then(ResponseHandler.respondWithResult(res))
    .catch(ResponseHandler.handleError(res));
}

// Gets a list of Spaces owned by the current user
export function mySpaces(req, res) {
  return Space.find({
      'spaceOwner': req.user._id
    }).populate('beacons').exec()
    .then(ResponseHandler.respondWithResult(res))
    .catch(ResponseHandler.handleError(res));
}

// Gets a single Space from the DB
export function show(req, res) {
  return Space.findById(req.params.id).exec()
    .then(ResponseHandler.handleEntityNotFound(res))
    .then(ResponseHandler.respondWithResult(res))
    .catch(ResponseHandler.handleError(res));
}

// Creates a new Space in the DB
export function create(req, res) {
  // Get data from the request and create a space
  const newSpace = req.body;
  newSpace.spaceOwner = req.user;

  // Create the space Mongoose model
  const space = new Space(newSpace);

  // Create a beacon with the passed in identifier
  const beacon = {
    identifier: req.body.identifier,
    name: 'A default beacon',
    space: space._id
  }
  const sensors = req.body.sensors;

    const beacons = req.body.additionalBeacons;

  // Push the beacon subdoc
  space.beacons.push(beacon);

<<<<<<< HEAD
  //push the sensors subdoc
  for (var i in sensors)
    space.sensors.push(sensors[i]);

  // Save the space to mongoDB
  return space.save()
    .then(ResponseHandler.respondWithResult(res, 201))
    .catch(ResponseHandler.handleError(res));
=======
    //push the sensors subdoc
    for(var i in sensors)
      space.sensors.push(sensors[i]);
    //push for additional beacons into the subdoc
    for(var i in beacons){
      space.beacons.push(beacons[i]);
    }
    // Save the space to mongoDB
    return space.save()
        .then(ResponseHandler.respondWithResult(res, 201))
        .catch(ResponseHandler.handleError(res));
>>>>>>> add-more-beacons
}

// Updates an existing Space in the DB
export function update(req, res) {
  // Get the space from the body of the request
  const space = req.body;

  // Iterate thru the beacons in the request and forany new ones,
  // Remove them from the space's list, and add the current space's ID to its space attribute
  const newBeacons = _.remove(space.beacons, beacon => beacon.space === undefined);
  newBeacons.forEach(beacon => beacon.space = space._id);

  // Finally, find the space,
  // Push the new beacons into its array. This will create subdocs for each one.
  // Then with saveUpdates, merge the new changes to the exisiting attributes
  // of the space with the space we got from the DB.
  // (Which also has the new beacons we added) and save.
  return Space.findById(req.params.id).exec()
    .then(space => {
      newBeacons.forEach(beacon => space.beacons.push(beacon));
      return space;
    })
    .then(ResponseHandler.handleEntityNotFound(res))
    .then(ResponseHandler.saveUpdates(space))
    .then(ResponseHandler.respondWithResult(res))
    .catch(ResponseHandler.handleError(res));
}

// Deletes a Space from the DB
export function destroy(req, res) {
  return Space.findById(req.params.id).exec()
    .then(ResponseHandler.handleEntityNotFound(res))
    .then(ResponseHandler.removeEntity(res))
    .catch(ResponseHandler.handleError(res));
}

// Clear all usrs from the space
export function clearUsersFromSpace(req, res) {
  return Space.findById(req.params.id).exec()
    .then(ResponseHandler.handleEntityNotFound(res))
    .then(space => {
      // Clear users in space
      space.usersInSpace = [];
      return space.save()
        .then(updated => {
          console.log("Cleared all users in space: " + updated.name);
          return updated;
        });
    })
    .then(ResponseHandler.respondWithResult(res))
    .catch(ResponseHandler.handleError(res));
}

// Clear all matches from the space
export function clearMatchesFromSpace(req, res) {
  return Space.findById(req.params.id).exec()
    .then(ResponseHandler.handleEntityNotFound(res))
    .then(space => {
      // Clear users in space
      space.userMatches = [];
      return space.save()
        .then(updated => {
          console.log("Cleared all matches in space: " + updated.name);
          return updated;
        });
    })
    .then(ResponseHandler.respondWithResult(res))
    .catch(ResponseHandler.handleError(res));
}

// Add user to a space
// This is only called after a user has a space profile for this space.
export function addUserToSpace(userId, spaceId) {
  console.log("Adding user " + userId + " to space");
  return Space.findById(spaceId).exec()
    .then(space => {
      space.usersInSpace.push(userId);
      // Run match algorithm asyncronously
      matching.checkForMatchesWithNewUser(userId, space);
      return space;
    })
    .then(space => {
      // Save the updated space with the added user to mongoDB
      space.save()
        .then(updated => {
          return true;
        })
    })
}


// Space Feed / Dash
export function feed(req, res) {
  // Get necessary data yo
  const spaceID = req.body.space_id;
  const beacons = req.body.beacons;
  const user = req.user;

  // Get the space
  return Space.findById(spaceID).exec()
    .then(space => {
      const ads = space.ads;
      const announcments = space.announcments;

      // Will look for matches that contain this user making the req.
      const matches = space.userMatches;

      // A new array of match objects of users this user is matched to.
      const thisUsersMatches = [];

      // Maintain an array of users whom this user has matched with.
      const matchedUsers = [];

      // Find matches that contain this user in the space.
      matches.forEach(match => {
        if (String(match.user1) === user.id) {
          const cleanedMatchObj = {};

          // Rename the matched user, and add to array
          cleanedMatchObj.matchedUser = match.user2;
          cleanedMatchObj.matchedAttributes = match.matchedAttributes;
          cleanedMatchObj.timestamp = match.timestamp;

          // Keep list of matched users
          matchedUsers.push(String(cleanedMatchObj.matchedUser));

          // Add to the array of matches
          thisUsersMatches.push(cleanedMatchObj);
        }
        else if (String(match.user2) === user.id) {
          const cleanedMatchObj = {};

          // Rename the matched user, and add to array
          cleanedMatchObj.matchedUser = match.user1;
          cleanedMatchObj.matchedAttributes = match.matchedAttributes;
          cleanedMatchObj.timestamp = match.timestamp;

          // Keep list of matched users
          matchedUsers.push(String(cleanedMatchObj.matchedUser));

          // Add to the array of matches
          thisUsersMatches.push(cleanedMatchObj);
        }
      });

      // Get all users, filter out matched ones
      const usersInSpace = space.usersInSpace;

      // Filter out matched users from general user list
      // Also make sure we dont send ourself in the general user list
      const filteredUsers = usersInSpace.filter(userObj => {
        !matchedUsers.some(u => u === userObj.id) && userObj.id !== user.id
      });

      // Info of the space to return
      const spaceInfo = {
        name: space.name,
        description: space.description,
        id: space.id
      }

      // Respond with all the data!
      const response = {
        ads: ads,
        announcments: announcments,
        matches: thisUsersMatches,
        users: filteredUsers,
        space: spaceInfo
      };

      // Respond
      res.status(200).json(response);

    })
    .catch(ResponseHandler.handleError(res));

}
