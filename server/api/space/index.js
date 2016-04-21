'use strict';

var express = require('express');
var controller = require('./space.controller');
var middleware = require('../utilities/middlewares.js');
import * as auth from '../../auth/auth.service';


var router = express.Router();

router.get('/', controller.index);
router.get('/mine', auth.isAuthenticated(), controller.mySpaces);
router.get('/:id', controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

// Space dash feed
router.post('/dash', middleware.attatchUserFromGoogleID, controller.feed);

// Debug stuff
router.get('/clear/users/:id', controller.clearUsersFromSpace);
router.get('/clear/matches/:id', controller.clearMatchesFromSpace);
router.get('/clear/sensors/:id', controller.clearSensorsFromSpace);
router.get('/clear/ads/:id', controller.clearAdsFromSpace);



module.exports = router;
