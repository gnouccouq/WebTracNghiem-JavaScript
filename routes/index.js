const express = require("express");
const router = express.Router();
var Contact = require("..//app/model/contact");
var Exam = require('..//app/model/exam')
var Unit = require('..//app/model/unit')
var Account = require('..//app/model/account')
var Vocabulary = require('..//app/model/vocabulary');
const { render } = require("express/lib/response");
const { default: mongoose } = require("mongoose");
const jwt=require("jsonwebtoken")
const cookieParser=require("cookie-parser")
const bcryptjs=require("bcryptjs")

 

//const Exam = require('..//app/model/exam')
//const Unit = require('..//app/model/unit')
//const Vocabulary = require('..//app/model/vocabulary')
//const Contact = require('..//app/model/contact')

async function hashPass(password){

    const res=await bcryptjs.hash(password,10)
    return res

}
async function compare(userPass,hashPass){

    const res=await bcryptjs.compare(userPass,hashPass)
    return res

}

// new Account({
//     name: "cuong",
//     password: "1234",
// }).save()

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

    app.post('/signup',async(req,res)=>{
        try{
            const check=await Collection.findOne({name:req.body.name})
    
            if(check){
                res.send("user already exist")
            }
    
            else{
                const token=jwt.sign({name:req.body.name},"helloandwelcometotechywebdevtutorialonauthhelloandwelcometotechywebdevtutorialonauth")
    
                res.cookie("jwt",token,{
                    maxAge:600000,
                    httpOnly:true
                })
    
    
                const data={
                    name:req.body.name,
                    password:await hashPass(req.body.password),
                    token:token
                }
    
                await Collection.insertMany([data])
    
                res.render('/login.ejs',{name:req.body.name})
    
            }
    
        }
        catch{
    
            res.send("wrong details")
    
        }
    })

    app.post('/login',async(req,res)=>{
        try{
            const check = await Collection.findOne({name:req.body.name})
            const passCheck = await compare(req.body.password,check.password)
    
            if(check && passCheck){
    
                res.cookie("jwt",check.token,{
                    maxAge:600000,
                    httpOnly:true
                })
    
                res.render('/admin.ejs',{name:req.body.name})
            }
            
            else{
                
                res.send("wrong details")
    
            }
    
        }
        catch{
    
            res.send("wrong details")
    
        }
    })
}
module.exports = Routes;
