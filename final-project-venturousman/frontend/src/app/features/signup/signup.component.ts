import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCardContent, MatCardHeader } from '@angular/material/card';
import { MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import {
  MatError,
  MatFormField,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { AuthService } from '../../core/services/auth.service';
import { SubmitState } from '../../core/constants/constants';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  imports: [
    FormsModule,
    MatButton,
    MatCardContent,
    MatCardHeader,
    MatDialogClose,
    MatError,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatSuffix,
    ReactiveFormsModule,
    MatProgressSpinner,
  ],
  templateUrl: 'signup.component.html',
  styleUrl: 'signup.component.css',
})
export class SignupComponent {
  signupForm: FormGroup;
  #authService = inject(AuthService);
  #dialogRef = inject(MatDialogRef<SignupComponent>);
  #snackbar = inject(MatSnackBar);
  $showPassword = signal(false);
  $submitState = signal<SubmitState>(SubmitState.IDEAL);

  selectedFile: File | null = null;
  imageSrc: string | null = null;

  constructor(private fb: FormBuilder) {
    this.signupForm = this.fb.nonNullable.group({
      fullName: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      //   profile_picture: [null, [Validators.required]],
    });
  }

  onAvatarUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    if (!target || !target.files || target.files.length === 0) return;
    const file = target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imageSrc = reader.result as string;
      };

      //   this.signupForm.patchValue({
      //     profile_picture: file,
      //   });

      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const formData = new FormData();
      formData.append('email', this.email?.value);
      formData.append('fullname', this.fullName?.value);
      formData.append('password', this.password?.value);
      if (this.selectedFile) {
        formData.append('profile_picture', this.selectedFile);
      }
      this.$submitState.set(SubmitState.FETCHING);
      this.#authService.signUp(formData).subscribe({
        next: (data) => {
          if (data) {
            this.$submitState.set(SubmitState.SUCCESS);
            this.openSnackBar();
            this.#dialogRef.close();
          } else {
            throw new Error('Sign up fail');
          }
        },
        error: () => {
          this.$submitState.set(SubmitState.ERROR);
        },
      });
    } else {
      console.log('error');
    }
  }

  get fullName() {
    return this.signupForm.get('fullName');
  }

  get email() {
    return this.signupForm.get('email');
  }

  get password() {
    return this.signupForm.get('password');
  }

  //   get avatar() {
  //     return this.signupForm.get('profile_picture');
  //   }

  handleSignIn() {
    this.#dialogRef.close('sign-in');
  }

  toggleShowPassword() {
    this.$showPassword.update((pre) => !pre);
  }

  openSnackBar() {
    this.#snackbar.open('Sign up successfully.', 'Close', {
      duration: 2000,
    });
  }

  protected readonly SubmitState = SubmitState;
}
