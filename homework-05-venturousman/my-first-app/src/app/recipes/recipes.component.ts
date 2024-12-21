import {
    Component,
    computed,
    effect,
    inject,
    input,
    signal,
} from '@angular/core';
import { DataResponse, Recipe } from '../../types';
import { RecipeComponent } from '../recipe/recipe.component';
import { MatGridListModule } from '@angular/material/grid-list';
import {
    MatPaginatorIntl,
    MatPaginatorModule,
} from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';
import { RecipesService } from '../recipes.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { TitleService } from '../title.service';

@Component({
    selector: 'recipes',
    imports: [
        RecipeComponent,
        MatGridListModule,
        MatPaginatorModule,
        // AsyncPipe,
        CommonModule,
    ],
    templateUrl: './recipes.component.html',
    styleUrls: ['./recipes.component.scss'],
    providers: [{ provide: MatPaginatorIntl, useClass: TitleService }],
})
export class RecipesComponent {
    // as container (stateful) holds the data as signal
    // $recipes = signal<Recipe[]>([]);
    $displayRecipes = signal<Recipe[]>([]);
    $total = signal(0); // Total number of recipes
    $currentPage = signal(0); // Current page index
    pageSize = 4; // Number of cards per page

    readonly #recipesService = inject(RecipesService);
    // ob$: Observable<DataResponse> = this.#recipesService.getRecipes(
    //     this.pageSize,
    //     this.$currentPage() * this.pageSize,
    // );
    // $recipes = toSignal(this.ob$);

    // Create a reactive observable using computed
    ob$ = computed(() =>
        this.#recipesService.getRecipes(
            this.pageSize,
            this.$currentPage() * this.pageSize,
        ),
    );

    constructor() {
        effect(() => {
            // this.#recipesService
            //     .getRecipes(this.pageSize, this.$currentPage() * this.pageSize)
            //     .subscribe((data: DataResponse) => {
            //         this.$displayRecipes.set(data.recipes);
            //         this.$total.set(data.total);
            //     });
            const observable = this.ob$();
            observable.subscribe((data: DataResponse) => {
                this.$displayRecipes.set(data.recipes);
                this.$total.set(data.total);
            });
        });
    }

    onPageChange(event: PageEvent) {
        // console.log('Page event: ', event);
        this.$currentPage.set(event.pageIndex);
    }
}
