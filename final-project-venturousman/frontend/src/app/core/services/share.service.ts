import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ItineraryModel } from '../models/itinerary.model';

@Injectable({
  providedIn: 'root',
})
export class ShareService {
  #http = inject(HttpClient);

  getSharedItinerary(id: string) {
    return this.#http.get<ItineraryModel>(`${environment.apiUrl}share/${id}`);
  }
}
