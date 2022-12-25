const express = require("express");
const {
  getAllHintChats,
  getAllChats,
  getAllMessageChats,
  addChat,
  createMessageChat,
} = require("../controller/chatController");
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
}).single("file");

const router = express.Router();

router.get("/hints", getAllHintChats);
router.get("/:id", getAllChats);
router.get("/messageChat/:id", getAllMessageChats);
router.post("/addChat", addChat);
router.post("/addMessageChat",upload, createMessageChat);

module.exports = {
  routes: router,
};
