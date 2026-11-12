
const Joi = require('joi');

const nutritionValidator = Joi.object({
    foodItem: Joi.string().trim().required(),
    quantity: Joi.number().positive().required(),
    calories: Joi.number().min(0).required(),
    protein: Joi.number().min(0).required(),
    carbs: Joi.number().min(0).required(),
    fat: Joi.number().min(0).required(),
    mealType: Joi.string()
        .valid('Breakfast', 'Lunch', 'Dinner', 'Snacks')
        .required(),
    date: Joi.date().optional()
});

const updateNutritionValidator = nutritionValidator.fork(
    [
        'foodItem',
        'quantity',
        'calories',
        'protein',
        'carbs',
        'fat',
        'mealType',
        'date'
    ],
    (schema) => schema.optional()
).min(1);

module.exports = {
    nutritionValidator,
    updateNutritionValidator
};
