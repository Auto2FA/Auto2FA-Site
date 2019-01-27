module.exports = function(app, passport, bruteforce) {

    var User = require('../models/user');
    var bodyParser   = require('body-parser');
    var url = require('url');
    var qs = require('qs');
    var twoFactor = require('node-2fa');
    var crypto = require('crypto');
    var tempUsers = {};

    app.get('/', function(req, res) {
      res.render('index.ejs', {
          user : req.user
      });
    });

    app.get('/login', function(req, res) {
        res.render('login.ejs', { smessage: req.flash('loginMessage'), emessage: req.flash('loginMessage') });
    });
    app.post('/login', /*bruteforce.prevent,*/ function(req, res) {
        var parsedUrl = qs.parse(url.parse(req.url).query);    
        var email = parsedUrl.email || req.body.email;
        User.findOne({ 'email' :  email }, function(err, user) {
            var secret = "";
            var secretQr = "";
            var usr = user;
            if(err || !user) {
                var newUser = new User();
                newUser.email = email;
                newUser.save(function(err, user) {
                    if(err) {
                        res.status(500).send('Something broke! ' + err);
                    }
                });
                usr = newUser;
                // we'll get secret on the waiting page and show them the QR code
            } else {
                secret = user.secret;
            }
            var randomID = crypto.randomBytes(20).toString('hex');

            tempUsers[randomID] = usr;
            res.render('login.ejs', { smessage: /*'Check ' + email + " for your sign in link"*/ randomID });
        });
    });


    app.get('/auth/*', function(req, res, next) {
        var path = req.originalUrl.substring(req.originalUrl.lastIndexOf("/") + 1);
        if(tempUsers[path]) {
                var user = tempUsers[path];
            console.log("SECRET: " + user.secret);
                if(user.secret == null) {
                    secretObj = twoFactor.generateSecret({name: 'Auto2FA', account: user.email});
                    secretQr = secretObj.qr;
                    user.secret = secretObj.secret;
                    User.update({_id : user.id}, { $set: { secret: user.secret}}, function callback(err, num) {});
                    res.render('authpg/qr.ejs', {data : secretQr});

                            req.login(user, function(err) {
                                if(err)
                                    res.status(405).send(err);
                                res.redirect('/');
                            });
                } else {
                    var net = require('net');
                    var client = new net.Socket();
                    client.connect(1337, /*req.connection.remoteAddress*/ '127.0.0.1', function() {
	                client.write(user.email);
                    });

                    client.on('data', function(data) {
	                console.log('Received: ' + data); // TODO: Check if this is the right number
                        var t = twoFactor.verifyToken(user.secret, data.toString(), 0.5);
	                client.destroy(); // kill client after server's response
                        if(t != null /* && t['delta'] == 0*/) { // if matches user's number
                            req.login(user, function(err) {
                                if(err)
                                    res.status(405).send(err);
                                res.redirect('/');
                            });
                        } else {
                            res.status(403).send('Access denied. Wrong code');
                        }

                    });

                    client.on('error', function(err) {
                        res.status(405).send(err);
                    });
                }

        } else {
            res.status(404).send('Couldn\'t find ' + path);
        }
    });

    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user
        });
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
/*
    app.use(function(err, req, res, next) {
        res.status(405).send(err);
    });
    */
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    res.status(403).send('Forbidden');
}
