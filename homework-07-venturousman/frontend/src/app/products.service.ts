import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
    DeleteProductResponse,
    GetProductsResponse,
    PartialProduct,
    Product,
} from '../types';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ProductsService {
    #http = inject(HttpClient);

    constructor() {}

    // https://dummyjson.com/docs/products
    getProducts(
        limit: number = 4,
        skip: number = 0,
    ): Observable<GetProductsResponse> {
        return this.#http.get<GetProductsResponse>(
            `https://dummyjson.com/products?limit=${limit}&skip=${skip}`,
        );
    }

    getProduct(id: number): Observable<Product> {
        return this.#http.get<Product>(`https://dummyjson.com/products/${id}`);
    }

    deleteProduct(id: number): Observable<DeleteProductResponse> {
        return this.#http.delete<DeleteProductResponse>(
            `https://dummyjson.com/products/${id}`,
        );
    }

    createProduct(product: PartialProduct): Observable<Product> {
        return this.#http.post<Product>(
            'https://dummyjson.com/products/add',
            product,
        );
    }

    updateProduct(product: PartialProduct): Observable<Product> {
        // return this.#http.put<Product>(
        //     `https://dummyjson.com/products/${product.id}`,
        //     product,
        // );
        const { id, ...productWithoutId } = product;
        return this.#http.patch<Product>(
            `https://dummyjson.com/products/${id}`,
            productWithoutId,
        );
    }

    updateProduct2(product: Product): Observable<Product> {
        return this.#http.put<Product>(
            `https://dummyjson.com/products/${product.id}`,
            product,
        );
        // return this.#http.put<Product>(
        //     `https://dummyjson.com/products/${product.id}`,
        //     JSON.stringify(product),
        //     { headers: { 'Content-Type': 'application/json' } },
        // );
    }
}
