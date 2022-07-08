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
      uri: "https://api.thegraph.com/subgraphs/name/fel-developers/orbit",
    }),
    cache: new InMemoryCache(),
  });
};

const GET_PROTOCOL_TVL = () => {
  const factory = "0xB4F9F129d59bD634Fa98d2759ee8c92E9F840802".toLowerCase();
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
      marketValueUSD
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
