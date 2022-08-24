const express = require("express");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/author");
const router = express.Router();
const User = require("../models/User");

// @route GET api/auth
// @desc Check if user is logged in
// @access Public
router.get("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, user });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});


//handle router register
router.post("/register", async (req, res) => {
  console.log(req.body);
  const { username, password, email, fcmtoken } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ succes: false, message: "Username or password is empty" });
  }
  try {
    //check user is exits
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ succes: false, message: "Email had already exits" });
    }

    //all good
    const hashedPassword = await argon2.hash(password);
    const newUser = new User({ username, password: hashedPassword, email, fcmtoken });
    await newUser.save();

    //return tokens
    const access_token = jwt.sign(
      { userId: newUser._id },
      process.env.ACCESS_TOKEN_SECRET
    );

    return res.json({
      success: true,
      message: "Register successfully",
      access_token,

    });
  } catch (error) {
    console.log(error);
    //error server
    return res
      .status(500)
      .json({ success: false, message: "Occur in server error" });
  }
});

//handle router login
router.post("/login", async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ succes: false, message: "Username or password is empty" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "email is not a valid",
      });
    }
    const verifyPassword = await argon2.verify(user.password, password);
    if (!verifyPassword) {
      return res
        .status(400)
        .json({ success: false, message: "password incorrect" });
    }
    //return tokens
    const access_token = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET
    );

    return res.json({
      success: true,
      message: "Login successfully",
      tokenFcm: req.body.tokenFcm,
      access_token,
      userId: user._id ,
    });
  } catch (error) {
    console.log(error);
    //error server
    return res
      .status(500)
      .json({ success: false, message: "Occur in server error" });
  }
});

module.exports = router;
