const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');

// create and configure connection to database
mongoose.connect(config.database, {
  useNewUrlParser: true
});

let db = mongoose.connection;
db.openUri(config.database, {
  socketTimeoutMS: 0,
  keepAlive: true,
  reconnectTries: 30
});

// Check connection
db.once('open', function () {
  console.log('Connected to MongoDB');
});

// Check for DB errors
db.on('error', function (err) {
  console.log(err);
});

// Init App
const app = express();

// Bring in Models
let Article = require('./models/article');
let User = require('./models/user');

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}));
// parse application/json
app.use(bodyParser.json());

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.'),
      root = namespace.shift(),
      formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

// Home Route
app.get('/', function (req, res) {
  res.render('curtain', {
    title: 'Welcome! Sit tight while we get things ready!'
  });
});

// Index/Articles Route
app.get('/index', function (req, res) {
  // List Articles
  Article.find({}, function (err, articles) {
    if (err) {
      console.log(err);
    } else {
      res.render('index', {
        title: 'Articles',
        articles: articles
      });
    }
  });
});

app.get('/users/userProfile', function (req, res, user) {
  User.find({
    user
  }, function (err) {
    if (err) {
      console.log(err);
    } else {
      res.render('userProfile', {
        name: user.name,
        email: user.email,
        username: user.username,
      });
    }
  });
});

// Route Files
let articles = require('./routes/articles');
let users = require('./routes/users');
app.use('/articles', articles);
app.use('/users', users);

// Start Server
var port = process.env.PORT || 3000;

app.listen(port, process.env.IP, function () {
  console.log('Server started on port ' + port);
});