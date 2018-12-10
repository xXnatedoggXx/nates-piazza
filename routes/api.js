var express = require('express')
var jwt = require('jsonwebtoken');

var isAuthenticated = require('../middlewares/isAuthenticated.js')

var User = require('../models/user.js');
var Question = require('../models/question.js');
var Statement = require('../models/statement.js');

var router = express.Router();

router.get('/getQuestions', function (req, res, next) {
  questions = Question.find({}, function (err, result) {
    if (err) next(err)
    res.json({
      questions: result,
      author: req.session.user.name,
      authorType: req.session.user.userType
    })
  })
})

router.get('/getStatements', function(req, res, next) {
  statements = Statement.find({}, function(err, result) {
    if(err) next(err);
    res.json({
      statements: result,
      author: req.session.user.name,
      authorType: req.session.user.userType,
    })
  });
});

router.post('/addQuestion', isAuthenticated, function (req, res, next) {
  var { text } = req.body;
  var author = req.session.user.name;
  var authorType = req.session.user.userType;

  var q = new Question({ text: text, author: author, authorType: authorType })
  q.save(function (err, result) {
    if (err) next(err);
    res.json({ status: 'OK' })
  })
})

router.post('/addStatement', isAuthenticated, function (req, res, next) {
  var { text } = req.body;
  var author = req.session.user.name;
  var authorType = req.session.user.userType;

  if(authorType === 'instructor') {
    var s = new Statement({ text: text, author: author, authorType: authorType, exists: true });
    s.save(function(err, result) {
      if(err) next(err);
      res.json({status: 'OK', success: true})
    })
  } else {
    res.json({ status: 'not an instructor', success: false });
  }
})

router.post('/answerQuestion', isAuthenticated, function (req, res, next) {
  var question_id = req.body.pid;
  var answerText = req.body.answer;
  var answerAuthor = req.body.answerAuthor;

  Question.findById(question_id, function (err, question) {
    question.answer = answerText;
    question.answerAuthor = answerAuthor;

    question.save(function (saveErr, result) {
        if(!saveErr) {
          res.json({success: 'OK'})
        } else {
          next(saveErr);
        }
    })
  })
})

router.post('/replyStatement', isAuthenticated, function (req, res, next) {
  var reply_id = req.body.pid;
  var replyText = req.body.answer;
  var replyAuthor = req.body.answerAuthor;
  
  Statement.findById(reply_id, function (err, statement) {
    statement.answer = replyText;
    statement.answerAuthor = replyAuthor;

    statement.save(function (saveErr, result) {
        if(!saveErr) {
          res.json({success: 'OK'})
        } else {
          next(saveErr);
        }
    })
  })
})

module.exports = router;
