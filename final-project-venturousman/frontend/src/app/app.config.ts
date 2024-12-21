import {
    ApplicationConfig,
    inject,
    provideAppInitializer,
    provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideMarkdown } from 'ngx-markdown';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
    HTTP_INTERCEPTORS,
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { provideNativeDateAdapter } from '@angular/material/core';
import { AuthGuard } from './core/guards/auth.guard';
import { TRAVEL_APP_STATE } from './core/constants/constants';
import { TokenInterceptor } from './core/interceptors/token.interceptor';

function initialize() {
    const state_service = inject(AuthGuard);
    const state = localStorage.getItem(TRAVEL_APP_STATE);
    if (state) {
        state_service.$state.set(JSON.parse(state));
    }
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideAppInitializer(initialize),
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideHttpClient(withInterceptorsFromDi()),
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
        provideRouter(routes),
        provideAnimationsAsync(),
        provideNativeDateAdapter(),
        provideMarkdown(),
    ],
};
