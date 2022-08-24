const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/author");
const Comment = require("../models/Comment");

// @route GET api/comment all
// @desc Get post
// @access Private
router.get("/", verifyToken, async (req, res) => {
  try {
      if(req.query.idProduct){
        const comments = await Comment.find({idProduct:req.query.idProduct});
        res.json({
            messages: "Get list comment successfully",
            success: true,
            data: comments,
          });
      }
      else{
        const comments = await Comment.find();
        res.json({
            messages: "Get list comment successfully",
            success: true,
            data: comments,
          });
      }
   
  
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
  const { content, idProduct } = req.body;
  if (content && idProduct && req.userId) {
    try {
        const comment = await Comment({...req.body, user: req.userId})
        await comment.save();
        
        return res.status(200).json({success: true, message: "Success", data: comment})
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: "Occur in server error" });
    }
  }else {
    return res.status(500).json({
        success: false,
        message: " Require content, productId, userId",
      });
  }
});


module.exports = router;
