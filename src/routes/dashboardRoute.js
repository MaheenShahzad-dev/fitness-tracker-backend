
let express = require('express');
let router = express.Router();
let dashboardController = require('../controllers/dashboardController');
let authMiddleware = require('../middleware/auth_middleware');

router.get('/', authMiddleware.verifyToken, dashboardController.getDashboard);

module.exports = router;
