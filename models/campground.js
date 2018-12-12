const { Schema, model } = require('mongoose');

var campgroundSchema = new Schema({
  name: String,
  description: String,
  image: String,
  price: String,
  location: String,
  lat: Number,
  lng: Number,
  createdAt: {
    type: Date,
    default: Date.now
  },
  author: {
    id: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
});

module.exports = model('Campground', campgroundSchema);
