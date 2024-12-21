import { Component, inject, OnInit, signal } from '@angular/core';
import {
  MatError,
  MatFormField,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatIconButton } from '@angular/material/button';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { MatOption, MatSelect } from '@angular/material/select';
import { budgetData, SubmitState } from '../../core/constants/constants';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { AsyncPipe, DatePipe, NgForOf } from '@angular/common';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { Place } from '../../core/models/place.model';
import { PlaceService } from '../../core/services/place.service';
import { SuggestPlaceComponent } from '../components/suggest-place/suggest-place.component';
import { ImageSliderComponent } from '../components/image-slider/image-slider.component';
import { ItineraryService } from '../../core/services/itinerary.service';
import { ItineraryRequestModel } from '../../core/models/request/Itinerary.request.model';
import { ItineraryInfoComponent } from '../components/itinerary-info/itinerary.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { RecommendationResponseModel } from '../../core/models/responsoe/Itinerary.response.model';
import { ItineraryModel } from '../../core/models/itinerary.model';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatFormField,
    MatIcon,
    MatInput,
    MatSuffix,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatDatepickerModule,
    MatLabel,
    MatSelect,
    MatOption,
    MatIconButton,
    ReactiveFormsModule,
    MatAutocompleteTrigger,
    MatAutocomplete,
    NgForOf,
    AsyncPipe,
    SuggestPlaceComponent,
    ImageSliderComponent,
    ItineraryInfoComponent,
    MatError,
    MatProgressSpinner,
  ],
  templateUrl: 'dashboard.component.html',
  styleUrl: 'dashboard.component.css',
  providers: [DatePipe],
})
export class DashboardComponent implements OnInit {
  #placeService = inject(PlaceService);
  #itineraryService = inject(ItineraryService);
  #formBuilder = inject(FormBuilder);
  #datePipe = inject(DatePipe);
  numberOfGuest: number[] = [];
  filteredOptions$: Observable<Place[]> = of([]);
  $submitState = signal<SubmitState>(SubmitState.IDEAL);
  $searchState = signal<SubmitState>(SubmitState.IDEAL);
  $recommendData = signal<RecommendationResponseModel>(
    {} as RecommendationResponseModel,
  );
  $errorMessage = signal('');
  today = new Date();

  bookingForm = this.#formBuilder.group({
    destination: [null as Place | null, [Validators.required]],
    fromDate: ['', [Validators.required]],
    toDate: ['', [Validators.required]],
    budget: [''],
    totalPerson: [''],
  });

  protected readonly budgetData = budgetData;

  ngOnInit(): void {
    this.numberOfGuest = Array.from({ length: 10 }, (_, i) => i + 1);
    this.filteredOptions$ =
      this.bookingForm.get('destination')?.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((value) => this.fetchOptions(value)),
      ) || of([]);
  }

  fetchOptions(query: Place | string | null): Observable<Place[]> {
    if (!query || typeof query !== 'string' || query.length === 0) {
      return of([]);
    }

    this.$searchState.set(SubmitState.FETCHING);
    return this.#placeService.searchPlace(query).pipe(
      tap(() => {
        this.$searchState.set(SubmitState.SUCCESS);
      }),
      catchError((err) => {
        this.$searchState.set(SubmitState.ERROR);
        return of([]);
      }),
    );
  }

  displayFn(option: Place): string {
    return option?.display_name ?? option?.name ?? '';
  }

  handleSearch() {
    if (this.bookingForm?.valid) {
      const { destination, fromDate, toDate } = this.bookingForm.value;

      if (!this.isValidDateRange() || !destination) {
        return;
      }

      this.$errorMessage.set('');

      const fromDateFormatted = this.#datePipe.transform(
        fromDate,
        'yyyy-MM-dd',
      );
      const toDateFormatted = this.#datePipe.transform(toDate, 'yyyy-MM-dd');

      const { budget, totalPerson } = this.bookingForm.value;
      let preferences = [];
      if (budget) {
        preferences.push(`budgets ${budget}`);
      }
      if (totalPerson) {
        preferences.push(`travel group size = ${totalPerson}`);
      }

      const requestModel: ItineraryRequestModel = {
        destination: destination.name,
        lat: destination.lat,
        lon: destination.lon,
        startDate: fromDateFormatted!,
        endDate: toDateFormatted!,
      };
      if (preferences.length > 0) {
        requestModel.preferences = preferences.join(', ');
      }

      this.$submitState.set(SubmitState.FETCHING);
      this.#itineraryService.recommend(requestModel).subscribe({
        next: async (data) => {
          console.log('### recommend data:', data);
          if (!data) throw new Error('No data');
          this.$recommendData.set(data);
          this.$submitState.set(SubmitState.SUCCESS);
        },
        error: () => {
          this.$errorMessage.set(
            'Can not get itinerary info. Please try again',
          );
          this.$submitState.set(SubmitState.ERROR);
        },
        complete: () => {},
      });
    }
  }

  isValidDateRange(): boolean {
    const { fromDate, toDate } = this.bookingForm.value;

    if (fromDate && toDate) {
      const fromTimestamp = new Date(fromDate).getTime();
      const toTimestamp = new Date(toDate).getTime();

      if (fromTimestamp > toTimestamp) {
        this.$errorMessage.set('From Date is later than To Date');
        return false;
      }
      return true;
    }

    return false;
  }

  disablePastDates = (date: Date | null): boolean => {
    if (!date) return false;
    return date >= this.today;
  };

  protected readonly SubmitState = SubmitState;
}
