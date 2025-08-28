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
import { PageContactComponent } from './pages/contact/contact.component';
import { ActualitesResolver } from '@core/resolvers/actualites.resolver';
import { ActualiteBySlugResolver } from '@core/resolvers/actualite-by-slug.resolver';
import { ErrorComponent } from './pages/error/error.component';

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
                resolve: {
                  actualites: ActualitesResolver,
                },
                loadComponent: () =>
                  import('./pages/actualites/actualites.component').then(
                    (m) => m.ActualitesComponent
                  ),
              },
              {
                path: ':slug',
                resolve: {
                  actualite: ActualiteBySlugResolver,
                },
                loadComponent: () =>
                  import(
                    './pages/actualites/actualite/actualite.component'
                  ).then((m) => m.ActualiteComponent),
              },
              {
                path: ':slug/apercu',
                canActivate: [AuthGuard],
                resolve: {
                  actualite: ActualiteBySlugResolver,
                },
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
          {
            path: 'erreur',
            data: {
              breadcumb: 'Erreur',
            },
            children: [
              {
                path: '',
                component: ErrorComponent,
              },
              {
                path: '401',
                component: ErrorComponent,
                data: {
                  breadcrumb: 'Erreur 401',
                },
              },
              {
                path: '403',
                component: ErrorComponent,
                data: {
                  breadcrumb: 'Erreur 403',
                },
              },
              {
                path: '404',
                component: ErrorComponent,
                data: {
                  breadcrumb: 'Erreur 404',
                },
              },
            ],
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
