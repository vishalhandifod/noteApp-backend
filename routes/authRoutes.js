const express = require('express');
const router = express.Router();
const {register, login,getProfile,logout} = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authMiddleware.verifyToken, logout);
router.get('/profile', authMiddleware.verifyToken, getProfile);

module.exports = router;
