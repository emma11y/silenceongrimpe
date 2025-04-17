import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { ActualitesComponent } from './pages/actualites/actualites.component';
import { AgendaComponent } from './pages/agenda/agenda.component';
import { RessourcesComponent } from './pages/ressources/ressources.component';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: HomeComponent,
      },
      {
        path: 'actualites',
        component: ActualitesComponent,
      },
      {
        path: 'agenda',
        component: AgendaComponent,
      },
      {
        path: 'ressources',
        component: RessourcesComponent,
      },
    ],
  },
];
