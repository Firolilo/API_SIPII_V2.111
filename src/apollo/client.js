import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path }) => {
            console.error(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            );
        });
    }

    if (networkError) {
        console.error(`[Network error]: ${networkError}`);
        // You can show a notification here
    }
});

// HTTP link with retry logic
const httpLink = createHttpLink({
    uri: 'http://localhost:4000/graphql',
    credentials: 'same-origin'
});

// Create Apollo Client
const client = new ApolloClient({
    link: from([errorLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'network-only',
            errorPolicy: 'all',
        },
        query: {
            fetchPolicy: 'network-only',
            errorPolicy: 'all',
        },
        mutate: {

        },
    },
});

export default client;