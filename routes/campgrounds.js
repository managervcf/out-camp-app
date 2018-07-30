const   express         = require("express"),
        router          = express.Router();
        
const   Campground      = require("../models/campground"),
        middleware      = require("../middleware"),
        nodeGeocoder    = require('node-geocoder');

// Geocoder Config
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = nodeGeocoder(options);

// INDEX ROUTE - Shows all the campgrounds
router.get("/", function(req, res){
    var noMatch = null;
    if (req.query.search) {
        console.log("Search query: " + req.query.search);
        var regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Campground.find({name: regex}, function(err, allCampgrounds){
            if (err){
                console.log(err);
            } else {
                if (allCampgrounds.length === 0) {
                    noMatch = "No campgrounds match that query, please try again.";
                }
                res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user, noMatch: noMatch});
            }
        });
    } else {
        Campground.find({}, function(err, allCampgrounds){
            if (err){
                console.log(err);
            } else {
                res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user, noMatch: noMatch});
            }
        });
    }
});

// CREATE ROUTE - Adds new campground to the database
router.post("/", middleware.isLoggedIn, function(req, res){
    console.log(req.body.location);
    geocoder.geocode(req.body.location, function (err, geoData) {
        console.log(req.body.location);
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
        Campground.create(newCampground, function(err, newlyCreatedCampground){
            if (err){
                console.log(err);
            } else {
                console.log(newlyCreatedCampground);
                res.redirect("/campgrounds");
        }});
    });
});

// NEW ROUTE - Shows form to create campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

// SHOW ROUTE - Shows info about particular campground
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, camp){
        if (err){
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: camp});
        }
    });
});

// EDIT CAMPGROUND ROUTE - Edits particular campground
router.get("/:id/edit", middleware.isUserCampgroundOwner, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            req.flash("error", "Campground not found!");
            console.log(err);
            res.redirect("back");
        } else {
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

// UPDATE CAMPGROUND ROUTE - Updates existing campground with new data
router.put("/:id", middleware.isUserCampgroundOwner, function(req, res) {
    geocoder.geocode(req.body.campground.location, function (err, geoData) {
        if (err || !geoData.length) {
            console.log(err);
            req.flash('error', 'Invalid address');
            return res.redirect('back');
        }
        req.body.campground.lat = geoData[0].latitude;
        req.body.campground.lng = geoData[0].longitude;
        req.body.campground.location = geoData[0].formattedAddress;
        Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
            if (err) {
                req.flash("error", "Campground not found!");
                console.log(err);
                res.redirect("/campgrounds");
            } else {
                console.log(updatedCampground);
                req.flash("success", "Campground successfully edited");
                res.redirect("/campgrounds/" + req.params.id);
            }
        });
    });
});

// DESTROY CAMPGROUND ROUTE - Removes campground from database
router.delete("/:id", middleware.isUserCampgroundOwner, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log(err);
        } else {
            req.flash("success", "Campground deleted.");
            res.redirect("/campgrounds");
        }
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;