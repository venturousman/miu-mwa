import { Request } from 'express';
import jwt from 'jsonwebtoken';

interface CustomRequest extends Request {
    user?: string | jwt.JwtPayload; // Add your custom property
}

export default CustomRequest;
