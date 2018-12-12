// Require packages
const express = require('express');
const router = express.Router();
const passport = require('passport');

// Require models
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const User = require('../models/user');

// Require middleware
const middleware = require('../middleware');

// Import keys
const keys = require('../config/keys');

// HOME ROUTE - Home page
router.get('/', (req, res) => {
  res.render('home');
});

// Authentication Routes - register, login, logout
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  if (!isImageURL(req.body.avatar)) {
    req.body.avatar = 'http://i.imgur.com/HQ3YU7n.gif';
  }
  var newUser = new User({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    bio: req.body.bio,
    avatar: req.body.avatar
  });
  if (req.body.adminCode === keys.adminCode) {
    newUser.isAdmin = true;
  }
  console.log(newUser);
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      req.flash('error', err.message);
      console.log(err);
      res.redirect('/register');
    }
    passport.authenticate('local')(req, res, () => {
      req.flash(
        'success',
        'Welcome to YelpCamp, ' +
          user.username +
          '. Start exploring the most amazing campgrounds in the world!'
      );
      res.redirect('/campgrounds');
    });
  });
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
  }),
  (req, res) => {}
);

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Successfully logged out');
  res.redirect('/campgrounds');
});

// USER PROFILE Route
router.get('/users/:id', (req, res) => {
  User.findById(req.params.id, (err, foundUser) => {
    if (err) {
      console.log(err);
      req.flash('error', 'Something went wrong, cannot find given user');
      res.redirect('back');
    } else {
      Campground.find()
        .where('author.id')
        .equals(foundUser._id)
        .exec((err, userCampgrounds) => {
          if (err) {
            console.log(err);
            res.redirect('back');
          } else {
            Comment.find()
              .where('author.id')
              .equals(foundUser._id)
              .exec((err, userComments) => {
                if (err) {
                  console.log(err);
                  res.redirect('back');
                } else {
                  res.render('users/show', {
                    user: foundUser,
                    campgrounds: userCampgrounds,
                    comments: userComments
                  });
                }
              });
          }
        });
    }
  });
});

// EDIT USER PROFILE
router.get('/users/:id/edit', middleware.isUserAuthorized, (req, res) => {
  User.findById(req.params.id, (err, foundUser) => {
    if (err) {
      console.log(err);
      res.redirect('back');
    } else {
      res.render('users/edit', { user: foundUser });
    }
  });
});

router.put('/users/:id', middleware.isUserAuthorized, (req, res) => {
  if (!isImageURL(req.body.user.avatar)) {
    req.body.user.avatar = 'http://i.imgur.com/HQ3YU7n.gif';
  }
  User.findByIdAndUpdate(req.params.id, req.body.user, (err, updatedUser) => {
    if (err) {
      console.log(err);
      res.redirect('back');
    } else {
      req.flash('success', 'Updated user profile');
      res.redirect('/users/' + req.params.id);
    }
  });
});

const isImageURL = url => {
  url.match(/\.(jpeg|jpg|gif|png)$/) != null ||
    url.startsWith('https://secure.gravatar.com/avatar/');
};

module.exports = router;
