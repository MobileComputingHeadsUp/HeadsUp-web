import User from '../user/user.model'
import Space from '../space/space.model'
import _ from 'lodash';
const ResponseHandler = require('../utilities/response.handlers.js');

// Functions for matching user will be in this module.



export function checkForMatchesWithNewUser(userId, space) {
  console.log("Running space matching algorithm! for user: " + userId);
  const usersInSpace = space.usersInSpace;

  // Get ths new users space profile
  return User.findById(userId).exec()
    // Get the new users space profile for this space
    .then(user => findSpaceProfileForSpace(user, space._id))
    .then (profile => {
      // Now we have the new users space profile for this space.
      // Compare against all other users space profile in this space
      const users = space.usersInSpace.filter(otherUser => otherUser.id !== userId);

      console.log("Other users in space: ");
      console.log(users);

      // Get the space's required user info object which we will check off
      // in order to make matches
      const requiredUserInfo = space.requiredUserInfo;

      // Array of matches which we will save to db?
      const matches = [];

      const numberOfUsers = users.length;
      let processedUsers = 0;

      users.forEach(userInSpaceObj => {
        // Get this users data from DB
        getUserById(userInSpaceObj)
          .then(user => {
            const spaceProfile = findSpaceProfileForSpace(user, space._id);

            // now compare against the new users profile
            const matchedDataArray = findMatchesInSpaceProfiles(profile, spaceProfile, requiredUserInfo);
            console.log("The matched data array");
            console.log(matchedDataArray);

            // Create the object we will store in the DB!
            if (matchedDataArray) {
              console.log("Found a match!");
              const matchObj = {
                user1: userId,
                user2: user._id,
                matchedAttributes: matchedDataArray
              }
              matches.push(matchObj);
            }
            // Increment number of processed users
            processedUsers++;
            // Check if we're finished checking for matches with all users,
            // If so, save the found matches to mongodb with the callback
            if (processedUsers === numberOfUsers) {
              console.log("finished iterating thru users in space");
              return saveMatchesToSpace(matches, space);
            }
          })
      });
      return matches;
    })
}


function saveMatchesToSpace(matches, space) {
  // Now save the matches array to the space.
  // matches.forEach(match => space.userMatches.push(match));
  space.userMatches = matches;

  // Save the space to mongoDB
  return space.save()
    .then(updated => {
      console.log("Updated space with matches! ");
      console.log(updated);
    })
}

// TODO: only match if the space version of this requiredSpaceProfile info option
// has a "match" as true. Not entirely necessary
function findMatchesInSpaceProfiles(profileA, profileB, requiredUserInfo) {
  // TODO: Implement
  console.log('profile A');
  console.log(profileA);
  console.log('profile B');
  console.log(profileB);

  // Get A's profile info
  const checksA = profileA.data.checkAllThatApplys;
  const dropdownsA = profileA.data.dropdowns;
  const freeResponsesA = profileA.data.freeResponses;

  // Get B's profile info
  const checksB = profileB.data.checkAllThatApplys;
  const dropdownsB = profileB.data.dropdowns;
  const freeResponsesB = profileB.data.freeResponses;

  const dropdownMatches = findMatchedDropdowns(dropdownsA, dropdownsB, requiredUserInfo);
  const checkAllMatches = findMatchedChecks(checksA, checksB, requiredUserInfo);
  const freeResponsesMatches = findMatchedFreeResponses(freeResponsesA, freeResponsesB, requiredUserInfo);

  // Array of matches with all common answers
  const matches = [].concat(dropdownMatches, checkAllMatches, freeResponsesMatches);

  console.log(matches);
  return matches;
}

