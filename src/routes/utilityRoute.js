
const express = require('express');
const router = express.Router();

const utilityController = require('../controllers/utilityController');
const authMiddleware = require('../middleware/auth_middleware');

router.get('/settings', authMiddleware.verifyToken, utilityController.getSettings);
router.put('/settings', authMiddleware.verifyToken, utilityController.updateSettings);
router.post('/support', authMiddleware.verifyToken, utilityController.submitSupport);

module.exports = router;
