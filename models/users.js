const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const environment = process.env.NODE_ENV;
const stage = require('../config')[environment];

// schema maps to a collection
const Schema = mongoose.Schema;

const userSchema = new Schema({
  nickname: {
    type: 'String',
    required: [true,"can't be blank"],
    trim: true,
    unique: true,
    match: /^[a-zA-Z0-9]+$/,
    index : true
  },
  email: {
    type: 'String',
    required: [true,"can't be blank"],
    trim: true,
    unique: true,
    match: /\S+@\S+\.\S+/,
    index : true
  },
  firstName: {
    type: 'String',
    required: true,
    trim: true,
  },
  lastName: {
    type: 'String',
    required: true,
    trim: true,
  },
  img: {
    type: 'String',
    required: false,
    trim: true,
  },
  organization: {
    type: 'String',
    required: false,
    trim: true,
  },
  bio: {
    type: 'String',
    required: false,
    trim: true,
  },
  events: {
    type: 'String',
    required: false,
    trim: true,
  },
  roles: {
    type: [String],
    required: true,
    trim: true,
  },
  password: {
    type: 'String',
    required: true,
    trim: true
  }
});

// hash password before save
userSchema.pre('save', function(next) {
    const user = this;
    if(!user.isModified || !user.isNew) { // don't rehash if it's an old user
      next();
    } else {
      bcrypt.hash(user.password, stage.saltingRounds, function(err, hash) {
        if (err) {
          console.log('Error hashing password for user', user.nickname);
          next(err);
        } else {
          user.password = hash;
          next();
        }
      });
    }
  });

module.exports = mongoose.model('User', userSchema);