function findMatchedDropdowns(dropdownsA, dropdownsB, requiredUserInfo) {
  const matches = [];
  requiredUserInfo.dropdown.forEach(dropdown => {
    if (dropdown.matchUsers) {
      const label = dropdown.label;
      // console.log("THIS DROPDOWNS LABEL: " + label);
      // Find this specific  drop down in each of the users space profile
      const dropObjA = dropdownsA.find(findObjectByKeyInArray(label));
      const dropObjB = dropdownsB.find(findObjectByKeyInArray(label));

      const dropdownAnswerA = dropObjA[label];
      const dropdownAnswerB = dropObjB[label];
      // console.log("Dropdown answer for A: " + dropdownAnswerA);
      // console.log("Dropdown answer for B: " + dropdownAnswerB);

      // If we found an equal answer, add it to the matches arr!
      if (dropdownAnswerA === dropdownAnswerB) {
        const aNewMatch = { [label]: [dropdownAnswerA] };
        matches.push(aNewMatch);
      }
    }
  });
  return matches;
}

function findMatchedChecks(checksA, checksB, requiredUserInfo) {
  const matches = [];
  requiredUserInfo.checkAllThatApply.forEach(checkAll => {
    if (checkAll.matchUsers) {
      const label = checkAll.label;
      // console.log("THIS CHECKS LABEL: " + label);
      // Find this specific check all in each of the users space profile
      const checkObjA = checksA.find(findObjectByKeyInArray(label));
      const checkObjB = checksB.find(findObjectByKeyInArray(label));

      const checkAnswerA = checkObjA[label];
      const checkAnswerB = checkObjB[label];
      // console.log("Check answer for A: ");
      // console.log(checkAnswerA);
      // console.log("Check answer for B: ");
      // console.log(checkAnswerB);

      // Get the intersection of both of their answers for this question
      const intersection = checkAnswerA.filter(a => checkAnswerB.some(b => b === a));
      // If size of intersection != 0, means they had at least
      // one common answer for this check all question, Add it!
      if (intersection.length) {
        const aNewMatch = { [label]: intersection };
        matches.push(aNewMatch);
      }
    }
  });
  return matches;
}


// TODO: Figure out exactly what to store with common "Free Response" answers...
// And what threshold of common words to use..
function findMatchedFreeResponses(freeResponsesA, freeResponsesB, requiredUserInfo) {
  const matches = [];
  requiredUserInfo.freeResponse.forEach(freeResponse => {
    if (freeResponse.matchUsers) {
      const label = freeResponse.label;
      // console.log("THIS FREE RESPONSES LABEL: " + label);
      // Find this specific check all in each of the users space profile
      const frObjA = freeResponsesA.find(findObjectByKeyInArray(label));
      const frObjB = freeResponsesB.find(findObjectByKeyInArray(label));

      const frAnswerA = frObjA[label];
      const frAnswerB = frObjB[label];
      // console.log("FR answer for A: ");
      // console.log(frAnswerA);
      // console.log("FR answer for B: ");
      // console.log(frAnswerB);

      // Amount of words to be considered a simlar answer
      const threshold = 2;

      // Convert each string answer to array of words
      const wordsA = frAnswerA.split(" ");
      const wordsB = frAnswerB.split(" ");

      // Get the intersection of both of their answers for this question
      const intersection = wordsA.filter(a => wordsB.some(b => b === a));
      // If size of intersection > threshold, means they had
      // common words in their answer for this free response
      if (intersection.length >= threshold) {
        const aNewMatch = { [label]: intersection };
        matches.push(aNewMatch);
      }
    }
  });
  return matches;
}

// Hella badass function >:)
function findObjectByKeyInArray(label) {
  return object => Object.keys(object).find(key => key === label);
}


function findSpaceProfileForSpace(user, spaceId) {
  const profiles = user.spaceProfiles;
  return _.find(profiles, {'spaceID': spaceId});
}

function getUserById(userObj) {
  const userId = userObj._id;
  console.log("looking for user by this id: " + userId);
  return User.findById(userId).exec()
    .then(user => {
      if (user) {
        console.log("found dat user");
        return user;
      }
      else return null;
    })
}
