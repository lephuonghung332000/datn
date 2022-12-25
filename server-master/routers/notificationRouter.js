const express = require("express");
const {
  getAllNotifications,
  updateReadNotification,
  deleteFcmTokens,
  updateFcmTokens,
  getUnreadNotifications,
  updateAllNewNotification,
} = require("../controller/notificationController");

const router = express.Router();

router.get("/:id", getAllNotifications);
router.get("/unread/all", getUnreadNotifications);
router.patch("/unread/update", updateAllNewNotification);
router.patch("/read/:id", updateReadNotification);
router.post("/updateFCMTokens/:id", updateFcmTokens);
router.delete("/removeFcmToken/:token", deleteFcmTokens);

module.exports = {
  routes: router,
};
