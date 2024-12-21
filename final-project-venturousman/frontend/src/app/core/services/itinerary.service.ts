import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ItineraryRequestModel } from '../models/request/Itinerary.request.model';
import { RecommendationResponseModel } from '../models/responsoe/Itinerary.response.model';
import { BaseResponseModel } from '../models/responsoe/base.response.model';
import { ItineraryModel } from '../models/itinerary.model';

@Injectable({
  providedIn: 'root',
})
export class ItineraryService {
  #http = inject(HttpClient);

  recommend(data: ItineraryRequestModel) {
    return this.#http.post<RecommendationResponseModel>(
      environment.apiUrl + `itinerary/recommend`,
      data,
    );
  }

  save(itineraryId: string) {
    return this.#http.post<BaseResponseModel<number>>(
      `${environment.apiUrl}itinerary/${itineraryId}/save`,
      null,
    );
  }

  share(itineraryId: string) {
    return this.#http.post<BaseResponseModel<string>>(
      `${environment.apiUrl}itinerary/${itineraryId}/share`,
      null,
    );
  }

  unshare(itineraryId: string) {
    return this.#http.post<BaseResponseModel<number>>(
      `${environment.apiUrl}itinerary/${itineraryId}/unshare`,
      null,
    );
  }

  getDetail(itineraryId: string) {
    return this.#http.get<ItineraryModel>(
      `${environment.apiUrl}itinerary/${itineraryId}`,
    );
  }

  delete(itineraryId: string) {
    return this.#http.delete<BaseResponseModel<number>>(
      `${environment.apiUrl}itinerary/${itineraryId}`,
    );
  }
}
