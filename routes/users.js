const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Bring in User Model
let User = require('../models/user');

// Register Form
router.get('/register', function (req, res) {
  res.render('register');
});

// Register Proccess
router.post('/register', function (req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  let errors = req.validationErrors();

  if (errors) {
    res.render('register', {
      errors: errors
    });
  } else {
    let newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password
    });

    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(newUser.password, salt, function (err, hash) {
        if (err) {
          console.log(err);
        }
        newUser.password = hash;
        newUser.save(function (err) {
          if (err) {
            console.log(err);
            return;
          } else {
            req.flash('success', 'You are now registered and can log in');
            res.redirect('/users/login');
          }
        });
      });
    });
  }
});


/* // Update userProfile
router.post('/userEdit', function (req, res, next) {
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  let errors = req.validationErrors();

  if (errors) {
    res.render('userEdit', {
      errors: errors
    });
  } else {
    var user = req.user;

    user.name = name;
    user.email = email;
    user.username = username;
    user.password = password;

    user.save(function (err) {
      if (err) {
        next(err)
        console.log(err);
        return;
      } else {
        req.flash('success', 'You are now registered and can log in');
        res.redirect('/users/login');
      }
    });
  }
}); */

// userEditName Form
router.get('/userEditName', function (req, res) {
  res.render('userEditName');
});


// Update Name
router.post('/userEditName', function (req, res, next) {
  const name = req.body.name;

  req.checkBody('name', 'Name is required').notEmpty();
  let errors = req.validationErrors();

  if (errors) {
    res.render('userEditName', {
      errors: errors
    });
  } else {
    var user = req.user;

    user.name = name;

    user.save(function (err) {
      if (err) {
        next(err)
        console.log(err);
        return;
      } else {
        req.flash('success', 'You are now registered and can log in');
        res.redirect('/users/login');
      }
    });
  }
});

// userEditEmail Form
router.get('/userEditEmail', function (req, res) {
  res.render('userEditEmail');
});

// Update Email
router.post('/userEditEmail', function (req, res, next) {

  const email = req.body.email;

  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();

  let errors = req.validationErrors();

  if (errors) {
    res.render('userEditEmail', {
      errors: errors
    });
  } else {
    var user = req.user;


    user.email = email;

    user.save(function (err) {
      if (err) {
        next(err)
        console.log(err);
        return;
      } else {
        req.flash('success', 'You are now registered and can log in');
        res.redirect('/users/login');
      }
    });
  }
});

// userEditUsername Form
router.get('/userEditUsername', function (req, res) {
  res.render('userEditUsername');
});

// Update Username
router.post('/userEditUsername', function (req, res, next) {
  const username = req.body.username;

  req.checkBody('username', 'Username is required').notEmpty();

  let errors = req.validationErrors();

  if (errors) {
    res.render('userEditUsername', {
      errors: errors
    });
  } else {
    var user = req.user;

    user.username = username;

    user.save(function (err) {
      if (err) {
        next(err)
        console.log(err);
        return;
      } else {
        req.flash('success', 'You are now registered and can log in');
        res.redirect('/users/login');
      }
    });
  }
});

// userEditPassword Form
router.get('/userEditPassword', function (req, res) {
  res.render('userEditPassword');
});

// Update Password
router.post('/userEditPassword', function (req, res, next) {
  const password = req.body.password;
  const password2 = req.body.password2;

  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  let errors = req.validationErrors();

  if (errors) {
    res.render('userEditPassword', {
      errors: errors
    });
  } else {
    var user = req.user;

    user.password = password;

    user.save(function (err) {
      if (err) {
        next(err)
        console.log(err);
        return;
      } else {
        req.flash('success', 'You are now registered and can log in');
        res.redirect('/users/login');
      }
    });
  }
});


// Login Form
router.get('/login', function (req, res) {
  res.render('login');
});

// Login Process
router.post('/login', function (req, res, next) {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// logout
router.get('/logout', function (req, res) {
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;