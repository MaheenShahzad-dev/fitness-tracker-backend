
const Joi = require('joi');

const reportValidator = Joi.object({
    startDate: Joi.string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/)
        .custom((value, helpers) => {
            const date = new Date(`${value}T00:00:00.000Z`);

            if (
                isNaN(date.getTime()) ||
                date.toISOString().slice(0, 10) !== value
            ) {
                return helpers.error('any.invalid');
            }

            return value;
        })
        .optional(),

    endDate: Joi.string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/)
        .custom((value, helpers) => {
            const date = new Date(`${value}T00:00:00.000Z`);

            if (
                isNaN(date.getTime()) ||
                date.toISOString().slice(0, 10) !== value
            ) {
                return helpers.error('any.invalid');
            }

            return value;
        })
        .optional()
}).custom((value, helpers) => {
    if (
        value.startDate &&
        value.endDate &&
        value.startDate > value.endDate
    ) {
        return helpers.error('any.invalid');
    }

    return value;
});

module.exports = reportValidator;
