import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';

export const authConfig: AuthConfig = {
  issuer: 'http://localhost:8080/realms/omnishop360',
  redirectUri: window.location.origin + '/',
  clientId: 'omnishop-frontend',
  responseType: 'code',
  scope: 'openid profile email',
  showDebugInformation: true,
  requireHttps: false,
  disableAtHashCheck: true,
  strictDiscoveryDocumentValidation: false
};

export function initializeOAuth(oauthService: OAuthService, router: Router): () => Promise<void> {
  return () => {
    oauthService.setStorage(localStorage);
    oauthService.configure(authConfig);
    oauthService.setupAutomaticSilentRefresh();

    oauthService.events.subscribe(e => {
      console.log('OAuth Event:', e.type);
      if (e.type === 'token_received') {
        console.log('OAuth: Token received!');
      }
      if (e.type === 'token_error') {
        console.error('OAuth: Token error', e);
      }
    });

    return oauthService.loadDiscoveryDocumentAndTryLogin()
      .then(() => {
        if (oauthService.hasValidAccessToken()) {
          console.log('OAuth: Login success.');
          // Redirection vers le dashboard si on est à la racine
          if (router.url === '/' || router.url === '/index.html') {
             router.navigate(['/dashboard']);
          }
        } else {
          console.log('OAuth: No valid token found. Starting login flow if needed...');
        }
        return Promise.resolve();
      })
      .catch(err => {
        console.error('OAuth: Error during initialization', err);
        return Promise.resolve();
      });
  };
}
