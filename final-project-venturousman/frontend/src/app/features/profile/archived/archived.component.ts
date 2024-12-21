import { Component, effect, inject, OnDestroy, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { SubmitState } from '../../../core/constants/constants';
import { MatProgressBar } from '@angular/material/progress-bar';
import { ProfileService } from '../../../core/services/profile.service';
import { AuthGuard } from '../../../core/guards/auth.guard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ArchivedItemComponent } from './archived-item/archived-item.component';
import { MatDialog } from '@angular/material/dialog';
import { ItineraryDetailComponent } from '../../itinerary-detail/itinerary-detail.component';
import { ItineraryService } from '../../../core/services/itinerary.service';
import { ItineraryListResponseModel } from '../../../core/models/responsoe/Itinerary-list.response.model';

@Component({
  selector: 'app-archived',
  imports: [
    MatIcon,
    MatIconButton,
    MatProgressBar,
    MatPaginator,
    ArchivedItemComponent,
  ],
  templateUrl: 'archived.component.html',
  styleUrl: 'archived.component.css',
})
export class ArchivedComponent implements OnDestroy {
  #profileService = inject(ProfileService);
  #itineraryService = inject(ItineraryService);
  #authGuard = inject(AuthGuard);
  #snackbar = inject(MatSnackBar);
  #dialog = inject(MatDialog);
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
    console.log(fetchTime);
    this.$state.set(SubmitState.FETCHING);
    this.#profileService
      .getSavedItineraries(this.#authGuard.userId, this.$currentPage())
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

  showLoadDataError() {
    this.#snackbar.open('Fetch data error', 'Close', {
      duration: 2000,
    });
  }

  onRemoveAllItem = () => {
    this.$state.set(SubmitState.FETCHING);
    this.#profileService
      .deleteSavedItineraries(this.#authGuard.userId)
      .subscribe({
        next: () => {
          this.$refresh.set(new Date().getMilliseconds());
          this.showRemoveAllItemSuccess();
        },
        error: () => {
          this.$state.set(SubmitState.ERROR);
          this.showRemoveAllItemError();
        },
        complete: () => {
          this.$state.set(SubmitState.IDEAL);
        },
      });
  };

  onRemoveItem = (itemId: string) => {
    console.log(itemId);
    this.$state.set(SubmitState.FETCHING);
    this.#itineraryService.delete(itemId).subscribe({
      next: () => {
        this.$refresh.set(new Date().getMilliseconds());
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
  };

  onViewItem = (itemId: string) => {
    this.showPopupLogin(itemId);
  };

  showPopupLogin = (id: string) => {
    const dialogRef = this.#dialog.open(ItineraryDetailComponent, {
      minWidth: '800px',
      disableClose: true,
      data: {
        it_id: id,
      },
      panelClass: 'app-archived-dialog-container',
    });

    dialogRef.afterClosed().subscribe((result) => {});
  };

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

  showRemoveItemSuccess() {
    this.#snackbar.open('Remove item successful', 'Close', {
      duration: 2000,
    });
  }

  showRemoveItemError() {
    this.#snackbar.open('Remove item error', 'Close', {
      duration: 2000,
    });
  }

  ngOnDestroy(): void {
    this.#fetchDataEffect.destroy();
  }

  protected readonly SubmitState = SubmitState;
}
