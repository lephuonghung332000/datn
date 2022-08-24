const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const NotificationSchema = new Schema({
    idProduct: {
        type: String,
        require: true,
    },
    idClient: {
        type: String,
        require: true,
    },
    content: {
        type: String,
        require: true,
    },
    type: {
        type: String,
        require: false,
    },
    createAt: {
        type: Date,
        default: Date.now,
    },

});

const Notification = mongoose.model("notifications", NotificationSchema);

module.exports = Notification;
