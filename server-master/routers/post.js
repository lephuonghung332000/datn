const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/author");
const Post = require("../models/Post");

// @route GET api/posts
// @desc Get post
// @access Private
router.get("/", verifyToken, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.userId }).populate("user", [
      "username",
    ]);
    res.json({
      messages: "Get list post successfully",
      success: true,
      data: posts,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Occur in server error" });
  }
});

// @route POST api/posts
// @desc Create post
// @access Private
router.post("/", verifyToken, async (req, res) => {
  const { title, description, url, status } = req.body;
  if (!title) {
    return res
      .status(400)
      .json({ success: false, message: "title is required" });
  }
  try {
    const newPost = new Post({
      title,
      description,
      url: url.includes("https://") ? url : "https://" + url,
      status: status || "IN LEARN",
      user: req.userId,
    });
    await newPost.save();
    return res.json({
      success: true,
      post: newPost,
      message: " Create a post successfully",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Occur in server error" });
  }
});

// @route POST api/posts
// @desc Create post
// @access Private
router.post("/", verifyToken, async (req, res) => {
  const { title, description, url, status } = req.body;
  if (!title) {
    return res
      .status(400)
      .json({ success: false, message: "title is required" });
  }
  try {
    const newPost = new Post({
      title,
      description,
      url: url.includes("https://") ? url : "https://" + url,
      status: status || "IN LEARN",
      user: req.userId,
    });
    await newPost.save();
    return res.json({
      success: true,
      post: newPost,
      message: " Create a post successfully",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Occur in server error" });
  }
});

// @route PUT api/posts
// @desc Update post
// @access Private
router.put("/:id", verifyToken, async (req, res) => {
  const { title, description, url, status } = req.body;
  if (!title) {
    return res
      .status(400)
      .json({ message: "title is required", success: false });
  }
  try {
    const conditionsUpdate = { _id: req.params.id, user: req.userId };
    let postUpdate = {
      title,
      description,
      url: url.includes("https://") ? url : "https://" + url,
      status: status || "IN LEARN",
    };
    postUpdate = await Post.findOneAndUpdate(conditionsUpdate, postUpdate, {
      new: true,
    });
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

// @route DELETE api/posts
// @desc Update post
// @access Private
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const conditionDetele = { _id: req.params.id, user: req.userId };
    const postDelete = await Post.findOneAndDelete(conditionDetele);
    if (!postDelete) {
      return res.status(400).json({
        success: false,
        message: "Post not found or user not authorised",
      });
    }

    res.json({
      success: true,
      message: "Delete post successfully",
      data: postDelete,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Occur in server error" });
  }
});

module.exports = router;
