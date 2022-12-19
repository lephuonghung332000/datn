const express = require('express')
const userMiddleware = require('../middleware/author')
const {getAllAds,createAds,deleteAds} = require('../controller/adsController');

const router = express.Router();
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
}).single("file");

router.get('/', getAllAds);
router.post('/addAds', upload, createAds);
router.delete('/deleteAds/:id', deleteAds);

module.exports = {
    routes: router
}