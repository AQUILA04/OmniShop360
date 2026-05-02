import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { environment } from '../../../environments/environment';

export const authConfig: AuthConfig = {
    issuer: environment.keycloak.issuer,
    redirectUri: environment.keycloak.redirectUri,
    clientId: environment.keycloak.clientId,
    responseType: environment.keycloak.responseType,
    scope: environment.keycloak.scope,
    showDebugInformation: environment.keycloak.showDebugInformation,
    requireHttps: environment.keycloak.requireHttps,
    strictDiscoveryDocumentValidation: false
};

export function initializeOAuth(oauthService: OAuthService): () => Promise<void> {
    return () => {
        oauthService.setStorage(localStorage);
        oauthService.configure(authConfig);
        oauthService.setupAutomaticSilentRefresh();

        return oauthService.loadDiscoveryDocumentAndTryLogin()
            .then(() => {
                if (oauthService.hasValidAccessToken()) {
                    console.log('POS: OAuth Login success');
                } else {
                    console.log('POS: No valid token, starting login flow');
                    oauthService.initLoginFlow();
                }
            })
            .catch(err => console.error('POS: OAuth Init Error', err));
    };
}
