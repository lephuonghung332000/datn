const { db, firebaseStorage } = require("../config/fbConfig");

const Notification = require("../models/Notification");

const getAllNotifications = async (req, res) => {
  try {
    const id = req.params.id;
    const notifications = db.collection("notification").doc(id);
    const data = await notifications.get();
    const notificationsArray = [];
    if (data.empty) {
      return res.status(200).json([]);
    }
    data.forEach((doc) => {
      const notification = new Notification(
        doc.id,
        doc.data().post_id,
        doc.data().list_user_id,
        doc.data().type,
        doc.data().content,
        doc.data().createAt
      );
      notificationsArray.push(notification);
    });
    return res.status(200).json(notificationsArray);
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Occur in server error" });
  }
};

module.exports = {
  getAllNotifications,
};
