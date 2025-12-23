import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const oauthService = inject(OAuthService);
  const token = oauthService.getAccessToken();

  if (!token) {
    console.warn('AuthInterceptor: No token found in OAuthService');
    // Debug: check storage directly
    console.log('LocalStorage access_token:', localStorage.getItem('access_token'));
    console.log('SessionStorage access_token:', sessionStorage.getItem('access_token'));
  }

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
