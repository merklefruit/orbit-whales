import { ApolloClient, createHttpLink, gql, InMemoryCache } from "@apollo/client";

import Client from "./apolloClient";
import { PM_FACTORY_ADDRESS } from "./constants";
import {
    IGetPoolDataQuery, IGetProtocolTvlQuery, IGetTickDataQuery, IGetTopPoolsQuery,
    IGetTopPositionsQuery, IGetTopUsersQuery, ITickArgs
} from "./types";

const GET_PROTOCOL_TVL = () => {
  const factory = PM_FACTORY_ADDRESS.toLowerCase()

  const queryString = `
  query protocolTVL {
    positionManagerFactory(id: "${factory}") {
      protocolTVL
    }
  }
  `
  return queryString
}

const GET_TOP_USERS = () => {
  const queryString = `
  query topUsers {
    positionManagers (orderBy: totalValueLocked orderDirection: desc)  {
      id,
      user,
      totalValueLocked
    }
  }
  `
  return queryString
}

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
  `
  return queryString
}

const GET_TOP_POOLS = () => {
  const queryString = `
  query topPools {
    pools(orderBy: totalValueLockedUSD, orderDirection: desc, subgraphError: allow, first: 250) {
      id
    }
  }
`
  return queryString
}

const GET_TICK_DATA = (args: ITickArgs) => {
  const queryString = `
  {
    ticks(first: 1000, where: { 
        poolAddress: "${args.poolAddress.toLowerCase()}" , 
        tickIdx_gt: ${args.minimumTick}, 
        tickIdx_lt: ${args.maximumTick} 
      }, orderBy: tickIdx) {
      tickIdx
      liquidityNet
    }
  }`

  return queryString
}

const GET_POOL_DATA = (pools: string[]) => {
  let poolString = `[`
  pools.map((address) => {
    return (poolString += `"${address}",`)
  })
  poolString += ']'

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
`
  return queryString
}

export const getPoolData = async (pools: string[]) => {
  return (await Client().query({ query: gql(GET_POOL_DATA(pools)) })).data as IGetPoolDataQuery
}

export const getTickData = async (args: ITickArgs) => {
  return (await Client().query({ query: gql(GET_TICK_DATA(args)) })).data as IGetTickDataQuery
}

export const getTopPools = async () => {
  return (await Client().query({ query: gql(GET_TOP_POOLS()) })).data as IGetTopPoolsQuery
}

export const getProtocolTVL = async () => {
  return (await Client().query({ query: gql(GET_PROTOCOL_TVL()) })).data as IGetProtocolTvlQuery
}

export const getTopUsers = async () => {
  return (await Client().query({ query: gql(GET_TOP_USERS()) })).data as IGetTopUsersQuery
}

export const getTopPositions = async () => {
  return (await Client().query({ query: gql(GET_TOP_POSITIONS()) })).data as IGetTopPositionsQuery
}
