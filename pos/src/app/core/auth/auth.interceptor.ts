import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    // Break circular dependency by accessing storage directly
    // OAuthService uses HttpClient -> AuthInterceptor -> OAuthService -> Loop
    // Debug: check storage
    const storedToken = localStorage.getItem('access_token');
    console.log('POS AuthInterceptor: Checking for token. Found:', !!storedToken);

    if (storedToken) {
        console.log('POS AuthInterceptor: Adding Bearer token');
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${storedToken}`
            }
        });
    } else {
        console.warn('POS AuthInterceptor: No token found in localStorage!');
    }

    return next(req);
};
