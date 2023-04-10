const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Contact = new mongoose.Schema({
    Name: String,
    email: String,
    phoneNumber: String,
    mess: String,
});

module.exports = mongoose.model("Contact", Contact);
