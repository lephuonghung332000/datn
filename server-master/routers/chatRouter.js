const express = require("express");
const {
  getAllHintChats,
  getAllChats,
  addChat,
} = require("../controller/chatController");

const router = express.Router();

router.get("/hints", getAllHintChats);
router.get("/:id", getAllChats);
router.post("/addChat", addChat);

module.exports = {
  routes: router,
};
