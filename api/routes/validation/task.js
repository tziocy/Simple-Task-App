const Joi = require('@hapi/joi');

const validate = require('../../middlewares/validate');

module.exports = {
  createEditTask: () => validate(Joi.object({
    title: Joi.string().max(256).required(),
    description: Joi.string().required(),
    completed: Joi.boolean()
  })),
}
