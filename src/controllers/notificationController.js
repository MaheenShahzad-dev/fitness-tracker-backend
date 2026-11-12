
const notification = require('../models/notificationModel');
const mongoose = require('mongoose');

exports.getNotifications = async (req, res) => {
    try {
        let {
            search,
            isRead,
            page = 1,
            limit = 10
        } = req.query;

        page = Math.max(1, parseInt(page, 10) || 1);
        limit = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));

        const filter = {
            userId: req.user.userID
        };

        if (isRead === 'true') {
            filter.isRead = true;
        } else if (isRead === 'false') {
            filter.isRead = false;
        }

        if (search && search.trim()) {
            const searchValue = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

            filter.$or = [
                { title: { $regex: searchValue, $options: 'i' } },
                { message: { $regex: searchValue, $options: 'i' } },
                { type: { $regex: searchValue, $options: 'i' } }
            ];
        }

        const [notifications, total, unreadCount, readCount] = await Promise.all([
            notification.find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),

            notification.countDocuments(filter),

            notification.countDocuments({
                userId: req.user.userID,
                isRead: false
            }),

            notification.countDocuments({
                userId: req.user.userID,
                isRead: true
            })
        ]);

        return res.status(200).json({
            status: 'success',
            total,
            unreadCount,
            readCount,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            notifications
        });

    } catch (e) {
        return res.status(500).json({
            message: `error ${e.message}`
        });
    }
};

exports.getUnreadCount = async (req, res) => {
    try {
        const count = await notification.countDocuments({
            userId: req.user.userID,
            isRead: false
        });

        return res.status(200).json({
            status: 'success',
            unreadCount: count
        });

    } catch (e) {
        return res.status(500).json({
            message: `error ${e.message}`
        });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid notification ID'
            });
        }

        const notificationData = await notification.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user.userID
            },
            {
                $set: { isRead: true }
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!notificationData) {
            return res.status(404).json({
                message: 'Notification not found'
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Notification marked as read',
            notification: notificationData
        });

    } catch (e) {
        return res.status(500).json({
            message: `error ${e.message}`
        });
    }
};

exports.markAllAsRead = async (req, res) => {
    try {
        await notification.updateMany(
            {
                userId: req.user.userID,
                isRead: false
            },
            {
                $set: { isRead: true }
            }
        );

        return res.status(200).json({
            status: 'success',
            message: 'All notifications marked as read'
        });

    } catch (e) {
        return res.status(500).json({
            message: `error ${e.message}`
        });
    }
};

exports.deleteNotification = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid notification ID'
            });
        }

        const notificationData = await notification.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.userID
        });

        if (!notificationData) {
            return res.status(404).json({
                message: 'Notification not found'
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Notification deleted successfully'
        });

    } catch (e) {
        return res.status(500).json({
            message: `error ${e.message}`
        });
    }
};
exports.deleteAllNotifications = async (req, res) => {
    try {
        await notification.deleteMany({
            userId: req.user.userID
        });

        return res.status(200).json({
            status: 'success',
            message: 'All notifications deleted successfully'
        });

    } catch (e) {
        return res.status(500).json({
            message: `error ${e.message}`
        });
    }
};