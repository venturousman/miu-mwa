import { Component, computed, input, signal } from '@angular/core';
import { Recipe } from '../../types';
import { data } from '../../data';
import { RecipeComponent } from '../recipe/recipe.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';

@Component({
    selector: 'recipes',
    imports: [RecipeComponent, MatGridListModule, MatPaginatorModule],
    // template: `@for (recipe of recipes(); track recipe.id) {
    //     <recipe [data]="recipe" />
    //     } `,
    templateUrl: './recipes.component.html',
    styleUrls: ['./recipes.component.scss'],
})
export class RecipesComponent {
    // as container (stateful) holds the data as signal
    recipes = signal<Recipe[]>([]);
    currentPage = signal(0); // Current page index
    pageSize = 10; // Number of cards per page
    // total = data?.recipes?.length || data?.total || 0; // Total number of recipes

    displayRecipes = computed(() => {
        // console.log('Recalculating');
        const start = this.currentPage() * this.pageSize;
        // const pagedData = data.recipes.slice(start, start + this.pageSize);
        const pagedData = this.recipes().slice(start, start + this.pageSize);
        return pagedData;
    });

    constructor() {
        // console.log('## data: ', data);
        // console.log('## recipes: ', data.recipes);
        this.recipes.set(data.recipes);
    }

    onPageChange(event: PageEvent) {
        // this.currentPage = event.pageIndex;
        // console.log('Page event: ', event);
        this.currentPage.set(event.pageIndex);
    }
}
