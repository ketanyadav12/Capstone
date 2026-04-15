import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { ShellComponent } from './shell/shell.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ModulePageComponent } from './pages/module-page/module-page.component';
import { MapDashboardComponent } from './pages/map-dashboard/map-dashboard.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'agriculture',
        component: ModulePageComponent,
        data: {
          moduleType: 'Agriculture'
        }
      },
      {
        path: 'health',
        component: ModulePageComponent,
        data: {
          moduleType: 'Health'
        }
      },
      {
        path: 'education',
        component: ModulePageComponent,
        data: {
          moduleType: 'Education'
        }
      },
      {
        path: 'water',
        component: ModulePageComponent,
        data: {
          moduleType: 'Water Resources'
        }
      },
      { path: 'map', component: MapDashboardComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];
