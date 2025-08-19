import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { ActualitesComponent } from './pages/actualites/actualites.component';
import { AgendaComponent } from './pages/agenda/agenda.component';
import { RessourcesComponent } from './pages/ressources/ressources.component';
import { MentionsLegalesComponent } from './pages/mentions-legales/mentions-legales.component';
import { CollectifComponent } from './pages/collectif/collectif.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthGuard } from '@core/guards/auth.guard';

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
            path: 'evenement',
            canActivate: [AuthGuard],
            children: [
              {
                path: '',
                loadComponent: () =>
                  import(
                    './admin/evenement-form/evenement-form.component'
                  ).then((m) => m.EvenementFormComponent),
              },
              {
                path: ':id',
                loadComponent: () =>
                  import(
                    './admin/evenement-form/evenement-form.component'
                  ).then((m) => m.EvenementFormComponent),
              },
            ],
          },
          {
            path: 'evenements',
            canActivate: [AuthGuard],
            loadComponent: () =>
              import('./admin/evenements/evenements.component').then(
                (m) => m.EvenementsComponent
              ),
          },
          {
            path: 'bibliotheque-images',
            canActivate: [AuthGuard],
            loadComponent: () =>
              import(
                './admin/bibliotheque-images/bibliotheque-images.component'
              ).then((m) => m.BibliothequeImagesComponent),
          },
        ],
      },
      { path: '**', redirectTo: 'erreur/404' },
    ],
  },
];
