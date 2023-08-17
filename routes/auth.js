const express = require('express');
const {
    register,
    login,
    getMe,
    forgotPassword
} = require('../controllers/auth')

const router = express.Router();

const { protect } = require('../middleware/auth')

router
    .post('/register', register)
    .post('/login', login)
    .get('/me',protect, getMe)
    .post('/forgotpassword',forgotPassword)

module.exports = router;