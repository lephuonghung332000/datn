const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/author");
const Search = require("../models/Search");

// @route GET api/comment all
// @desc Get post
// @access Private
router.get("/", verifyToken, async (req, res) => {
  try {
    const search = await Search.find({
      user: req.userId,
    }).sort({ _id: -1 }).limit(Number(req.query.total))
    res.json({
      messages: "Get list search successfully",
      success: true,
      data: search,
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
  const { key } = req.body;
  if (key && req.userId) {
    try {
      const search = await Search({ ...req.body, user: req.userId })
      await search.save();
      return res.status(200).json({ success: true, message: "Success", data: search })
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: "Occur in server error" });
    }
  } else {
    return res.status(500).json({
      success: false,
      message: " Require key,userId",
    });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const conditionDetele = { _id: req.params.id, user: req.userId };
    const search = await Search.findOneAndDelete(conditionDetele);
    if (!search) {
      return res.status(400).json({
        success: false,
        message: "Post not found or user not authorised",
      });
    }
    res.json({
      success: true,
      message: "Delete search successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Occur in server error" });
  }
});



module.exports = router;
