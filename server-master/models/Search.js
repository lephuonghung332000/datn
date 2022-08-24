const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SearchSchema = new Schema({
    key: {
        type: String,
        require: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
    createAt: {
        type: Date,
        default: Date.now,
    },

});

const Search = mongoose.model("searchs", SearchSchema);

module.exports = Search;
