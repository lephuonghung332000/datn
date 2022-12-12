const express = require("express");
const userMiddleware = require("../middleware/author");
const {
  getAllHintChats,
  getAllChats,
} = require("../controller/chatController");

const router = express.Router();

router.get("/hints", userMiddleware, getAllHintChats);
router.get("/", userMiddleware, getAllChats);

module.exports = {
  routes: router,
};
