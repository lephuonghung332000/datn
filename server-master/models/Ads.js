const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AdsSchema = new Schema({
    image: {
        type: String,
        require: true,
    },
    createAt: {
        type: Date,
        default: Date.now,
    },

});

const Ads = mongoose.model("adss", AdsSchema);

module.exports = Ads;
