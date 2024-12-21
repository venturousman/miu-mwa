import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ProfileViewModel } from '../models/user.model';
import { environment } from '../../../environments/environment';
import { ItineraryModel } from '../models/itinerary.model';
import { ItineraryListResponseModel } from '../models/responsoe/Itinerary-list.response.model';
import { BaseResponseModel } from '../models/responsoe/base.response.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  #http = inject(HttpClient);

  get(userId: string) {
    const url = `${environment.apiUrl}profile/${userId}`;
    return this.#http.get<ProfileViewModel>(url);
  }

  update(userId: string, data: FormData) {
    const url = `${environment.apiUrl}profile/${userId}`;
    return this.#http.put<{ success: boolean; data: number }>(url, data);
  }

  getSharedLinks(userId: string, page: number) {
    const url = `${environment.apiUrl}profile/${userId}/shared-itineraries?page=${page}`;
    return this.#http.get<ItineraryListResponseModel>(url);
  }

  deleteSharedItineraries(userId: string) {
    const url = `${environment.apiUrl}profile/${userId}/itineraries/unshare`;
    return this.#http.post<BaseResponseModel<number>>(url, null);
  }

  getSavedItineraries(userId: string, page: number) {
    const url = `${environment.apiUrl}profile/${userId}/itineraries?page=${page}`;
    return this.#http.get<ItineraryListResponseModel>(url);
  }

  deleteSavedItineraries(userId: string) {
    const url = `${environment.apiUrl}profile/${userId}/itineraries`;
    return this.#http.delete<BaseResponseModel<number>>(url);
  }
}
