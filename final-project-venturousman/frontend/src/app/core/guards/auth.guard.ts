import { effect, inject, Injectable, signal } from '@angular/core';
import { GlobalState } from '../models/global-state.model';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { TRAVEL_APP_STATE } from '../constants/constants';
import { environment } from '../../../environments/environment';

export const initial_state = {
  fullname: '',
  email: '',
  _id: '',
  jwt: '',
  avatar: '',
};

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  $state = signal<GlobalState>(initial_state);
  #router = inject(Router);
  #myEffect = effect(() => {
    localStorage.setItem(TRAVEL_APP_STATE, JSON.stringify(this.$state()));
  });

  logOut() {
    this.$state.set(initial_state); // Reset the signal to the initial state
    localStorage.clear();
    this.#router.navigate(['dashboard']).then(() => {});
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean {
    if (this.isAuthenticated()) {
      return true;
    }
    // Redirect to login if not authenticated
    this.#router.navigate(['']);
    return false;
  }

  isAuthenticated(): boolean {
    // console.log(this.$state()._id)
    return this.$state && this.$state()._id.length !== 0;
    // return !!this.$state()._id;
  }

  get userId(): string {
    return this.$state()._id;
  }

  get avatarUrl(): string {
    if (this.$state().avatar && this.$state().avatar.length!==0){
      return `${environment.domainUrl}/${this.$state().avatar}`;
    }else{
      return 'default_avatar.jpg'
    }
  }

  getAccessToken(): string | null {
    return this.$state().jwt;
  }

  setAccessToken(token: string) {
    this.$state.set({ ...this.$state(), jwt: token });
  }
}
