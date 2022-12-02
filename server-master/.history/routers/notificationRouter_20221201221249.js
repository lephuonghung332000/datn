const express = require("express");
const userMiddleware = require("../middleware/author");
const {
  getAllNotifications,
  updateReadNotification,
  deleteFcmTokens,
  updateFcmTokens,
} = require("../controller/notificationController");

const router = express.Router();

router.get("/", getAllNotifications);
router.patch("/read", userMiddleware, updateReadNotification);
router.post("/updateFCMTokens", userMiddleware, updateFcmTokens);
router.delete("/removeFcmToken/:token", userMiddleware, deleteFcmTokens);

module.exports = {
  routes: router,
};
