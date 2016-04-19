var ResponseHandler = require('./response.handlers.js');
import User from '../user/user.model'

// Middleware function which takes a request made from the android app,
// Finds the associated user in the DB and attatches it to the request.
export function attatchUserFromGoogleID(req, res, next) {
  console.log("REQ: ");
  console.log(req.body);
  const googleID = req.body.google_id;
  console.log('the google id is: ');
  console.log(googleID);
  User.findOne({
      'google.id': googleID
    }).exec()
    .then(user => {
      req.user = user;
      next();
    })
    .catch(ResponseHandler.handleError(res));
}
