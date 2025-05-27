const passport = require('passport')
const LocalStrategy = require('passport-local');
const User = require('../models/User');
const { compareSync } = require('bcrypt');

passport.use(new LocalStrategy({
  usernameField: 'email'
},
async function (email, password, done) {
    try{
      const user = await User.findOne({
        email: email
      })

      if (!user) { return done(null, false); }
      if (!compareSync(password,user.password)) { return done(null, false); }
      return done(null, user);
    }

    catch(err){
       return done(err);
    }
    }
  ));



  passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      cb(null, { id: user.id, email: user.email });
    });
  });
  
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });