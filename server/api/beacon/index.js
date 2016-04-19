'use strict';

var express = require('express');
var controller = require('./beacon.controller');
var middleware = require('../utilities/middlewares.js');
import * as auth from '../../auth/auth.service';


var router = express.Router();

router.post('/hit_beacon', middleware.attatchUserFromGoogleID, controller.hitBeacon);
router.get('/', controller.testResponse);

module.exports = router;
