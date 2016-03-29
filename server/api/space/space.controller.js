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
import Beacon from '../beacon/beacon.model';
var ResponseHandler = require('../utilities/response.handlers.js');

// Gets a list of Spaces
export function index(req, res) {
  return Space.find().exec()
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
  console.log(req.body);
  var beaconIdentifier = req.body.identifier;
  // Create a beacon with the passed in identifier
  var beacon = {
      identifier: beaconIdentifier,
      name: 'A beacon'
  }
  // TODO: abstract beacon create into own function somewhere else
  Beacon.create(beacon)
    .then(newBeacon => {
        var newSpace = req.body;
        newSpace.beacons = [newBeacon._id];
        return Space.create(newSpace)
          .then(ResponseHandler.respondWithResult(res, 201))
          .catch(ResponseHandler.handleError(res));
    }, error => {
        console.log('Error creating the beacon');
        console.log(error);
    })
}

// Updates an existing Space in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Space.findById(req.params.id).exec()
    .then(ResponseHandler.handleEntityNotFound(res))
    .then(ResponseHandler.saveUpdates(req.body))
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
