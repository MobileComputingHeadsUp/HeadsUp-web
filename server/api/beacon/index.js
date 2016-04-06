'use strict';

var express = require('express');
var controller = require('./beacon.controller');
import * as auth from '../../auth/auth.service';


var router = express.Router();

router.get('/', controller.index);
// router.get('/mine', auth.isAuthenticated(), controller.mySpaces);
// router.get('/:id', controller.show);
// router.post('/', auth.isAuthenticated(), controller.create);
// router.put('/:id', auth.isAuthenticated(), controller.update);
// router.patch('/:id', controller.update);
// router.delete('/:id', controller.destroy);

module.exports = router;
