import Joi from 'joi';

export const updateProfileSchema = Joi.object({
    fullname: Joi.string().required(),
    // email: Joi.string().email().required(),
    password: Joi.string().optional(), // in case of changing password
});
