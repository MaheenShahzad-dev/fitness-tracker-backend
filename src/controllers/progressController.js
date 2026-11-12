
const progress = require('../models/progessModel');
const {
    progressValidator,
    updateProgressValidator
} = require('../validators/progressValidator');
const createNotification = require('../helpers/createNotifications');

const mongoose = require('mongoose');

exports.createProgress = async (req, res) => {
    try {
        const data = await progressValidator.validateAsync(req.body);

        let progressData = progress({
            ...data,
            userId: req.user.userID
        });

        await progressData.save();
await createNotification(
    req.user.userID,
    'Progress Recorded',
    'Your fitness progress has been recorded successfully.',
    'Progress'
);
        return res.status(201).json({
            status: 'success',
            message: 'Progress entry added successfully',
            progress: progressData
        });

    } catch (e) {
        if (e.isJoi || e.name === 'ValidationError') {
            return res.status(400).json({ message: e.message });
        }

        return res.status(500).json({ message: `error ${e.message}` });
    }
};


exports.getProgress = async (req, res) => {
    try {
        let {
            date,
            startDate,
            endDate,
            search,
            page = 1,
            limit = 10
        } = req.query;

        page = Math.max(1, parseInt(page, 10) || 1);
        limit = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));

        let filter = {
            userId: req.user.userID
        };

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

                if (startDate && endDate && startDate > endDate) {
                    return res.status(400).json({
                        message: 'Start date cannot be after end date'
                    });
                }
            }

            filter.date = dateFilter;
        }

        if (search && search.trim()) {
            const searchNumber = Number(search.trim());

            if (!isNaN(searchNumber)) {
                filter.$or = [
                    { weight: searchNumber },
                    { 'measurements.chest': searchNumber },
                    { 'measurements.waist': searchNumber },
                    { 'performanceMetrics.runDistance': searchNumber },
                    { 'performanceMetrics.runTime': searchNumber }
                ];
            } else {
                return res.status(200).json({
                    status: 'success',
                    total: 0,
                    page,
                    limit,
                    totalPages: 0,
                    progress: []
                });
            }
        }

        const progressRecords = await progress.find(filter)
            .sort({ date: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await progress.countDocuments(filter);

        return res.status(200).json({
            status: 'success',
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            progress: progressRecords
        });

    } catch (e) {
        return res.status(500).json({ message: `error ${e.message}` });
    }
};


exports.getProgressById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid progress ID'
            });
        }

        const progressData = await progress.findOne({
            _id: req.params.id,
            userId: req.user.userID
        });

        if (!progressData) {
            return res.status(404).json({
                message: 'Progress entry not found'
            });
        }

        return res.status(200).json({
            status: 'success',
            progress: progressData
        });

    } catch (e) {
        return res.status(500).json({ message: `error ${e.message}` });
    }
};



exports.updateProgress = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid progress ID'
            });
        }

        const data = await updateProgressValidator.validateAsync(req.body);

        const progressData = await progress.findOne({
            _id: req.params.id,
            userId: req.user.userID
        });

        if (!progressData) {
            return res.status(404).json({
                message: 'Progress entry not found'
            });
        }

        if (data.weight !== undefined) {
            progressData.weight = data.weight;
        }

        if (data.measurements) {
            if (data.measurements.chest !== undefined) {
                progressData.measurements.chest = data.measurements.chest;
            }

            if (data.measurements.waist !== undefined) {
                progressData.measurements.waist = data.measurements.waist;
            }
        }

       if (data.performanceMetrics) {
    if (data.performanceMetrics.runTime !== undefined) {
        progressData.performanceMetrics.runTime =
            data.performanceMetrics.runTime;
    }

    if (data.performanceMetrics.runDistance !== undefined) {
        progressData.performanceMetrics.runDistance =
            data.performanceMetrics.runDistance;
    }
}

        if (data.date !== undefined) {
            progressData.date = data.date;
        }

        await progressData.save();
        await createNotification(
    req.user.userID,
    'Progress Updated',
    'Your fitness progress has been updated successfully.',
    'Progress'
);

        return res.status(200).json({
            status: 'success',
            message: 'Progress entry updated successfully',
            progress: progressData
        });

    } catch (e) {
        if (e.isJoi || e.name === 'ValidationError') {
            return res.status(400).json({
                message: e.message
            });
        }

        if (e.name === 'CastError') {
            return res.status(400).json({
                message: 'Invalid progress ID or field value'
            });
        }

        return res.status(500).json({
            message: `error ${e.message}`
        });
    }
};

  
exports.deleteProgress = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid progress ID'
            });
        }

        const progressData = await progress.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.userID
        });

        if (!progressData) {
            return res.status(404).json({
                message: 'Progress entry not found'
            });
        }
await createNotification(
    req.user.userID,
    'Progress Deleted',
    'Your fitness progress record has been deleted successfully.',
    'Progress'
);
        return res.status(200).json({
            status: 'success',
            message: 'Progress entry deleted successfully'
        });

    } catch (e) {
        return res.status(500).json({ message: `error ${e.message}` });
    }
};
