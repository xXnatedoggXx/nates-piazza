var express = require('express')
var router = express.Router();
var isAuthenticated = require('../middlewares/isAuthenticated');
var User = require('../models/user.js');
const jwt = require('jsonwebtoken');

router.get('/login', function (req, res, next) {
  var username = req.query.username;
  var password = req.query.password;

  if(username === undefined || password === undefined) {
    username = '';
    password = '';
  }

  User.findOne({ username: username }, function(err, user) {
        if (!err && user !== null) {
        // test a matching password
          user.checkPassword(password, function(err, isRight) {
              if (err) next(err);
              if(isRight) {
                req.session.user = user;

                const payload = { user: user.username };

                var token = jwt.sign(payload, 'hot-daddy', { expiresIn: '24h' });

                res.json({
                  status: 'OK',
                  success: true,
                  token: token
                })

              } else {
                res.json({
                  status: 'invalid username or password',
                  success: false,
                })
              }
          });
      } else {
        res.json({
          status: 'invalid username or password',
          success: false,
        })
      }
  });
});

router.post('/login', isAuthenticated, function (req, res, next) {
  res.redirect('/home');
});


router.get('/logout', function (req, res) {
  req.session.user = undefined;
  res.redirect('/')
});

module.exports = router;
