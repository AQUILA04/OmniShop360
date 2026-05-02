import { HttpInterceptorFn } from '@angular/common/http';

export const proxyInterceptor: HttpInterceptorFn = (req, next) => {
  // Les requêtes vers Keycloak (8080) doivent y aller directement pour que 
  // angular-oauth2-oidc gère correctement l'URL de l'issuer sans passer par localhost:4200
  return next(req);
};
