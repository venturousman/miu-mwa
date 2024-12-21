import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { Recipe } from '../../types';

@Component({
    selector: 'recipe',
    imports: [MatCardModule, MatChipsModule],
    // template: `<mat-card appearance="outlined">
    //     <mat-card-content>{{ data()?.name }}</mat-card-content>
    // </mat-card> `,
    // styles: ``,
    templateUrl: './recipe.component.html',
    styleUrls: ['./recipe.component.scss'],
})
export class RecipeComponent {
    // as reusable component (stateless), it receives the data via input signal and display it.
    readonly data = input<Recipe>();
    constructor() {
        // console.log('## recipe: ', this.data);
    }
}
