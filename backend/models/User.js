const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = mongoose.model('User', userSchema, 'Users'); // 'Users' is the exact collection name

module.exports = User;
