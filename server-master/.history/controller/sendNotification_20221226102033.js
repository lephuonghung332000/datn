const { admin, db, firebaseStorage } = require("../config/fbConfig");

const {
  getAllToken,
  getTokensByUserId,
  getAllUserIds,
} = require("../controller/fcmTokenController");

module.exports = async function sendNotifications(
  body,
  postTitle,
  type,
  user_id_choose
) {
  var title = "";
  var content = "";
  var ids = [];
  // try {
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
        isNew: true,
        content: content,
        create_at: new Date().getTime() / 1000,
        user_id: id,
      });
    });
    //send notification
    const fcmTokens = await getAllToken();
    await admin.messaging().sendMulticast({
      tokens: fcmTokens,
      data: {
        type: type,
        url: content,
      },
      notification: {
        title: "Quảng cáo hôm nay",
        body: body.title,
      },
    });
  }
  //post
  else {
    title = postTitle;
    content = body;
    // if (user_id_choose) {
    //   notificationDb.doc().set({
    //     title: title,
    //     type: type,
    //     isRead: false,
    //     isNew: true,
    //     content: content,
    //     create_at: new Date().getTime() / 1000,
    //     user_id: user_id_choose,
    //   });
    //send notification

    const tokens = await getTokensByUserId(user_id_choose);
    admin
      .messaging()
      .sendMulticast({
        tokens: tokens,
        data: {
          type: type,
          url: "",
        },
        notification: {
          title: title,
          body: content,
        },
      })
      .then((response) => {
        // Response is a message ID string.
        console.log("Successfully sent message:", response);
        console.log(response.responses[0].error);
      })
      .catch((error) => {
        console.log("Error sending message:", error);
      });
  }
  // }
  // } catch (e) {}
};
