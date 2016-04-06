/**
* Don't really need endpoints for a Beacon.
* Will never be creating beacons on their own from the web.
* Will only be adding/modifiying/editing beacons to a space
* This controller will be used to create/edit beacons etc
 */

'use strict';

import _ from 'lodash';
import Beacon from '../beacon/beacon.model';
import async from 'async';
var ResponseHandler = require('../utilities/response.handlers.js');


// Gets a list of Beacons
export function index(req, res) {
  return Beacon.find().exec()
    .then(ResponseHandler.respondWithResult(res))
    .catch(ResponseHandler.handleError(res));
}

// Gets a single Space from the DB
// export function show(req, res) {
//   return Space.findById(req.params.id).exec()
//     .then(ResponseHandler.handleEntityNotFound(res))
//     .then(ResponseHandler.respondWithResult(res))
//     .catch(ResponseHandler.handleError(res));
// }


// Function to bulk create a list of beacons in Mongo
// This will normally be used when updating a space, and new beacons
//were added to it
export function createBeacons(beacons, res, finished) {
  // Async-ronously create all these beacons
  // Keep track, and return the updated beacons after being saved in mongo
  let savedBeacons = [];
  async.each(beacons, (beacon, callback) => {
    create(beacon, res)
      .then(saved => {
          console.log("did we create the beacon in mongo???");
          console.log(saved);
          savedBeacons.push(saved);
          callback();
      });
  }, (err) => {
    if (!err) {
      finished(savedBeacons);
    }
  });
}


// Creates a new Beacon in the DB and returns a promise
// PARAM: beacon object with data to create the beacon with
export function create(beacon) {
  beacon.added = Date.now();
  return Beacon.create(beacon);
}

// Function to update a list of beacons in Mongo
// This will normally be used when updating a space
export function updateBeacons(beacons, res, finished) {
  // Async-ronously update all these beacons in mongo wongo
  // Keep track, and return the updated beacons after being updated in mongo
  let updatedBeacons = [];
  async.each(beacons, (beacon, callback) => {
    update(beacon, res)
      .then(saved => {
          console.log("did we save the beacon to mongo???");
          console.log(saved);
          updatedBeacons.push(saved);
          callback();
      });
  }, (err) => {
    if (!err) {
      finished(updatedBeacons);
    }
  });
}

export function update(beacon, res) {
  return Beacon.findById(beacon._id).exec()
    .then(ResponseHandler.saveUpdates(beacon))
    .catch(ResponseHandler.handleError(res));
}

// Updates an existing Space in the DB
// export function update(req, res) {
//   if (req.body._id) {
//     delete req.body._id;
//   }
//   return Space.findById(req.params.id).exec()
//     .then(ResponseHandler.handleEntityNotFound(res))
//     .then(ResponseHandler.saveUpdates(req.body))
//     .then(ResponseHandler.respondWithResult(res))
//     .catch(ResponseHandler.handleError(res));
// }
//
// // Deletes a Space from the DB
// export function destroy(req, res) {
//   return Space.findById(req.params.id).exec()
//     .then(ResponseHandler.handleEntityNotFound(res))
//     .then(ResponseHandler.removeEntity(res))
//     .catch(ResponseHandler.handleError(res));
// }
