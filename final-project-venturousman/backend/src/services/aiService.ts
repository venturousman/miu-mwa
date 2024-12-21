import OpenAI from 'openai';
import { ChatCompletionTool } from 'openai/resources';
import weatherService from './weatherService';
import yelpService from './yelpService';
import itineraryService from './itineraryService';
import recommendationService from './recommendationService';
import { envConfig } from '../config/environment';
import { RecommendationContext } from '../models/recommendationModel';

async function recommend(
    destination: string,
    lon: number,
    lat: number,
    startDate: string,
    endDate: string,
    preferences: string | undefined = undefined,
    userId: string | undefined = undefined,
) {
    try {
        const token = envConfig.githubToken;
        if (!token) {
            throw new Error('GITHUB TOKEN is not set');
        }
        const endpoint = 'https://models.inference.ai.azure.com';
        const model = 'gpt-4o-mini';
        const openai = new OpenAI({ baseURL: endpoint, apiKey: token });

        const { hotels, restaurants, attractions } =
            await yelpService.getDataString(lon, lat);
        const weather = await weatherService.getWeatherForecastString(
            lat,
            lon,
            startDate,
            endDate,
        );

        const preferencesText = preferences
            ? `based on user's preferences: ${preferences}`
            : '';

        let context: OpenAI.Chat.ChatCompletionMessageParam[] = [
            {
                role: 'system',
                content: `You are a helpful assistant that gives a travel itinerary based on user's preferences. The itinerary should have three parts: Overview, Details and Recommendations/Notes.`,
            },
            {
                role: 'user',
                content: `Generate a complete travel itinerary ${preferencesText} from ${startDate} to ${endDate} for ${destination} using the following hotels, restaurants, attractions, and weather: 
                    Hotels:\n ${hotels} 
                    Restaurants:\n ${restaurants} 
                    Attractions:\n ${attractions} 
                    Weather:\n ${weather}.`,
            },
        ];

        const response = await openai.chat.completions.create({
            model,
            messages: context,
            // tools,
            temperature: 0.2,
        });

        // console.log('### response: ', JSON.stringify(response));
        // console.log('---');
        const itineraryText = response.choices[0].message.content;

        let recommendationId = '';
        let itineraryId = '';
        try {
            // save to db
            const contextToSave = context.map((c) => ({
                role: c.role,
                content: c.content as string,
            }));
            contextToSave.push({
                role: 'assistant',
                content: itineraryText || '',
            });
            const recommend = await recommendationService.create(
                destination,
                lon,
                lat,
                startDate,
                endDate,
                preferences,
                contextToSave,
                userId,
            );
            // console.log('### recommend:', recommend);
            recommendationId = recommend._id.toString();
            const itinerary = await itineraryService.create(
                destination,
                lon,
                lat,
                startDate,
                endDate,
                preferences,
                userId,
                recommendationId,
                itineraryText,
            );
            // console.log('### itinerary:', itinerary);
            itineraryId = itinerary._id.toString();
        } catch (error) {
            // dont stop the process if saving to db fails
            console.error('recommend() function error saving to db:', error);
        }

        return { content: itineraryText, recommendationId, itineraryId };
    } catch (error) {
        console.error('Error with OpenAI API:', error);
        throw new Error('Failed to process request');
    }
}

export default {
    recommend,
};
