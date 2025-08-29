import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Server },
  { path: 'collectif', renderMode: RenderMode.Prerender },
  { path: 'contact', renderMode: RenderMode.Prerender },
  {
    path: 'ressources',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'mentions-legales',
    renderMode: RenderMode.Prerender,
  },

  { path: 'actualites', renderMode: RenderMode.Server },
  { path: 'actualites/:slug', renderMode: RenderMode.Server },
  { path: 'agenda', renderMode: RenderMode.Server },

  // Pages d’erreur
  { path: 'erreur', renderMode: RenderMode.Server },
  { path: 'erreur/401', renderMode: RenderMode.Server },
  { path: 'erreur/403', renderMode: RenderMode.Server },
  { path: 'erreur/404', renderMode: RenderMode.Server },

  // Routes admin en client
  { path: 'admin/:pathMatch(.*)*', renderMode: RenderMode.Client },

  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
