import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogClose} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatIconButton} from '@angular/material/button';
import {MatCardContent, MatCardHeader} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {Clipboard} from '@angular/cdk/clipboard';
import {MatSnackBar} from '@angular/material/snack-bar';
import {generateCopyLink} from '../../../core/utils/link.utils';

@Component({
  selector: 'app-share-link-dialog',
  imports: [
    FormsModule,
    MatCardContent,
    MatCardHeader,
    MatDialogClose,
    MatIcon,
    MatIconButton,
    ReactiveFormsModule
  ],
  templateUrl: './share-link-dialog.component.html',
  styleUrl: './share-link-dialog.component.css'
})
export class ShareLinkDialogComponent {
  #snackbar = inject(MatSnackBar)
  #clipboard = inject(Clipboard)
  data: { link: string } = inject(MAT_DIALOG_DATA)

  handleCopy() {
    this.#clipboard.copy(generateCopyLink(this.data.link));
    this.showCopySuccess()
  }

  showCopySuccess() {
    this.#snackbar.open('Copied', 'Close', {
      duration: 2000,
    });
  }
}
