
let express = require('express');
let router = express.Router();
let reportController = require('../controllers/reportController');
let authMiddleware = require('../middleware/auth_middleware');

router.get('/', authMiddleware.verifyToken, reportController.getReports);

module.exports = router;
