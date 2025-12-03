export const environment = {
  production: true,
  apiUrl: '/api',
  keycloak: {
    issuer: '${KEYCLOAK_ISSUER}',
    clientId: 'omnishop-frontend',
    redirectUri: window.location.origin,
    scope: 'openid profile email',
    responseType: 'code',
    requireHttps: true,
    showDebugInformation: false
  }
};
