const user = require('../models/userModel');
const uploadToCloudinary = require('../utils/uploadToCloudinary');
const cloudinary = require('../helpers/cloudinary');
exports.getProfile = async (req, res) => {
    try {
       
        let userData = await user.findById(req.user.userID).select('-password');
        
        if (!userData) {
            return res.status(404).json({ "message": "User not found" });
        }

        res.json({
            "status": "success",
            "user": userData
        });
    } catch (e) {
        res.status(500).json({ "message": `error ${e.message}` });
    }
}

exports.updateNotificationSettings = async (req, res) => {
    try {
        const { notificationsEnabled } = req.body;

        if (typeof notificationsEnabled !== 'boolean') {
            return res.status(400).json({
                status: 'error',
                message: 'notificationsEnabled must be boolean'
            });
        }

        const userData = await user.findByIdAndUpdate(
            req.user.userID,
            {
                $set: {
                    'settings.notificationsEnabled': notificationsEnabled
                }
            },
            {
                new: true,
                runValidators: true
            }
        ).select('-password');

        if (!userData) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Notification settings updated successfully',
            settings: userData.settings
        });

    } catch (e) {
        return res.status(500).json({
            status: 'error',
            message: e.message
        });
    }
};

exports.updateProfile = async (req, res) => {
try {
const userData = await user.findById(req.user.userID);

    if (!userData) {
        return res.status(404).json({
            message: 'User not found'
        });
    }

    userData.name = req.body.name;

    await userData.save();

    return res.status(200).json({
        status: 'success',
        message: 'Profile updated successfully',
        user: await user.findById(req.user.userID).select('-password')
    });

} catch (e) {
        res.status(500).json({ "message": `error ${e.message}` });
    }
}



exports.updateProfilePic = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                status: 'error',
                message: 'Please select a profile picture'
            });
        }

        const userData = await user.findById(req.user.userID);

        if (!userData) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        const oldPublicId = userData.profilePicPublicId;

       
        const uploadedImage = await uploadToCloudinary(req.file.buffer);

        
        userData.profilePic = uploadedImage.secure_url;
        userData.profilePicPublicId = uploadedImage.public_id;

        await userData.save();

       
        if (oldPublicId && oldPublicId !== uploadedImage.public_id) {
            try {
                const deleteResult = await cloudinary.uploader.destroy(
                    oldPublicId,
                    {
                        resource_type: 'image',
                        invalidate: true
                    }
                );

                if (deleteResult.result !== 'ok') {
                    console.log('Old profile picture was not deleted:', deleteResult);
                }
            } catch (deleteError) {
                console.log('Old profile picture deletion failed:', deleteError.message);
            }
        }

        return res.status(200).json({
            status: 'success',
            message: 'Profile picture updated successfully',
            user: await user.findById(req.user.userID).select('-password')
        });

    } catch (e) {
        return res.status(500).json({
            status: 'error',
            message: `error ${e.message}`
        });
    }
};




