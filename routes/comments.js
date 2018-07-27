const   express     = require("express"),
        router      = express.Router({mergeParams: true});
        
const   Campground  = require("../models/campground"),
        Comment     = require("../models/comment"),
        middleware  = require("../middleware");

// NEW ROUTE - Shows form to create comment
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: foundCampground}); 
        }
    });
});

// CREATE ROUTE - Adds new comment to the database connected to specific campground
router.post("/", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, createdComment) {
                if (err) {
                    req.flash("error", "Something went wrong!")
                    console.log(err);
                } else {
                    createdComment.author.id = req.user._id;
                    createdComment.author.username = req.user.username;
                    createdComment.save();
                    foundCampground.comments.push(createdComment);
                    foundCampground.save();
                    console.log(createdComment);
                    req.flash("success", "Successfully created comment!")
                    res.redirect('/campgrounds/' + foundCampground._id);
                }
            });
        }
    });
});

// EDIT COMMENT ROUTE - Shows form to edit comment
router.get("/:comment_id/edit", middleware.isUserCommentOwner, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            Comment.findById(req.params.comment_id, function(err, foundComment) {
                if (err) {
                    console.log(err);
                    res.redirect("back");
                } else {
                    res.render("comments/edit", {comment: foundComment, campground: foundCampground});
                }
            });
        }
    });
});

// UPDATE COMMENT ROUTE - Updates existing comment with new text
router.put("/:comment_id", middleware.isUserCommentOwner, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            req.flash("success", "Comment edited");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY COMMENT ROUTE - Removes comment from database
router.delete("/:comment_id", middleware.isUserCommentOwner, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
            console.log(err);
        } else {
            req.flash("success", "Comment deleted.");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;