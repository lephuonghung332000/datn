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
  try {
    const user = await currentUser();
    const notificationDb = db.collection("notification");
    //ads
    if (type === "ads") {
      title = body.title;
      content = body.url;
      ids = await getAllUserIds();
      ids.forEach((id) => {
        notificationDb.doc().set({
          title: title,
          type: type,
          isRead: false,
          content: content,
          create_at: new Date().getTime() / 1000,
          user_id: id,
        });
      });
      //send notification
      // const fcmTokens = await getAllToken();
      // await admin.messaging().sendMulticast({
      //   tokens: fcmTokens,
      //   notification: {
      //     title: "Quảng cáo mới",
      //     body: body.title,
      //   },
      // });
    }
    //post
    else {
      title = postTitle;
      content = body;
      if (user) {
        notificationDb.doc().set({
          title: title,
          type: type,
          isRead: false,
          content: content,
          create_at: new Date().getTime() / 1000,
          user_id: user.id,
        });
        //send notification

        // const tokens = getTokensByUserId(user.id);
        // admin.messaging().sendToDevice(tokens, payload);
      }
    }
  } catch (e) {}
};
