'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DetailSchema = new Schema({
  userId: String,
  name: String,
  city: String,
  state: String
});

module.exports = mongoose.model('Detail', DetailSchema);