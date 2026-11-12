
let express = require('express');
let router = express.Router();
let progressController = require('../controllers/progressController');
let authMiddleware = require('../middleware/auth_middleware');

router.get('/', authMiddleware.verifyToken, progressController.getProgress);
router.get('/:id', authMiddleware.verifyToken, progressController.getProgressById);
router.post('/', authMiddleware.verifyToken, progressController.createProgress);
router.put('/:id', authMiddleware.verifyToken, progressController.updateProgress);
router.delete('/:id', authMiddleware.verifyToken, progressController.deleteProgress);

module.exports = router;
