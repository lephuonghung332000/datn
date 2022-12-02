const { db, firebaseStorage } = require("../config/fbConfig");
const currentUser = require("../utils/CurrentUser");

const Notification = require("../models/Notification");
const PAGE_SIZE = 2;

const getAllNotifications = async (req, res) => {
  var page = req.query.page;
  var lengthNotification;
  var data;
  try {
    var current = await currentUser();
    if (!current) {
      return res.status(400).json({ succes: false, message: "No found user " });
    }
    var user_id = current.id;
    if (page) {
      // get page
      page = parseInt(page);
      if (page < 1) {
        page = 1;
      }
      if (page == 1) {
        data = await queryNotification(user_id, PAGE_SIZE, null);
      } else {
        var start = (page - 1) * PAGE_SIZE;

        const snapshot = await queryNotification(user_id, start, null);

        if (snapshot.docs.length < start) {
          data = [];
        } else {
          // Get the last document
          var last = snapshot.docs[snapshot.docs.length - 1];

          data = await queryNotification(
            user_id,
            PAGE_SIZE,
            last.data().create_at
          );
        }
      }
      // don't pass page
    } else {
      data = await queryNotification(user_id, null, null);
    }

    const notificationsArray = [];
    if (data.empty || data.docs == undefined) {
      return res.status(200).json({
        success: true,
        message: "Fetch notification successfully",
        total: 0,
        data: [],
      });
    }
    var allNotifications = await queryNotification(user_id, null, null);
    lengthNotification = allNotifications.docs.length;
    console.log(data.docs.length);
    data.forEach((doc) => {
      const notification = new Notification(
        doc.id,
        doc.data().title,
        doc.data().type,
        doc.data().isRead,
        doc.data().content,
        doc.data().user_ids,
        doc.data().isNew,
        doc.data().createAt
      );
      notificationsArray.push(notification);
    });
    return res.status(200).json({
      success: true,
      message: "Fetch notification successfully",
      total: lengthNotification,
      data: notificationsArray,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Occur in server error" });
  }
};

async function queryNotification(user_id, limit, start) {
  var data = db.collection("notification");
  if (user_id) {
    data = data.where("user_ids", "array-contains", user_id);
  }
  data = data.orderBy("create_at", "desc");
  if (start) {
    data = data.startAfter(start);
  }
  if (limit) {
    data = data.limit(limit);
  }
  return await data.get();
}

const updateReadNotification = async (req, res) => {
  var id = req.params.id;
  try {
    const commentDb = db.collection("notification").doc(id);
    const response = await commentDb.update({ isRead: true });
    if (response) {
      return res
        .status(200)
        .json({ success: true, message: "Update notification successfully" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Update notification failed" });
    }
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Occur in server error" });
  }
};

const deleteFcmTokens = async (req, res) => {
  if (!req.params.token) {
    return res
      .status(400)
      .json({ succes: false, message: "Missing fcm token" });
  }

  try {
    const doc = await db
      .collection("tokens")
      .where("token", "==", req.params.token)
      .get();
    for (let i = 0; i < doc.length; i++) {
      await doc[i].ref
        .delete()
        .then(() => {
          return res
            .status(200)
            .json({ success: true, message: "Update fcmTokens successfully" });
        })
        .catch(function (error) {
          return res
            .status(400)
            .json({ success: false, message: "Update fcmTokens failed" });
        });
    }
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Occur in server error" });
  }
};


const updateFcmTokens = async (req, res) => {
  if (!req.body.token) {
    return res
      .status(400)
      .json({ succes: false, message: "Missing fcm token" });
  }

  try {
    var current = await currentUser();
    if (!current) {
      return res.status(400).json({ succes: false, message: "No found user " });
    }
    const tokenDb = db.collection("tokens");
    const response = await tokenDb.doc().set({
      image: current.id,
      token: req.body.token,
    });
    if (response) {
      return res
        .status(200)
        .json({ success: true, message: "Add tokens successfully" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Add tokens failed" });
    }
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Occur in server error" });
  }
};

module.exports = {
  getAllNotifications,
  updateReadNotification,
  deleteFcmTokens,
  updateFcmTokens,
};
