const express = require(`express`);
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const jwt = require('jsonwebtoken');
const passport = require("passport");
const passportJWT = require("passport-jwt");

const fetch = require('node-fetch');

// const urls = require('../../urls_const'); //LOCALHOST
const urls = require('./urls_const'); //Docker

const connectWithRetry = function() {
  return mongoose.connect(urls.url_mongo_auth+'/grades-auth', { useNewUrlParser: true },
  function(err) {
    if (err) {
      console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
      setTimeout(connectWithRetry, 5000);
    }
  });
};

connectWithRetry();

const Schema = mongoose.Schema;
const userSchema = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    type: {type: String, required: true}
});
const User = mongoose.model('user',userSchema);


//Express
const app = express();
const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`Listening port ${port} Auth`);
});

app.use(bodyParser.json());
app.use(cookieParser());

//JWT
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

let cookieExtractor = function(req) {
  var token = null;
  if (req && req.cookies){
    token = req.cookies['token'];
  } 
  return token;
};

const jwtOptions_students = {}
jwtOptions_students.jwtFromRequest = cookieExtractor;
jwtOptions_students.secretOrKey = 'mySecretStudent';

const jwtOptions_professors= {}
jwtOptions_professors.jwtFromRequest = cookieExtractor;
jwtOptions_professors.secretOrKey = 'mySecretProfessor';


const strategy_student = new JwtStrategy(jwtOptions_students, function(jwt_payload, next) {
  //console.log('payload received', jwt_payload);
  User.findOne({username: jwt_payload.username, _id: jwt_payload._id, type:jwt_payload.type})
  .then((user) => {
      if (user.type==='student') {
          //console.log('yes',user);
          next(null, user);
        } else {
          //console.log('not',user);
          next(null, false);
        }
  })
  .catch(() => console.log('Payload Cacth'));
});

const strategy_professor = new JwtStrategy(jwtOptions_professors, function(jwt_payload, next) {
  //console.log('payload received', jwt_payload);
  User.findOne({username: jwt_payload.username, _id: jwt_payload._id, type:jwt_payload.type})
  .then((user) => {
      if (user.type==='professor') {
          //console.log('yes',user);
          next(null, user);
        } else {
          //console.log('not',user);
          next(null, 'false');
        }
  })
  .catch(() => console.log('Payload Cacth'));
});

passport.use('student',strategy_student);
passport.use('professor',strategy_professor);
app.use(passport.initialize());

//Functions
function sendUser(body){
    fetch(urls.url_be_noty + '/store-user', {
      method: 'post',
      body:    JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
  })
  .then(res => res.json())
  .then(json => {
    //console.log(json)
  })
  .catch((e)=>{console.log('error sendUser')});
}


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

app.post('/login', (req, res) => {
    const name = req.body.username;
    const pass = req.body.password;
    User.findOne({username: name})
    .then((user)=>{

      if(!user){
        res.send({msg: 'User does not exist'});
      }
      else if(user.password === pass){
        const payload = {username: user.username, _id: user._id, type: user.type};

        if(user.type==='student'){
          const token = jwt.sign(payload, jwtOptions_students.secretOrKey,  {expiresIn: '36000s'});
          res.cookie('token', token, { maxAge: 900000, httpOnly: true });
          res.send({msg: 'Succesfully Login', flag: true, type: user.type});
        } else if(user.type==='professor'){
          const token = jwt.sign(payload, jwtOptions_professors.secretOrKey,  {expiresIn: '36000s'});
          res.cookie('token', token, { maxAge: 900000, httpOnly: true });
          res.send({msg: 'Succesfully Login', flag: true, type: user.type});
        } else {
          res.send({msg: 'Not An User'});
        }

      }
      else {
        res.send({msg: 'Wrong password'});
      }
    })

});

app.post('/register', (req, res) => {
    const name = req.body.username;
    const pass = req.body.password;
    const type = req.body.type;

    //console.log(req.body);
    User.findOne({username: name})
    .then((user)=>{
        if(user){
            res.send({msg: 'Username already exists'});
        } else {
            const user1 = new User({
                username: name,
                password:  pass,
                type: type
            });
            return user1.save();
        }
    })
    .then((u)=>{
        user = {username: u.username, _id: u._id, type: u.type};
        sendUser(user);
        res.send({msg: 'Registration Successfully'});
    })
    .catch(() => {
        console.log('/register catch');
        res.send('Error registration');
    });
});

app.get('/secret-student', passport.authenticate('student', {session: false}), (req, res) => {
  console.log('Secret Student Accessed');
  res.send({message: `Success! Student!`, validate: true, type: req.user.type,  user: req.user._id});
});

app.get('/secret-professor', passport.authenticate('professor', {session: false}), (req, res) => {
  console.log('Secret Professor Accessed');
  console.log(req.user);
  res.send({message: `Success! Professor!`, validate: true, type: req.user.type, user: req.user._id});
});

app.get('/delete-cookie', (req, res) => {
  res.cookie('token', '', { maxAge: 0, httpOnly: true });
  res.send({msg: 'Succesfully Deleted'});
});