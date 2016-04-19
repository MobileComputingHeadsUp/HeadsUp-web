'use strict';

import User from './user.model';
import passport from 'passport';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';
const ResponseHandler = require('../utilities/response.handlers.js');
var SpaceController = require('../space/space.controller');



function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    res.status(statusCode).json(err);
  }
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

/**
 * Get list of users
 * restriction: 'admin'
 */
export function index(req, res) {
  return User.find({}, '-salt -password').exec()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(handleError(res));
}

/**
 * Creates a new user
 */
export function create(req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save()
    .then(function(user) {
      var token = jwt.sign({ _id: user._id }, config.secrets.session, {
        expiresIn: 60 * 60 * 5
      });
      res.json({ token });
    })
    .catch(validationError(res));
}

/**
 * Get a single user
 */
export function show(req, res, next) {
  var userId = req.params.id;

  return User.findById(userId).exec()
    .then(user => {
      if (!user) {
        return res.status(404).end();
      }
      res.json(user.profile);
    })
    .catch(err => next(err));
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
export function destroy(req, res) {
  return User.findByIdAndRemove(req.params.id).exec()
    .then(function() {
      res.status(204).end();
    })
    .catch(handleError(res));
}

/**
 * Change a users password
 */
export function changePassword(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  return User.findById(userId).exec()
    .then(user => {
      if (user.authenticate(oldPass)) {
        user.password = newPass;
        return user.save()
          .then(() => {
            res.status(204).end();
          })
          .catch(validationError(res));
      } else {
        return res.status(403).end();
      }
    });
}

/**
 * Get my info
 */
export function me(req, res, next) {
  var userId = req.user._id;

  return User.findOne({ _id: userId }, '-salt -password').exec()
    .then(user => { // don't ever give out the password or salt
      if (!user) {
        return res.status(401).end();
      }
      res.json(user);
    })
    .catch(err => next(err));
}

// Add a new space profile
export function addSpaceProfile(req, res) {
    // Get relevant data from the request
    // TODO: why the eff are you sending the space profile as a string brad?
    // Serialize that shit into JSON on the client side plz
    let spaceProfile = {}
    if (typeof req.body.profile === "string") {
      spaceProfile = JSON.parse(req.body.profile);
    } else {
      spaceProfile = req.body.profile;
    }
    // Init variables we'll be using
    const spaceID = spaceProfile.spaceID;
    const user = req.user;
    const profiles = user.spaceProfiles;


    // Loook to see if this space Profile already EXISTS
    // Array.find() returns the object or returns undefined
    const existingProfile = profiles.find(profile => String(profile.spaceID) === spaceID);
    if (existingProfile) {
      console.log("Updating an exisiting space profile");
      // Update this Profile
      existingProfile.requiredUserInfoVersion = spaceProfile.requiredUserInfoVersion;
      existingProfile.data = spaceProfile.data;
    }
    else {
      // If the profile doesnt exist, Create it!
      console.log("Creating a new space profile");
      user.spaceProfiles.push(spaceProfile);
    }
    // Save the updated user obj with either the new space profile,
    // Or the updated space profile.
    user.save()
      .then(updated => {
        // Add user to the space.
        SpaceController.addUserToSpace(user.id, spaceID);
        return res.status(200).json(updated);
      });

}

// Clear all of a users space profiles!
export function clearSpaceProfiles(req, res) {
  return User.findById(req.params.id).exec()
    .then(ResponseHandler.handleEntityNotFound(res))
    .then(user => {
      // Clear users in space
      user.spaceProfiles = [];
      return user.save()
        .then(updated => {
          console.log("Cleared all space profiles for user: " + updated.name);
          return updated;
        });
    })
    .then(ResponseHandler.respondWithResult(res))
    .catch(ResponseHandler.handleError(res));
}

/**
 * Authentication callback
 */
export function authCallback(req, res, next) {
  res.redirect('/');
}
