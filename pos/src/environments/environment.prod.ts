export const environment = {
  production: true,
  apiUrl: '/api',
  keycloak: {
    issuer: '${KEYCLOAK_ISSUER}',
    clientId: 'omnishop-pos',
    redirectUri: window.location.origin,
    scope: 'openid profile email',
    responseType: 'code',
    requireHttps: true,
    showDebugInformation: false
  },
  pos: {
    enableOfflineMode: true,
    syncInterval: 300000,
    maxCacheSize: 1000,
    enableBarcodeScan: true
  }
};
