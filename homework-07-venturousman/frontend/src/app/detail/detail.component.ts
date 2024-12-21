import { Component, inject, input, signal } from '@angular/core';
import { ProductsService } from '../products.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Product } from '../../types';
import { CommonModule } from '@angular/common';
import { catchError, of } from 'rxjs';

@Component({
    selector: 'app-detail',
    imports: [CommonModule, RouterLink],
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss'],
})
export class DetailComponent {
    readonly #productsService = inject(ProductsService);
    readonly #route = inject(ActivatedRoute);
    readonly #router = inject(Router);

    $product = signal<Product | undefined>(undefined);

    constructor() {}

    ngOnInit(): void {
        this.#route.paramMap.subscribe((params) => {
            const productId = Number(params.get('id'));
            console.log('Product ID: ', productId);
            if (isNaN(productId) || productId <= 0) {
                // Handle invalid ID, e.g., navigate to an error page or show a message
                this.#router.navigate(['/products']);
                return;
            }
            this.getProductDetails(productId);
        });
    }

    getProductDetails(id: number): void {
        this.#productsService
            .getProduct(id)
            .pipe(
                catchError((error) => {
                    console.error('Error fetching product details:', error);
                    // Handle the error, e.g., navigate to an error page or show a message
                    this.#router.navigate(['/products']);
                    return of(null); // Return a fallback value or an empty observable
                }),
            )
            .subscribe((product) => {
                console.log('Product detail: ', product);
                if (product) this.$product.set(product);
            });
    }

    deleteProduct(): void {
        const id = this.$product()?.id ?? 0;
        if (id > 0) {
            this.#productsService.deleteProduct(id).subscribe((data) => {
                console.log('Deleted product: ', data);
                this.#router.navigate(['/products']);
            });
        }
    }
}
