export const environment = {
  production: false,
  apiUrl: 'http://localhost:8081/api',
  keycloak: {
    issuer: 'http://localhost:8080/realms/omnishop360',
    clientId: 'omnishop-frontend',
    redirectUri: window.location.origin,
    scope: 'openid profile email',
    responseType: 'code',
    requireHttps: false,
    showDebugInformation: true
  }
};
