const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Account = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    dateOfBirth: Date
})

module.exports = mongoose.model("Account", Account)