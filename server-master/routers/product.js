const { request } = require("express");
const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/author");
const Product = require("../models/Product");

//import controller
const { updateProductRequire } = require('../controller/profile');


///search
router.get("/searchProduct", verifyToken, async (req, res) => {
  console.log(req.userId);
  try {
    let listProducts = await Product.find({ 
      name: { $regex: ".*" + req.query.key + ".*", $options: "i" },
    status: 0 }).sort(
      { _id: -1 }
    ).limit(
      Number(req.query.total)
    ).populate('user', ['username', "email"]);
    res.json({
      messages: "Search successfully",
      success: true,
      data: listProducts,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Occur in server error" });
  }
});


///getByListRequire
router.get("/listRequire", verifyToken, async (req, res) => {
  console.log(req.userId);
  try {
    let listProducts = await Product.find({
      status: 0,
      user: req.userId,
      listRequire: { $exists: true, $type: 'array', $ne: [] }
    }
    ).sort(
      { _id: -1 }
    ).limit(
      Number(req.query.total)
    ).populate('user', ['username', "email"]);
    res.json({
      messages: "Get list by list required successfully",
      success: true,
      data: listProducts,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Occur in server error" });
  }
});
///Get by User
router.get("/user", verifyToken, async (req, res) => {
  try {
    if (req.query.status) {
      let status = req.query.status;
      if (!req.query.userId) {
        posts = await Product.find({
          status: status, user: req.userId,
        }).sort({ _id: -1 }).limit(Number(req.query.total)).populate('user', [
          'username', "email"
        ]);
      } else {
        posts = await Product.find({
          status: status, user: req.query.userId,
        }).sort({ _id: -1 }).limit(Number(req.query.total)).populate('user', [
          'username', "email"
        ]);
      }
    }
    else {
      if (!req.query.userId) {
        posts = await Product.find({ user: req.userId }).sort({ _id: -1 }).limit(Number(req.query.total)).populate('user', [
          'username', "email"
        ]);
      } else {
        posts = await Product.find({ user: req.query.userId }).sort({ _id: -1 }).limit(Number(req.query.total)).populate('user', [
          'username', "email"
        ]);
      }
    }
    res.json({
      messages: "Get list by User successfully",
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
// @route GET api/posts
// @desc Get post
// @access Private
router.get("/", verifyToken, async (req, res) => {
  let posts;
  if (!req.query.category && !req.query.location) {
    posts = await Product.find(
      { status: 0 }
    ).sort({ _id: -1 }).limit(Number(req.query.total)).populate('user', [
      'username', "email"
    ]);
  } else {
    if (req.query.category && req.query.location) {
      posts = await Product.find({
        status: 0,
        category: req.query.category,
        location: req.query.location,
      }).sort({ _id: -1 }).limit(Number(req.query.total)).populate('user', [
        'username', "email"
      ]);
    } else {
      if (!req.query.category) {
        posts = await Product.find({
          status: 0,
          location: req.query.location,
        }).sort({ _id: -1 }).limit(Number(req.query.total)).populate('user', [
          'username', "email"
        ]);
      } else {
        posts = await Product.find({
          status: 0,
          category: req.query.category,
        }).sort({ _id: -1 }).limit(Number(req.query.total)).populate('user', [
          'username', "email"
        ]);
      }
    }
  }
  try {
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
///Get by Id
router.get("/:id", verifyToken, async (req, res) => {
  console.log(req.userId);
  posts = await Product.findById(req.params.id).populate('user', [
    'username', "email"
  ]);
  try {
    res.json({
      messages: "Get successfully",
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
  try {
    const newProduct = new Product({
      ...req.body, user: req.userId
    });
    await newProduct.save();
    return res.json({
      success: true,
      product: newProduct,
      message: " Create a post successfully",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Add Product Err" });
  }
});


// @route PUT api/product
// @desc Update post
// @access Private
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    let postUpdate = null;
    const conditionsUpdate = { _id: req.params.id, user: req.userId };
    if (status) {
      postUpdate = {
        status: status || 0,
      };
      postUpdate = await Product.findOneAndUpdate(conditionsUpdate, postUpdate, {
        new: true,
      });
    } else {
      postUpdate = await Product.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { listRequire: { $each: [req.userId] } } },
        { new: false }
      );
      await postUpdate.save().then(() => {
        updateProductRequire({ idProduct: req.params.id, idUser: req.userId });
      });
    }

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
    const product = await Product.findOneAndDelete(conditionDetele);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Post not found or user not authorised",
      });
    }

    res.json({
      success: true,
      message: "Delete post successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Occur in server error" });
  }
});

module.exports = router;
