import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  gql,
} from "@apollo/client";

// This is the Apollo graphQL client config object
const Client = () => {
  return new ApolloClient({
    link: createHttpLink({
      uri: "https://api.thegraph.com/subgraphs/name/riccardogalbusera/orbit-subgraph",
    }),
    cache: new InMemoryCache(),
  });
};

const GET_PROTOCOL_TVL = () => {
  const factory = "0x6B8Bc2BF3DCc979082E70D4A9D3854A1FF323dE7".toLowerCase();
  const queryString = `
  query protocolTVL {
    positionManagerFactory(id: "${factory}") {
      protocolTVL
    }
  }
  `;
  return queryString;
};

const GET_TOP_USERS = () => {
  const queryString = `
  query topUsers {
    positionManagers (orderBy: totalValueLocked orderDirection: desc)  {
      id,
      user,
      totalValueLocked
    }
  }
  `;
  return queryString;
};

const GET_TOP_POSITIONS = () => {
  const queryString = `
  query topPositions {
    positions (orderBy:marketValueUSD, orderDirection:desc) {
      id,
      poolName,
      marketValueUSD,
      tickLower,
      tickUpper,
      fee,
      positionManager {
        user
      }
    }
  }
  `;
  return queryString;
};

export const getProtocolTVL = async () => {
  return (await Client().query({ query: gql(GET_PROTOCOL_TVL()) })).data;
};

export const getTopUsers = async () => {
  return (await Client().query({ query: gql(GET_TOP_USERS()) })).data;
};

export const getTopPositions = async () => {
  return (await Client().query({ query: gql(GET_TOP_POSITIONS()) })).data;
};
