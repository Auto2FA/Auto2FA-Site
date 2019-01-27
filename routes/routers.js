module.exports = function(app, passport, bruteforce) {

    app.get('/', function(req, res) {
      res.render('index.ejs', {
          user : req.user
      });
    });

    app.get('/login', function(req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });
    app.post('/login', bruteforce.prevent, passport.authenticate('login', {
      successRedirect : '/profile',
      failureRedirect : '/login',
      failureFlash : true
    }));

    app.get('/signup', function(req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });
    app.post('/signup', bruteforce.prevent, passport.authenticate('signup', {
      successRedirect : '/profile',
      failureRedirect : '/signup',
      failureFlash : true
    }));

    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user
        });
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.use(function(err, req, res, next) {
      console.log(err);
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    res.status(403).send('Forbidden');
}
