import Joi from 'joi';

export const signinValidationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const signupValidationSchema = Joi.object({
    fullname: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});
