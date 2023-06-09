const express = require('express')
const app = express()
const bodyParser = require("body-parser");

const port = 3001
const mongoose = require("mongoose");
const routes = require('./routes')
const db = require('./config/database')

const UserRouter = require('./routes/index');
app.use('/user', UserRouter)

mongoose.set("strictQuery", false);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

db.connect()
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static('public'))
app.use("/public", express.static(__dirname + "/public"));
app.set('view engine', 'ejs')
routes(app)
const ExamControl = require('./util/examControl')

server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

// socket io
io.on('connection', socket => {
    console.log('Socket connection with ID ' + socket.id)
    var examControl


    socket.on('start', async(data) => {
        examControl = new ExamControl(data.userName, data.slug)
        await examControl.init()
        socket.emit('server-ok', examControl.length())
    });
    socket.on('request-get-question', () => {
        sendQuestion()
    })
    socket.on('request-check-answer', (data) => {
        try {
            let status = examControl.isAnswer(data.option)
            socket.emit('server-send-result-answer', { status: status });
        } catch (error) {
            console.log(error)
            socket.emit('finish-exam', examControl.getIncorrectVocabularies())
        }
    })

    function sendQuestion() {
        if (!examControl.isFinished()) {
            examControl.getQuestion().then((question) => {
                socket.emit('server-send-question', question)
            })
        } else {
            socket.emit('finish-exam', examControl.getIncorrectVocabularies())
        }
    }
    socket.on('disconnect', () => { console.log('Socket disconnect:' + socket.id) });
});