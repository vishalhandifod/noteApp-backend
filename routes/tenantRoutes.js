const express = require('express');
const router = express.Router();
const tenantController = require('../controllers/tenantController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/:slug/upgrade', authMiddleware.verifyToken, authMiddleware.isAdmin, tenantController.upgradeTenant);
router.get('/tenant', authMiddleware.verifyToken, tenantController.getTenant);

module.exports = router;
