const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// Only Admin can invite users
router.post('/invite', authMiddleware.verifyToken, authMiddleware.isAdmin, userController.inviteUser);
router.get('/health', userController.getHealth);
module.exports = router;
