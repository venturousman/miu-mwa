import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { Product } from '../../types';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-product',
    imports: [MatCardModule, MatChipsModule, RouterLink],
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss'],
})
export class ProductComponent {
    readonly data = input<Product>();
}
