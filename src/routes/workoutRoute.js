
let express = require('express');
let router = express.Router();
let workoutController = require('../controllers/workoutController');
let authMiddleware = require('../middleware/auth_middleware');

router.post('/', authMiddleware.verifyToken, workoutController.createWorkout);
router.get('/', authMiddleware.verifyToken, workoutController.getWorkouts);
router.get('/:id', authMiddleware.verifyToken, workoutController.getWorkoutById);
router.put('/:id', authMiddleware.verifyToken, workoutController.updateWorkout);
router.delete('/:id', authMiddleware.verifyToken, workoutController.deleteWorkout);

module.exports = router;
