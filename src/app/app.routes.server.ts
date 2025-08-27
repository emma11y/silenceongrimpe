import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
  /*  {
    path: 'actualites/:slug',
    renderMode: RenderMode.Server,
  },
  {
    path: 'actualites/:slug/apercu',
    renderMode: RenderMode.Server,
  },
  {
    path: 'admin/evenement/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'admin/actualite/:slug',
    renderMode: RenderMode.Server,
  },
  {
    path: 'image/:guid',
    renderMode: RenderMode.Server,
  },*/
];
