import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../services/authentication/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./common/common.component').then(c => c.CommonComponent),
    canActivate: [AuthGuard],
    children: [

      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'users/permission',
        loadChildren: () => import('./users/permission/permission.module').then(m => m.PermissionModule)
      },
      {
        path: 'users/role-permission',
        loadChildren: () => import('./users/role-permission/role-permission.module').then(m => m.RolePermissionModule)
      },
      {
        path: 'config/country',
        loadChildren: () => import('./system-config/country/country.module').then(m => m.CountryModule)
      },





      {
        path: 'user-profile',
        loadChildren: () => import('./user-profile/user-profile.module').then(m => m.UserProfileModule)
      },

      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
