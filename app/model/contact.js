const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new mongoose.Schema({
  Name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    trim: true,
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  mess: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model("Contact", userSchema);
