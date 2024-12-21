import Joi from 'joi';

export const createDiarySchema = Joi.object({
    user_id: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().optional(),
});
