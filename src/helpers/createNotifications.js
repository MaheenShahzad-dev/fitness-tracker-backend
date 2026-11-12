
const notification = require('../models/notificationModel');
const notificationValidator = require('../validators/notificationValidator');
const user = require('../models/userModel');

const createNotification = async (userId, title, message, type = 'System') => {
    try {
        const userData = await user.findById(userId).select('settings.notificationsEnabled');

        if (!userData) {
            return null;
        }

        if (userData.settings?.notificationsEnabled === false) {
            return null;
        }

        const data = await notificationValidator.validateAsync({
            title,
            message,
            type
        });

        const notificationData = notification({
            userId,
            ...data
        });

        await notificationData.save();

        return notificationData;

    } catch (e) {
        console.error('Notification creation failed:', e.message);
        return null;
    }
};

module.exports = createNotification;
