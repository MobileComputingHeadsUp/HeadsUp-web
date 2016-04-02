'use strict';

import express from 'express'
import * as controller from './google-token.controller';

var router = express.Router();

router.get('/', controller.verifyToken);

export default router;
