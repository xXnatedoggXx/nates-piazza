var mongoose = require('mongoose');
var User = require('./user.js');

const questionSchema = new mongoose.Schema({
  text: { type: String },
  author: { type: String },
  authorType: { type: String },
  answer: { type: String },
  answerAuthor: { type: String },
})

module.exports = mongoose.model('Question', questionSchema);
