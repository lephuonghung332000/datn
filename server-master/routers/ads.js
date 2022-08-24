const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/author");
const Ads = require("../models/Ads");

// @route GET api/comment all
// @desc Get post
// @access Private
router.get("/", verifyToken, async (req, res) => {
    try {
        const ads = await Ads.find({
        }).sort({ _id: -1 }).limit(Number(req.query.total))
        res.json({
            messages: "Get list ads successfully",
            success: true,
            data: ads,
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
    const { image } = req.body;
    if (image) {
        try {
            const ads = await Ads({ ...req.body })
            await ads.save();
            return res.status(200).json({ success: true, message: "Success", data: ads })
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



module.exports = router;
