
const nutrition = require('../models/nutritionModel');
const {
    nutritionValidator,
    updateNutritionValidator
} = require('../validators/nutritionValidator');

const createNotification = require('../helpers/createNotifications');

const mongoose = require('mongoose');

exports.createNutrition = async (req, res) => {
    try {
        const data = await nutritionValidator.validateAsync(req.body);

        let nutritionData = nutrition({
            ...data,
            userId: req.user.userID
        });

        await nutritionData.save();
await createNotification(
    req.user.userID,
    'Nutrition Saved',
    'Your nutrition record has been saved successfully.',
    'Nutrition'
);
        return res.status(201).json({
            status: 'success',
            message: 'Nutrition record added successfully',
            nutrition: nutritionData
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


exports.getNutrition = async (req, res) => {
    try {
        let {
            date,
            startDate,
            endDate,
            mealType,
            search,
            page = 1,
            limit = 10
        } = req.query;

        page = Math.max(1, parseInt(page, 10) || 1);
        limit = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));

        let filter = {
            userId: req.user.userID
        };

        if (mealType) {
            if (!['Breakfast', 'Lunch', 'Dinner', 'Snacks'].includes(mealType)) {
                return res.status(400).json({
                    message: 'Invalid meal type'
                });
            }

            filter.mealType = mealType;
        }

        if (search) {
            filter.foodItem = {
                $regex: search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
                $options: 'i'
            };
        }

        if (date && (startDate || endDate)) {
            return res.status(400).json({
                message: 'Use date or startDate/endDate, not both'
            });
        }

        if (date || startDate || endDate) {
            const dateFilter = {};

            const isValidDate = (value) => {
                if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                    return false;
                }

                const parsed = new Date(`${value}T00:00:00.000Z`);

                return !isNaN(parsed.getTime()) &&
                    parsed.toISOString().slice(0, 10) === value;
            };

            if (date) {
                if (!isValidDate(date)) {
                    return res.status(400).json({
                        message: 'Invalid date. Use YYYY-MM-DD'
                    });
                }

                dateFilter.$gte = new Date(`${date}T00:00:00.000Z`);

                dateFilter.$lt = new Date(
                    new Date(`${date}T00:00:00.000Z`).getTime() +
                    24 * 60 * 60 * 1000
                );
            } else {
                if (startDate) {
                    if (!isValidDate(startDate)) {
                        return res.status(400).json({
                            message: 'Invalid start date. Use YYYY-MM-DD'
                        });
                    }

                    dateFilter.$gte = new Date(`${startDate}T00:00:00.000Z`);
                }

                if (endDate) {
                    if (!isValidDate(endDate)) {
                        return res.status(400).json({
                            message: 'Invalid end date. Use YYYY-MM-DD'
                        });
                    }

                    dateFilter.$lt = new Date(
                        new Date(`${endDate}T00:00:00.000Z`).getTime() +
                        24 * 60 * 60 * 1000
                    );
                }

                if (
                    startDate &&
                    endDate &&
                    startDate > endDate
                ) {
                    return res.status(400).json({
                        message: 'Start date cannot be after end date'
                    });
                }
            }

            filter.date = dateFilter;
        }

        const nutritionRecords = await nutrition.find(filter)
            .sort({ date: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await nutrition.countDocuments(filter);

        return res.status(200).json({
            status: 'success',
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            nutrition: nutritionRecords
        });

    } catch (e) {
        return res.status(500).json({
            message: `error ${e.message}`
        });
    }
};


exports.getNutritionById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid nutrition ID'
            });
        }

        const nutritionData = await nutrition.findOne({
            _id: req.params.id,
            userId: req.user.userID
        });

        if (!nutritionData) {
            return res.status(404).json({
                message: 'Nutrition record not found'
            });
        }

        return res.status(200).json({
            status: 'success',
            nutrition: nutritionData
        });

    } catch (e) {
        return res.status(500).json({
            message: `error ${e.message}`
        });
    }
};


exports.updateNutrition = async (req, res) => {
    try {
        const data = await updateNutritionValidator.validateAsync(req.body);

        const nutritionData = await nutrition.findOne({
            _id: req.params.id,
            userId: req.user.userID
        });

        if (!nutritionData) {
            return res.status(404).json({
                message: 'Nutrition record not found'
            });
        }

        Object.keys(data).forEach((field) => {
            nutritionData[field] = data[field];
        });

        await nutritionData.save();
await createNotification(
    req.user.userID,
    'Nutrition Updated',
    'Your nutrition record has been updated successfully.',
    'Nutrition'
);
        return res.status(200).json({
            status: 'success',
            message: 'Nutrition record updated successfully',
            nutrition: nutritionData
        });

    } catch (e) {
        if (e.isJoi || e.name === 'ValidationError') {
            return res.status(400).json({
                message: e.message
            });
        }

        if (e.name === 'CastError') {
            return res.status(400).json({
                message: 'Invalid nutrition ID or field value'
            });
        }

        return res.status(500).json({
            message: `error ${e.message}`
        });
    }
};


exports.deleteNutrition = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid nutrition ID'
            });
        }

        const nutritionData = await nutrition.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.userID
        });

        if (!nutritionData) {
            return res.status(404).json({
                message: 'Nutrition record not found'
            });
        }
await createNotification(
    req.user.userID,
    'Nutrition Deleted',
    'Your nutrition record has been deleted successfully.',
    'Nutrition'
);
        return res.status(200).json({
            status: 'success',
            message: 'Nutrition record deleted successfully'
        });

    } catch (e) {
        return res.status(500).json({
            message: `error ${e.message}`
        });
    }
};
