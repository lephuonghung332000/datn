const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  url: {
    type: String,
  
  },
  status: {
    type: String,
    enum: ["IN LEARN", "LEARNING", "LEARNED"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

const Post = new mongoose.model("posts", postSchema);

module.exports = Post;
