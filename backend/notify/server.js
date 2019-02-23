const express = require(`express`);
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const fetch = require('node-fetch');

//Express
const app = express();
const port = process.env.PORT || 3001;
app.listen(port,()=>{
    console.log(`Listening port ${port} Notify`);
});

app.use(bodyParser.json());
app.use(cookieParser());

//Mongoose
mongoose.connect(process.env.MONGODB_URI||'mongodb://localhost/grades-notify', { useNewUrlParser: true });
const Schema = mongoose.Schema;
const studentSchema = new Schema({
    username: {type: String, required: true},
    type: {type: String, required: true},
});
const professorSchema = new Schema({
    username: {type: String, required: true},
    type: {type: String, required: true},
});
const Student = mongoose.model('student',studentSchema);
const Professor = mongoose.model('professor',professorSchema);

//Routes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.post('/secret', (req, res) => {
    const opts = {
        headers: {
            cookie: `token=${req.cookies['token']}`
        }
    };
    fetch(`http://localhost:3000/secret-${req.body.type}`, opts)
    .then(res => res.text())
    .then(json => {
        console.log(json);
      res.send(json);
    })
    .catch((e)=>{
        console.log(e);
    });
});