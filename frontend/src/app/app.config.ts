import { ApplicationConfig, APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideOAuthClient, OAuthService } from 'angular-oauth2-oidc';
import { provideToastr } from 'ngx-toastr';
import { NgxPermissionsModule, NgxPermissionsService } from 'ngx-permissions';

import { routes } from './app.routes';
import { authInterceptor } from './core/auth/auth.interceptor';
import { proxyInterceptor } from './core/auth/proxy.interceptor';
import { initializeOAuth } from './core/auth/auth.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([proxyInterceptor, authInterceptor])
    ),
    provideOAuthClient(),
    provideToastr({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    importProvidersFrom(NgxPermissionsModule.forRoot()),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeOAuth,
      deps: [OAuthService, Router, NgxPermissionsService], // Ajout de NgxPermissionsService ici
      multi: true
    }
  ]
};
