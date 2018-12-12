const Campground = require('../models/campground');
const Comment = require('../models/comment');
const User = require('../models/user');
const middlewareObj = {};

middlewareObj.isUserCampgroundOwner = (req, res, next) => {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if (err) {
        req.flash('error', 'Campground not found');
        console.log(err);
        res.redirect('back');
      } else {
        if (
          foundCampground.author.id.equals(req.user._id) ||
          req.user.isAdmin
        ) {
          return next();
        } else {
          req.flash('error', 'Permission denied');
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'You need to be logged in');
    res.redirect('back');
  }
};

middlewareObj.isUserCommentOwner = (req, res, next) => {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        console.log(err);
        res.redirect('back');
      } else {
        if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
          return next();
        } else {
          req.flash('error', 'Permission denied');
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'You need to be logged in');
    res.redirect('/login');
  }
};

middlewareObj.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'You need to be logged in');
  res.redirect('/login');
};

middlewareObj.isUserAuthorized = (req, res, next) => {
  if (req.isAuthenticated()) {
    User.findById(req.params.id, (err, foundUser) => {
      if (err) {
        console.log(err);
        res.redirect('back');
      } else {
        if (foundUser._id.equals(req.user._id)) {
          return next();
        } else {
          req.flash('error', 'Permission denied');
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'You need to be logged in');
    res.redirect('back');
  }
};

module.exports = middlewareObj;
