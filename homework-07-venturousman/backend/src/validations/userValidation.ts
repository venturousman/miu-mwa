import Joi from 'joi';

export const createUserSchema = Joi.object({
    fullname: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    picture_url: Joi.string().uri().optional(),
});
