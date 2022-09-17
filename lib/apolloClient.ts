import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";

export const UniswapClient = () => {
  return new ApolloClient({
    link: createHttpLink({
      uri: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-polygon',
    }),
    cache: new InMemoryCache(),
  })
}

export const OrbitClient = () => {
  return new ApolloClient({
    link: createHttpLink({
      uri: 'https://api.thegraph.com/subgraphs/name/riccardogalbusera/orbit-subgraph',
    }),
    cache: new InMemoryCache(),
  })
}
