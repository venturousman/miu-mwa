import { Component } from '@angular/core';
// import { ProductsComponent } from './products/products.component';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, RouterLink],
    // imports: [ProductsComponent],
    // template: ` <app-products /> `,
    template: ` <nav>
            <ul>
                <li><a [routerLink]="['home']">Home</a></li>
                <li><a [routerLink]="['products']">Products</a></li>
                <li>
                    <a [routerLink]="['products/create']">Create a Product</a>
                </li>
                <li><a [routerLink]="['contact']">Contact us</a></li>
            </ul>
        </nav>
        <router-outlet />`,
    styles: [],
})
export class AppComponent {
    title = 'frontend';
}
