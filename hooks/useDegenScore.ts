import { getTopPositions } from "../lib/queries";
import { usePools } from "./usePools";

function compareDegen(a: any, b: any, key: any) {
  if (a[key] > b[key]) {
    return -1;
  }
  if (a[key] < b[key]) {
    return 1;
  }
  return 0;
}

export const useDegenScore = () => {
  const getDegenScore = async () => {
    const { getUniPools } = usePools();
    let degenScoreArray: any = [];
    const top100Position = await getTopPositions();

    const topPools = await getUniPools();
    //calc score of how much low is tvl on that pool in the first 100 position

    top100Position.positions.map((t100: any) => {
      let degenScore: any = {
        totalDegen: 0,
        poolName: t100.poolName,
        id: t100.id,
        user: t100.positionManager.user,
      };
      const token0 = t100.poolName.split("-")[0];
      const token1 = t100.poolName.split("-")[1].split(":")[0];
      const fees = t100.poolName.split("-")[1].split(":")[1];
      const poolFinded = topPools.findIndex(
        (tpool: any) =>
          (tpool.token0 == token0 &&
            tpool.token1 == token1 &&
            (fees / 10000).toString() == tpool.feeTier.toString()) ||
          (tpool.token0 == token1 &&
            tpool.token1 == token0 &&
            (fees / 10000).toString() == tpool.feeTier.toString())
      );

      degenScore.degenTVL = Math.ceil((poolFinded + 1) / 10); //max value 25 min value 1
      degenScore.totalDegen += poolFinded >= 0 ? degenScore.degenTVL : 25;

      //another (max 5% of tvl) so max value is 5 * 250 = 1250 but i will assign a flat
      const valuePos: any = t100.marketValueUSD;

      degenScore.degenPercTvl =
        (((valuePos / topPools[poolFinded].tvl) * 10000) /
          (Math.abs(t100.tickUpper - t100.tickLower) / 100 / 2)) *
          2 >
        20
          ? 20
          : (((valuePos / topPools[poolFinded].tvl) * 100000) /
              (Math.abs(t100.tickUpper - t100.tickLower) / 100 / 2)) *
            2;

      degenScore.totalDegen += degenScore.degenPercTvl;

      degenScoreArray.push(degenScore);
    });
    degenScoreArray.sort((a: any, b: any) => compareDegen(a, b, "totalDegen"));

    let addressAlreadyFinded: any = {};
    degenScoreArray = degenScoreArray.filter((val: any) => {
      if (addressAlreadyFinded[val.user]) null;
      else {
        addressAlreadyFinded[val.user] = true;
        return val;
      }
    });

    return degenScoreArray;

    //sort degenScore of user by highest
  };

  return { getDegenScore };
};
