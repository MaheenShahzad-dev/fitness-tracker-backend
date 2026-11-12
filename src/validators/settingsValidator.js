const Joi = require('joi');

const settingsValidator = Joi.object({
    theme: Joi.string()
        .valid('Light', 'Dark'),

    weightUnit: Joi.string()
        .valid('kg', 'lb'),

    distanceUnit: Joi.string()
        .valid('km', 'miles'),

    notificationsEnabled: Joi.boolean()
});

module.exports = settingsValidator;