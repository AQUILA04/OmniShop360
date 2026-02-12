import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';

export const authGuard: CanActivateFn = (route, state) => {
    const oauthService = inject(OAuthService);
    const router = inject(Router);

    if (oauthService.hasValidAccessToken()) {
        return true;
    }

    // Allow login flow to complete or start login
    // Note: initializeOAuth usually handles the initial login flow.
    // This guard is for ensuring we don't access protected routes without token.

    // Attempt login
    oauthService.initLoginFlow();
    return false;
};
