// Require Packages
const   bodyParser      = require("body-parser"),
        mongoose        = require("mongoose"),
        passport        = require("passport"),
        localStrategy   = require("passport-local"),
        methodOverride  = require("method-override"),
        flash           = require("connect-flash"),
        express         = require("express"),
        app             = express();

// Require Models
const   Campground          = require("./models/campground"),
        Comment             = require("./models/comment"),
        User                = require("./models/user"),
        commentRoutes       = require("./routes/comments"),
        campgroundRoutes    = require("./routes/campgrounds"),
        indexRoutes         = require("./routes/index");
        
// SEEDING DATABASE WITH NEW DATA
// var seedDB = require("./seeds");
// seedDB();        

// Packages Configuration
mongoose.connect("mongodb://managervcf:Kochamdomi1@ds155461.mlab.com:55461/yelpcamp_managervcf", {useNewUrlParser: true});     
// mongoose.connect("mongodb://localhost:27017/yelp_camp_v13", {useNewUrlParser: true});

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());

// Passport Configuration
app.use(require("express-session")({
    secret: "Campgrounds are awesome",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// Use Routes
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// Server Listener
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server is running...");
});

