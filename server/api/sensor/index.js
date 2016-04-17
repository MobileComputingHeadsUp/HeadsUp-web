'use strict';

var express = require('express');
var controller = require('./sensor.controller');
import * as auth from '../../auth/auth.service';


var router = express.Router();

router.get('/', controller.index);
router.get('/:model', controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:model', auth.isAuthenticated(), controller.update);
router.patch('/:model', controller.update);
router.delete('/:model', controller.destroy);

module.exports = router;
