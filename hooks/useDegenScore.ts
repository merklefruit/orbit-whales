import { getTopPositions } from "../lib/queries";
import { IDegenScore } from "../lib/types";
import { usePools } from "./usePools";

function compareDegens(a: IDegenScore, b: IDegenScore, key: keyof IDegenScore) {
  const first = a[key]
  const second = b[key]

  if (typeof first === 'undefined' || typeof second === 'undefined') return 0
  if (first > second) return -1
  else if (second < first) return 1
  else return 0
}

export const useDegenScore = () => {
  const { getUniPools } = usePools()

  const getDegenScore = async () => {
    let degenScoreArray: IDegenScore[] = []

    const top100Position = await getTopPositions()
    const topPools = await getUniPools()

    //calc score of how much low is tvl on that pool in the first 100 position
    top100Position.positions.map((t100) => {
      let degenScore: IDegenScore = {
        totalDegen: 0,
        poolName: t100.poolName,
        id: t100.id,
        user: t100.positionManager.user,
      }

      const token0 = t100.poolName.split('-')[0]
      const token1 = t100.poolName.split('-')[1].split(':')[0]
      const fees = parseInt(t100.poolName.split('-')[1].split(':')[1])
      const poolFound = topPools.findIndex(
        (tpool) =>
          (tpool.token0 === token0 && tpool.token1 === token1 && fees / 10000 === tpool.feeTier) ||
          (tpool.token0 === token1 && tpool.token1 === token0 && fees / 10000 === tpool.feeTier)
      )

      //max value 25, min value 1
      degenScore.degenTVL = Math.ceil((poolFound + 1) / 10)
      degenScore.totalDegen += poolFound >= 0 ? degenScore.degenTVL : 25

      //another (max 5% of tvl) so max value is 5 * 250 = 1250 but i will assign a flat
      const valuePos = t100.marketValueUSD

      degenScore.degenPercTVL =
        (((valuePos / topPools[poolFound].tvl) * 10000) /
          (Math.abs(t100.tickUpper - t100.tickLower) / 100 / 2)) *
          2 >
        20
          ? 20
          : (((valuePos / topPools[poolFound].tvl) * 100000) /
              (Math.abs(t100.tickUpper - t100.tickLower) / 100 / 2)) *
            2

      degenScore.totalDegen += degenScore.degenPercTVL

      degenScoreArray.push(degenScore)
    })
    degenScoreArray.sort((a, b) => compareDegens(a, b, 'totalDegen'))

    let addressAlreadyFound: { [address: string]: boolean | null } = {}
    degenScoreArray = degenScoreArray.filter((val) => {
      if (addressAlreadyFound[val.user]) null
      else {
        addressAlreadyFound[val.user] = true
        return val
      }
    })

    return degenScoreArray
  }

  return { getDegenScore }
}
