const express = require('express')
const {getUser, updateUser,updateRole,deleteUser,updateFCMTokens} = require('../controller/userController');
const userMiddleware = require('../middleware/author')
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
}).single("file");

const router = express.Router();

router.get('/',userMiddleware, getUser);
router.delete('/:id',userMiddleware, deleteUser);
router.patch('/update',userMiddleware,upload, updateUser);
router.patch('/update/role/:id', updateRole);
router.patch('/updateFCMTokens', userMiddleware, updateFCMTokens);

module.exports = {
    routes: router
}