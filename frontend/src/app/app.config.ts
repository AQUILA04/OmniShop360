import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { AuthConfig, provideOAuthClient } from 'angular-oauth2-oidc';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    provideOAuthClient(),
    {
      provide: AuthConfig,
      useValue: {
        issuer: 'http://localhost:8080/realms/omnishop360',
        redirectUri: window.location.origin + '/dashboard',
        clientId: 'omnishop-frontend',
        responseType: 'code',
        scope: 'openid profile email offline_access',
        showDebugInformation: true,
      }
    }
  ]
};
