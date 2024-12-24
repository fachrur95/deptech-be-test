import Joi from 'joi';

export const configValidationSchema = Joi.object({
  CURRENT_ENV: Joi.string().required(),

  // DATABASE
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.string().default(5432).required(),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_LOGGING: Joi.boolean().required(),

  // JWT Config
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION_IN_SECONDS: Joi.number().required(),

  // JWT Refresh Config
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_EXPIRATION_IN_DAYS: Joi.number().required(),
});
