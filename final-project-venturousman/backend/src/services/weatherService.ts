import axios from 'axios';

// Weather Code Mapping
const weatherCodeDescriptions: { [key: number]: string } = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Drizzle: Light',
    53: 'Drizzle: Moderate',
    55: 'Drizzle: Dense',
    61: 'Rain: Slight',
    63: 'Rain: Moderate',
    65: 'Rain: Heavy',
    71: 'Snowfall: Slight',
    73: 'Snowfall: Moderate',
    75: 'Snowfall: Heavy',
    80: 'Rain showers: Slight',
    81: 'Rain showers: Moderate',
    82: 'Rain showers: Violent',
    95: 'Thunderstorm: Slight',
    99: 'Thunderstorm: Severe',
};

interface WeatherForecast {
    date: string;
    temperature_max: number;
    temperature_min: number;
    precipitation_sum: number;
    precipitation_hours: number;
    rain_sum: number;
    snowfall_sum: number;
    weather_code: number;
    weather: string;
    sunrise: string;
    sunset: string;
    sunshine_duration: number;
    daylight_duration: number;
    wind_speed_max: number;
    wind_gusts_max: number;
    uv_index_max: number;
}

const getWeatherForecast = async (
    latitude: number,
    longitude: number,
    startDate: string,
    endDate: string,
): Promise<WeatherForecast[]> => {
    // const endDate = new Date(startDate);
    // endDate.setDate(endDate.getDate() + 6); // Add 6 days to cover a 7-day forecast
    // const formattedEndDate = endDate.toISOString().split('T')[0];

    const url = `https://api.open-meteo.com/v1/forecast`;
    // https://open-meteo.com/en/docs/historical-forecast-api#start_date=2024-12-01

    try {
        const response = await axios.get(url, {
            params: {
                latitude,
                longitude,
                start_date: startDate,
                end_date: endDate,
                // end_date: formattedEndDate,
                daily: [
                    'temperature_2m_max',
                    'temperature_2m_min',
                    'precipitation_sum', // Sum of daily precipitation (including rain, showers and snowfall)
                    'precipitation_hours', // The number of hours with rain
                    'rain_sum', // Sum of daily rain (mm)
                    'snowfall_sum', // Sum of daily snowfall (cm)
                    'weathercode',
                    'sunrise', // Sun rise and set times
                    'sunset',
                    'sunshine_duration', // The number of seconds of sunshine per day
                    'daylight_duration', // Number of seconds of daylight per day
                    'wind_speed_10m_max', // Maximum wind speed and gusts on a day (km/h)
                    'wind_gusts_10m_max',
                    'uv_index_max',
                ],
                // timezone: 'auto',
            },
        });

        // console.log('### response.data: ', JSON.stringify(response.data));

        const dailyData = response.data.daily;

        // Map response data into a structured array
        const forecast: WeatherForecast[] = dailyData.time.map(
            (date: string, index: number) => ({
                date,
                temperature_max: dailyData.temperature_2m_max[index],
                temperature_min: dailyData.temperature_2m_min[index],
                precipitation_sum: dailyData.precipitation_sum[index],
                precipitation_hours: dailyData.precipitation_hours[index],
                rain_sum: dailyData.rain_sum[index],
                snowfall_sum: dailyData.snowfall_sum[index],
                weather_code: dailyData.weathercode[index],
                weather: weatherCodeDescriptions[dailyData.weathercode[index]],
                sunrise: dailyData.sunrise[index],
                sunset: dailyData.sunset[index],
                sunshine_duration: dailyData.sunshine_duration[index],
                daylight_duration: dailyData.daylight_duration[index],
                wind_speed_max: dailyData.wind_speed_10m_max[index],
                wind_gusts_max: dailyData.wind_gusts_10m_max[index],
                uv_index_max: dailyData.uv_index_max[index],
            }),
        );

        return forecast;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw new Error('Failed to fetch weather data');
    }
};

async function getWeatherForecastString(
    latitude: number,
    longitude: number,
    startDate: string,
    endDate: string,
): Promise<string> {
    const forecast = await getWeatherForecast(
        latitude,
        longitude,
        startDate,
        endDate,
    );
    return forecast
        .map((day, index) => {
            return `${day.date}: ${day.weather}, temperatureMax: ${day.temperature_max}°C, temperatureMin: ${day.temperature_min}°C, precipitation: ${day.precipitation_sum}mm, rain: ${day.rain_sum}mm, snowfall: ${day.snowfall_sum}cm, windSpeedMax: ${day.wind_speed_max}km/h, windGustsMax: ${day.wind_gusts_max}km/h, uvIndexMax: ${day.uv_index_max}.`;
        })
        .join('\n');
}

export default {
    getWeatherForecast,
    getWeatherForecastString,
};
