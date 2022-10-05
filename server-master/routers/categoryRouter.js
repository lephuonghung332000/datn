const express = require('express')
const userMiddleware = require('../middleware/author')
const {getAllCategories,addCategory} = require('../controller/categoryController');

const router = express.Router();
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
}).single("file");

router.get('/', getAllCategories);
router.post('/addCategory',upload, addCategory);

module.exports = {
    routes: router
}