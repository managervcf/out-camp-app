const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    bio: String,
    avatar: {
        type: String,
        default: "http://i.imgur.com/HQ3YU7n.gif"
    },
    firstName: String,
    lastName: String,
    isAdmin: {
        type: Boolean,
        default: false
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);