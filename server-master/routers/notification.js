const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/author");
const Notification = require("../models/Notification");

// @route GET api/comment all
// @desc Get post
// @access Private
router.get("/", verifyToken, async (req, res) => {
    try {
        const notification = await Notification.find({ idClient:req.userId});
        res.json({
            messages: "Get list notify successfully",
            success: true,
            data: notification,
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
    const { content, idProduct } = req.body;
    if (content && idProduct) {
        try {
            const notification = await Notification({ ...req.body})
            await notification.save();

            return res.status(200).json({ success: true, message: "Success", data: notification })
        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({ success: false, message: "Occur in server error" });
        }
    } else {
        return res.status(500).json({
            success: false,
            message: " Require content, productId",
        });
    }
});


module.exports = router;
