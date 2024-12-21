import { Component, Input, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { ItineraryModel } from '../../../../core/models/itinerary.model';
import { formatDateToDDMMYYYY } from '../../../../core/utils/date-time.utils';

@Component({
  selector: 'app-archived-item',
  imports: [MatIcon, MatIconButton],
  templateUrl: './archived-item.component.html',
  styleUrl: './archived-item.component.css',
})
export class ArchivedItemComponent {
  data = input<ItineraryModel>();
  @Input() onRemoveItem!: (id: string) => void;
  @Input() onViewItem!: (data: string) => void;
  disableAction = input(false);

  handleOnViewItem(id: string) {
    this.onViewItem(id);
  }

  handleOnRemoveItem(id: string) {
    this.onRemoveItem(id);
  }

  protected readonly formatDateToDDMMYYYY = formatDateToDDMMYYYY;
}
