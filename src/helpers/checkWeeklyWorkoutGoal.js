
const workout = require('../models/workoutModel');
const goal = require('../models/goalModel');
const createNotification = require('./createNotifications');

const checkWeeklyWorkoutGoal = async (userId) => {
    try {
        const pakistanNow = new Date(
            Date.now() + (5 * 60 * 60 * 1000)
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

        const userGoal = await goal.findOne({ userId });

        if (!userGoal) {
            return;
        }

        const totalWorkouts = await workout.countDocuments({
            userId,
            date: {
                $gte: weekStart,
                $lt: weekEnd
            }
        });

        const alreadyNotified =
            userGoal.lastAchievedWeekStart &&
            userGoal.lastAchievedWeekStart.getTime() ===
                weekStart.getTime();

        if (
            totalWorkouts >= userGoal.weeklyWorkoutTarget &&
            !alreadyNotified
        ) {
            const notificationData = await createNotification(
                userId,
                'Weekly Workout Goal Achieved',
                'Your weekly workout target has been achieved!',
                'Goal'
            );

            if (notificationData) {
                userGoal.lastAchievedWeekStart = weekStart;
                await userGoal.save();
            }
        }
    } catch (e) {
        console.error('Weekly goal check failed:', e.message);
    }
};

module.exports = checkWeeklyWorkoutGoal;
