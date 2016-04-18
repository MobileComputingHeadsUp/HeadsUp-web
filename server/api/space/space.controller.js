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


    // Push the beacon subdoc
    space.beacons.push(beacon);

    //push the sensors subdoc
    for(var i in sensors)
      space.sensors.push(sensors[i]);

    // Save the space to mongoDB
    return space.save()
        .then(ResponseHandler.respondWithResult(res, 201))
        .catch(ResponseHandler.handleError(res));
}

// Updates an existing Space in the DB
export function update(req, res) {
  // Get the space from the body of the request
  const space = req.body;

  // Iterate thru the beacons in the request and forany new ones,
  // Remove them from the space's list, and add the current space's ID to its space attribute
  const newBeacons = _.remove(space.beacons, beacon => beacon.space === undefined );
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
