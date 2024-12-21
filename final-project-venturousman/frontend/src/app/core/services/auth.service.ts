import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BaseResponseModel } from '../models/responsoe/base.response.model';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    #http = inject(HttpClient);

    signIn(credential: { email: string; password: string }) {
        return this.#http.post<{
            accessToken: string;
            email: string;
            avatar: string;
        }>(environment.apiUrl + 'auth/signin', credential, {
            withCredentials: true, // must have this line to send cookies in next requests
        });
    }

    signUp(data: FormData) {
        return this.#http.post<BaseResponseModel<string>>(
            environment.apiUrl + 'auth/signup',
            data,
        );
    }

    signOut() {
        return this.#http.post<BaseResponseModel<string>>(
            environment.apiUrl + 'auth/signout',
            null,
            { withCredentials: true },
        );
    }

    refreshAccessToken() {
        return this.#http.post<{
            accessToken: string;
            email: string;
        }>(environment.apiUrl + 'auth/refresh-token', null, {
            withCredentials: true,
        });
    }
}
