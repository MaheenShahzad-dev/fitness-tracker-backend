
const Joi = require('joi');

const progressValidator = Joi.object({
    weight: Joi.number().positive().optional(),

    measurements: Joi.object({
        chest: Joi.number().positive().optional(),
        waist: Joi.number().positive().optional()
    }).min(1).optional(),

   performanceMetrics: Joi.object({
    runTime: Joi.number().positive().optional(),
    runDistance: Joi.number().positive().optional()
}).min(1).optional(),

    date: Joi.date().optional()
}).or('weight', 'measurements', 'performanceMetrics');

const updateProgressValidator = Joi.object({
    weight: Joi.number().positive().optional(),

    measurements: Joi.object({
        chest: Joi.number().positive().optional(),
        waist: Joi.number().positive().optional()
    }).min(1).optional(),

performanceMetrics: Joi.object({
    runTime: Joi.number().positive().optional(),
    runDistance: Joi.number().positive().optional()
}).min(1).optional(),

    date: Joi.date().optional()
}).min(1);

module.exports = {
    progressValidator,
    updateProgressValidator
};
