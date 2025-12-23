import { HttpInterceptorFn } from '@angular/common/http';

export const proxyInterceptor: HttpInterceptorFn = (req, next) => {
  // Si la requête vise Keycloak (port 8080), on la redirige vers le proxy (URL relative)
  if (req.url.startsWith('http://localhost:8080/realms')) {
    const newUrl = req.url.replace('http://localhost:8080', '');
    console.log('ProxyInterceptor: Rewriting URL', req.url, 'to', newUrl);
    const newReq = req.clone({ url: newUrl });
    return next(newReq);
  }
  return next(req);
};
