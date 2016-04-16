'use strict';

import User from '../../api/user/user.model';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';
import request from 'request';

const googleVerifyEndpoint = 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token='

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Verify a login token
export function verifyToken(req, res) {
  var url = googleVerifyEndpoint + req.query.id_token;

  console.log("YYOOOOOOOOOOOOO");

  request(url, function(error, response, body) {
    if(error) { res.status(500).send(error); }

    // Parse the data
    var data = JSON.parse(body);

    // Make sure that the request came from our app! We're not gettin hacked today!
    if(data.azp.valueOf() !== config.google.androidClientID.valueOf()){
      // The request did not come from our app.
      return res.status(403).end();
    }

    // Get the googleID from the response
    var googleID = data.sub;

    console.log("AAAAAAAAAAAAAAAA");

    // Try to find a user with this id. If one does not exist, create one.
    User.findOne({'google.id': googleID}).exec()
      .then(user => {
        if (user) {
          console.log("USER EXISTS");
          console.log(user);
          console.log("ABBBBBBBBBBBBBBBBBBB");

          return res.status(200).json(user);
        }
        console.log("DATA \n\n");
        console.log(data);

        console.log("NO USER EXISTS");
        user = new User({
          name: data.name,
          email: data.email,
          role: 'user',
          username: data.email.split('@')[0],
          provider: 'google',
          google: { // TODO: Not sure if we need to store any google specific info besides id.... Also, this might not match the format of the passport google auth.
            id: googleID, // however, I think the only thing we REALLY need is the id so this should be fine.
            email: data.email,
            name: data.name,
            given_name: data.given_name,
            family_name: data.family_name
          }
        });
        console.log("BEFORE SAVING");
        console.log("CCCCCCCCCCCCCCCCCC");

        user.save()
          .then(user => res.status(200).json(user))
          .catch(err => res.status(500).send(err));
      })
      .catch(err => res.status(500).send(err));
  });
}
