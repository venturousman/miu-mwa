import { Component, inject, signal } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import {
    MatError,
    MatFormField,
    MatLabel,
    MatSuffix,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCardHeader, MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';
import { SubmitState } from '../../core/constants/constants';
import { jwtDecode } from 'jwt-decode';
import { Token } from '../../core/models/token.model';
import { AuthGuard } from '../../core/guards/auth.guard';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-login',
    imports: [
        ReactiveFormsModule,
        MatFormField,
        MatInput,
        MatButton,
        MatDialogClose,
        MatLabel,
        MatCardHeader,
        MatCardModule,
        MatError,
        MatIcon,
        MatSuffix,
        MatIconButton,
        MatProgressSpinnerModule,
    ],
    templateUrl: 'login.component.html',
    styleUrl: 'login.component.css',
})
export class LoginComponent {
    #dialogRef = inject(MatDialogRef<LoginComponent>);
    $showPassword = signal(false);
    #authService = inject(AuthService);
    $submitState = signal<SubmitState>(SubmitState.IDEAL);
    #authGuard = inject(AuthGuard);
    loginForm = inject(FormBuilder).nonNullable.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
    });

    onSubmit() {
        if (this.loginForm.valid) {
            this.$submitState.set(SubmitState.FETCHING);
            const email = this.loginForm.value.email!;
            const password = this.loginForm.value.password!;
            this.#authService.signIn({ email, password }).subscribe({
                next: (data) => {
                    const decoded = jwtDecode(data.accessToken) as Token;
                    this.#authGuard.$state.set({
                        _id: decoded.userId,
                        fullname: decoded.fullname,
                        email: decoded.email,
                        jwt: data.accessToken,
                        avatar:
                            data.avatar,
                    });
                    this.$submitState.set(SubmitState.SUCCESS);
                    this.#dialogRef.close();
                },
                error: () => {
                    this.$submitState.set(SubmitState.ERROR);
                },
            });
        }
    }

    get email() {
        return this.loginForm.get('email');
    }

    get password() {
        return this.loginForm.get('password');
    }

    handleSignUp() {
        this.#dialogRef.close('sign-up');
    }

    toggleShowPassword() {
        this.$showPassword.update((pre) => !pre);
    }

    protected readonly SubmitState = SubmitState;
}
