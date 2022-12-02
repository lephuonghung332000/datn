const { admin, db, firebaseStorage } = require("../config/fbConfig");
const currentUser = require("../utils/CurrentUser");

const {
  getAllToken,
  getTokensByUserId,
  getAllUserIds,
} = require("../controller/fcmTokenController");

module.exports = async function sendNotifications(body, postTitle, type) {
  var title = "";
  var content = "";
  var ids = [];
  const user = await currentUser();
  //ads
  if (type === "ads") {
    title = body.title;
    content = body.url;
    ids = await getAllUserIds();
  }
  //post
  else {
    title = postTitle;
    content = body;
    if (user) {
      ids.push(user.id);
    }
  }
  try {
    const notificationDb = db.collection("notification");
    const response = await notificationDb.doc().set({
      title: title,
      type: type,
      isRead: false,
      content: content,
      create_at: new Date().getTime() / 1000,
      user_ids: ids,
    });

    // if (response) {
    //   var payload = {
    //     notification: {
    //       title: title,
    //       body: type === "ads" ? content : null,
    //       sound: "default",
    //     },
    //   };
    //   if (type === "ads") {
    //     const fcmTokens = await getAllToken();
    //     await admin.messaging().sendMulticast({
    //       tokens: fcmTokens,
    //       notification: {
    //         title: "Weather Warning!",
    //         body: "A new weather warning has been issued for your location.",
    //         imageUrl: "https://my-cdn.com/extreme-weather.png",
    //       },
    //     });
    //   } else {
    //     if (user) {
    //       const tokens = getTokensByUserId(user.id);
    //       admin.messaging().sendToDevice(tokens, payload);
    //     }
    //   }
    // }
  } catch (e) {}
};
