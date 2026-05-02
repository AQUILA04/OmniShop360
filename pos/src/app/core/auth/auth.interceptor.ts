import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { catchError, switchMap, throwError, from } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const injector = inject(Injector);
    
    // Break circular dependency by accessing storage directly
    const storedToken = localStorage.getItem('access_token');
    
    if (storedToken) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${storedToken}`
            }
        });
    }

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                console.warn('POS AuthInterceptor: 401 Unauthorized detected. Attempting to refresh token...');
                const oauthService = injector.get(OAuthService);

                // Prevent infinite loop if the refresh token endpoint itself returns 401
                if (req.url.includes('token') || req.url.includes('protocol/openid-connect')) {
                    oauthService.logOut();
                    return throwError(() => error);
                }

                // If no refresh token is stored, just logout
                if (!oauthService.getRefreshToken() && !localStorage.getItem('refresh_token')) {
                    console.error('POS AuthInterceptor: No refresh token available. Logging out.');
                    oauthService.logOut();
                    return throwError(() => error);
                }

                return from(oauthService.refreshToken()).pipe(
                    switchMap(() => {
                        console.log('POS AuthInterceptor: Token refreshed successfully. Retrying request...');
                        const newToken = oauthService.getAccessToken();
                        const clonedReq = req.clone({
                            setHeaders: {
                                Authorization: `Bearer ${newToken}`
                            }
                        });
                        return next(clonedReq);
                    }),
                    catchError((refreshErr) => {
                        console.error('POS AuthInterceptor: Token refresh failed. Logging out.', refreshErr);
                        oauthService.logOut();
                        return throwError(() => refreshErr);
                    })
                );
            }
            
            return throwError(() => error);
        })
    );
};
