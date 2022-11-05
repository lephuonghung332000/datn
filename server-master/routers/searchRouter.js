const express = require('express')
const userMiddleware = require('../middleware/author')
const {getAllHistorySearch} = require('../controller/searchController');

const router = express.Router();

router.get('/',userMiddleware, getAllHistorySearch);

module.exports = {
    routes: router
}