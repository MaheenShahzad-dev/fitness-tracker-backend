
const Joi = require('joi');

const workoutValidator = Joi.object({

    exerciseName: Joi.string().trim().required(),

    sets: Joi.number().integer().min(1).required(),

    reps: Joi.number().integer().min(1).required(),

    weight: Joi.number().min(0).required(),

    durationMinutes: Joi.number().min(0).required(),

    caloriesBurned: Joi.number().min(0).required(),

    notes: Joi.string().allow('').optional(),

    category: Joi.string()
        .valid('Strength', 'Cardio', 'HIIT', 'Yoga', 'Flexibility')
        .required(),

    date: Joi.date().optional()

});

const updateWorkoutValidator = Joi.object({

    exerciseName: Joi.string().trim(),

    sets: Joi.number().integer().min(1),

    reps: Joi.number().integer().min(1),

    weight: Joi.number().min(0),

    durationMinutes: Joi.number().min(0),

    caloriesBurned: Joi.number().min(0),

    notes: Joi.string().allow(''),

    category: Joi.string()
        .valid('Strength', 'Cardio', 'HIIT', 'Yoga', 'Flexibility'),

    date: Joi.date()

}).min(1);

module.exports = {
    workoutValidator,
    updateWorkoutValidator
};
