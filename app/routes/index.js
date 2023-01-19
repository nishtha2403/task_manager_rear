const express = require('express');
const router = express.Router();

const { 
    register,
    login,
    refreshToken
} = require('../controllers');

router.post('/register', register);
router.post('/login', login),
router.get('/refresh-token', refreshToken)

module.exports = router;