import { Component, inject, OnInit, signal } from '@angular/core';
import { SubmitState } from '../../core/constants/constants';
import { MatProgressBar } from '@angular/material/progress-bar';
import { ItineraryInfoComponent } from '../components/itinerary-info/itinerary.component';
import { ItineraryService } from '../../core/services/itinerary.service';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { MatCardHeader } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { ItineraryModel } from '../../core/models/itinerary.model';
import {NotFoundComponent} from '../not-found/not-found.component';

@Component({
  selector: 'app-itinerary-detail',
  imports: [
    MatProgressBar,
    ItineraryInfoComponent,
    MatCardHeader,
    MatDialogClose,
    MatIcon,
    MatIconButton,
    NotFoundComponent,
  ],
  templateUrl: './itinerary-detail.component.html',
  styleUrl: './itinerary-detail.component.css',
})
export class ItineraryDetailComponent implements OnInit {
  #itineraryService = inject(ItineraryService);
  $itineraryData = signal<ItineraryModel>({} as ItineraryModel);
  $state = signal(SubmitState.IDEAL);
  data: { it_id: string } = inject(MAT_DIALOG_DATA);

  ngOnInit(): void {
    if (!this.data?.it_id) {
      return;
    }
    this.fetchData();
  }

  fetchData() {
    this.$state.set(SubmitState.FETCHING);
    this.#itineraryService.getDetail(this.data.it_id).subscribe({
      next: (data) => {
        this.$state.set(SubmitState.SUCCESS);
        this.$itineraryData.set(data);
      },
      error: () => {
        this.$state.set(SubmitState.ERROR);
      },
      complete: () => {
        this.$state.set(SubmitState.IDEAL);
      },
    });
  }

  protected readonly SubmitState = SubmitState;
}
