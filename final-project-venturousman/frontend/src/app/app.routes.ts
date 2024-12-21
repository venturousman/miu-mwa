import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { inject, NgModule } from '@angular/core';
import { AuthGuard } from './core/guards/auth.guard';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { ProfileDashboardComponent } from './features/profile/profile-dashboard/profile-dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'about-us',
    loadComponent: () =>
      import('./features/about-us/about-us.component').then(
        (c) => c.AboutUsComponent,
      ),
  },
  {
    path: 's/:id',
    loadComponent: () =>
      import('./features/share/share.component').then((c) => c.ShareComponent),
  },
  {
    path: 'profile',
    component: ProfileDashboardComponent,
    loadChildren: () =>
      import('./features/profile/profile.routes').then((r) => r.profile_routes),
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      bindToComponentInputs: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
