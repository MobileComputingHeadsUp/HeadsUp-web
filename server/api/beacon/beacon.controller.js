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


// Gets a list of Spaces
// export function index(req, res) {
//   return Space.find().exec()
//     .then(ResponseHandler.respondWithResult(res))
//     .catch(ResponseHandler.handleError(res));
// }

// Gets a single Space from the DB
// export function show(req, res) {
//   return Space.findById(req.params.id).exec()
//     .then(ResponseHandler.handleEntityNotFound(res))
//     .then(ResponseHandler.respondWithResult(res))
//     .catch(ResponseHandler.handleError(res));
// }

// Creates a new Beacon in the DB and returns a promise
// PARAM: beacon object with data to create the beacon with
export function create(beacon) {
  beacon.added = Date.now();
  return Beacon.create(beacon);
}

// Function to update a list of beacons in Mongo
// This will normally be used when updating a space
export function updateBeacons(beacons, finished) {

  async.each(beacons, (beacon, callback) => {
    update(beacon)
    .then( (saved) => {
        console.log("did we save the beacon to mongo???");
        console.log(saved);
        callback();
    });
  }, (err) => {
    if (!err) {
      finished();
    }
  })
  // for (var i = 0; i < beacons.length; i++) {
  //   var beacon = beacons[i];
  //   Beacon.findById(beacon.id).exec()
  //     .then(ResponseHandler.handleEntityNotFound())
  //     .then(ResponseHandler.saveUpdates(beacon))
  //     .then(ResponseHandler.respondWithResult())
  //     .catch(ResponseHandler.handleError());
  // }
}

export function update(beacon) {
    if(beacon._id == undefined){
        return create(beacon);
    }
      return Beacon.findById(beacon._id).exec()
          .then( (mongoBeacon) => {
                var updated = _.merge(mongoBeacon, beacon);
                return updated.save()
                    .then(updated => {
                        return updated;
                    });
            }
          );
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
