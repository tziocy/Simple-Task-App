const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
  email: {
    sparse: true,
    type: String,
    unique: true
  },
  firstName: String,
  language: {
    default: 'el',
    enum: ['el', 'en'],
    type: String
  },
  lastName: String,
  password: {
    select: false,
    type: String
  },
  phone: String,
  username: {
    type: String,
    unique: true
  }
});

UserSchema.pre('save', function (next) {
  const user = this;
  if (user.isModified('password')) {
    bcrypt.hash(user.password, 12)
      .then((hash) => {
        user.password = hash;
        next();
      })
      .catch((err) => next(err));
  } else {
    next();
  }
});

module.exports = mongoose.model('User', UserSchema);
