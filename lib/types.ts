export type ITickArgs = {
  poolAddress: string
  minimumTick: number
  maximumTick: number
}

export type IDegenScore = {
  totalDegen: number
  poolName: string
  id: string | number
  user: string
  degenTVL?: number
  degenPercTVL?: number
}

export type IGetTopPositionsQuery = {
  positions: IPositions
}

export type IPositions = {
  id: string
  poolName: string
  marketValueUSD: number
  tickLower: number
  tickUpper: number
  fee: number
  positionManager: {
    user: string
  }
}[]

export type IGetTopUsersQuery = {
  positionManagers: IPositionManagers
}

export type IPositionManagers = {
  id: string
  user: string
  totalValueLocked: number
}[]

export type IGetTopPoolsQuery = {
  pools: {
    id: string
  }[]
}

export type IGetTickDataQuery = {
  ticks: {
    tickIdx: number
    liquidityNet: number
  }[]
}

export type IGetPoolDataQuery = {
  pools: {
    id: string
    token0: {
      id: string
      symbol: string
      decimals: number
      derivedETH: number
      name: string
    }
    token1: {
      id: string
      symbol: string
      decimals: number
      derivedETH: number
      name: string
    }
    feeTier: number
    tick: number
    totalValueLockedUSD: number
    volumeUSD: number
    liquidity: number
    token0Price: number
    token1Price: number
    txCount: number
    totalValueLockedToken0: number
    totalValueLockedToken1: number
  }[]
}

export type IGetProtocolTvlQuery = {
  positionManagerFactory: {
    protocolTVL: number
  }
}

export type ILoadDataParams = {
  resetAll?: boolean
  showAllUsers?: boolean
  showAllPositions?: boolean
}
