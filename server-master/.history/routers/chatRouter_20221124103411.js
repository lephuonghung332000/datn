const express = require('express')
const userMiddleware = require('../middleware/author')
const {getAllHintChats} = require('../controller/chatController');

const router = express.Router();

router.get('/hints',userMiddleware, getAllHintChats);

module.exports = {
    routes: router
}