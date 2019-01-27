module.exports = function(app, passport, bruteforce) {

    var User = require('../models/user');
    var bodyParser   = require('body-parser');
    var url = require('url');
    var qs = require('qs');
    var twoFactor = require('node-2fa');
    var tempRoutes = {};

    app.get('/', function(req, res) {
      res.render('index.ejs', {
          user : req.user
      });
    });

    app.get('/login', function(req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });
    app.post('/login', bruteforce.prevent, function(req, res) {
        var parsedUrl = qs.parse(url.parse(req.url).query);    
        var email = parsedUrl.email || req.body.email;
        User.findOne({ 'email' :  email }, function(err, user) {
            var secret = "";
            var secretQr = "";
            if(err || !user) {
                var newUser = new User();
                newUser.email = email;
                secretObj = twoFactor.generateSecret({name: 'Auto2FA', account: email});
                secretQr = secretObj.qr;
                newUser.secretObj.secret = secret;
                newUser.save(function(err, user) {
                    if(err) {
                        res.status(500).send('Something broke! ' + err);
                    }
                });
            } else {
                secret = user.secret;
            }
            var randomID = crypto.randomBytes(20).toString('hex');
            // TODO: Send e-mail with /auth/{randomID}
            // If qr code isn't equal to "" then display the QR code in the e-mail
            tempRoutes[irandomID] = function(req, res) {
                // TODO: Use TCP server to connect to client at port
                res.render('auth/wait.ejs');
            };
        });
    });


    app.get('/auth/*', function(req, res) {
        var path = req.path.substring(6);
        if(tempRoutes[path]) {
            var routeFunction = tempRoutes[path];
            delete tempRoutes[path]
            routeFunction.apply(this, [req, res]); // apply the temporary route function
        } else {
            res.status(404).send('Not found');
        }
    });

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
