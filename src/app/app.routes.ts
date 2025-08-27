import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { RessourcesComponent } from './pages/ressources/ressources.component';
import { MentionsLegalesComponent } from './pages/mentions-legales/mentions-legales.component';
import { CollectifComponent } from './pages/collectif/collectif.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthGuard } from '@core/guards/auth.guard';
import { AgendaResolver } from '@core/resolvers/agenda.resolver';
import { ImageComponent } from '@shared/components/image/image.component';
import { ActualitesComponent } from './pages/actualites/actualites.component';
import { PageContactComponent } from './pages/contact/contact.component';

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
            //component: ActualitesComponent,
            children: [
              {
                path: '',
                pathMatch: 'full',
                loadComponent: () =>
                  import('./pages/actualites/actualites.component').then(
                    (m) => m.ActualitesComponent
                  ),
              },
              {
                path: ':slug',
                loadComponent: () =>
                  import(
                    './pages/actualites/actualite/actualite.component'
                  ).then((m) => m.ActualiteComponent),
              },
              {
                path: ':slug/apercu',
                canActivate: [AuthGuard],
                loadComponent: () =>
                  import(
                    './pages/actualites/actualite/actualite.component'
                  ).then((m) => m.ActualiteComponent),
              },
            ],
          },
          {
            path: 'agenda',
            resolve: {
              items: AgendaResolver,
            },
            loadComponent: () =>
              import('./pages/agenda/agenda.component').then(
                (m) => m.AgendaComponent
              ),
          },
          { path: 'contact', component: PageContactComponent },
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
          {
            path: 'actualites',
            canActivate: [AuthGuard],
            loadComponent: () =>
              import('./admin/actualites/actualites.component').then(
                (m) => m.ActualitesComponent
              ),
          },
          {
            path: 'actualite',
            canActivate: [AuthGuard],

            children: [
              {
                path: '',
                loadComponent: () =>
                  import(
                    './admin/actualite-form/actualite-form.component'
                  ).then((m) => m.ActualiteFormComponent),
              },
              {
                path: ':slug',
                loadComponent: () =>
                  import(
                    './admin/actualite-form/actualite-form.component'
                  ).then((m) => m.ActualiteFormComponent),
              },
            ],
          },
        ],
      },
      {
        path: 'image/:guid',
        component: ImageComponent,
      },
      { path: '**', redirectTo: 'erreur/404' },
    ],
  },
];
