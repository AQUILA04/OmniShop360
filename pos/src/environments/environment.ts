export const environment = {
  production: false,
  apiUrl: 'http://localhost:8081/api',
  keycloak: {
    issuer: 'http://localhost:8080/realms/omnishop360',
    clientId: 'omnishop-pos',
    redirectUri: window.location.origin,
    scope: 'openid profile email',
    responseType: 'code',
    requireHttps: false,
    showDebugInformation: true
  },
  pos: {
    // POS-specific configurations for performance
    enableOfflineMode: true,
    syncInterval: 300000, // 5 minutes
    maxCacheSize: 1000,
    enableBarcodeScan: true
  }
};
