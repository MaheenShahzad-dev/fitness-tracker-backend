
const Joi = require('joi');

const goalValidator = Joi.object({
    weeklyWorkoutTarget: Joi.number()
        .integer()
        .min(1)
        .required()
});

module.exports = goalValidator;
