import {Component, Input, input} from '@angular/core';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {ItineraryModel} from '../../../../core/models/itinerary.model';
import {formatDateToDDMMYYYY} from '../../../../core/utils/date-time.utils';

@Component({
  selector: 'app-share-link-item',
  imports: [
    MatIconButton,
    MatIcon
  ],
  templateUrl: './share-link-item.component.html',
  styleUrl: './share-link-item.component.css'
})
export class ShareLinkItemComponent {
  @Input() onRemoveItem!: (id: string) => void;
  @Input() onCopyLink!: (id: string) => void;

  data = input<ItineraryModel>()
  disableAction = input(false)

  handleOnRemoveItem() {
    if (this.data() && this.data()!.id) {
      this.onRemoveItem(this.data()!.id)
    }
  }

  handleCopyLink() {
    if (this.data() && this.data()!.shareableId) {
      this.onCopyLink(this.data()!.shareableId)
    }
  }

  protected readonly formatDateToDDMMYYYY = formatDateToDDMMYYYY;
}
