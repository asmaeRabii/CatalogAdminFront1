import { Routes } from '@angular/router';
import { AdminBookListComponent } from './components/admin-catalog/admin-book-list.component';


export const routes: Routes = [
  { path: 'books', component: AdminBookListComponent },

  { path: '', redirectTo: '/books', pathMatch: 'full' }
];
