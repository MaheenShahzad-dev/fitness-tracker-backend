
const cloudinary = require('../helpers/cloudinary');
const streamifier = require('streamifier');

const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: 'fitness-tracker/profile-pictures',
                resource_type: 'image'
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        streamifier.createReadStream(fileBuffer).pipe(stream);
    });
};

module.exports = uploadToCloudinary;
