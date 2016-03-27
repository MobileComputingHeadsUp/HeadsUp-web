'use strict';

import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var SpaceSchema = new Schema({
  name: String,
  description: String,
  usersInSpace: [{type: Schema.Types.ObjectId, ref: 'User'}],
  beacons: [{type: Schema.Types.ObjectId, ref: 'Beacon'}],
  ads: [{type: Schema.Types.ObjectId, ref: 'Ad'}],
  sensors: [{type: Schema.Types.ObjectId, ref: 'Sensor'}],
  requriedUserInfo: { // this will be versioned.
    dropdown: [{
      label: String,
      optionStrings: [String],
      matchUsers: Boolean
    }],
    checkAllThatApply:[{
      label: String,
      options: [String],
      matchUsers: Boolean
    }],
    freeResponse: [{
      label: String,
      charLimit: Number
    }]
  },
  active: Boolean
});

export default mongoose.model('Space', SpaceSchema);
