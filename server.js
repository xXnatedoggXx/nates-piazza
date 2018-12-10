var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var mongoose = require('mongoose');
var isAuthenticated = require('./middlewares/isAuthenticated.js');
var Question = require('./models/question.js');
var User = require('./models/user.js');
var accountRouter = require('./routes/account.js');
var apiRouter = require('./routes/api.js');
var jwt = require('jsonwebtoken');
var app = express();
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hw5-new')

app.engine('html', require('ejs').__express);
app.set('view engine', 'html');

app.use('/static', express.static(path.join(__dirname, 'static')))



app.use(bodyParser.urlencoded({ extended: false }))

// TODO: configure body parser middleware to also accept json. just do
app.use(bodyParser.json())

app.use(cookieSession({
  name: 'local-session',
  keys: ['spooky'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))


app.get('/', function (req, res, next) {
  res.redirect('/index');
});

app.get('/index', function(req, res, next) {
  res.render('index');
})

app.get('/signup', function (req, res, next) {
  res.render('signup');
});

app.post('/signup', function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var confirmPassword = req.body.confirmpassword;
  var code = req.body.code;
  var name = req.body.name;

  var willExecute = true;

  if(username === password)
    willExecute = false;

  if(password !== confirmPassword)
    willExecute = false;

  if(password.length < 8) {
    willExecute = false;
  }

  if(code !== 'student' && code !== 'instructor') {
      willExecute = false;
  }

  if(willExecute) {
    var containsUser = false;

    User.findOne({ username: username }, function(err, user) {
      if(!err && user !== null) containsUser = true;
    });

    if(containsUser) {
        console.log('Username already taken');
    } else {
      var u = new User({ name: name, username: username, password: password, userType: code });
      u.save(function (err, result) {
        if (err) next(err);
        else {
          res.redirect('/login');
        }
      });
    }
  }
});

app.get('/login', function(req, res) {
  res.render('login');
})


//Protected route to homepage
app.get('/home', function(req, res) {
  questions = Question.find({}, function (err, result) {
    if (err) next(err)
    res.render('home', {
      questions: result,
      username: req.session.user.username,
      name: req.session.user.name,
      userType: req.session.user.userTpye
    })
  })
});


app.post('/', function (req, res, next) {

})

app.use('/account', accountRouter)

app.use('/api', apiRouter)

// don't put any routes below here!
app.use(function (err, req, res, next) {
  return res.send('ERROR :  ' + err.message)
})

app.listen(process.env.PORT || 3000, function () {
  console.log('App listening on port ' + (process.env.PORT || 3000))
})
