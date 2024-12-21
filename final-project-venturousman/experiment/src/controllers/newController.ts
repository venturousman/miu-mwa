import { RequestHandler } from 'express';
import openaiService from '../services/openaiService';
import weatherService from '../services/weatherService';

export const endpoint1: RequestHandler = async (req, res) => {
    const { days, destination } = req.body;
    if (!days || !destination) {
        res.status(400).json({ message: 'input is required' });
        return;
    }

    const prompt = `Plan a ${days}-day itinerary for ${destination}`;

    try {
        const result = await openaiService.prompt(prompt);
        res.json({ result });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const endpoint2: RequestHandler = async (req, res) => {
    const { days, destination } = req.body;
    if (!days || !destination) {
        res.status(400).json({ message: 'input is required' });
        return;
    }

    const prompt = `Plan a ${days}-day itinerary for ${destination}`;

    try {
        const result = await openaiService.calling(prompt);
        // console.log(result);
        res.json({ result });
    } catch (error) {
        res.status(500).json({ error });
    }
};
