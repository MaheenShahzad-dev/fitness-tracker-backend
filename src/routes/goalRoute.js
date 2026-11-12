
let express = require('express');
let router = express.Router();
let goalController = require('../controllers/goalController');
let authMiddleware = require('../middleware/auth_middleware');

router.get('/', authMiddleware.verifyToken, goalController.getGoal);
router.put('/', authMiddleware.verifyToken, goalController.updateGoal);

module.exports = router;
