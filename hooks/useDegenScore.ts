import { getTopPositions } from "../lib/queries";
import { usePools } from "./usePools";

function compareDegen(a: any, b: any) {
  if (a.totalDegen > b.totalDegen) {
    return -1;
  }
  if (a.totalDegen < b.totalDegen) {
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

    top100Position.positions.map((t: any) => {
      let degenScore: any = { totalDegen: 0, poolName: t.poolName, id: t.id };
      const token0 = t.poolName.split("-")[0];
      const token1 = t.poolName.split("-")[1].split(":")[0];
      const fees = t.poolName.split("-")[1].split(":")[1];
      const poolFinded = topPools.findIndex(
        (tp: any) =>
          (tp.token0 == token0 &&
            tp.token1 == token1 &&
            (fees / 10000).toString() == tp.feeTier.toString()) ||
          (tp.token0 == token1 &&
            tp.token1 == token0 &&
            (fees / 10000).toString() == tp.feeTier.toString())
      );
      degenScore.degenTVL = poolFinded + 1; //max value 250 min value 1
      degenScore.totalDegen += degenScore.degenTVL;

      //another (max 5% of tvl) so max value is 5 * 250 = 1250 but i will assign a flat
      const valuePos: any = t.marketValueUSD;

      degenScore.degenPercTvl =
        (valuePos / topPools[poolFinded].tvl) * 100 * 20 > 5 && poolFinded > 100
          ? 500
          : (valuePos / topPools[poolFinded].tvl) * 100 * 20 * (poolFinded + 1);

      degenScore.totalDegen += degenScore.degenPercTvl;

      degenScoreArray.push(degenScore);
    });
    degenScoreArray.sort(compareDegen);
    return degenScoreArray;

    //sort degenScore of user by highest
  };

  return { getDegenScore };
};
