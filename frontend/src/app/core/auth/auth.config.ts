import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';

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

export function initializeOAuth(oauthService: OAuthService, router: Router, permissionsService: NgxPermissionsService): () => Promise<void> {
  return () => {
    oauthService.setStorage(localStorage);
    oauthService.configure(authConfig);
    oauthService.setupAutomaticSilentRefresh();

    oauthService.events.subscribe(e => {
      console.log('OAuth Event:', e.type);
      if (e.type === 'token_received') {
        console.log('OAuth: Token received!');
        loadPermissions(oauthService, permissionsService);
      }
      if (e.type === 'token_error') {
        console.error('OAuth: Token error', e);
      }
      if (e.type === 'logout') {
        permissionsService.flushPermissions();
      }
    });

    return oauthService.loadDiscoveryDocumentAndTryLogin()
      .then(() => {
        if (oauthService.hasValidAccessToken()) {
          console.log('OAuth: Login success.');
          loadPermissions(oauthService, permissionsService);
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

function loadPermissions(oauthService: OAuthService, permissionsService: NgxPermissionsService) {
  const claims: any = oauthService.getIdentityClaims();
  if (claims) {
    // Keycloak realm roles
    const realmRoles = claims.realm_access?.roles || [];
    // Keycloak resource roles (if needed)
    // const resourceRoles = claims.resource_access?.['omnishop-frontend']?.roles || [];

    const roles = [...realmRoles];
    console.log('Loading permissions:', roles);
    permissionsService.loadPermissions(roles);
  }
}
