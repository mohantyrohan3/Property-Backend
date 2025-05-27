const express = require('express');
const router = express.Router();
const passportConfig = require('../config/passport')
const hashSync = require('bcrypt').hashSync
const User = require('../models/User');
const passport = require('passport');


router.get('/' , (req ,res) => {
    res.send({
        "HELLO WORLD" : "USER ROUTE",
    })
})



// Register route
router.post('/register',function(req,res){
    const newUser = new User({
        name:req.body.name,
        email:req.body.email,
        password:hashSync(req.body.password , 10),
    });

    newUser.save()
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to create user', err: error });
    });
})



// Login Route
router.post('/login', passport.authenticate('local', { failureRedirect: '/user/failed' }), (req,res)=>{
    res.send({
        msg:'Successfully Logged In',
        admin:req.user
    })
})



// Failed Route
router.get("/failed",(req,res)=>{
    res.send({
        msg:'Failed to Log In'
    })
})



// Logout Route
router.get('/logout', function(req, res) {
  req.logout(function(err) {
    if (err) {
      console.log('Error occured while loging out');
      return;
    }
    res.send({
      msg:'LOGGED OUT'
    })
  });
});


// Just to check if user is authenticated
router.get('/details', async (req,res)=>{

    console.log(req.user)
    if(req.isAuthenticated()){
      res.send({
        status:"Authenticated",
        details:req.user
      })
      
    }
  
    
    else{
      res.send({
        status:"Not Authenticated",
        msg:'Not Authenticated'
      })
    }
  
  })



module.exports = router;