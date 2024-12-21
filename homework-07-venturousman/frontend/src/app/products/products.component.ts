import { Component, computed, effect, inject, signal } from '@angular/core';
import { ProductComponent } from '../product/product.component';
import { MatGridListModule } from '@angular/material/grid-list';
import {
    MatPaginatorIntl,
    MatPaginatorModule,
    PageEvent,
} from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { TitleService } from '../title.service';
import { ProductsService } from '../products.service';
import { GetProductsResponse, Product } from '../../types';

@Component({
    selector: 'app-products',
    imports: [
        ProductComponent,
        MatGridListModule,
        MatPaginatorModule,
        // AsyncPipe,
        CommonModule,
    ],
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss'],
    providers: [{ provide: MatPaginatorIntl, useClass: TitleService }],
})
export class ProductsComponent {
    readonly #productsService = inject(ProductsService);

    $products = signal<Product[]>([]);
    $total = signal(0); // Total number of products
    $currentPage = signal(0); // Current page index
    pageSize = 10; // Number of products per page

    // Create a reactive observable using computed
    ob$ = this.#productsService.getProducts(
        this.pageSize,
        this.$currentPage() * this.pageSize,
    );

    constructor() {
        effect(() => {
            // this.loading.set(true);
            const observable = this.ob$;
            const subscription = observable.subscribe({
                next: (data: GetProductsResponse) => {
                    this.$products.set(data.products);
                    this.$total.set(data.total);
                },
                // complete: () => this.loading.set(false),
            });
            return () => {
                // The cleanup function is called automatically when the effect is re-triggered or destroyed.
                console.log('Unsubscribing from products observable');
                // Cleanup subscription
                subscription.unsubscribe();
            };
        });
    }

    onPageChange(event: PageEvent) {
        // console.log('Page event: ', event);
        this.$currentPage.set(event.pageIndex);
    }
}
