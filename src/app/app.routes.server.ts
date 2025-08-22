import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'admin/evenement/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'admin/actualite/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'image/:guid',
    renderMode: RenderMode.Server,
  },
];
