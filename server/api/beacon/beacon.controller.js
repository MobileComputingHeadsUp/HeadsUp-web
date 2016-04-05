/**
* Don't really need endpoints for a Beacon.
* Will never be creating beacons on their own from the web.
* Will only be adding/modifiying/editing beacons to a space
* This controller will be used to create/edit beacons etc
 */

'use strict';

import _ from 'lodash';
import Beacon from '../beacon/beacon.model';

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
