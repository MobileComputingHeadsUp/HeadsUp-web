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
var BeaconController  = require('../beacon/beacon.controller.js');
var ResponseHandler = require('../utilities/response.handlers.js');

// Gets a list of Spaces
export function index(req, res) {
  return Space.find().populate('beacons').exec()
    .then(ResponseHandler.respondWithResult(res))
    .catch(ResponseHandler.handleError(res));
}

// Gets a list of Spaces owned by the current user
export function mySpaces(req, res) {
  return Space.find({'spaceOwner': req.user._id}).populate('beacons').exec()
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
  var beaconIdentifier = req.body.identifier;
  // Create a beacon with the passed in identifier
  var beacon = {
      identifier: beaconIdentifier,
      name: 'A beacon'
  }
  BeaconController.create(beacon)
    .then(newBeacon => {
        var newSpace = req.body;
        var user = req.user;
        newSpace.spaceOwner = user;
        newSpace.beacons = [newBeacon._id];
        return Space.create(newSpace)
          .then(ResponseHandler.respondWithResult(res, 201))
          .catch(ResponseHandler.handleError(res));
    })
    .catch(ResponseHandler.handleError(res));
}

// Updates an existing Space in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  // Split up this spaces beacons by new beacons being added and exisiting
  // beacons being updated
  var beacons = req.body.beacons;
  var newBeacons = [];
  var existingBeacons = [];
  for (var beacon of beacons) {
    if (beacon._id == undefined) {
        newBeacons.push(beacon);
    } else existingBeacons.push(beacon);
  }

  // Create beacons, then update existing beacons, then save the space!
  BeaconController.createBeacons(newBeacons, res, createdBeacons => {
    BeaconController.updateBeacons(existingBeacons, res, updatedBeacons => {
      // Combine both the newly created beacons and the newly updated beacons
      // into a single array
      var totalBeacons = updatedBeacons.concat(createdBeacons);
      // When we save to the DB, we only want to save the beacon IDs to the space's beacons arr
      // not the actual beacon objects
      req.body.beacons = totalBeacons.map(beacon => beacon._id);
      // Finally, save the Space.
      return Space.findById(req.params.id).popula.exec()
        .then(ResponseHandler.handleEntityNotFound(res))
        .then(ResponseHandler.saveUpdates(req.body))
        .then(ResponseHandler.respondWithResult(res))
        .catch(ResponseHandler.handleError(res));
    });
  });

}

// Deletes a Space from the DB
export function destroy(req, res) {
  return Space.findById(req.params.id).exec()
    .then(ResponseHandler.handleEntityNotFound(res))
    .then(ResponseHandler.removeEntity(res))
    .catch(ResponseHandler.handleError(res));
}
