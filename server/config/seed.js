/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import Thing from '../api/thing/thing.model';
import User from '../api/user/user.model';
import Beacon from '../api/beacon/beacon.model';
import Space from '../api/space/space.model';

User.find({}).remove()
  .then(() => {
    User.create({
      "name": "Jane Smith",
      "email": "nqwdnqwiondoiwqd@gmail.com",
      "provider": "google",
      "google": {
        "kind": "plus#person",
        "id": "105979492421200560976",
        "displayName": "Jane Smith",
        "image": {
        "url": "http://i.istockimg.com/image-zoom/87462343/3/254/380/stock-photo-87462343-portrait.jpg",
        "isDefault": true
        },
        "language": "en",
        "verified": false
      },
      "birthday": "1990-04-03T00:00:00.000Z",
      "spaceProfiles": [
        {
          "data": {
            "checkAllThatApplys": [
              {
              "What are your favorite drinks?": ["Beer", "Rum"]
              },
              {
              "How do you spend your free time?": ["Exercising", "Reading"]
              }
            ],
            "dropdowns": [
              {
              "Where are you from?": "The West"
              },
              {
              "Whats your favorite color?": "Blue"
              },
              {
              "Why are you here tonight?": "To make new friends"
              }
            ],
            "freeResponses": [
            {
              "What do you like most about The Foo Bar?": "The atmosphere"
            },
            {
              "Whats an interesting fact about yourself?": "I'm a cool girl"
            }
            ]
          },
          requiredUserInfoVersion: 0,
          spaceID: "5718e6677a5c06666f1843f1"
        }
      ],
      role: "user"
    },{
      "name": "Melany Jones",
      "email": "qsqsq@gmail.com",
      "provider": "google",
      "google": {
        "kind": "plus#person",
        "id": "105979492428905560976",
        "displayName": "Jane Smith",
        "image": {
        "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50",
        "isDefault": true
        },
        "language": "en",
        "verified": false
      },
      "birthday": "1990-04-03T00:00:00.000Z",
      "spaceProfiles": [
        {
          "data": {
            "checkAllThatApplys": [
              {
              "What are your favorite drinks?": ["Beer"]
              },
              {
              "How do you spend your free time?": ["Coding", "Reading"]
              }
            ],
            "dropdowns": [
              {
              "Where are you from?": "The North"
              },
              {
              "Whats your favorite color?": "Red"
              },
              {
              "Why are you here tonight?": "To make new friends"
              }
            ],
            "freeResponses": [
            {
              "What do you like most about The Foo Bar?": "The atmosphere is very nice"
            },
            {
              "Whats an interesting fact about yourself?": "I'm a cool girl"
            }
            ]
          },
          requiredUserInfoVersion: 0,
          spaceID: "5718e6677a5c06666f1843f1"
        }
      ],
      role: "user"
    },{
      "name": "John Doe",
      "email": "beeeee@gmail.com",
      "provider": "google",
      "google": {
        "kind": "plus#person",
        "id": "105978976421200560976",
        "displayName": "12e Smith",
        "image": {
        "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50",
        "isDefault": true
        },
        "language": "en",
        "verified": false
      },
      "birthday": "1990-04-03T00:00:00.000Z",
      "spaceProfiles": [
        {
          "data": {
            "checkAllThatApplys": [
              {
              "What are your favorite drinks?": ["Vodka", "Brandy"]
              },
              {
              "How do you spend your free time?": ["Exercising", "Surfing"]
              }
            ],
            "dropdowns": [
              {
              "Where are you from?": "The Northeast"
              },
              {
              "Whats your favorite color?": "Yellow"
              },
              {
              "Why are you here tonight?": "To have fun"
              }
            ],
            "freeResponses": [
            {
              "What do you like most about The Foo Bar?": "The specials!"
            },
            {
              "Whats an interesting fact about yourself?": "I'm a cool dude"
            }
            ]
          },
          requiredUserInfoVersion: 0,
          spaceID: "5718e6677a5c06666f1843f1"
        }
      ],
      role: "user"

    },{

    },{

    },{

    });
  });




Thing.find({}).remove()
  .then(() => {
    Thing.create({
      name: 'Development Tools',
      info: 'Integration with popular tools such as Bower, Grunt, Babel, Karma, ' +
             'Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, ' +
             'Stylus, Sass, and Less.'
    }, {
      name: 'Server and Client integration',
      info: 'Built with a powerful and fun stack: MongoDB, Express, ' +
             'AngularJS, and Node.'
    }, {
      name: 'Smart Build System',
      info: 'Build system ignores `spec` files, allowing you to keep ' +
             'tests alongside code. Automatic injection of scripts and ' +
             'styles into your index.html'
    }, {
      name: 'Modular Structure',
      info: 'Best practice client and server structures allow for more ' +
             'code reusability and maximum scalability'
    }, {
      name: 'Optimized Build',
      info: 'Build process packs up your templates as a single JavaScript ' +
             'payload, minifies your scripts/css/images, and rewrites asset ' +
             'names for caching.'
    }, {
      name: 'Deployment Ready',
      info: 'Easily deploy your app to Heroku or Openshift with the heroku ' +
             'and openshift subgenerators'
    });
  });



// User.find({}).remove();
// Space.find({}).remove();
// Beacon.find({}).remove();


//
// User.find({}).remove()
//   .then(() => {
//     User.create({
//       provider: 'local',
//       name: 'Test User',
//       email: 'test@example.com',
//       password: 'test'
//     }, {
//       provider: 'local',
//       role: 'admin',
//       name: 'Admin',
//       email: 'admin@example.com',
//       password: 'admin'
//     })
//     .then(() => {
//       console.log('finished populating users');
//     });
//   });
