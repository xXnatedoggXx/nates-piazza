var mongoose = require('mongoose')
var User = require('./user.js');

const StatementSchema = new mongoose.Schema({
  text: { type: String },
  author: { type: String },
  authorType: { tpye: String },
  exists: { type: Boolean },
  answer: { type: String },
  answerAuthor: { type: String }
})

module.exports = mongoose.model('Statement', StatementSchema);
