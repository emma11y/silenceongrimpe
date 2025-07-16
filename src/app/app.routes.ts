import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { ActualitesComponent } from './pages/actualites/actualites.component';
import { AgendaComponent } from './pages/agenda/agenda.component';
import { RessourcesComponent } from './pages/ressources/ressources.component';
import { MentionsLegalesComponent } from './pages/mentions-legales/mentions-legales.component';
import { CollectifComponent } from './pages/collectif/collectif.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthGuard } from '@core/services/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    children: [
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
            path: 'collectif',
            component: CollectifComponent,
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
          {
            path: 'mentions-legales',
            component: MentionsLegalesComponent,
          },
        ],
      },
      {
        path: 'admin',
        component: AdminLayoutComponent,
        children: [
          {
            path: '',
            redirectTo: 'login',
            pathMatch: 'full',
          },
          {
            path: 'login',
            loadComponent: () =>
              import('./admin/login/login.component').then(
                (m) => m.LoginComponent
              ),
          },
          {
            path: 'tableau-de-bord',
            canActivate: [AuthGuard],
            loadComponent: () =>
              import('./admin/tableau-de-bord/tableau-de-bord.component').then(
                (m) => m.TableauDeBordComponent
              ),
          },
          {
            path: 'import',
            canActivate: [AuthGuard],
            loadComponent: () =>
              import('./admin/import/import.component').then(
                (m) => m.ImportComponent
              ),
          },
          {
            path: 'formulaire',
            canActivate: [AuthGuard],
            loadComponent: () =>
              import('./admin/formulaire/formulaire.component').then(
                (m) => m.FormulaireComponent
              ),
          },
          {
            path: 'liste',
            canActivate: [AuthGuard],
            loadComponent: () =>
              import('./admin/liste/liste.component').then(
                (m) => m.ListeComponent
              ),
          },
        ],
      },
      { path: '**', redirectTo: 'erreur/404' },
    ],
  },
];
