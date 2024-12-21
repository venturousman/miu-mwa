import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { AuthGuard } from '../guards/auth.guard';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  #authGuard = inject(AuthGuard);
  #authService = inject(AuthService);
  // constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const token = this.#authGuard.getAccessToken();
    if (token) {
      req = this.addToken(req, token);
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // console.log('## error: ', JSON.stringify(error));
        if (error.status === 401 && error.error?.name === 'TokenExpiredError') {
          return this.handleTokenExpiredError(req, next);
        }
        return throwError(() => error);
      }),
    );
  }

  // private addWithCredentials(req: HttpRequest<any>): HttpRequest<any> {
  //     return req.clone({ withCredentials: true });
  // }

  private addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
      // setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  private handleTokenExpiredError(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.#authService.refreshAccessToken().pipe(
        switchMap((response: { accessToken: string; email: string }) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(response.accessToken);
          this.#authGuard.setAccessToken(response.accessToken); // set the new token
          return next.handle(this.addToken(req, response.accessToken));
        }),
        catchError((err) => {
          this.isRefreshing = false;
          this.#authService.signOut();
          return throwError(() => err);
        }),
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token !== null),
        take(1),
        switchMap((token) => next.handle(this.addToken(req, token!))),
      );
    }
  }
}
