
const workout = require('../models/workoutModel');
const nutrition = require('../models/nutritionModel');
const progress = require('../models/progessModel');
const reportValidator = require('../validators/reportValidator');

exports.getReports = async (req, res) => {
    try {
        const filters = await reportValidator.validateAsync(req.query);

        let dateFilter = {};

        if (filters.startDate) {
            dateFilter.$gte = new Date(
                `${filters.startDate}T00:00:00.000Z`
            );
        }

        if (filters.endDate) {
            dateFilter.$lt = new Date(
                new Date(`${filters.endDate}T00:00:00.000Z`).getTime() +
                24 * 60 * 60 * 1000
            );
        }

        const createFilter = () => {
            let filter = {
                userId: req.user.userID
            };

            if (Object.keys(dateFilter).length > 0) {
                filter.date = dateFilter;
            }

            return filter;
        };

        const [workouts, nutritionRecords, progressRecords] =
            await Promise.all([
            workout.find(createFilter()).sort({ date: 1, createdAt: 1 }),
nutrition.find(createFilter()).sort({ date: 1, createdAt: 1 }),
progress.find(createFilter()).sort({ date: 1, createdAt: 1 })
            ]);

        const workoutByDate = {};
        const nutritionByDate = {};

        workouts.forEach((item) => {
            const date = new Date(item.date).toISOString().slice(0, 10);

            if (!workoutByDate[date]) {
                workoutByDate[date] = {
                    date,
                    totalWorkouts: 0,
                    strengthWorkouts: 0,
                    cardioWorkouts: 0
                };
            }

            workoutByDate[date].totalWorkouts++;

            if (item.category === 'Strength') {
                workoutByDate[date].strengthWorkouts++;
            }

            if (item.category === 'Cardio') {
                workoutByDate[date].cardioWorkouts++;
            }
        });

        nutritionRecords.forEach((item) => {
            const date = new Date(item.date).toISOString().slice(0, 10);

            if (!nutritionByDate[date]) {
                nutritionByDate[date] = {
                    date,
                    calories: 0,
                    protein: 0,
                    carbs: 0,
                    fat: 0
                };
            }

            nutritionByDate[date].calories += item.calories;
            nutritionByDate[date].protein += item.protein;
            nutritionByDate[date].carbs += item.carbs;
            nutritionByDate[date].fat += item.fat;
        });

        const totalCalories = nutritionRecords.reduce(
            (total, item) => total + item.calories, 0
        );

        const totalProtein = nutritionRecords.reduce(
            (total, item) => total + item.protein, 0
        );

        const totalCarbs = nutritionRecords.reduce(
            (total, item) => total + item.carbs, 0
        );

        const totalFat = nutritionRecords.reduce(
            (total, item) => total + item.fat, 0
        );

        const nutritionDays = Object.keys(nutritionByDate).length;

        const weightRecords = progressRecords.filter(
            (item) => item.weight != null
        );

        const firstWeight = weightRecords.length
            ? weightRecords[0].weight
            : null;

        const latestWeight = weightRecords.length
            ? weightRecords[weightRecords.length - 1].weight
            : null;

        const weightChange =
            firstWeight !== null && latestWeight !== null
                ? latestWeight - firstWeight
                : null;

        const weightProgress = weightRecords.map((item) => ({
            date: new Date(item.date).toISOString().slice(0, 10),
            weight: item.weight
        }));

        const bodyMeasurements = progressRecords
            .filter((item) =>
                item.measurements &&
                (
                    item.measurements.chest != null ||
                    item.measurements.waist != null
                )
            )
            .map((item) => ({
                date: new Date(item.date).toISOString().slice(0, 10),
                chest: item.measurements.chest ?? null,
                waist: item.measurements.waist ?? null
            }));

        const runningProgress = progressRecords
            .filter((item) =>
                item.performanceMetrics &&
                (
                    item.performanceMetrics.runTime != null ||
                    item.performanceMetrics.runDistance != null
                )
            )
            .map((item) => ({
                date: new Date(item.date).toISOString().slice(0, 10),
                runTime: item.performanceMetrics.runTime ?? null,
                runDistance: item.performanceMetrics.runDistance ?? null
            }));

        return res.status(200).json({
            status: 'success',

            filters: {
                startDate: filters.startDate || null,
                endDate: filters.endDate || null
            },

            summary: {
                totalWorkouts: workouts.length,
                strengthWorkouts: workouts.filter(
                    (item) => item.category === 'Strength'
                ).length,
                cardioWorkouts: workouts.filter(
                    (item) => item.category === 'Cardio'
                ).length,

                totalNutritionEntries: nutritionRecords.length,
                totalCaloriesConsumed: totalCalories,
                totalProtein,
                totalCarbs,
                totalFat,

                averageDailyCalories: nutritionDays
                    ? Number((totalCalories / nutritionDays).toFixed(2))
                    : 0,

                firstWeight,
                latestWeight,
                weightChange
            },

            charts: {
                workoutsByDate: Object.values(workoutByDate),
                nutritionByDate: Object.values(nutritionByDate),
                weightProgress,
                bodyMeasurements,
                runningProgress
            },

            records: {
                workouts,
                nutrition: nutritionRecords,
                progress: progressRecords
            }
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
