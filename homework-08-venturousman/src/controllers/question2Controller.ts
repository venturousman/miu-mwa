import { RequestHandler } from 'express';
import openaiService from '../services/openaiService';

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
