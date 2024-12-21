import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DataResponse } from '../types';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class RecipesService {
    #http = inject(HttpClient);

    // getRecipes$ = this.#http.get<{ recipes: Recipe[] }>(
    //     'https://dummyjson.com/recipes?limit=4&skip=0',
    // );

    constructor() {}

    getRecipes(limit: number = 4, skip: number = 0): Observable<DataResponse> {
        return this.#http.get<DataResponse>(
            `https://dummyjson.com/recipes?limit=${limit}&skip=${skip}`,
        );
    }
}
