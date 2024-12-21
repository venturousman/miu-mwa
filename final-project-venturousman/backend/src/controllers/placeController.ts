import { RequestHandler } from 'express';
import axios from 'axios';

export const search: RequestHandler = async (req, res, next) => {
    try {
        const query = req.query.q;
        const response = await axios.get(
            'https://nominatim.openstreetmap.org/search',
            {
                params: {
                    q: query,
                    format: 'json',
                },
                headers: {
                    'User-Agent': 'MyApp/1.0',
                },
            },
        );
        res.status(200).json(response.data);
    } catch (error) {
        console.log('Something went wrong');
        next(error);
    }
};
