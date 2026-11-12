const Joi = require('joi');

const supportValidator = Joi.object({
    subject: Joi.string()
        .trim()
        .required(),

    message: Joi.string()
        .trim()
        .required(),

    type: Joi.string()
        .valid('Support', 'Feedback', 'Bug Report')
        .default('Support')
});

module.exports = supportValidator;