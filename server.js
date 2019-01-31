require('dotenv').config();
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var ExpressBrute = require('express-brute');
var MongoStore = require('express-brute-mongo');

var favicon = require('serve-favicon');
var path = require('path');

var autoIncrement = require('mongoose-auto-increment');

app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));

mongoose.connect("mongodb://" + process.env.DB_USER + ":" + process.env.DB_PASS + "@" + process.env.DB_HOST + "/auto2fa");
var db = mongoose.connection;

db.on('error', function(err) {
	console.log('MongoDB connection error');
});
db.once('open', function() {
	console.log('MongoDB connection established');
});

autoIncrement.initialize(db);

var store = new MongoStore(function (ready) {
	ready(db.collection('bruteforce-store'));
});

var bruteforce = new ExpressBrute(store);

////////////
// Models //
////////////

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

require(__dirname + '/config/passport')(passport, bodyParser);

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'NogxYecdKasi7=' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

////////////
// Routes //
////////////

require(__dirname + '/routes/routers.js')(app, passport, bruteforce);
var admin = require(__dirname + '/routes/admin.js');
var profile = require(__dirname + '/routes/profile.js')(passport);
app.use(express.static('public')); // Static files
app.use('/profile', profile);
app.use('/admin', admin);

process.on('uncaughtException', function(err) {
    console.log(err)
});

app.listen(3000);
console.log('Listening on port 3000.');
