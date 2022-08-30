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

const GET_TICK_DATA = (
  poolAddress: any,
  minimumTick: any,
  maximumTick: any
) => {
  const queryString = `
  {
    ticks(first: 1000, where: { 
        poolAddress: "${poolAddress.toLowerCase()}" , 
        tickIdx_gt: ${minimumTick}, 
        tickIdx_lt: ${maximumTick} 
      }, orderBy: tickIdx) {
      tickIdx
      liquidityNet
    }
  }`;

  return queryString;
};

export const getTickData = async (
  poolAddress: any,
  minimumTick: any,
  maximumTick: any
) => {
  return (
    await Client().query({
      query: gql(GET_TICK_DATA(poolAddress, minimumTick, maximumTick)),
    })
  ).data;
};
