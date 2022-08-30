import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  gql,
} from "@apollo/client";

const Client = () => {
  return new ApolloClient({
    link: createHttpLink({
      uri: "https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-polygon",
    }),
    cache: new InMemoryCache(),
  });
};

const GET_TOP_POOLS = () => {
  const queryString = `
  query topPools {
    pools(orderBy: totalValueLockedUSD, orderDirection: desc, subgraphError: allow, first: 250) {
      id
    }
  }
`;
  return queryString;
};

export const getTopPools = async () => {
  return (await Client().query({ query: gql(GET_TOP_POOLS()) })).data.pools;
};
