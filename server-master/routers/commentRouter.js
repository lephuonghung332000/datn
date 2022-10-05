const express = require("express");
const userMiddleware = require("../middleware/author");
const {
  getAllComment,
  addComment,
  updateComment,
  deleteComment
} = require("../controller/commentController");

const router = express.Router();
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
}).single("file");

router.get("/:id?", getAllComment);
router.post("/addComment", upload, addComment);
router.patch("/updateComment/:id", upload, updateComment);
router.delete("/deleteComment/:id", deleteComment);

module.exports = {
  routes: router,
};
