const express = require(`express`);
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const jwt = require('jsonwebtoken');
const passport = require("passport");
const passportJWT = require("passport-jwt");

//Mongoose
mongoose.connect(process.env.MONGODB_URI||'mongodb://localhost/grades-auth');
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
    console.log(`Listening port ${port}`);
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

const jwtOptions = {}
jwtOptions.jwtFromRequest = cookieExtractor;
jwtOptions.secretOrKey = 'mySecret';

const strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  console.log('payload received', jwt_payload);

  User.findOne({username: jwt_payload.username, _id: jwt_payload._id})
  .then((user) => {
      if (user) {
          next(null, user);
        } else {
          next(null, false);
        }
  })
  .catch(() => console.log('Payload Cacth'));
});

passport.use(strategy);
app.use(passport.initialize());


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
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
        const payload = {username: user.username, _id: user._id};
        const token = jwt.sign(payload, jwtOptions.secretOrKey,  {expiresIn: '36000s'});
        res.cookie('token', token, { maxAge: 900000, httpOnly: true });
        res.send({msg: 'Succesfully Login', flag: true});
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

    console.log(req.body);
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
    .then(()=>{
        res.send({msg: 'Registration Successfully'});
    })
    .catch(() => {
        console.log('/register catch');
        res.send('Error registration');
    });
});

app.get('/secret', passport.authenticate('jwt', {session: false}), (req, res) => {
  console.log('Secret Accessed');
res.send({message: `Success! You can not see this without a token`, validate: true});
});