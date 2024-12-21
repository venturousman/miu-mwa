import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../../features/login/login.component';
import { SignupComponent } from '../../features/signup/signup.component';
import { AuthGuard } from '../../core/guards/auth.guard';

@Component({
    selector: 'app-header',
    imports: [RouterLink, RouterLinkActive, MatButtonModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css',
})
export class HeaderComponent {
    #dialog = inject(MatDialog);
    authState = inject(AuthGuard);

    showPopupLogin() {
        const dialogRef = this.#dialog.open(LoginComponent, {
            width: '400px',
            disableClose: true,
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result == 'sign-up') {
                this.showPopupSignUp();
            }
        });
    }

    showPopupSignUp() {
        const dialogRef = this.#dialog.open(SignupComponent, {
            width: '400px',
            disableClose: true,
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result == 'sign-in') {
                this.showPopupLogin();
            } else if (result) {
                console.log('User sign up with:', result);
            }
        });
    }
}
