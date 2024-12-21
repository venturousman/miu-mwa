import {ItineraryModel} from '../itinerary.model';

export type ItineraryListResponseModel = {
  total: number
  items: ItineraryModel[]
  page: number
  limit: number
};
