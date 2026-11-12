
const user = require('../models/userModel');
const settingsValidator = require('../validators/settingsValidator');
const supportMessage = require('../models/supportMessageModel');
const supportValidator = require('../validators/supportValidator');

exports.getSettings = async (req, res) => {
    try {
        const userData = await user.findById(req.user.userID)
            .select('settings');

        if (!userData) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        return res.status(200).json({
            status: 'success',
            settings: userData.settings
        });

    } catch (e) {
        return res.status(500).json({
            message: `error ${e.message}`
        });
    }
};

exports.updateSettings = async (req, res) => {
    try {
        const data = await settingsValidator.validateAsync(req.body);

        if (Object.keys(data).length === 0) {
            return res.status(400).json({
                message: 'Please provide at least one setting to update'
            });
        }

        const userData = await user.findById(req.user.userID);

        if (!userData) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        userData.settings = {
            ...(userData.settings?.toObject?.() || userData.settings || {}),
            ...data
        };

        await userData.save();

        return res.status(200).json({
            status: 'success',
            message: 'Settings updated successfully',
            settings: userData.settings
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


exports.submitSupport = async (req, res) => {
    try {

        const data = await supportValidator.validateAsync(req.body);

        const supportData = supportMessage({
            userId: req.user.userID,
            ...data
        });

        await supportData.save();

        return res.status(201).json({
            status: 'success',
            message: 'Your message has been submitted successfully.',
            support: supportData
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