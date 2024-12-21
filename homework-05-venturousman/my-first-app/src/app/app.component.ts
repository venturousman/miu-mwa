import { Component } from '@angular/core';
import { RecipesComponent } from './recipes/recipes.component';
// import { data } from '../data';

@Component({
    selector: 'app-root',
    imports: [RecipesComponent],
    template: ` <recipes /> `,
    styles: [],
})
export class AppComponent {
    title = 'my-first-app';
}
