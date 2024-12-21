import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShareService } from '../../core/services/share.service';
import { SubmitState } from '../../core/constants/constants';
import { MatProgressBar } from '@angular/material/progress-bar';
import { ItineraryInfoComponent } from '../components/itinerary-info/itinerary.component';
import { RecommendationResponseModel } from '../../core/models/responsoe/Itinerary.response.model';
import { ItineraryModel } from '../../core/models/itinerary.model';
import {NotFoundComponent} from '../not-found/not-found.component';

@Component({
  selector: 'app-share',
  imports: [MatProgressBar, ItineraryInfoComponent, NotFoundComponent],
  templateUrl: './share.component.html',
  styleUrl: './share.component.css',
})
export class ShareComponent implements OnInit {
  #activeRoute = inject(ActivatedRoute);
  #shareService = inject(ShareService);
  id!: string;
  $itineraryData = signal<ItineraryModel>({} as ItineraryModel);
  $state = signal(SubmitState.IDEAL);
  $errorMessage = signal('Item not found')
  ngOnInit(): void {
    this.id = this.#activeRoute.snapshot.paramMap.get('id') || '';
    this.fetchData();
  }

  fetchData() {
    this.$state.set(SubmitState.FETCHING);
    this.#shareService.getSharedItinerary(this.id).subscribe({
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
