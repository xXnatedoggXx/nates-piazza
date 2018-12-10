var jwt = require('jsonwebtoken');

var isAuthenticated = function (req, res, next) {
  let token =  req.headers['authenticated'];
  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  if(token) {
    jwt.verify(token, 'hot-daddy', function(err, decoded) {
      if (err) {
       res.sendStatus(403);
     } else {
       req.decoded = decoded;
       next();
     }
  });

  } else {
    res.sendStatus(403);
    console.log('no existing token');
  }
}

module.exports = isAuthenticated;
