var mongoose = require('mongoose');

var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/user');

module.exports = function(passport, bodyParser) {

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('signup', new LocalStrategy({
  usernameField   : 'email',
  passwordField   : 'password',
  passReqToCallback : true
  },
  function(req, email, password, done) {

    process.nextTick(function() {
      User.findOne({ 'email' :  email }, function(err, user) {
        if(err) {
          return done(err);
        }

        if(user) {
          return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
        }
      });

          var newUser = new User();
          newUser.email = email;
          newUser.password = newUser.generateHash(password);
          newUser.save(function(err, user) {
            if(err) {
              return done(err);
            }
            return done(null, newUser);
          });
      });

    //});

  }));

  ///////////
  // Login //
  ///////////

  passport.use('login', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
    User.findOne({ 'email' :  email }, function(err, user) {
      if(err) return done(err);
      if(user && user.validPassword(password)) {
        return done(null, user);
      } else {
        return done(null, false, req.flash('loginMessage', 'Either your e-mail or password is incorrect. Please try again or click on \'Forgot my password\'.')); // req.flash is the way to set flashdata using connect-flash
      }
    });

  }));

};
