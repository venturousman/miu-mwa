import { Component, inject, input, Input, signal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatDialog, MatDialogClose } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MarkdownModule } from 'ngx-markdown';
import { ItineraryService } from '../../../core/services/itinerary.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShareLinkDialogComponent } from '../share-link-dialog/share-link-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { AuthGuard } from '../../../core/guards/auth.guard';
import { LoginComponent } from '../../login/login.component';
import { SignupComponent } from '../../signup/signup.component';
import { ItineraryModel } from '../../../core/models/itinerary.model';

@Component({
  selector: 'app-itinerary',
  imports: [MatIconButton, MatDialogClose, MatIcon, MarkdownModule],
  templateUrl: 'itinerary.component.html',
  styleUrl: 'itinerary.component.css',
})
export class ItineraryInfoComponent {
  #itineraryService = inject(ItineraryService);
  #snackBar = inject(MatSnackBar);
  #dialog = inject(MatDialog);
  #authState = inject(AuthGuard);
  showActionButton = input(true);
  itineraryId = input('');
  recommendContent = input('');
  hideSaveButton = input(false);

  handleShare=()=> {
    if (this.#authState.isAuthenticated()) {
      if (this.itineraryId()?.length > 0) {
        this.#itineraryService.share(this.itineraryId()).subscribe({
          next: (data) => {
            if (data && data.success) {
              this.showMessageShareSuccess(data.data);
            } else {
              throw new Error('Create share link error ');
            }
          },
          error: () => {
            this.showMessageSaveError();
          },
          complete: () => {},
        });
      }
    } else {
      this.showConfirmLoginDialog();
    }
  }

  handleSave =()=> {
    if (this.#authState.isAuthenticated()) {
      if (this.itineraryId()?.length > 0) {
        this.#itineraryService.save(this.itineraryId()).subscribe({
          next: (data) => {
            if (data && data.success) {
              this.showMessageSaveSuccess();
            } else {
              throw new Error('Create share link error ');
            }
          },
          error: () => {
            this.showMessageSaveError();
          },
          complete: () => {},
        });
      }
    } else {
      this.showConfirmLoginDialog();
    }
  }

  showMessageShareSuccess(link: string) {
    const dialogRef = this.#dialog.open(ShareLinkDialogComponent, {
      width: '400px',
      disableClose: true,
      data: { link: link },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'sign-up') {
      } else if (result) {
        console.log('User logged in with:', result);
      }
    });
  }

  showMessageSaveSuccess() {
    this.#snackBar.open('Save itinerary success.', 'Close', {
      duration: 2000,
    });
  }

  showMessageSaveError() {
    this.#snackBar.open('Oop, Something went wrong', 'Close', {
      duration: 2000,
    });
  }

  showConfirmLoginDialog() {
    const dialogRef = this.#dialog.open(ConfirmDialogComponent, {
      width: '400px',
      disableClose: true,
      data: {
        title: 'Confirm',
        message: 'You need to log in to share this content.',
        negative_text: 'Cancel',
        positive_text: 'Login',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'handle-positive-case') {
        this.showPopupLogin();
      } else if (result) {
        console.log(result);
      }
    });
  }

  showPopupLogin() {
    const dialogRef = this.#dialog.open(LoginComponent, {
      width: '400px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'sign-up') {
        this.showPopupSignUp();
      } else if (result) {
        console.log('User logged in with:', result);
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
