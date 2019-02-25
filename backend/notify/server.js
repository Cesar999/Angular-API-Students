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
const classSchema = new Schema({
    name: {type: String, required: true},
    starts: {type: Number, required: true},
    ends: {type: Number, required: true},
    days: {type: String, required: true},
    capacity: {type: Number, required: true},
    professor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profesor'
    }
});

const Student = mongoose.model('Student',studentSchema);
const Professor = mongoose.model('Professor',professorSchema);
const Class = mongoose.model('Class',classSchema);

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

app.post('/store-user', (req, res) => {
    if(req.body.type==='student'){
        const user1 = new Student({...req.body});
        user1.save()
        .then((u)=>{
            //console.log(u);
            res.send({msg: 'User saved'});
        });
    } else if(req.body.type==='professor'){
        const user1 = new Professor({...req.body});
        user1.save()
        .then((u)=>{
            //console.log(u);
            res.send({msg: 'User saved'});
        });
    } else {
        //console.log(req.body);
    }
});

function validatePofessor(req, res, next){
    const opts = {
        headers: {
            cookie: `token=${req.cookies['token']}`
        }
    };
    //console.log(req.cookies)
    fetch(`http://localhost:3000/secret-professor`, opts)
    .then(res => res.json())
    .then(json => {
        //console.log(json);
        if(json['validate']){
            //console.log(req.body)
            req.body.professor = json['user'];
            next(null);
        }
    })
    .catch((e)=>{
        console.log(e.type);
        if(e.type==='invalid-json'){
            res.send({msg: 'Unauthorized'});
        }
    });
}

app.post('/create-class',validatePofessor,(req, res) => {
    //console.log(req.body);
    const class1 = new Class({...req.body});
    class1.professor = mongoose.Types.ObjectId(class1.professor);
    class1.save()
    .then((u)=>{
        //console.log(u);
        res.send({msg: 'Class saved'});
    });
});

