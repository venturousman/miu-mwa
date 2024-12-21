import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogClose, MatDialogRef} from '@angular/material/dialog';
import {MatCardContent, MatCardFooter, MatCardHeader} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';

@Component({
  selector: 'app-confirm-dialog',
  imports: [
    MatCardContent,
    MatCardHeader,
    MatDialogClose,
    MatIcon,
    MatIconButton,
    MatCardFooter,
    MatButton
  ],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent {
  #dialogRef = inject(MatDialogRef<ConfirmDialogComponent>)
  data: { title: string, message: string, negative_text: string, positive_text: string } = inject(MAT_DIALOG_DATA)

  handlePositive(){
    this.#dialogRef.close('handle-positive-case')
  }

  handleNegative(){
    this.#dialogRef.close()
  }
}
