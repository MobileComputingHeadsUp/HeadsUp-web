'use strict';

// Use local.env.js for environment variables that grunt will set when the server starts locally.
// Use for your api keys, secrets, etc. This file should not be tracked by git.
//
// You will need to set these on the server you deploy to.

module.exports = {
  DOMAIN:           'http://localhost:9000',
  SESSION_SECRET:   'headsupweb-secret',

  GOOGLE_ID: '1093664181012-u0cdesqbprhp7p6toinn4s2mkte9fpj6.apps.googleusercontent.com',
  GOOGLE_SECRET: '-R2EYwjDbTdX-Z3hsZ7T1bKx',

  // Control debug level for modules using visionmedia/debug
  DEBUG: ''
};
