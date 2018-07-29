const   express     = require("express"),
        router      = express.Router(),
        passport    = require("passport");
        
const   Campground  = require("../models/campground"),
        Comment     = require("../models/comment"),
        User        = require("../models/user");

// HOME ROUTE - Home page
router.get("/", function(req, res){
    res.render("home");
});

// Authentication Routes - register, login, logout
router.get("/register", function(req, res) {
    res.render("register");
});

router.post("/register", function(req, res) {
    var newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        avatar: req.body.avatar,
    });
    if (req.body.adminCode === "dupakupa1") {
        newUser.isAdmin = true;
    }
    console.log(newUser);
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            req.flash("error", err.message);
            console.log(err);
            res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome to YelpCamp, " + user.username + ". Start exploring the most amazing campgrounds in the world!");
            res.redirect("/campgrounds");
        });
    }) ;   
});

router.get("/login", function(req, res) {
    res.render("login");
});

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res) {
});

router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Successfully logged out");
    res.redirect("/campgrounds");
});

// USER PROFILE Route
router.get("/users/:id", function(req, res) {
   User.findById(req.params.id, function(err, foundUser) {
       if (err) {
           console.log(err);
           req.flash("error", "Something went wrong, cannot find given user");
           res.redirect("back");
       } else {
           res.render("users/show", {user: foundUser});
       }
   }); 
});

module.exports = router;