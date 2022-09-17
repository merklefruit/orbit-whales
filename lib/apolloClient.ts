import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";

const Client = () => {
  return new ApolloClient({
    link: createHttpLink({
      uri: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-polygon',
    }),
    cache: new InMemoryCache(),
  })
}

export default Client
