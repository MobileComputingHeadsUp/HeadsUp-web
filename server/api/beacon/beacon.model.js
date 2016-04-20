'use strict';

import mongoose from 'mongoose';
import Ad from '../ad/ad.model';
var Schema = mongoose.Schema;

var BeaconSchema = new Schema({
  identifier: {type: String, required: true, unique: true},
  name: String,
  entry: {type: Boolean, required: true, default: true},
  enqueue: {
    queueName: String
  },
  vicinityAds: {
    ads: [Ad]
  },
  vicinitySensors: {
    sensors: [{type: Schema.Types.ObjectId, ref: 'Sensor'}]
  },
  added: {
    type: Date
  },
  usesSensors: Boolean,
  space: {type: Schema.Types.ObjectId, ref: 'Space'}
});

// Export the schema, not as a mongoose model since we want to use this as a sub document.
export default BeaconSchema;
