const express = require("express");
const {
  getPost,
  createPost,
  updatePost,
  deletePost,
  updateStatusPost
} = require("../controller/postController");

const router = express.Router();
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
}).array("files");

router.get("/:id?", getPost);
router.post("/addPost", upload, createPost);
router.patch("/updatePost/:id", upload, updatePost);
router.delete("/deletePost/:id", deletePost);
router.patch("/updatePost/status/:id", updateStatusPost);

module.exports = {
  routes: router,
};
