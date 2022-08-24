const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/author");
const Chat = require("../models/Chat");

const { updateFriend } = require('../controller/profile');
// @route GET api/chat 
// @desc Get post
// @access Private
router.get("/", verifyToken, async (req, res) => {
  try {
    const chats = await Chat.findOne({
      idClient1: [req.query.idClient1 , req.query.idClient2],
      idClient2: [req.query.idClient2 , req.query.idClient1],
    });
    res.json({
      messages: "Get list chat successfully",
      success: true,
      data: chats,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Occur in server error" });
  }
});


// @route POST api/chat
// @desc Create post
// @access Private
router.post("/", verifyToken, async (req, res) => {
  const { idClient1, idClient2 } = req.body;
  if (idClient1 && idClient2 && req.userId) {
    try {
      const chat = await Chat({ ...req.body })
      await chat.save().then(() => {
        updateFriend({ idFriend: idClient2, idUser: idClient1 });
        updateFriend({ idFriend: idClient1, idUser: idClient2 });
      });;
      return res.status(200).json({ success: true, message: "Success", data: chat })
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: "Occur in server error" });
    }
  } else {
    return res.status(500).json({
      success: false,
      message: " Require content, idClient",
    });
  }
});
///Put chat
router.put("/:id", verifyToken, async (req, res) => {
  try {
    postUpdate = await Chat.findOneAndUpdate({ _id: req.params.id },
      { $push: { listChat: { $each: [req.body] } } },
      { new: false }
    );
    return res.json({
      success: true,
      message: "Update successful",
      data: postUpdate,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Occur in server error" });
  }
});

module.exports = router;
