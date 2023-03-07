const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    role: Joi.string().required().valid("user", "admin")
  })
};

const newDriver = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    mobile: Joi.string()
      .required()
      .length(10)
      .pattern(/^[0-9]+$/)
  })
};
const updateDriver = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    mobile: Joi.string()
      .required()
      .length(10)
      .pattern(/^[0-9]+$/)
  })
};
const updateNormalUser = {
  body: Joi.object().keys({
    name: Joi.string().required().min(3)
  })
};
const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId)
  })
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId)
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string()
    })
    .min(1)
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  newDriver,
  updateDriver,
  updateNormalUser
};
