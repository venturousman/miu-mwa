import { Component, inject, input, signal } from '@angular/core';
import { ProductsService } from '../products.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PartialProduct, Product } from '../../types';
import { CommonModule } from '@angular/common';
import { catchError, of } from 'rxjs';
import {
    FormBuilder,
    FormsModule,
    NonNullableFormBuilder,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';

@Component({
    selector: 'app-product-form',
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './product-form.component.html',
    styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent {
    readonly #productsService = inject(ProductsService);
    readonly #route = inject(ActivatedRoute);
    readonly #router = inject(Router);

    productForm = inject(NonNullableFormBuilder).group({
        id: [0],
        title: ['', Validators.required],
        // brand: ['', Validators.required],
        // category: ['', Validators.required],
        price: [0, [Validators.required, Validators.min(0)]],
        // discountPercentage: [
        //     0,
        //     [Validators.required, Validators.min(0), Validators.max(100)],
        // ],
        // stock: [0, [Validators.required, Validators.min(0)]],
        // warrantyInformation: ['', Validators.required],
        // shippingInformation: ['', Validators.required],
        // availabilityStatus: ['', Validators.required],
        // returnPolicy: ['', Validators.required],
        // description: ['', Validators.required],
    });

    // $product = signal<Product | undefined>(undefined);

    ngOnInit(): void {
        this.#route.paramMap.subscribe((params) => {
            const productId = Number(params.get('id'));
            console.log('Product ID: ', productId);
            if (isNaN(productId) || productId <= 0) {
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
                if (product) {
                    // this.$product.set(product);
                    this.productForm.patchValue(product);
                }
            });
    }

    onSubmit(): void {
        if (this.productForm.valid) {
            const product: PartialProduct = this.productForm.value;
            console.log('Product form value: ', product);
            if (product.id) {
                // const tmp = this.$product();
                // if (tmp) {
                //     this.#productsService
                //         .updateProduct2(tmp)
                //         .subscribe((data) => {
                //             console.log('Updated product 2: ', data);
                //             this.#router.navigate(['/products']);
                //         });
                // }

                this.#productsService
                    .updateProduct(product)
                    .subscribe((data) => {
                        console.log('Updated product: ', data);
                        this.#router.navigate(['/products']);
                    });
            } else {
                this.#productsService
                    .createProduct(product)
                    .subscribe((data) => {
                        console.log('Created product: ', data);
                        this.#router.navigate(['/products']);
                    });
            }
        }
    }
}
