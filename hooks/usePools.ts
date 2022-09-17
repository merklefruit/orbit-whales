import { getPoolData, getTickData, getTopPools } from "../lib/queries";

export const usePools = () => {
  const getUniPools = async () => {
    const queryBatchSize = 5

    const topPoolsIds = await getTopPools()
    const topPoolsAddresses = topPoolsIds.pools.map((pool) => pool.id)
    const topPoolsBatched = topPoolsAddresses.reduce((acc: string[][], cur: string, i: number) => {
      if (i % queryBatchSize === 0) acc.push([])
      acc[acc.length - 1].push(cur)
      return acc
    }, [])

    const poolDataPromises = topPoolsBatched.map((batch) => getPoolData(batch))
    const poolDataBatchedResponse = await Promise.all(poolDataPromises)
    const poolsData = poolDataBatchedResponse.map((batch) => batch.pools).flat()

    const formattedPoolsData = poolsData.map((pool) => {
      return {
        token0: pool.token0.symbol,
        token0Address: pool.token0.id,
        token0Decimals: Number(pool.token0.decimals),
        token1: pool.token1.symbol,
        token1Address: pool.token1.id,
        token1Decimals: Number(pool.token1.decimals),
        feeTier: pool.feeTier / 10000,
        tick: Number(pool.tick),
        tvl: +Number(pool.totalValueLockedUSD).toFixed(2),
        volume: +Number(pool.volumeUSD).toFixed(2),
        poolAddress: pool.id,
      }
    })

    return formattedPoolsData
  }

  const getUniswapPoolLiquidity = async (
    poolAddress: string,
    minimumTick: number,
    maximumTick: number
  ) => {
    const poolData = await getTickData({ poolAddress, minimumTick, maximumTick })

    return poolData.ticks
  }

  return { getUniPools, getUniswapPoolLiquidity }
}
