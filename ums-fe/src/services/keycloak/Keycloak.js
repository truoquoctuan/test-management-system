import Keycloak from 'keycloak-js';

// Tạo một instance của Keycloak
const keycloak = new Keycloak({
  url: process.env.REACT_APP_API_URL_KEYCLOAK,
  realm: 'BZC',
  clientId: 'bzc-service',
});

export default keycloak;
