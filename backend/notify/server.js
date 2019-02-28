const express = require(`express`);
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const fetch = require('node-fetch');

// const urls = require('../../urls_const'); //LOCALHOST
const urls = require('./urls_const'); //Docker

//Mongoose
const connectWithRetry = function() {
    return mongoose.connect(urls.url_mongo_notify+'/grades-notify', { useNewUrlParser: true },
    function(err) {
      if (err) {
        console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
        setTimeout(connectWithRetry, 5000);
      }
    });
  };
  
  connectWithRetry();

const Schema = mongoose.Schema;

const studentSchema = new Schema({
    username: {type: String, required: true},
    type: {type: String, required: true},
    classes: [{
        grade: {
            type: Number,
        },
        name:{
            type: String
        },
        class:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class'
        },
         _id : false
    }]
});

const professorSchema = new Schema({
    username: {type: String, required: true},
    type: {type: String, required: true},
    classes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class'
    }]
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
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Students'
    }]
});

const Student = mongoose.model('Student',studentSchema);
const Professor = mongoose.model('Professor',professorSchema);
const Class = mongoose.model('Class',classSchema);

//Express
const app = express();
const port = process.env.PORT || 3001;
app.listen(port,()=>{
    console.log(`Listening port ${port} Notify`);
});

app.use(bodyParser.json());
app.use(cookieParser());

//http://localhost:4200
//http://192.168.99.100:30017
//Routes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200, http://192.168.99.100:30017');
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
    fetch(urls.url_be_auth + `/secret-${req.body.type}`, opts)
    .then(res => res.text())
    .then(json => {
        //console.log(json);
      res.send(json);
    })
    .catch((e)=>{
        //console.log(e);
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
    fetch(urls.url_be_auth + `/secret-professor`, opts)
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
    const class1 = new Class({...req.body});
    let class_id;
    class1.professor = mongoose.Types.ObjectId(class1.professor);
    Class.find({$and: [ {professor: {$in: [class1.professor]}}, {starts: {$in: [class1.starts]}}, {days: {$in: [class1.days]}} ]})
    .then((cs)=>{
        if(cs.length<1){
            return class1.save();;
        } else {
            return null;
        }
    })
    .then((c)=>{
        class_id = mongoose.Types.ObjectId(c._id);
        return Professor.findOne({_id: class1.professor});
    })
    .then((p)=>{
        //console.log(p);
        let arr = p.classes;
        arr.push(class_id);
        return Professor.findOneAndUpdate({_id: class1.professor }, { $set: {'classes': arr}});
    })
    .then((u)=>{
        //console.log(u);
        res.send({msg: 'Class saved'});
    })
    .catch((e)=>{
        //console.log(e);
        res.send({msg: 'Class Not saved'});
    });
});


function validateStudent(req, res, next){
    const opts = {
        headers: {
            cookie: `token=${req.cookies['token']}`
        }
    };
    //console.log(req.cookies)
    fetch(urls.url_be_auth + `/secret-student`, opts)
    .then(res => res.json())
    .then(json => {
        //console.log(json);
        if(json['validate']){
            //console.log(req.body)
            req.body.student = json['user'];
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

app.post('/subs-class',validateStudent,(req, res) => {
    //console.log(req.body);
    let student_id = mongoose.Types.ObjectId(req.body.student);
    let class_id = mongoose.Types.ObjectId(req.body.class);
    let arr_students = [];
    let arr_classes = [];

    let msg = "Subscription Succesfully";
    // { _id: { $ne: class_id } },
//----------------------------------------------------------
    Class.findOne({_id: class_id })
    .then((c)=>{
        return Class.find({$and: [ {starts: {$in: [c.starts]}}, {days: {$in: [c.days]}}, {students: {$in: [student_id]}}]})
    })
    .then((cs)=>{
        console.log(cs);
        if(cs.length<1){
            return Class.findOne({_id: class_id });
        } else {
            return null;
        }
    })
    .then((c)=>{
      arr_students = c.students;
      if(arr_students.indexOf(student_id)===-1){
        arr_students.push(student_id);
      } else {
        msg = "Student already register";
      }
      return Class.findOneAndUpdate({_id: class_id }, { $set: {'students': arr_students}});
    })
    .then(()=>{
      return Student.findOne({_id: student_id});
    })
    .then((s)=>{
      //console.log(s);
      arr_classes = s.classes;
      let flag = true;
      for(const e of arr_classes){
        if(e.class.toString() === class_id.toString()){
          flag = false;
          msg = "Student already register";
        }
      }
      if(flag){
        arr_classes.push({grade: 0, class: class_id});
      }
      return Student.findOneAndUpdate({_id: student_id}, { $set: {'classes': arr_classes}});
    })
    .then(()=>{
      res.send({msg:msg});
    })
    .catch((e)=>{
        console.log(e.message);
        res.send({msg:'Overlapping Class'});
    });
});


app.get('/load-classes',(req, res) => {
    Class.find({})
    .select('name starts ends days capacity professor')
    .populate({
      path: 'professor',
      select: 'username -_id',
      model: 'Professor'
    })
    .then((c)=>{
        res.send({arr: c});
    })
});


app.get('/get-grades',validateStudent,(req, res) => {
    const student_id = req.body.student;
    Student.findOne({_id: student_id})
    //.lean()
    .select('classes -_id')
    .populate({
        path: 'classes.class',
        select: 'name -_id',
        model: 'Class'
      })
    .then((c=>{
        //console.log(c.classes);
        res.send(c.classes)
    }))
    .catch((e)=>{
        console.log(e);
    })
});

app.get('/get-prof-classes',validatePofessor,(req, res) => {
    const professor_id = req.body.professor;
    Class.find({professor: {$in: [professor_id]}})
    .select('students name starts ends')
    .populate({
        path: 'students',
        select: 'username classes',
        model: 'Student',
        populate:{
            path: 'classes.class',
            select: 'name -_id',
            model: 'Class'
        }
      })
    .then((arr)=>{
        //console.log(arr);
        res.send({msg: arr});
    })
    .catch((e)=>{
        console.log(e);
    })
});

app.post('/set-grade',validatePofessor,(req, res) => {
    let temp = {
        grade: req.body.grade,
        class: req.body.class
    }
    let class_arr = [];
    Student.findOne({_id: req.body.student})
    .then((s)=>{
        for(const c of s.classes){
            if(c.class.toString() === req.body.class.toString()){
                class_arr.push(temp);
            } else {
                class_arr.push(c);
            }
        }
        return Student.findOneAndUpdate({_id: req.body.student }, { $set: {'classes': class_arr}});
    })
    .then((st)=>{
        res.send({msg: 'Grade set'});
    })
    .catch((e)=>{
        console.log(e);
    })
});

app.get('/get-schedule',validatePofessor,(req, res) => {
    const professor_id = req.body.professor;
    Class.find({professor:{$in:req.body.professor}})
    .populate({
        path: 'professor',
        select: 'username _id',
        model: 'Professor'
      })
    .then((c)=>{
        res.send({msg: c});
    })
    .catch((e)=>{
        console.log(e);
    })
});

app.get('/get-schedule-student',validateStudent,(req, res) => {
    const student_id = req.body.student;
    Class.find({students:{$in:req.body.student}})
    .populate({
      path: 'professor',
      select: 'username _id',
      model: 'Professor'
    })
    .then((c)=>{
        res.send({msg: c});
    })
    .catch((e)=>{
        console.log(e);
    })
});