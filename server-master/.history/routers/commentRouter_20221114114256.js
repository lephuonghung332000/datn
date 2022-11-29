const express = require("express");
const {
  getAllComment,
  addComment,
  updateComment,
  deleteComment
} = require("../controller/commentController");

const router = express.Router();
const multer = require("multer");

router.get("/:id?", getAllComment);
router.post("/addComment", addComment);
router.patch("/updateComment/:id", updateComment);
router.delete("/deleteComment/:id", deleteComment);

module.exports = {
  routes: router,
};
