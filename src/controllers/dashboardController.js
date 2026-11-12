
const workout = require('../models/workoutModel');
const nutrition = require('../models/nutritionModel');
const progress = require('../models/progessModel');
const notification = require('../models/notificationModel');

exports.getDashboard = async (req, res) => {
    try {
        const userId = req.user.userID;

        const pakistanNow = new Date(
            Date.now() + (5 * 60 * 60 * 1000)
        );

        const todayStart = new Date(Date.UTC(
            pakistanNow.getUTCFullYear(),
            pakistanNow.getUTCMonth(),
            pakistanNow.getUTCDate()
        ) - (5 * 60 * 60 * 1000));

        const tomorrowStart = new Date(
            todayStart.getTime() + (24 * 60 * 60 * 1000)
        );

        const weekStartPakistan = new Date(Date.UTC(
            pakistanNow.getUTCFullYear(),
            pakistanNow.getUTCMonth(),
            pakistanNow.getUTCDate()
        ));

        const day = weekStartPakistan.getUTCDay();
        const daysFromMonday = (day + 6) % 7;

        weekStartPakistan.setUTCDate(
            weekStartPakistan.getUTCDate() - daysFromMonday
        );

        const weekStart = new Date(
            weekStartPakistan.getTime() - (5 * 60 * 60 * 1000)
        );

        const weekEnd = new Date(
            weekStart.getTime() + (7 * 24 * 60 * 60 * 1000)
        );

        const recentWorkouts = await workout.find({ userId })
            .select('exerciseName sets reps weight notes category date')
            .sort({ date: -1 })
            .limit(5);

        const todayNutritionRecords = await nutrition.find({
            userId,
            date: {
                $gte: todayStart,
                $lt: tomorrowStart
            }
        }).select('calories protein carbs fat');

        const todayNutrition = todayNutritionRecords.reduce(
            (totals, item) => {
                totals.calories += item.calories || 0;
                totals.protein += item.protein || 0;
                totals.carbs += item.carbs || 0;
                totals.fat += item.fat || 0;

                return totals;
            },
            {
                calories: 0,
                protein: 0,
                carbs: 0,
                fat: 0
            }
        );

        const latestWeight = await progress.findOne({
            userId,
            weight: { $gt: 0 }
        })
            .select('weight date')
            .sort({ date: -1 });

        const weightHistory = await progress.find({
            userId,
            weight: { $gt: 0 }
        })
            .select('weight date')
            .sort({ date: -1 })
            .limit(7);

        const weeklyWorkoutFilter = {
            userId,
            date: {
                $gte: weekStart,
                $lt: weekEnd
            }
        };

        const totalWeeklyWorkouts =
            await workout.countDocuments(weeklyWorkoutFilter);

        const weeklyStrengthWorkouts =
            await workout.countDocuments({
                ...weeklyWorkoutFilter,
                category: 'Strength'
            });

        const weeklyCardioWorkouts =
            await workout.countDocuments({
                ...weeklyWorkoutFilter,
                category: 'Cardio'
            });

        const unreadNotifications =
            await notification.countDocuments({
                userId,
                isRead: false
            });

        return res.status(200).json({
            status: 'success',
            dashboard: {
                recentWorkouts,
                todayNutrition,
                latestWeight: latestWeight
                    ? latestWeight.weight
                    : null,
                latestWeightDate: latestWeight
                    ? latestWeight.date
                    : null,
                weightHistory: weightHistory.reverse(),
                unreadNotifications,
                weeklyWorkoutSummary: {
                    total: totalWeeklyWorkouts,
                    strength: weeklyStrengthWorkouts,
                    cardio: weeklyCardioWorkouts
                }
            }
        });

    } catch (e) {
        return res.status(500).json({
            message: `error ${e.message}`
        });
    }
};
