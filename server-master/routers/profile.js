const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/author");
const Profile = require("../models/Profile");

//const users = require("../models/User");

// @route GET api/
// @desc Get all clients
// @access Private(public for test)
router.get("/", verifyToken, async (req, res) => {
    try {
        const profiles = await Profile.findOne({
            user: req.userId
        }).populate('user', [
			'username',"email"
		]);

        return res.json({
            data: profiles
        })
    } catch (e) {
        return res.json({
            error: e
        })
    }
});

//get single client
router.get("/:clientId", verifyToken, async (req, res) => {
    try{
        const profiles = await Profile.findOne({
            user: req.params.clientId
        }).populate('user', [
			'username',"email"
		]);
        return res.json({
            data:profiles
        })
    }catch(error){
        return res.status(400).json({
            error: error
        })
    }
})

// @route POST api/posts
// @desc Create post
// @access Private
router.post("/", verifyToken, async (req, res) => {
    try {
        param = req.body;
        let profile = new Profile(
            { ...param, user: req.userId }
        )
        profile = await profile.save()
        return res.status(201).json({
            data: profile
        })
    } catch (error) {
        return res.json({
            error: error
        })
    }

});

// @route PUT api/posts
// @desc Update post
// @access Private
router.put("/:id", verifyToken, async (req, res) => {
    try {
        const profileUpdate = await Profile.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        return res.json({
            success: true,
            message: "Update successful",
            data: profileUpdate,
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

});

module.exports = router;
