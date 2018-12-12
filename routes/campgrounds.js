// Require packages
const express = require('express');
const router = express.Router();

// Require models
const Campground = require('../models/campground');

// Require middleware
const middleware = require('../middleware');
const nodeGeocoder = require('node-geocoder');

// Import keys
const keys = require('../config/keys');

// Geocoder Config
const options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: keys.geocoderAPIKey,
  formatter: null
};

const geocoder = nodeGeocoder(options);

// INDEX ROUTE - Shows all the campgrounds
router.get('/', (req, res) => {
  var noMatch = null;
  if (req.query.search) {
    var regex = new RegExp(escapeRegex(req.query.search), 'gi');
    Campground.find({ name: regex }, (err, allCampgrounds) => {
      if (err) {
        console.log(err);
      } else {
        if (allCampgrounds.length === 0) {
          noMatch = 'No campgrounds found, please try again!';
        }
        res.render('campgrounds/index', {
          campgrounds: allCampgrounds,
          currentUser: req.user,
          noMatch: noMatch
        });
      }
    });
  } else {
    Campground.find({}, (err, allCampgrounds) => {
      if (err) {
        console.log(err);
      } else {
        res.render('campgrounds/index', {
          campgrounds: allCampgrounds,
          currentUser: req.user,
          noMatch: noMatch
        });
      }
    });
  }
});

// CREATE ROUTE - Adds new campground to the database
router.post('/', middleware.isLoggedIn, (req, res) => {
  geocoder.geocode(req.body.location, (err, geoData) => {
    if (err || !geoData.length) {
      console.log(err);
      req.flash('error', err);
      return res.redirect('back');
    }
    var newCampground = {
      name: req.body.name,
      image: req.body.image,
      description: req.body.description,
      price: req.body.price,
      location: geoData[0].formattedAddress,
      lat: geoData[0].latitude,
      lng: geoData[0].longitude,
      author: {
        id: req.user._id,
        username: req.user.username
      }
    };
    Campground.create(newCampground, (err, newlyCreatedCampground) => {
      if (err) {
        console.log(err);
      } else {
        console.log(newlyCreatedCampground);
        res.redirect('/campgrounds');
      }
    });
  });
});

// NEW ROUTE - Shows form to create campground
router.get('/new', middleware.isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

// SHOW ROUTE - Shows info about particular campground
router.get('/:id', (req, res) => {
  Campground.findById(req.params.id)
    .populate('comments')
    .exec((err, camp) => {
      if (err) {
        console.log(err);
      } else {
        res.render('campgrounds/show', {
          campground: camp,
          apiKey: keys.mapsAPIKey
        });
      }
    });
});

// EDIT CAMPGROUND ROUTE - Edits particular campground
router.get('/:id/edit', middleware.isUserCampgroundOwner, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) {
      req.flash('error', 'Campground not found!');
      console.log(err);
      res.redirect('back');
    } else {
      res.render('campgrounds/edit', { campground: foundCampground });
    }
  });
});

// UPDATE CAMPGROUND ROUTE - Updates existing campground with new data
router.put('/:id', middleware.isUserCampgroundOwner, (req, res) => {
  geocoder.geocode(req.body.campground.location, (err, geoData) => {
    if (err || !geoData.length) {
      console.log(err);
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    req.body.campground.lat = geoData[0].latitude;
    req.body.campground.lng = geoData[0].longitude;
    req.body.campground.location = geoData[0].formattedAddress;
    Campground.findByIdAndUpdate(
      req.params.id,
      req.body.campground,
      (err, updatedCampground) => {
        if (err) {
          req.flash('error', 'Campground not found!');
          console.log(err);
          res.redirect('/campgrounds');
        } else {
          console.log(updatedCampground);
          req.flash('success', 'Campground successfully edited');
          res.redirect('/campgrounds/' + req.params.id);
        }
      }
    );
  });
});

// DESTROY CAMPGROUND ROUTE - Removes campground from database
router.delete('/:id', middleware.isUserCampgroundOwner, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, err => {
    if (err) {
      console.log(err);
    } else {
      req.flash('success', 'Campground deleted.');
      res.redirect('/campgrounds');
    }
  });
});

const escapeRegex = text => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

module.exports = router;
