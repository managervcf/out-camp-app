// Require Packages
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const localStrategy = require('passport-local');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const express = require('express');

// Create express app
const app = express();

// Import keys
const keys = require('./config/keys');

// Require Models and Routes
const User = require('./models/user');
const commentRoutes = require('./routes/comments');
const campgroundRoutes = require('./routes/campgrounds');
const indexRoutes = require('./routes/index');

// Connect to MongoDB
mongoose.connect(
  keys.databaseURI,
  { useNewUrlParser: true }
);

// Packages Configuration
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(flash());
app.locals.moment = require('moment');

// Passport Configuration
app.use(
  require('express-session')({
    secret: 'Campgrounds are awesome',
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

// Use Routes
app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

// Server Listener
const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`OutCamp server is running on port ${port}`)
);
