'use strict';

import mongoose from 'mongoose';
import Beacon from '../beacon/beacon.model';
import Ad from '../ad/ad.model';
import Sensor from '../sensor/sensor.model';
var Schema = mongoose.Schema;

var SpaceSchema = new Schema({
  name: String,
  description: String,
  spaceOwner: {type: Schema.Types.ObjectId, ref: 'User'},
  // When sending android app usersInSpace, filter out matched users, dont
  // want no repeats!!!!!!!
  usersInSpace: [{
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    timestamp:  { type: Number, default: function() { return new Date().getTime()} }
  }],
  // Clean up before sending userMatches to app,
  // rename the matched user to just "match"
  userMatches:[{
    user1: {type: Schema.Types.ObjectId, ref: 'User'},
    user2: {type: Schema.Types.ObjectId, ref: 'User'},
    // When the match occured
    timestamp:  { type: Number, default: function() { return new Date().getTime()} },
    matchedAttributes: {}// Same as required user info/space profile data
  }],
  // Stuff tha space holds.
  announcments:[{
      text: String,
      timestamp:  { type: Number, default: function() { return new Date().getTime()} }
    }],
  beacons: [Beacon],
  ads: [Ad],
  sensors: [Sensor],
  // Data the space requires about its users.
  requiredUserInfo: { // this will be versioned.
    dropdown: [{
      label: String,
      optionStrings: [String],
      matchUsers: Boolean
    }],
    checkAllThatApply:[{
      label: String,
      optionStrings: [String],
      matchUsers: Boolean
    }],
    freeResponse: [{
      label: String,
      charLimit: Number,
      matchUsers: Boolean
    }],
    requiredUserInfoVersion: {type: Number, default: 0}
  },
  active: Boolean
});

export default mongoose.model('Space', SpaceSchema);
