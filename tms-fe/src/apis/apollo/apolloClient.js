import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { createHttpLink } from '@apollo/client/link/http';
import { createUploadLink } from 'apollo-upload-client'; // Nhập trực tiếp
import keycloak from 'service/keycloak/Keycloak';

// Hàm tạo Apollo Client với header xác thực
const createApolloClient = (uri) => {
    const httpLink = createHttpLink({
        uri
    });

    const uploadLink = createUploadLink({
        uri
    });

    const authLink = setContext((_, { headers }) => {
        return {
            headers: {
                ...headers,
                Authorization: keycloak?.token ? `Bearer ${keycloak?.token}` : ''
            }
        };
    });

    const combinedLink = ApolloLink.split(
        // Phân tách lưu lượng dựa trên loại hoạt động
        (operation) => {
            const definition = operation.query.definitions.find((def) => def.kind === 'OperationDefinition');
            return definition.operation === 'mutation'; // Sử dụng upload link cho mutations
        },
        uploadLink,
        httpLink
    );

    return new ApolloClient({
        link: authLink.concat(combinedLink),
        cache: new InMemoryCache()
    });
};

// eslint-disable-next-line no-undef
const serviceRepo = process.env.REACT_APP_SERVICE_REPO;
// eslint-disable-next-line no-undef
const serviceRun = process.env.REACT_APP_SERVICE_RUN;
// eslint-disable-next-line no-undef
const serviceStatistical = process.env.REACT_APP_SERVICE_STATISTICAL;
// eslint-disable-next-line no-undef
const serviceFile = process.env.REACT_APP_SERVICE_FILE;

// Tạo các Apollo Clients cho từng dịch vụ sử dụng hàm createApolloClient
export const clientRepo = createApolloClient(serviceRepo);
export const clientRun = createApolloClient(serviceRun);
export const clientStatistical = createApolloClient(serviceStatistical);
export const clientFile = createApolloClient(serviceFile); // Xuất clientFile đúng cách
