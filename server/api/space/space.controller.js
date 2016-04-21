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
import mongoose from 'mongoose';
import Space from './space.model';
import User from '../user/user.model';
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
}

// Updates an existing Space in the DB
export function update(req, res) {
  // Get the space from the body of the request
  const newSpace = req.body;

  // Update it using mongoose function
  return Space.update({_id: req.params.id}, newSpace).exec()
    .then(space => {
      console.log("upadated yoo");
      console.log(space);
      return Space.findById(req.params.id)
    })
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

// Function called when user is out of range of all beacons with a space
// This will remove them from the list of users in the spce
export function leave(req, res) {
  // Get data
  const user = req.user;
  const spaceID = req.body.space_id;

  //  Find the space, and the remoce the user who made this request
  // From the list of "usersInSpace"
  // Respond with the updated space object.
  return Space.findById(spaceID).exec()
    .then(ResponseHandler.handleEntityNotFound(res))
    .then(space => {
      // Clear users in space
      const removedUserArray = space.usersInSpace.filter(userObj => userObj.id === String(user.id));
      space.usersInSpace = removedUserArray;
      return space.save()
        .then(updated => {
          console.log("Removed " + user.name + " from space!");
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

// Clear all sensors from the space
export function clearSensorsFromSpace(req, res) {
  return Space.findById(req.params.id).exec()
    .then(ResponseHandler.handleEntityNotFound(res))
    .then(space => {
      // Clear users in space
      space.sensors = [];
      return space.save()
        .then(updated => {
          console.log("Cleared all sensors in space: " + updated.name);
          return updated;
        });
    })
    .then(ResponseHandler.respondWithResult(res))
    .catch(ResponseHandler.handleError(res));
}

// Clear all sensors from the space
export function clearAdsFromSpace(req, res) {
  return Space.findById(req.params.id).exec()
    .then(ResponseHandler.handleEntityNotFound(res))
    .then(space => {
      // Clear users in space
      space.ads = [];
      return space.save()
        .then(updated => {
          console.log("Cleared all ads in space: " + updated.name);
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
  // NEED TO CHECK IF USER IS IN SPACE LOL
  return Space.findById(spaceId).exec()
    .then(space => {

      // Check if user is in the space already.
      let inSpace = space.usersInSpace.some(userObj => userObj.id === userId);

      // If user is not in space already,
      // add em to it and run match algorithm
      if (!inSpace) {
        space.usersInSpace.push(userId);
        // Run match algorithm asyncronously
        matching.checkForMatchesWithNewUser(userId, space);
      } else console.log("!!!!!!!!!!!!!!!@@@@@@@@@USER IS ALRDY IN SPACE");
      return space;
    })
    .then(space => {
      // Save the updated space with the added user to mongoDB
      return space.save()
        .then(updated => {
          return updated;
        });
    });
}


// Space Feed / Dash
export function feed(req, res) {
  // Get necessary data yo
  const spaceID = req.body.space_id;
  const beacons = req.body.beacons;
  const user = req.user;

  // Get the space
  return Space.findById(spaceID).populate('userMatches.user1 userMatches.user2').exec()
    .then(space => {
      // Get general ads from space
      let ads = space.ads;

      // Also add in ads specific to beacons
      const beaconAds = findAllAdsInTheseBeacons(beacons, space.beacons);
      ads = ads.concat(beaconAds);

      const announcments = space.announcments;

      // Will look for matches that contain this user making the req.
      const matches = space.userMatches;

      // A new array of match objects of users this user is matched to.
      const thisUsersMatches = [];

      // Maintain an array of users whom this user has matched with.
      const matchedUsers = [];

      // Find matches that contain this user in the space.
      matches.forEach(match => {
        if (String(match.user1.id) === user.id) {
          const cleanedMatchObj = {};

          // Rename the matched user, and add to array
          // cleanedMatchObj.matchedUser = match.user2;
          cleanedMatchObj.user = {};
          cleanedMatchObj.user.name = match.user2.name;
          try {
            cleanedMatchObj.user.pictureUrl = match.user2.google.image.url;
          }
          catch(err) {
              console.log("user doesnt have a picture");
          }
          cleanedMatchObj.user.bio = match.user2.bio;
          cleanedMatchObj.user.gender = match.user2.gender;

          cleanedMatchObj.user.age = match.user2.age;

          cleanedMatchObj.matchedAttributes = match.matchedAttributes;
          cleanedMatchObj.timestamp = match.timestamp;

          // Keep list of matched users
          matchedUsers.push(String(match.user2));

          // Add to the array of matches
          thisUsersMatches.push(cleanedMatchObj);
        }
        else if (String(match.user2.id) === user.id) {
          const cleanedMatchObj = {};

          // Rename the matched user, and add to array
          cleanedMatchObj.matchedUser = match.user1;
          cleanedMatchObj.user = {};
          cleanedMatchObj.user.name = match.user1.name;
          try {
            cleanedMatchObj.user.pictureUrl = match.user1.google.image.url;
          }
          catch(err) {
              console.log("user doesnt have a picture");
          }
          cleanedMatchObj.user.bio = match.user1.bio;
          cleanedMatchObj.user.gender = match.user1.gender;
          cleanedMatchObj.user.age = match.user1.age;

          cleanedMatchObj.matchedAttributes = match.matchedAttributes;
          cleanedMatchObj.timestamp = match.timestamp;

          // Keep list of matched users
          matchedUsers.push(String(match.user1));

          // Add to the array of matches
          thisUsersMatches.push(cleanedMatchObj);
        }
      });

      // Get all users, filter out matched ones
      const usersInSpace = space.usersInSpace;

      // Filter out matched users from general user list
      // Also make sure we dont send ourself in the general user list
      const filteredUsers = usersInSpace.filter(userObj => {
        !matchedUsers.some(u => u.id === userObj.id) && userObj.id !== user.id
      });

      // Populate and clean up the users in space Array.
      // After promise is returned, respond to client
      return cleanUpUsersInSpace(filteredUsers)
        .then(cleanedUsersInSpace => {
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
            users: cleanedUsersInSpace, //PUT BACK TO FILTERED
            space: spaceInfo
          };
          // Respond
          res.status(200).json(response);
        })
    })
    .catch(ResponseHandler.handleError(res));
}

function cleanUpUsersInSpace(usersInSpace) {
  // Convert ids to mongoose ids
  const userIdsInSpace = usersInSpace.map(userObj => mongoose.Types.ObjectId(userObj.id));

  // Find all users from my arra of ids
  return User.find({ '_id': { $in: userIdsInSpace}}).exec()
    .then(users => {
      const fullyPopulatedUsers = [];

      // Loop through and add timestamps
      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const cleanedUser = {};
        cleanedUser.name = user.name;
        try {
          cleanedUser.pictureUrl = user.google.image.url;
        }
        catch(err) {
            console.log("user doesnt have a picture");
        }
        cleanedUser.bio = user.bio;
        cleanedUser.gender = user.gender;
        cleanedUser.age = user.age;
        const timestamp = usersInSpace[i].timestamp;
        cleanedUser.timestamp = timestamp;
        fullyPopulatedUsers.push(cleanedUser);
      }
      return fullyPopulatedUsers;
    });
}

function findAllAdsInTheseBeacons(beaconIdentifiers, beaconsInSpace) {
  const beaconsInRange = beaconsInSpace.filter(b => beaconIdentifiers.some(i => i === b.identifier));

  // Array of ads containing all ads associated with beacons in range
  let ads = [];
  beaconsInRange.forEach(beacon => {
    if (beacon.vicinityAds.ads) {
      ads = ads.concat(beacon.vicinityAds.ads);
    }
  });
  return ads;
}
