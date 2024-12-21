import { RequestHandler } from 'express';
import openaiService from '../services/openaiService';
import weatherService from '../services/weatherService';

export const proofread: RequestHandler = async (req, res) => {
    const { text } = req.body;
    if (!text) {
        res.status(400).json({ message: 'Text is required' });
        return;
    }

    const prompt = 'Proofread the following text: ' + text;

    try {
        const result = await openaiService.prompt(prompt);
        res.json({ result });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const friendly: RequestHandler = async (req, res) => {
    const { text } = req.body;
    if (!text) {
        res.status(400).json({ message: 'Text is required' });
        return;
    }

    const prompt = 'Make the following text sound friendly: ' + text;

    try {
        const result = await openaiService.prompt(prompt);
        res.json({ result });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const professional: RequestHandler = async (req, res) => {
    const { text } = req.body;
    if (!text) {
        res.status(400).json({ message: 'Text is required' });
        return;
    }

    const prompt = 'Make the following text sound professional: ' + text;

    try {
        const result = await openaiService.prompt(prompt);
        res.json({ result });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const summarize: RequestHandler = async (req, res) => {
    const { text } = req.body;
    if (!text) {
        res.status(400).json({ message: 'Text is required' });
        return;
    }

    const prompt = 'Summarize the following text: ' + text;

    try {
        const result = await openaiService.prompt(prompt);
        res.json({ result });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const keypoints: RequestHandler = async (req, res) => {
    const { text } = req.body;
    if (!text) {
        res.status(400).json({ message: 'Text is required' });
        return;
    }

    const prompt =
        'Extract the key points from the following text sound friendly: ' +
        text;

    try {
        const result = await openaiService.prompt(prompt);
        res.json({ result });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const weather: RequestHandler = async (req, res) => {
    // const { lat, lon } = req.body;
    // if (!lat || !lon) {
    //     res.status(400).json({ message: 'Location is required' });
    //     return;
    // }

    const { text } = req.body;
    if (!text) {
        res.status(400).json({ message: 'Text is required' });
        return;
    }

    try {
        // const prompt = 'Extract the location in the following text: ' + text;
        // let result = await openaiService.prompt(prompt);
        // result = result
        //     .split('<|fim_suffix|>')[0] // Take content before any unwanted suffix markers
        //     .trim();
        // result = result.split(' ')[1].trim();
        // console.log(result);
        // res.json({ result });

        // const result = await weatherService.getWeather(lat, lon);
        // console.log(result);
        // res.json({ result });

        const result = await openaiService.calling(text);
        // console.log(result);
        res.json({ result });
    } catch (error) {
        res.status(500).json({ error });
    }
};
