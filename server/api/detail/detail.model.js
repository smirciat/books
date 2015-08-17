'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DetailSchema = new Schema({
  userId: String,
  name: String,
  city: String,
  state: String,
  pendingTrades: [{tradeId: String,
                   myBookId: String,
                   myBookUrl: String,
                   myBookTitle: String,
                   myBookOwner: String,
                   otherBookId: String, 
                   otherBookUrl: String,
                   otherBookTitle: String,
                   otherBookOwner: String,
                   otherUserApproved: Boolean}]
});

module.exports = mongoose.model('Detail', DetailSchema);