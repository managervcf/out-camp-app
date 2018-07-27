const   express     = require("express"),
        router      = express.Router();
        
const   Campground  = require("../models/campground"),
        middleware  = require("../middleware");

// INDEX ROUTE - Shows all the campgrounds
router.get("/", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if (err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
        }
    });
});

// CREATE ROUTE - Adds new campground to the database
router.post("/", middleware.isLoggedIn, function(req, res){
    var newCampground = {
        name: req.body.name,
        image: req.body.image,
        description: req.body.description,
        price: req.body.price,
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
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if (err) {
            req.flash("error", "Campground not found!");
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground successfully edited");
            res.redirect("/campgrounds/" + req.params.id);
        }
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

module.exports = router;