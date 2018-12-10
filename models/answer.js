var mongoose = require('mongoose');
var User = require('./user.js');

const AnswerSchema = new mongoose.Schema({
  text: { type: String },
  author: { type: User },
  index: { type: Number},
})

module.exports = mongoose.model('Answer', AnswerSchema);
