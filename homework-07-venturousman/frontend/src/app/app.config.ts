import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
// import { ProductsComponent } from './products/products.component';
import { HomeComponent } from './home/home.component';

const appRoutes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent, title: 'Home page' },
    {
        path: 'products',
        loadComponent: () =>
            import('./products/products.component').then(
                (c) => c.ProductsComponent,
            ),
        title: 'Products page',
    },
    {
        path: 'products/create',
        loadComponent: () =>
            import('./product-form/product-form.component').then(
                (c) => c.ProductFormComponent,
            ),
        title: 'Create a Product',
    },
    {
        path: 'products/:id',
        loadComponent: () =>
            import('./detail/detail.component').then((c) => c.DetailComponent),
        title: 'Product details',
    },
    {
        path: 'products/edit/:id',
        loadComponent: () =>
            import('./product-form/product-form.component').then(
                (c) => c.ProductFormComponent,
            ),
        title: 'Edit a Product',
    },
    { path: '**', redirectTo: 'home' },
];

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideHttpClient(),
        provideRouter(appRoutes),
    ],
};
