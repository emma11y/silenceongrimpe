import { ReactiveFormsModule } from '@angular/forms';
import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  RouterModule,
  withComponentInputBinding,
} from '@angular/router';

import { routes } from './app.routes';
import {
  BrowserModule,
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
//import { provideAnimationsAsync } from '@node_modules/@angular/platform-browser/animations/async';
/*import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@node_modules/@angular/common/http';*/

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      BrowserModule,
      RouterModule.forRoot(routes),
      ReactiveFormsModule
    ),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(withEventReplay()),
  ],
};
