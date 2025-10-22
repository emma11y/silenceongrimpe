import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { RessourcesComponent } from './pages/ressources/ressources.component';
import { MentionsLegalesComponent } from './pages/mentions-legales/mentions-legales.component';
import { CollectifComponent } from './pages/collectif/collectif.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthGuard } from '@core/guards/auth.guard';
import { AgendaResolver } from '@core/resolvers/agenda.resolver';
import { PageContactComponent } from './pages/contact/contact.component';
import { ActualitesPublieesResolver } from '@core/resolvers/actualites-publiees.resolver';
import { ActualiteBySlugResolver } from '@core/resolvers/actualite-by-slug.resolver';
import { ErrorComponent } from './pages/error/error.component';
import { ActualitesALaUneResolver } from '@core/resolvers/actualites-a-la-une.resolver';

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
            data: {
              metadata: {
                title: 'Accueil',
                description: `"Silence, on grimpe !", c’est un collectif de bénévoles qui s’engagent pour la justice sociale et l’accessibilité culturelle. Nous militons pour des festivals de films sous-titrés, en accompagnant les événements, en sensibilisant le public et en conseillant les équipes de réalisation.`,
              },
            },
            resolve: {
              actualites: ActualitesALaUneResolver,
            },
            component: HomeComponent,
          },
          {
            path: 'collectif',
            data: {
              metadata: {
                title: 'Le collectif',
                description: `Retrouvez les informations sur le collectif "Silence, on grimpe !"`,
              },
            },
            component: CollectifComponent,
          },
          {
            path: 'actualites',
            children: [
              {
                path: '',
                pathMatch: 'full',
                data: {
                  metadata: {
                    title: 'Actualités',
                    description: `Retrouvez les actualités du collectif "Silence, on grimpe !"`,
                  },
                },
                resolve: {
                  actualites: ActualitesPublieesResolver,
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
            data: {
              metadata: {
                title: 'Agenda',
                description: `Retrouvez l'agenda des festivals des films de montagne mis en ligne par le collectif "Silence, on grimpe !"`,
              },
            },
            resolve: {
              items: AgendaResolver,
            },
            loadComponent: () =>
              import('./pages/agenda/agenda.component').then(
                (m) => m.AgendaComponent
              ),
          },
          {
            path: 'videos',
            data: {
              metadata: {
                title: 'Vidéos',
                description: `Retrouvez toutes les vidéos mis en ligne par le collectif "Silence, on grimpe !"`,
              },
            },
            loadComponent: () =>
              import('./pages/videos/videos.component').then(
                (m) => m.VideosComponent
              ),
          },
          {
            path: 'contact',
            data: {
              metadata: {
                title: 'Nous contacter',
                description: `Contacter le collectif "Silence, on grimpe !" via un formulaire de contact.`,
              },
            },
            component: PageContactComponent,
          },
          {
            path: 'ressources',
            data: {
              metadata: {
                title: 'Ressources',
                description: `Retrouvez toutes les ressources mises à disposition par le collectif "Silence, on grimpe !"`,
              },
            },
            component: RessourcesComponent,
          },
          {
            path: 'mentions-legales',
            data: {
              metadata: {
                title: 'Mentions légales',
                description: `Consultez les mentions légales du site "Silence, on grimpe !"`,
              },
            },
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
            data: {
              metadata: {
                title: 'Se connecter',
                robots: 'noindex, nofollow',
              },
            },
            loadComponent: () =>
              import('./admin/login/login.component').then(
                (m) => m.LoginComponent
              ),
          },
          {
            path: 'tableau-de-bord',
            data: {
              metadata: {
                title: 'Tableau de bord',
                robots: 'noindex, nofollow',
              },
            },
            canActivate: [AuthGuard],
            loadComponent: () =>
              import('./admin/tableau-de-bord/tableau-de-bord.component').then(
                (m) => m.TableauDeBordComponent
              ),
          },
          {
            path: 'import',
            canActivate: [AuthGuard],
            data: {
              metadata: {
                title: 'Importer les événéments',
                robots: 'noindex, nofollow',
              },
            },
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
                data: {
                  metadata: {
                    title: 'Créer un nouvel événément',
                    robots: 'noindex, nofollow',
                  },
                },
                loadComponent: () =>
                  import(
                    './admin/evenement-form/evenement-form.component'
                  ).then((m) => m.EvenementFormComponent),
              },
              {
                path: ':id',
                data: {
                  metadata: {
                    title: 'Modifier un événément',
                    robots: 'noindex, nofollow',
                  },
                },
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
            data: {
              metadata: {
                title: 'Liste des événéments',
                robots: 'noindex, nofollow',
              },
            },
            loadComponent: () =>
              import('./admin/evenements/evenements.component').then(
                (m) => m.EvenementsComponent
              ),
          },
          {
            path: 'bibliotheque-images',
            canActivate: [AuthGuard],
            data: {
              metadata: {
                title: 'Bibliothèque des images',
                robots: 'noindex, nofollow',
              },
            },
            loadComponent: () =>
              import(
                './admin/bibliotheque-images/bibliotheque-images.component'
              ).then((m) => m.BibliothequeImagesComponent),
          },
          {
            path: 'actualites',
            canActivate: [AuthGuard],
            data: {
              metadata: {
                title: 'Liste des actualités',
                robots: 'noindex, nofollow',
              },
            },
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
                data: {
                  metadata: {
                    title: 'Créer une nouvelle actualité',
                    robots: 'noindex, nofollow',
                  },
                },
                loadComponent: () =>
                  import(
                    './admin/actualite-form/actualite-form.component'
                  ).then((m) => m.ActualiteFormComponent),
              },
              {
                path: ':slug',
                data: {
                  metadata: {
                    title: "Modifier l'actualité",
                    robots: 'noindex, nofollow',
                  },
                },
                loadComponent: () =>
                  import(
                    './admin/actualite-form/actualite-form.component'
                  ).then((m) => m.ActualiteFormComponent),
              },
            ],
          },
        ],
      },
      { path: '**', redirectTo: 'erreur/404' },
    ],
  },
];
