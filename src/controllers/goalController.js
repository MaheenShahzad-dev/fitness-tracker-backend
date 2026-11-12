
const goal = require('../models/goalModel');
const goalValidator = require('../validators/goalValidator');

exports.getGoal = async (req, res) => {
    try {
        let goalData = await goal.findOne({
            userId: req.user.userID
        });

        if (!goalData) {
            goalData = await goal.create({
                userId: req.user.userID,
                weeklyWorkoutTarget: 5
            });
        }

        return res.status(200).json({
            status: 'success',
            goal: goalData
        });
    } catch (e) {
        return res.status(500).json({
            message: `error ${e.message}`
        });
    }
};

exports.updateGoal = async (req, res) => {
    try {
        const data = await goalValidator.validateAsync(req.body);

        const goalData = await goal.findOneAndUpdate(
            { userId: req.user.userID },
            {
                $set: {
                    weeklyWorkoutTarget: data.weeklyWorkoutTarget
                },
                $setOnInsert: {
                    userId: req.user.userID
                }
            },
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true
            }
        );

        return res.status(200).json({
            status: 'success',
            message: 'Weekly workout goal updated successfully',
            goal: goalData
        });
    } catch (e) {
        if (e.isJoi || e.name === 'ValidationError') {
            return res.status(400).json({
                message: e.message
            });
        }

        return res.status(500).json({
            message: `error ${e.message}`
        });
    }
};
