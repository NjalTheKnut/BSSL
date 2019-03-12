const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// User Schema
const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

UserSchema.pre('save', function (next) {
  var user = this;

  if (!user.isModified('password')) {
    return next();
  } else {

    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
    next();
  }
});

const User = module.exports = mongoose.model('User', UserSchema);