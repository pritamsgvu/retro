// app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
 
  {
    path: '',
    loadChildren: () => import('./pages/login/login.routes').then(m => m.LOGIN_ROUTES)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.routes').then(m => m.LOGIN_ROUTES)
  },
  {
    path: 'users',
    loadChildren: () => import('./pages/users/users.routes').then(m => m.USER_ROUTES)
  },
 
  {
    path: 'leaves',
    loadChildren: () => import('./pages/leaves/leaves.routes').then(m => m.LEAVE_ROUTES)
  },
];
