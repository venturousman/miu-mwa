import axios from 'axios';
import {
    parseYelpBusinesses,
    parseYelpBusinessesAsString,
} from '../utils/yelpApiUtils';
import { envConfig } from '../config/environment';

async function searchBusinesses(
    longitude: number,
    latitude: number,
    categories: string = 'restaurants,hotels,landmarks,museums',
    radius: number = 1000,
    sort_by: string = 'best_match',
    limit: number = 20,
) {
    // const url = `https://api.yelp.com/v3/businesses/search?sort_by=${sort_by}&limit=${limit}&categories=${categories}&radius=${radius}&longitude=${longitude}&latitude=${latitude}`;
    const url = `https://api.yelp.com/v3/businesses/search?sort_by=${sort_by}&limit=${limit}&categories=${categories}&longitude=${longitude}&latitude=${latitude}`;

    // &radius=1000&longitude=-74.006&latitude=40.7128
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${envConfig.yelpApiKey}`,
        },
    };

    try {
        const response = await axios.get(url, options);
        // console.log(response.data); // businesses, total, region
        const businesses = response.data.businesses; // length = 20
        // console.log(businesses);
        // console.log(businesses[0].categories);
        // console.log(businesses[0].business_hours[0].open);
        return businesses;
    } catch (error) {
        console.error(error);
    }
}

async function getHotels(
    longitude: number,
    latitude: number,
    radius: number = 1000,
    sort_by: string = 'best_match',
    limit: number = 20,
) {
    return searchBusinesses(
        longitude,
        latitude,
        'hotels',
        radius,
        sort_by,
        limit,
    );
}

async function getRestaurants(
    longitude: number,
    latitude: number,
    radius: number = 1000,
    sort_by: string = 'best_match',
    limit: number = 20,
) {
    return searchBusinesses(
        longitude,
        latitude,
        'restaurants',
        radius,
        sort_by,
        limit,
    );
}

async function getAttractions(
    longitude: number,
    latitude: number,
    radius: number = 1000,
    sort_by: string = 'best_match',
    limit: number = 20,
) {
    return searchBusinesses(
        longitude,
        latitude,
        'landmarks,museums,castles,historicaltours,culturalcenter,aquariums,beaches,parks,galleries,zoos,theater,stadiumsarenas',
        radius,
        sort_by,
        limit,
    );
}

async function getAll(
    lon: number,
    lat: number,
    radius: number = 1000,
    sort_by: string = 'best_match',
    days: number = 3,
) {
    // console.log('### days: ', days);
    const hotels = getHotels(lon, lat, radius, sort_by, days * 3);
    const restaurants = getRestaurants(lon, lat, radius, sort_by, days * 5);
    const attractions = getAttractions(lon, lat, radius, sort_by, days * 7);
    return Promise.all([hotels, restaurants, attractions]);
}

async function getData(
    lon: number,
    lat: number,
    radius: number = 1000,
    sort_by: string = 'best_match',
    days: number = 3,
) {
    const response = await getAll(lon, lat, radius, sort_by, days);
    // console.log('### response:', response);
    // process/parse response
    const hotels = response[0] ? parseYelpBusinesses(response[0]) : [];
    const restaurants = response[1] ? parseYelpBusinesses(response[1]) : [];
    const attractions = response[2] ? parseYelpBusinesses(response[2]) : [];
    return { hotels, restaurants, attractions };
}

async function getDataString(
    lon: number,
    lat: number,
    radius: number = 1000,
    sort_by: string = 'best_match',
    days: number = 3,
) {
    const response = await getData(lon, lat, radius, sort_by, days);
    // console.log('### response:', response);
    const hotels = parseYelpBusinessesAsString(response.hotels);
    const restaurants = parseYelpBusinessesAsString(response.restaurants);
    const attractions = parseYelpBusinessesAsString(response.attractions);
    return { hotels, restaurants, attractions };
}

export default {
    getHotels,
    getRestaurants,
    getAttractions,
    getAll,
    getData,
    getDataString,
};
