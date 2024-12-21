import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCardContent } from '@angular/material/card';
import {
  MatError,
  MatFormField,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { SubmitState } from '../../../core/constants/constants';
import { AuthGuard } from '../../../core/guards/auth.guard';
import { ProfileService } from '../../../core/services/profile.service';
import { firstValueFrom } from 'rxjs';
import { MustMatch } from '../../../core/validators/mustMatch.validator';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProfileViewModel } from '../../../core/models/user.model';

@Component({
  selector: 'app-info',
  imports: [
    FormsModule,
    MatButton,
    MatCardContent,
    MatError,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatSuffix,
    ReactiveFormsModule,
    MatProgressSpinner,
  ],
  templateUrl: 'info.component.html',
  styleUrl: 'info.component.css',
})
export class InfoComponent implements OnInit {
  #profileService = inject(ProfileService);
  #currentState = inject(AuthGuard);
  #snackbar = inject(MatSnackBar);
  $showPassword = signal(false);
  $submitState = signal<SubmitState>(SubmitState.IDEAL);
  selectedFile: File | null = null;
  imageSrc: string | null = null;

  profile: ProfileViewModel = {} as ProfileViewModel;

  updateForm = inject(FormBuilder).nonNullable.group(
    {
      fullName: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      // profile_picture: [null],
    },
    {
      validators: MustMatch('password', 'confirmPassword'),
    },
  );

  async ngOnInit(): Promise<void> {
    console.log('InfoComponent ngOnInit');
    await this.fetchUserProfile();
  }

  async fetchUserProfile(): Promise<void> {
    try {
      this.profile = await firstValueFrom(
        this.#profileService.get(this.#currentState.$state()._id),
      );

      // Update user info to global state
      this.#currentState.$state().avatar = this.profile.avatar || '';
      this.#currentState.$state().fullname = this.profile.fullname || '';

      this.imageSrc = this.#currentState.avatarUrl;
      this.updateForm.patchValue({
        fullName: this.profile.fullname,
        email: this.profile.email,
      });
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  }

  onAvatarChanged(event: Event) {
    event.preventDefault();
    const target = event.target as HTMLInputElement;
    if (!target || !target.files || target.files.length === 0) return;
    const file = target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imageSrc = reader.result as string;
      };

      // this.updateForm.patchValue({
      //   profile_picture: file,
      // });

      reader.readAsDataURL(file);
    }
  }

  async onSubmit() {
    if (this.updateForm.valid) {
      const formData = new FormData();
      formData.append('fullname', this.fullName.value);
      formData.append('password', this.password.value);
      if (this.selectedFile) {
        formData.append('profile_picture', this.selectedFile);
      }

      this.$submitState.set(SubmitState.FETCHING);

      try {
        const result = await firstValueFrom(
          this.#profileService.update(
            this.#currentState.$state()._id,
            formData,
          ),
        );
        if (result && result.success) {
          this.$submitState.set(SubmitState.SUCCESS);
          await this.fetchUserProfile();
          this.showUpdateSuccess();
          window.location.reload();
        } else {
          this.$submitState.set(SubmitState.ERROR);
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        this.$submitState.set(SubmitState.ERROR);
      }
    } else {
      this.#snackbar.open('Please fill form data', 'Close', {
        duration: 2000,
      });
    }
  }

  get fullName() {
    return this.updateForm.controls.fullName;
  }

  get email() {
    this.updateForm.get('email')?.disable();
    return this.updateForm.get('email');
  }

  get password() {
    return this.updateForm.controls.password;
  }

  get confirmPassword() {
    return this.updateForm.get('confirmPassword');
  }

  // get avatar() {
  //   return this.updateForm.get('profile_picture');
  // }

  toggleShowPassword() {
    this.$showPassword.update((pre) => !pre);
  }

  showUpdateSuccess() {
    this.#snackbar.open('Update profile successful.', 'Close', {
      duration: 2000,
    });
  }

  protected readonly SubmitState = SubmitState;
}
