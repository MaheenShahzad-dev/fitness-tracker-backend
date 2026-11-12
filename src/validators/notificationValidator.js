const Joi = require('joi');

const notificationValidator = Joi.object({
    title: Joi.string().trim().required(),
    message: Joi.string().trim().required(),
    type: Joi.string()
        .valid('Workout', 'Nutrition', 'Progress', 'Goal', 'System')
        .default('System')
});

module.exports = notificationValidator;