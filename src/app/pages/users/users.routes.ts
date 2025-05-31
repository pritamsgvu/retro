// users.routes.ts
import { Routes } from '@angular/router';
import { UserListComponent } from './user-list.component';

export const USER_ROUTES: Routes = [
  { path: '', component: UserListComponent },
];
