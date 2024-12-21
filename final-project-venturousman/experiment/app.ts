import dotenv from 'dotenv';
import OpenAI from 'openai';
import axios from 'axios';
import yelpService from './src/services/yelpService';
import weatherService from './src/services/weatherService';
import recommendationService from './src/services/recommendationService';
import { convertUnixToUTC, parseBusinessHours } from './src/utils/parsing';

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

async function test_yelp_business() {
    // const url =
    //     'https://api.yelp.com/v3/businesses/search?sort_by=best_match&limit=20&term=restaurants&location=Fairfield,IA';
    const url =
        'https://api.yelp.com/v3/businesses/search?sort_by=best_match&limit=20&categories=restaurants,hotels,landmarks,museums&radius=1000&longitude=-74.006&latitude=40.7128';

    // location=New%20York
    // latitude=10.368545217403739&longitude=107.11446342628902
    // can pass 'location' as string or coordinates (latitude, longitude)
    // https://docs.developer.yelp.com/reference/v3_business_search
    // categories=vegetarian
    // categories=landmarks,museums
    // attributes=hot_and_new (parking_lot, dogs_allowed are only Premium tier)
    // sort_by=rating, review_count, best_match, distance

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.YELP_API_KEY}`,
        },
    };

    // fetch(url, options)
    //     .then((res) => res.json())
    //     .then((json) => console.log(json))
    //     .catch((err) => console.error(err));

    try {
        const response = await axios.get(url, options);
        // console.log(response.data); // businesses, total, region
        const businesses = response.data.businesses; // length = 20
        console.log(businesses);
        console.log(businesses[0].categories);
        // console.log(businesses[0].business_hours[0].open);
    } catch (error) {
        console.error(error);
    }
}

async function test_osm() {
    const query = 'Quảng Bình, Vietnam';
    const response = await axios.get(
        'https://nominatim.openstreetmap.org/search',
        {
            params: {
                q: query,
                format: 'json',
                addressdetails: 1,
                limit: 5, // Adjust as needed
            },
            headers: {
                'User-Agent': 'YourAppName/1.0', // Include a User-Agent as required by OSM
            },
        },
    );
    console.log(response.data);
}

async function test_otm() {
    // https://api.opentripmap.com/0.1/en/places/radius?radius=1000&lon=-74.006&lat=40.7128&apikey=YOUR_API_KEY
    // cannot get the verify email yet, server 500
}

async function main() {
    if (!token) {
        throw new Error('GITHUB_TOKEN is not set');
    }

    // const client = new OpenAI({ baseURL: endpoint, apiKey: token });
    // await extract_address(client, '1000 N 4th Street, Fairfield, IA 52556');

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

    // await test_yelp_business();
    // await test_osm();

    // const hotels = await yelpService.getHotels(-74.006, 40.7128);
    // const restaurants = await yelpService.getRestaurants(-74.006, 40.7128);
    // const attractions = await yelpService.getAttractions(-74.006, 40.7128);
    // console.log(hotels);
    // console.log(restaurants);
    // console.log(attractions);

    // const lon = -74.006;
    // const lat = 40.7128;

    const lon = -75.8449946;
    const lat = 43.1561681;

    // const [hotels, restaurants, attractions] = await yelpService.getAll(
    //     lon,
    //     lat,
    // ); // ok
    // console.log(hotels);
    // console.log(JSON.stringify(restaurants));

    // restaurants.forEach((item: any) => {
    //     const parsedData = parseBusinessHours(item.business_hours);
    //     console.log(parsedData);
    //     console.log('---');
    // });

    const { hotels, restaurants, attractions } = await yelpService.getData(
        lon,
        lat,
    );
    console.log(hotels);

    // const { hotels, restaurants, attractions } =
    //     await yelpService.getDataString(lon, lat);
    // console.log(hotels);

    // const unixTimestamp = 1734318000;
    // const utcDateTime = convertUnixToUTC(unixTimestamp);
    // console.log(utcDateTime); // Output: 2024-12-15T01:00:00.000Z

    // const weather = await weatherService.getWeather('New York'); // ok
    // console.log(weather);
    // const weather = await weatherService.forecast(lat, lon); // ok
    // console.log(weather);
    // console.log(JSON.stringify(weather));

    // const response = await weatherService.getWeatherForecast(
    //     lat,
    //     lon,
    //     '2024-12-25',
    //     '2024-12-28',
    // ); // ok
    // const response = await weatherService.getWeatherForecastString(
    //     lat,
    //     lon,
    //     '2024-12-25',
    //     '2024-12-28',
    // );
    // console.log(response);

    /*
    const days = 3;
    const destination = 'New York';
    const startDate = '2024-12-25';
    const endDate = '2024-12-28';
    const content = `Generate an itinerary from ${startDate} to ${endDate} based on user's preferences (e.g., destination, budget, type of hotel, preferred amenities, etc.)`;
    // Provide the result in this JSON format:
    // 
    const content = `Plan a ${days}-day itinerary for ${destination} from ${startDate} to ${endDate}.`;
    const response = await recommendationService.recommend(lon, lat, content);
    console.log(response);
    */

    // const response = await recommendationService.recommend(
    //     'New York',
    //     lon,
    //     lat,
    //     '2024-12-25',
    //     '2024-12-28',
    //     // 'budget <= 1000$',
    //     'budget <= 1000$, travel group size = 4',
    //     // 'luxury hotel, vegetarian restaurant',
    // );
    // console.log(response);
}
