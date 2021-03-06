import { resolvers, typeDefs } from './resolvers';
import gql from 'graphql-tag';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider } from '@apollo/react-hooks';
import React from 'react';
import ReactDOM from 'react-dom'; 
import Pages from './pages';
import injectStyles from './styles';
const cache = new InMemoryCache();
const link = new HttpLink({
  uri: 'http://localhost:4000/'
   headers: {
      authorization: localStorage.getItem('token'),
    }, 
});
const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  link,
   typeDefs,
  resolvers,
});
cache.writeData({
  data: {
    isLoggedIn: !!localStorage.getItem('token'),
    cartItems: [],
  },
});
client
  .query({
    query: gql`
      query GetLaunch {
        launch(id: 56) {
          id
          mission {
            name
          }
        }
      }
    `
  })
  .then(result => console.log(result));
  injectStyles();
ReactDOM.render(
  <ApolloProvider client={client}>
    <Pages />
  </ApolloProvider>, 
  document.getElementById('root')
);