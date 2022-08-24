const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CommentSchema = new Schema({
    idProduct: {
        type: String,
        require: true,
    },
    content: {
        type: String,
        require: true,
    },
    image: [
        {
          file: {
            type: String,
            require: false,
          },
        }
      ],
    parentId: {
        type: String,
        require: false,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
    deleteAt: {
        type: Date,
        default: null,
    },
    createAt: {
        type: Date,
        default: Date.now,
    },

});

const Comment = mongoose.model("comments", CommentSchema);

module.exports = Comment;
