module.exports = function(passport) {

  var express = require('express');
  var router = express.Router();

  router.get('/', isLoggedIn, function(req, res) {
    res.render('dashboard/index.ejs', {
      user : req.user // get the user out of session and pass to template
    });
  });

  return router;

};

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.status(403).send('Forbidden');
}
