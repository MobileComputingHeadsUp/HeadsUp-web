'use strict';

import mongoose from 'mongoose';
var Schema = mongoose.Schema;
import Beacon from '../beacon/beacon.model';

// Ads are subdocuments. They only exisit within:
// A beacon or
// A space
var AdSchema = new Schema({
  title: String,
  description: String,
  imgUrl: String,
  link: String,
});

// Export the schema, not as a mongoose model since we want to use this as a sub document.
export default AdSchema;
