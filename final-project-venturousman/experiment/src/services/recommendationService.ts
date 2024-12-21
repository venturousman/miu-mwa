import OpenAI from 'openai';
import { ChatCompletionTool } from 'openai/resources';
import weatherService from './weatherService';
import yelpService from './yelpService';

async function recommend(
    destination: string,
    lon: number,
    lat: number,
    startDate: string,
    endDate: string,
    preferences: string | undefined = undefined,
) {
    try {
        const token = process.env.GITHUB_TOKEN;
        if (!token) {
            throw new Error('GITHUB_TOKEN is not set');
        }
        const endpoint = 'https://models.inference.ai.azure.com';
        const model = 'gpt-4o-mini';
        const openai = new OpenAI({ baseURL: endpoint, apiKey: token });

        // const tools: ChatCompletionTool[] = [
        //     {
        //         type: 'function',
        //         function: {
        //             name: 'getData',
        //             parameters: {
        //                 type: 'object',
        //                 properties: {
        //                     lon: { type: 'number' },
        //                     lat: { type: 'number' },
        //                     // location: { type: 'string' },
        //                 },
        //                 required: ['lon', 'lat'],
        //                 // required: ['location'],
        //             },
        //         },
        //     },
        // ];

        // let context: OpenAI.Chat.ChatCompletionMessageParam[] = [
        //     {
        //         role: 'system',
        //         content: `You are a helpful assistant that gives a travel itinerary based on user's preferences (e.g., destination, budget, type of hotel, preferred amenities, etc.).`,
        //     },
        //     {
        //         role: 'user',
        //         // content,
        //         content: `Generate an itinerary from ${startDate} to ${endDate} for ${destination}`,
        //     },
        // ];

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

        // the itinerary should have three parts: Overview, Details and Recommendations/Notes

        const response = await openai.chat.completions.create({
            model,
            messages: context,
            // tools,
            temperature: 0.2,
        });

        console.log('### response: ', JSON.stringify(response));
        console.log('---');
        return response.choices[0].message.content;

        // console.log('### response.choices[0]: ', response.choices[0]);
        // console.log(
        //     '### response.choices[0].message: ',
        //     response.choices[0].message,
        // );
        /*
        const toolCall = response.choices[0].message.tool_calls![0];
        // console.log('### toolCall: ', toolCall);
        if (response.choices[0].finish_reason === 'tool_calls') {
            // const toolName = toolCall.function.name;
            const stringArguments = toolCall.function.arguments;
            const parsedArguments = JSON.parse(stringArguments);
            console.log('### parsedArguments: ', parsedArguments);

            const toolResponse = await yelpService.getAll(lon, lat);

            // const toolResponse = await weatherService.getWeather(
            //     parsedArguments.location,
            // );
            // console.log('### toolResponse.weather: ', toolResponse.weather); // ok
            // const descriptions = toolResponse.weather.reduce(
            //     (
            //         acc: string[],
            //         item: {
            //             id: number;
            //             main: string;
            //             description: string;
            //             icon: string;
            //         },
            //     ) => {
            //         acc.push(item.description);
            //         return acc;
            //     },
            //     [],
            // );

            context.push(response.choices[0].message);
            context.push({
                role: 'tool',
                // content: toolResponse.weather,
                // content: `The weather information: ${toolResponse.weather}`,
                // content: `${descriptions.join(', ')}`,
                content: `nothing`,
                tool_call_id: toolCall.id,
            });
        }
        const secondResponse = await openai.chat.completions.create({
            model,
            messages: context,
        });
        // console.log(secondResponse.choices[0].message);
        return secondResponse.choices[0].message.content;
        */
    } catch (error) {
        console.error('Error with OpenAI API:', error);
        throw new Error('Failed to process request');
    }
}

export default {
    recommend,
};
