require('dotenv').config();
const express = require('express');
const port = 9000
const db = require("./config/mongoose");
var session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');



const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.set('trust proxy', 1)
app.use(session({
  secret: 'rkm trucktrack',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge:1000*60*60*24, sameSite:'none',secure:false},
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL,collectionName:"sessions" }),
}));



app.use(passport.initialize());
app.use(passport.session());



app.use('/user' , require('./routes/user'));
app.use('/property' , require('./routes/properties'));
app.use('/favorite' , require('./routes/favorite'));
app.use('/search' , require('./routes/search'));
app.use('/recommend' , require('./routes/recommend'));



app.get("/" , (req , res) => {
    res.send("HELLO WORLD FROM PROPERTY BACKEND");
});

app.listen(port , () => {
    console.log(`PROPERTY BACKEND RUNNING ON PORT  ${port}`);
});


