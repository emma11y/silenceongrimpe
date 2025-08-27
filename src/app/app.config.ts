import { ReactiveFormsModule } from '@angular/forms';
import {
  ApplicationConfig,
  importProvidersFrom,
  LOCALE_ID,
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
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ImageInterceptor } from '@core/interceptors/image.interceptor';
//import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
/*import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';*/

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

registerLocaleData(localeFr);

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      BrowserModule,
      RouterModule.forRoot(routes, {
        scrollPositionRestoration: 'top',
      }),
      ReactiveFormsModule
    ),
    // { provide: HTTP_INTERCEPTORS, useClass: ImageInterceptor, multi: true },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(withEventReplay()),
    [{ provide: LOCALE_ID, useValue: 'fr-FR' }],
  ],
};
