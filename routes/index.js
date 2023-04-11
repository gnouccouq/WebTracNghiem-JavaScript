const express = require("express");
const router = express.Router();
var Contact = require("..//app/model/contact");
var Exam = require('..//app/model/exam')
var Unit = require('..//app/model/unit')
var Account = require('..//app/model/account')
var Vocabulary = require('..//app/model/vocabulary');
const { render } = require("express/lib/response");
const { default: mongoose } = require("mongoose");

//password handler
const bcrypt = require('bcrypt');
 

//const Exam = require('..//app/model/exam')
//const Unit = require('..//app/model/unit')
//const Vocabulary = require('..//app/model/vocabulary')
//const Contact = require('..//app/model/contact')

new Account({
    name: "cuong",
    email: "cuongnguyenc.n1612@gmail.com",
    password: "test1234",
 
}).save()

function Routes(app) {
    
    app.get('/', function(req, res) {
        Unit.find().then((units) => {
            res.render('home.ejs', { units: units })
        })
        
    })

    app.get('/units.ejs', function(req, res) {
        Unit.find().then((units) => {
            res.render('units.ejs', { units: units })
        })
    })

    app.get('/admin.ejs', function(req, res) {
        Unit.find().then((units) => {
            res.render('admin.ejs')
        })
    })

    app.get('/addunits.ejs', function(req, res) {
        Unit.find().then((units) => {
            res.render('addunits.ejs', { units: units })
        })
    })

    app.get('/formadd.ejs', function(req, res) {
            res.render('formadd.ejs')
    })

    app.get('/formupdate/:id', function(req, res) {
        Unit.findById(req.params.id, (error, data) => {
            res.render('formupdate.ejs', { units: data });
        });
    })

    app.post('/update', function(req, res, next) {
        console.log(req.body);
        Unit.findByIdAndUpdate(req.body.id, req.body, (error, data) => {
            res.redirect('addunits.ejs')
        });
    })

    app.get('/formdelete/:id', function(req, res) {
        Unit.findByIdAndDelete(req.params.id, (error, data) => {
            res.redirect('/addunits.ejs');
        });
    })

    app.get('/deletecontact/:id', function(req, res) {
        Contact.findByIdAndDelete(req.params.id, (error, data) => {
            res.redirect('/adfeedback.ejs');
        });
    })

    app.get('/deleteuser/:id', function(req, res) {
        Exam.findByIdAndDelete(req.params.id, (error, data) => {
            res.redirect('/aduser.ejs');
        });
    })

    app.post('/add', function(req, res, next) {
        Unit.create(req.body);
        res.redirect('addunits.ejs')
    })

    app.get('/aduser.ejs', function(req, res, next) {
        Exam.find({}, (error, data) => {
            
            res.render('aduser.ejs', { exams: data});
        });
    })

    app.get('/about.ejs', function(req, res) {
        Unit.find().then((units) => {
            res.render('about.ejs')
        })
    })

    app.get('/achievements.ejs', function(req, res, next) {
        Exam.find({}, (error, data) => {
            console.log('Danh sach', data);
            res.render('achievements.ejs', { exams: data});
        });
    })

    app.get('/why.ejs', function(req, res) {
        Unit.find().then((units) => {
            res.render('why.ejs')
        })
    })

    app.get('/login.ejs', function(req, res) {
       
            res.render('login.ejs')
        
    })

    app.get('/signup.ejs', function(req, res) {
       
        res.render('signup.ejs')
    
    })

    app.get('/contact.ejs', function(req, res) {
        Contact.find({}, (error, data) => {
            console.log('Danh sach lien he', data);
            res.render('contact.ejs', { contacts: data});
        });
    })

    app.get('/adfeedback.ejs', function(req, res) {
        Contact.find({}, (error, data) => {
            console.log('Danh sach lien he', data);
            res.render('adfeedback.ejs', { contacts: data});
        });
    })

    app.get('/exam/:slug', function(req, res) {
        let slug = req.params.slug
        Unit.findOne({ slug: slug }).then((unit) => {
            if (unit) {
                res.render('exam.ejs', { unit })
            } else {
                res.redirect('/')
            }
        })
    })

    app.post('/sentContact', function(req, res, next) {
        Contact.create(req.body);
        res.redirect('/contact.ejs')
    })

    app.post('/ad-signup', (req,res)=>{
        let {name, email, password, dateOfBirth} = req.body;
        name = name.trim();
        email = email.trim();
        password = password.trim();
        dateOfBirth = dateOfBirth.trim();

        if(name == "" || email == "" || password == "" || dateOfBirth ==""){
            res.json({
                status: "FAILED",
                message: "Empty input fields!"
            });
        }else if (!/^[a-zA-Z]*$/.test(name)){
            res.json({
                status: "FAILED",
                message: "Invalid name entered!"
            })
        }else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
            res.json({
                status: "FAILED",
                message: "Invalid email entered!"
            })
        }else if (!new Date(dateOfBirth).getTime()){
            res.json({
                status: "FAILED",
                message: "Invalid date of birth entered!"
            })
        }else if (password.length < 8){
            res.json({
                status: "FAILED",
                message: "Password is too short!"
            })
        }else {
            //Checking if user already exists
            Account.find({email}).then(result => {
                if(result.length) {
                    res.json({
                        status: "FAILED",
                        message: "User with the provided email already exists"
                    })
                }else{
                    const saltRounds = 10;
                    bcrypt.hash(password, saltRounds).then(hashedPassword => {
                        const newUser = new User ({
                            name,
                            email,
                            password: hashedPassword,
                            dateOfBirth
                        });
                        
                        newUser.save().then(result => {
                            res.json({
                                status: "SUCCESS",
                                message: "Sign up successful",
                                data: result,
                            })
                        })
                        .catch(err => {
                            res.json({
                                status: "FAILED",
                                message: "An error occurred while saving user account!"
                            })
                        })
                    })
                    .catch(err => {
                        res.json({
                            status: "FAILED",
                            message: "An error occurred while hashing password!"
                        })
                    })
                }
            }).catch(err => {
                console.log(err);
                res.json({
                    status: "FAILED",
                    message: "An error occurred while checking for existing user!"
                })
            })
        }
    })

    app.post('/ad-login', (req,res)=>{
        let {email, password} = req.body;
        email = email.trim();
        password = password.trim();

        if(email == "" || password == ""){
            res.json({
                status: "FAILED",
                message: "Empty credentials supplied!"
            })
        }else {
            Account.find({email}).then(data => {
                if(data) {
                    const hashedPassword = data[0].password;
                    bcrypt.compare(password, hashedPassword).then(result => {
                        if(result) {
                            res.json({
                                status: "SUCCESS",
                                message: "Sign up successful",
                                data: data
                            })
                        }else {
                            res.json({
                                status: "FAILED",
                                message: "Invalid password entered!"
                            })
                        }
                    })
                    .catch(err => {
                        res.json({
                            status: "FAILED",
                            message: "An error occurred while comparing passwords!"
                        })
                    })
                } else {
                    res.json({
                        status: "FAILED",
                        message: "Invalid credentials entered!"
                    })
                }
            })
            .catch(err => {
                res.json({
                    status: "FAILED",
                    message: "An error occurred while checking for existing user!"
                })
            })
        }
    })
}
module.exports = Routes;
