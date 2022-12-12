const { admin, db, firebaseStorage } = require("../config/fbConfig");
const currentUser = require("../utils/CurrentUser");

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
      console.log(user_id_choose);
      console.log(user.id);
      title = postTitle;
      content = body;
      if (user_id_choose) {
        notificationDb.doc().set({
          title: title,
          type: type,
          isRead: false,
          isNew: true,
          content: content,
          create_at: new Date().getTime() / 1000,
          user_id: user_id_choose,
        });
        //send notification

        if (user.id == user_id_choose) {
          const tokens = await getTokensByUserId(user.id);
          admin.messaging().sendMulticast({
            tokens: tokens,
            data: {
              type: type,
              url: "",
            },
            notification: {
              title: title,
              body: content,
            },
          });
        }
      }
    }
  } catch (e) {}
};
