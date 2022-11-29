const express = require('express')
const {signup,login,logout,refreshToken} = require('../controller/authorController').default;

const router = express.Router();

router.post('/signup',signup);
router.post('/login',login);
router.post('/refreshToken',refreshToken);
router.post('/logout',logout);

module.exports = {
    routes: router
}