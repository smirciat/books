'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BookSchema = new Schema({
  title: String,
  ownerId: String,
  imageUrl: String
  
});

module.exports = mongoose.model('Book', BookSchema);