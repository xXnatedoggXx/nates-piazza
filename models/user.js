var mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const saltRounds = 17;

const userSchema = new mongoose.Schema({
  name: { type: String },
  username: { type: String },
  password: { type: String },
  userType: { type: String },
})

userSchema.pre('save', function(next) {
    var user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();
    // hash the password along with our new salt
    bcrypt.hash(user.password, saltRounds, function(err, hash) {
        if (err) return next(err);
        // override the cleartext password with the hashed one
        user.password = hash;
        next();
    });
});

userSchema.methods.checkPassword = function (possiblePass, cb) {
  bcrypt.compare(possiblePass, this.password, function(err, isRight) {
      if (err) return cb(err);
      cb(null, isRight);
  });
};

module.exports = mongoose.model('User', userSchema);
