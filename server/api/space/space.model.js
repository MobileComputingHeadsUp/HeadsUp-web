'use strict';

import mongoose from 'mongoose';
import Beacon from '../beacon/beacon.model';
var Schema = mongoose.Schema;

var SpaceSchema = new Schema({
  name: String,
  description: String,
  spaceOwner: {type: Schema.Types.ObjectId, ref: 'User'},
  usersInSpace: [{type: Schema.Types.ObjectId, ref: 'User'}],
  usersInSpace2: [{
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    matches: [{
      user: {type: Schema.Types.ObjectId, ref: 'User'},
      attributes: [{}]
    }]
  }, {timestamps: true}],
  beacons: [Beacon],
  ads: [{type: Schema.Types.ObjectId, ref: 'Ad'}],
  sensors: [{type: Schema.Types.ObjectId, ref: 'Sensor'}],
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
