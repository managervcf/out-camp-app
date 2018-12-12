const { Schema, model } = require('mongoose');

var commentSchema = new Schema({
  text: String,
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
  }
});

module.exports = model('Comment', commentSchema);
