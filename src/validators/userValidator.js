const Joi = require('joi');

const validator = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(12).required(),
  fitnessGoal: Joi.string()
    .valid('muscle_gain', 'fat_loss', 'endurance', 'general_fitness')
    .required(),
});

module.exports = validator;