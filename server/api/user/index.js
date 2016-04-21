'use strict';

import {Router} from 'express';
import * as controller from './user.controller';
import * as auth from '../../auth/auth.service';
var middleware = require('../utilities/middlewares.js');

var router = new Router();

router.get('/', controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);
router.post('/space_profile', middleware.attatchUserFromGoogleID, controller.addSpaceProfile);
router.post('/generic/info', middleware.attatchUserFromGoogleID, controller.addGenericUserInfo);

// Debug
router.get('/clear/profiles/:id', controller.clearSpaceProfiles);

module.exports = router;
