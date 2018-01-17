var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// var mailer = require('express-mailer');
var expressLayouts = require('express-ejs-layouts');
//var forceHTTPS = require("expressjs-force-https").forceHTTPS;
var frameguard = require('frameguard');
var helmet = require('helmet');

var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/nodetest1');

var index = require('./routes/index');
var users = require('./routes/users');

var domains = ['https://www.messenger.com/', 'https://www.facebook.com/'];

var app = express();

// mailer.extend(app, {
//   from: 'no-reply@hivetechug.com',
//   host: 'smtp.gmail.com', // hostname
//   secureConnection: true, // use SSL
//   port: 465, // port for secure SMTP
//   transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
//   auth: {
//     user: 'kgidion1@gmail.com',
//     pass: 'kalemera9209'
//   }
// });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

// Allow from a specific host.
// Sets "X-Frame-Options: ALLOW-FROM http://example.com".
// app.use(frameguard({
//   action: 'allow-from',
//   domain: 'https://www.messenger.com/',
// }));

// app.use(helmet({
//   frameguard: {
//     action: 'allow-from',
//     domain: ['https://www.messenger.com/', 'https://www.facebook.com/']
//   }
// }));

// Implement X-Frame: Allow-From
app.use(helmet.frameguard('allow-from', ['https://beta.hivetechug.com:3443','https://www.messenger.com/', 'https://www.facebook.com/']));



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

//app.use(forceHTTPS);

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
