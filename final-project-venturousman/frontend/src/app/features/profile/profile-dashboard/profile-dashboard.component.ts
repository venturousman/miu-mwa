import { Component, inject } from '@angular/core';
import { MenuItem } from '../../../core/models/menu-item.model';
import { of } from 'rxjs';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthGuard } from '../../../core/guards/auth.guard';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-profile-dashboard',
    imports: [RouterLink, RouterLinkActive, RouterOutlet],
    templateUrl: 'profile-dashboard.component.html',
    styleUrl: 'profile-dashboard.component.css',
})
export class ProfileDashboardComponent {
    items: MenuItem[] = Array.from({ length: 5 }, (_, index) => ({
        id: index + 1,
        title: `Item ${index + 1}`,
    }));
    #authGuard = inject(AuthGuard);
    #authService = inject(AuthService);

    constructor() {
        console.log(this.items);
    }

    handleLogOut() {
        this.#authService.signOut().subscribe();
        this.#authGuard.logOut();
    }

    protected readonly of = of;
}
