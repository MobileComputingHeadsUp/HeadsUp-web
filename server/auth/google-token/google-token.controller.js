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

  const noneAction = "NONE";
  const needsAction = "REQUIRED_GENERIC_INFO"

  console.log("YYOOOOOOOOOOOOO");

  request(url, function(error, response, body) {
    if(error) { res.status(500).send(error); }

    // Parse the data
    var data = JSON.parse(body);

    // Make sure that the request came from our app! We're not gettin hacked today!
    // if(data.azp.valueOf() !== config.google.androidClientID.valueOf()){
    //   // The request did not come from our app.
    //   console.log('REQ DIDNT COME FROM OUR APP');
    //   return res.status(403).end();
    // }

    // Get the googleID from the response
    var googleID = data.sub;

    console.log("AAAAAAAAAAAAAAAA");

    const responseWithAction = {};

    // Try to find a user with this id. If one does not exist, create one.
    User.findOne({'google.id': googleID}).exec()
      .then(user => {
        if (user) {
          console.log("USER EXISTS");
          console.log(user);
          console.log("ABBBBBBBBBBBBBBBBBBB");

          // Check if users requires generic info to be filled out
          if (needsGenericProfileInfo(user)) {
            responseWithAction.action = needsAction;
          } else {
            responseWithAction.action = noneAction;
          }
          // Add user to response
          responseWithAction.user = user;

          return res.status(200).json(responseWithAction);
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
            family_name: data.family_name,
            picture: data.picture
          }
        });
        // Check if user needs to fill out gneric info
        // He most likely will since this is his acc being created!
        if (needsGenericProfileInfo(user)) {
          responseWithAction.action = needsAction;
        } else {
          responseWithAction.action = noneAction;
        }

        user.save()
          .then(user => {
            // Add user to response
            responseWithAction.user = user;
            res.status(200).json(responseWithAction)
           })
          .catch(err => res.status(500).send(err));
      })
      .catch(err => res.status(500).send(err));
  });
}


function needsGenericProfileInfo(user) {
  return !user.gender || !user.bio || !user.birthday
}
