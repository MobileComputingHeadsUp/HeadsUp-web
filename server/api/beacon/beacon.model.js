'use strict';

import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var BeaconSchema = new Schema({
  identifier: {type: String, required: true, unique: true},
  name: String,
  entry: {type: Boolean, required: true, default: false},
  enqueue: {
    queueName: String
  },
  vicinityAds: {
    ads: [{type: Schema.Types.ObjectId, unique: true, ref: 'Ad'}]
  },
  vicinitySensors: {
    sensors: [{type: Schema.Types.ObjectId, ref: 'Sensor'}]
  }
});

export default mongoose.model('Beacon', BeaconSchema);
