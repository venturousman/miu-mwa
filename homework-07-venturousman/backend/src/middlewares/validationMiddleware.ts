import { RequestHandler } from 'express';
import { Schema } from 'joi';

export const validateRequest = (schema: Schema): RequestHandler => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
            return;
        }
        console.log('validateRequest value:', value);
        next();
    };
};
