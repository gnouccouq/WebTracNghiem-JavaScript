const express = require("express");
const router = express.Router();
var Contact = require("..//app/model/contact");
var Exam = require('..//app/model/exam')
var Unit = require('..//app/model/unit')
var Vocabulary = require('..//app/model/vocabulary');
const { render } = require("express/lib/response");
const { default: mongoose } = require("mongoose");


//const Exam = require('..//app/model/exam')
//const Unit = require('..//app/model/unit')
//const Vocabulary = require('..//app/model/vocabulary')
//const Contact = require('..//app/model/contact')



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

    app.post('/add', function(req, res, next) {
        Unit.create(req.body);
        res.redirect('addunits.ejs')
    })

    app.get('/aduser.ejs', function(req, res, next) {
        Exam.find({}, (error, data) => {
            console.log('Danh sach', data);
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
}
module.exports = Routes;
