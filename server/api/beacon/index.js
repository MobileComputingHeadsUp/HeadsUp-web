'use strict';

var express = require('express');
var controller = require('./beacon.controller');
import * as auth from '../../auth/auth.service';


var router = express.Router();

router.post('/:identifier', controller.attatchUserFromGoogleID, controller.hitBeacon);
router.get('/', controller.testResponse);

module.exports = router;
