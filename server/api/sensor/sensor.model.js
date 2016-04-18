'use strict';

import mongoose from 'mongoose';

var Schema = mongoose.Schema;

var SensorSchema = new Schema({
 	name: String,
 	type: {
 		type:String, 
 		enum: ['temperature', 'proximity', 'pressure','light']
 	},
    model: String,
    number: Number,
    imgURL: String,
    selected: Boolean

});

export default SensorSchema;