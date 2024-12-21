import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const token = process.env.GITHUB_TOKEN;
const endpoint = 'https://models.inference.ai.azure.com';
const model = 'gpt-4o-mini';

main().catch((err) => console.log(err));

async function extract_address(openai: OpenAI, address: string) {
    try {
        const prompt =
            'Extract the address parts from the following US address and return them in JSON format with keys: Street, City, State, Zipcode: ' +
            address;
        const completion = await openai.completions.create({
            model,
            prompt,
            max_tokens: 100,
            temperature: 0.2,
        });

        let result = completion.choices[0].text.trim();
        result = result
            .split('<|fim_suffix|>')[0] // Take content before any unwanted suffix markers
            .trim();
        const addressParts = JSON.parse(result);
        // console.log(result);
        console.log(addressParts);
    } catch (error) {
        console.log(error);
    }
}

async function main() {
    if (!token) {
        throw new Error('GITHUB_TOKEN is not set');
    }

    const client = new OpenAI({ baseURL: endpoint, apiKey: token });

    await extract_address(client, '1000 N 4th Street, Fairfield, IA 52556');

    // const response = await client.chat.completions.create({
    //     messages: [
    //         { role: 'system', content: 'You are a helpful assistant.' },
    //         { role: 'user', content: 'What is the capital of France?' },
    //     ],
    //     temperature: 1.0,
    //     top_p: 1.0,
    //     max_tokens: 1000,
    //     model: modelName,
    // });

    // console.log(response.choices[0].message.content);
}
