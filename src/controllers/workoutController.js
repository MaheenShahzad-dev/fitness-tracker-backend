const workout = require('../models/workoutModel');

const {
    workoutValidator,
    updateWorkoutValidator
} = require('../validators/workoutValidator');
const createNotification = require('../helpers/createNotifications');

const checkWeeklyWorkoutGoal =
    require('../helpers/checkWeeklyWorkoutGoal');

exports.createWorkout = async (req, res) => {
    try {
        await workoutValidator.validateAsync(req.body);

        let workoutData = workout({
            ...req.body,
            userId: req.user.userID
        });

        await workoutData.save();

await createNotification(
    req.user.userID,
    'Workout Saved',
    'Your workout has been saved successfully.',
    'Workout'
);

await checkWeeklyWorkoutGoal(req.user.userID);


        res.status(201).json({
            status: 'success',
            message: 'Workout created successfully',
            workout: workoutData
        });

    } catch (e) {
        res.status(400).json({
            message: e.message
        });
    }
};


exports.getWorkouts = async (req, res) => {
    try {
        let {
            category,
            search,
            startDate,
            endDate,
            page = 1,
            limit = 10
        } = req.query;

        page = Math.max(1, parseInt(page) || 1);
        limit = Math.min(100, Math.max(1, parseInt(limit) || 10));

        let filter = {
            userId: req.user.userID
        };

        if (category) {
            if (!['Strength', 'Cardio'].includes(category)) {
                return res.status(400).json({
                    message: 'Invalid workout category'
                });
            }

            filter.category = category;
        }

        if (search) {
            filter.exerciseName = {
                $regex: search,
                $options: 'i'
            };
        }

        if (startDate || endDate) {
            filter.date = {};

            if (startDate) {
                let start = new Date(startDate);

                if (isNaN(start.getTime())) {
                    return res.status(400).json({
                        message: 'Invalid start date'
                    });
                }

                filter.date.$gte = start;
            }

            if (endDate) {
                let end = new Date(endDate);

                if (isNaN(end.getTime())) {
                    return res.status(400).json({
                        message: 'Invalid end date'
                    });
                }

                end.setHours(23, 59, 59, 999);
                filter.date.$lte = end;
            }
        }

        const workouts = await workout.find(filter)
            .sort({ date: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await workout.countDocuments(filter);

        return res.status(200).json({
            status: 'success',
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            workouts
        });

    } catch (e) {
        return res.status(500).json({
            message: `error ${e.message}`
        });
    }
};



exports.getWorkoutById = async (req, res) => {
    try {
        const workoutData = await workout.findOne({
            _id: req.params.id,
            userId: req.user.userID
        });

        if (!workoutData) {
            return res.status(404).json({
                message: 'Workout not found'
            });
        }

        return res.status(200).json({
            status: 'success',
            workout: workoutData
        });

    } catch (e) {
        res.status(500).json({
            message: `error ${e.message}`
        });
    }
};



exports.updateWorkout = async (req, res) => {
    try {
        await updateWorkoutValidator.validateAsync(req.body);

        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({
                message: 'Please provide at least one field to update'
            });
        }

        const workoutData = await workout.findOne({
            _id: req.params.id,
            userId: req.user.userID
        });

        if (!workoutData) {
            return res.status(404).json({
                message: 'Workout not found'
            });
        }

        const allowedFields = [
            'exerciseName',
            'sets',
            'reps',
            'weight',
            'notes',
            'category',
            'date'
        ];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                workoutData[field] = req.body[field];
            }
        });

        await workoutData.save();
await createNotification(
    req.user.userID,
    'Workout Updated',
    'Your workout has been updated successfully.',
    'Workout'
);
        return res.status(200).json({
            status: 'success',
            message: 'Workout updated successfully',
            workout: workoutData
        });

    } catch (e) {
        if (e.isJoi) {
            return res.status(400).json({
                message: e.message
            });
        }

        return res.status(500).json({
            message: `error ${e.message}`
        });
    }
};


exports.deleteWorkout = async (req, res) => {
    try {
        const workoutData = await workout.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.userID
        });

        if (!workoutData) {
            return res.status(404).json({
                message: 'Workout not found'
            });
        }
await createNotification(
    req.user.userID,
    'Workout Deleted',
    'Your workout has been deleted successfully.',
    'Workout'
);
        return res.status(200).json({
            status: 'success',
            message: 'Workout deleted successfully'
        });

    } catch (e) {
        res.status(500).json({
            message: `error ${e.message}`
        });
    }
};
