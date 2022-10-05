const { admin, db, firebaseStorage } = require("../config/fbConfig");

module.exports = function sendNotifications(tokens,message) {
  var payload = {
    notification: {
      title: "Chợ mới",
      body: message,
      sound: "default",
    }
  };

  return admin.messaging().sendToDevice(tokens, payload);
};
