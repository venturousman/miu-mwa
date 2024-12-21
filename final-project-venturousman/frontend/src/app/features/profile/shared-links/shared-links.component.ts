import {Component, effect, inject, OnDestroy, signal} from '@angular/core';
import {MatIconButton} from '@angular/material/button';
import {ShareLinkItemComponent} from './share-link-item/share-link-item.component';
import {MatIcon} from '@angular/material/icon';
import {ProfileService} from '../../../core/services/profile.service';
import {AuthGuard} from '../../../core/guards/auth.guard';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatProgressBar} from '@angular/material/progress-bar';
import {SubmitState} from '../../../core/constants/constants';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Clipboard} from '@angular/cdk/clipboard';
import {generateCopyLink} from '../../../core/utils/link.utils';
import {ItineraryListResponseModel} from '../../../core/models/responsoe/Itinerary-list.response.model';
import {ItineraryService} from '../../../core/services/itinerary.service';

@Component({
  selector: 'app-shared-links',
  imports: [
    MatIconButton,
    ShareLinkItemComponent,
    MatIcon,
    MatPaginator,
    MatProgressBar,
  ],
  templateUrl: 'shared-links.component.html',
  styleUrl: 'shared-links.component.css',
})
export class SharedLinksComponent implements OnDestroy {
  #profileService = inject(ProfileService);
  #itineraryService = inject(ItineraryService);
  #authGuard = inject(AuthGuard);
  #snackbar = inject(MatSnackBar);
  #clipboard = inject(Clipboard);
  $currentPage = signal(1);
  $totalItems = signal(100);
  $pageData = signal<ItineraryListResponseModel>({
    total: 0,
    items: [],
    page: 0,
    limit: 0,
  });
  $state = signal(SubmitState.IDEAL);
  $refresh = signal(new Date().getMilliseconds());

  #fetchDataEffect = effect(() => {
    this.fetchData(this.$refresh());
  });

  fetchData(fetchTime: number) {
    console.log(fetchTime)
    this.$state.set(SubmitState.FETCHING);
    this.#profileService
      .getSharedLinks(this.#authGuard.userId, this.$currentPage())
      .subscribe({
        next: (data) => {
          this.$pageData.set(data);
          this.$totalItems.set(data.total);
        },
        error: () => {
          this.$state.set(SubmitState.ERROR);
          this.showLoadDataError();
        },
        complete: () => {
          this.$state.set(SubmitState.IDEAL);
        },
      });
  }

  onPageChange($event: PageEvent) {
    this.$currentPage.set($event.pageIndex + 1);
  }

  onRemoveItem = (itemId: string) => {
    this.$state.set(SubmitState.FETCHING);
    this.#itineraryService.unshare(itemId).subscribe({
      next: () => {
        this.$refresh.set(new Date().getMilliseconds())
        this.showRemoveItemSuccess();
      },
      error: () => {
        this.$state.set(SubmitState.ERROR);
        this.showRemoveItemError();
      },
      complete: () => {
        this.$state.set(SubmitState.IDEAL);
      },
    });
  }

  onRemoveAllItem = () => {
    this.$state.set(SubmitState.FETCHING);
    this.#profileService
      .deleteSharedItineraries(this.#authGuard.userId)
      .subscribe({
        next: () => {
          this.$refresh.set(new Date().getMilliseconds())
          this.showRemoveAllItemSuccess()
        },
        error: () => {
          this.$state.set(SubmitState.ERROR);
          this.showRemoveAllItemError()
        },
        complete: () => {
          this.$state.set(SubmitState.IDEAL);
        },
      });
  }

  onCopyLink = (shareableId: string) => {
    const link = generateCopyLink(shareableId);
    this.#clipboard.copy(link);
    this.showCopySuccess();
  }

  showCopySuccess() {
    this.#snackbar.open('Copied', 'Close', {
      duration: 2000,
    });
  }

  showLoadDataError() {
    this.#snackbar.open('Fetch data error', 'Close', {
      duration: 2000,
    });
  }

  showRemoveItemError() {
    this.#snackbar.open('Remove item error', 'Close', {
      duration: 2000,
    });
  }

  showRemoveItemSuccess() {
    this.#snackbar.open('Removed item', 'Close', {
      duration: 2000,
    });
  }

  showRemoveAllItemSuccess() {
    this.#snackbar.open('Remove all item successful', 'Close', {
      duration: 2000,
    });
  }

  showRemoveAllItemError() {
    this.#snackbar.open('Remove all item error', 'Close', {
      duration: 2000,
    });
  }

  ngOnDestroy(): void {
    this.#fetchDataEffect.destroy();
  }

  protected readonly SubmitState = SubmitState;
}
