import Keycloak from 'keycloak-js';

// Tạo một instance của Keycloak
const keycloak = new Keycloak({
    // url: 'http://localhost:5673',
    url: 'http://keycloak:8080',
    realm: 'BZC',
    clientId: 'bzq-service'
});

export default keycloak;
