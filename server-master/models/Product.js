const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ProductSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  width: {
    type: String,
    require: false,
  },
  height: {
    type: String,
    require: false,
  },
  address: {
    type: String,
    require: false,
  },
  image: [
    {
      file: {
        type: String,
        require: false,
      },
    }
  ],
  category: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    default: ""
  },
  status: {
    type: Number,
    default: 0,
  },
  listRequire:
    [
      {
        type: String,
        require: false,
      }
    ],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  createAt: {
    type: Date,
    default: Date.now,
  },

});

const Product = mongoose.model("product", ProductSchema);

module.exports = Product;
