// async function get_weather(lat: number, lon: number) {
async function get_weather(location: string) {
    try {
        console.log('### get_weather: ', location);
        const apiKey = process.env.OPENWEATHER_API_KEY;
        if (!apiKey) {
            throw new Error('OPENWEATHER_API_KEY is not set');
        }
        // const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
            location,
        )}&appid=${apiKey}&units=metric`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error with OpenAI API:', error);
        throw new Error('Failed to process request');
    }
}

export default {
    get_weather,
};
