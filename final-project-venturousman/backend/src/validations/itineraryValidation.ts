import Joi from 'joi';

export const recommendItineraryValidationSchema = Joi.object({
    destination: Joi.string().required(),
    lon: Joi.number().required(),
    lat: Joi.number().required(),
    startDate: Joi.string().required(),
    endDate: Joi.string().required(),
    preferences: Joi.string().optional(),
});
