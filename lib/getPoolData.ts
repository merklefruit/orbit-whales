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

const GET_POOL_DATA = (pools: any) => {
  let poolString = `[`;
  pools.map((address: any) => {
    return (poolString += `"${address}",`);
  });
  poolString += "]";

  const queryString = `
    query pools {
      pools(where: {id_in: ${poolString}}, 
        orderBy: totalValueLockedUSD, orderDirection: desc, subgraphError: allow) {
          id
          feeTier
          liquidity
          sqrtPrice
          tick
          token0 {
              id
              symbol 
              name
              decimals
              derivedETH
          }
          token1 {
              id
              symbol 
              name
              decimals
              derivedETH
          }
          token0Price
          token1Price
          volumeUSD
          txCount
          totalValueLockedToken0
          totalValueLockedToken1
          totalValueLockedUSD
        }
      }
`;
  return queryString;
};

export const getPoolData = async (pools: any) => {
  return (await Client().query({ query: gql(GET_POOL_DATA(pools)) })).data;
};
