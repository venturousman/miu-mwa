import OpenAI from 'openai';
import { ChatCompletionTool } from 'openai/resources';
import weatherService from './weatherService';

async function prompt(prompt: string) {
    try {
        const token = process.env.GITHUB_TOKEN;
        if (!token) {
            throw new Error('GITHUB_TOKEN is not set');
        }
        const endpoint = 'https://models.inference.ai.azure.com';
        const model = 'gpt-4o-mini';
        const openai = new OpenAI({ baseURL: endpoint, apiKey: token });

        const completion = await openai.completions.create({
            model,
            prompt,
            max_tokens: 100,
            temperature: 0.2,
        });

        return completion.choices[0].text.trim();
    } catch (error) {
        console.error('Error with OpenAI API:', error);
        throw new Error('Failed to process request');
    }
}

async function calling(content: string) {
    try {
        const token = process.env.GITHUB_TOKEN;
        if (!token) {
            throw new Error('GITHUB_TOKEN is not set');
        }
        const endpoint = 'https://models.inference.ai.azure.com';
        const model = 'gpt-4o-mini';
        const openai = new OpenAI({ baseURL: endpoint, apiKey: token });

        const tools: ChatCompletionTool[] = [
            {
                type: 'function',
                function: {
                    name: 'get_weather',
                    parameters: {
                        type: 'object',
                        properties: {
                            // lat: { type: 'number' },
                            // lon: { type: 'number' },
                            location: { type: 'string' },
                        },
                        // required: ['lat', 'lon'],
                        required: ['location'],
                    },
                },
            },
        ];

        let context: OpenAI.Chat.ChatCompletionMessageParam[] = [
            {
                role: 'system',
                content: `You are a helpful assistant that gives information about the current weather status of the given location.`,
            },
            {
                role: 'user',
                content,
                // content: "What's the weather like in Paris today?",
            },
        ];

        const response = await openai.chat.completions.create({
            model,
            messages: context,
            tools,
        });

        // console.log('### response.choices[0]: ', response.choices[0]);
        // console.log(
        //     '### response.choices[0].message: ',
        //     response.choices[0].message,
        // );

        const toolCall = response.choices[0].message.tool_calls![0];
        // console.log('### toolCall: ', toolCall);
        if (response.choices[0].finish_reason === 'tool_calls') {
            // const toolName = toolCall.function.name;
            const stringArguments = toolCall.function.arguments;
            const parsedArguments = JSON.parse(stringArguments);
            // console.log('### parsedArguments: ', parsedArguments);
            const toolResponse = await weatherService.get_weather(
                parsedArguments.location,
            );
            console.log('### toolResponse.weather: ', toolResponse.weather); // ok
            const descriptions = toolResponse.weather.reduce(
                (
                    acc: string[],
                    item: {
                        id: number;
                        main: string;
                        description: string;
                        icon: string;
                    },
                ) => {
                    acc.push(item.description);
                    return acc;
                },
                [],
            );
            context.push(response.choices[0].message);
            context.push({
                role: 'tool',
                // content: toolResponse.weather,
                // content: `The weather information: ${toolResponse.weather}`,
                content: `${descriptions.join(', ')}`,
                tool_call_id: toolCall.id,
            });
        }
        const secondResponse = await openai.chat.completions.create({
            model,
            messages: context,
        });
        // console.log(secondResponse.choices[0].message);
        return secondResponse.choices[0].message.content;
    } catch (error) {
        console.error('Error with OpenAI API:', error);
        throw new Error('Failed to process request');
    }
}

export default {
    prompt,
    calling,
};
