
let express = require('express');
let router = express.Router();
let nutritionController = require('../controllers/nutritionController');
let authMiddleware = require('../middleware/auth_middleware');

router.get('/', authMiddleware.verifyToken, nutritionController.getNutrition);
router.get('/:id', authMiddleware.verifyToken, nutritionController.getNutritionById);
router.post('/', authMiddleware.verifyToken, nutritionController.createNutrition);
router.put('/:id', authMiddleware.verifyToken, nutritionController.updateNutrition);
router.delete('/:id', authMiddleware.verifyToken, nutritionController.deleteNutrition);

module.exports = router;
