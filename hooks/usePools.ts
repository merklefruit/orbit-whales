import { useMemo } from "react";

import { getTopPools } from "../lib/getTopPools";
import { getPoolData } from "../lib/getPoolData";
import { getTickData } from "../lib/getTickData";

export const usePools = () => {
  const getUniPools = async () => {
    const queryBatchSize = 5;

    const topPoolsIds = await getTopPools();
    const topPoolsAddresses = topPoolsIds.map((pool: any) => pool.id);
    const topPoolsBatched = topPoolsAddresses.reduce(
      (acc: any, cur: any, i: any) => {
        if (i % queryBatchSize === 0) acc.push([]);
        acc[acc.length - 1].push(cur);
        return acc;
      },
      []
    );

    const poolDataPromises = topPoolsBatched.map((batch: any) =>
      getPoolData(batch)
    );
    const poolDataBatchedResponse = await Promise.all(poolDataPromises);
    const poolsData = [].concat(
      ...poolDataBatchedResponse.map((batch: any) => batch.pools)
    );

    const formattedPoolsData = poolsData.map((pool: any) => {
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
      };
    });

    return formattedPoolsData;
  };

  const getUniswapPoolLiquidity = async (
    poolAddress: any,
    minimumTick: any,
    maximumTick: any
  ) => {
    const poolData = await getTickData(poolAddress, minimumTick, maximumTick);

    return poolData.ticks;
  };

  return { getUniPools, getUniswapPoolLiquidity };
};
