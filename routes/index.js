const Exam = require('..//app/model/exam')
const Unit = require('..//app/model/unit')
const Vocabulary = require('..//app/model/vocabulary')
const Contact = require('..//app/model/vocabulary')

new Unit({
    name: "Unit 4 - Basic Communication",
    background: "EnglishIT2.jpg",
    description: "This is unit 1 and content is life",
    number: "20"
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

    app.get('/about.ejs', function(req, res) {
        Unit.find().then((units) => {
            res.render('about.ejs')
        })
    })

    app.get('/achievements.ejs', function(req, res) {
        Unit.find().then((units) => {
            res.render('achievements.ejs')
        })
    })

    app.get('/why.ejs', function(req, res) {
        Unit.find().then((units) => {
            res.render('why.ejs')
        })
    })

    app.get('/contact.ejs', function(req, res) {
        Unit.find().then((units) => {
            res.render('contact.ejs')
        })
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

    app.post("/sendContact", async (req, res) => {
        const { Name, email, phoneNumber, mess } = req.body;
        const _contact = new Contact({
          Name,
          email,
          phoneNumber,
          mess,
        });

        _contact.save((err, data) => {
            if (err) {
              console.log(err);
              return res.status(400).json({
                mess: "Sth wrong",
              });
            }
            if (data) {
              // res.render("home");
              res.redirect("/home.ejs");
            }
          });
    })
}
module.exports = Routes;