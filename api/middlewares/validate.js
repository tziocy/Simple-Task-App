const _ = require('lodash');
const Joi = require('@hapi/joi');

const validate = (schema) => async (req, res, next) => {
  try {
    if (!schema.validateAsync) {
      await Promise.all(['body', 'params'].map(x => _.get(schema, x, Joi.object({})).validateAsync(req[x]), { abortEarly: false }));
    } else {
      await schema.validateAsync(req.body, { abortEarly: false });
      await Joi.object({}).validateAsync(req.params, { abortEarly: false });
    }
    return next();
  } catch (error) {
    return res.status(400).json({ errors: error.details })
  }
}

module.exports = validate;