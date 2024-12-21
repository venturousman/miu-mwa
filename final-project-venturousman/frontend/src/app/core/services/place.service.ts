import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Place } from '../models/place.model';

@Injectable({
    providedIn: 'root',
})
export class PlaceService {
    #http = inject(HttpClient);

    searchPlace(query: string) {
        return this.#http.get<Place[]>(
            environment.apiUrl + `place/search?q=${query}`,
        );
    }
}
