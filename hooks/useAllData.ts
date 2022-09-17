/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";

import { getProtocolTVL, getTopPositions, getTopUsers } from "../lib/queries";
import { IDegenScore, ILoadDataParams, IPositionManagers, IPositions } from "../lib/types";
import { useDegenScore } from "./useDegenScore";

export const useAllData = () => {
  const { getDegenScore } = useDegenScore()

  const [loading, setLoading] = useState(true)
  const [tvl, setTvl] = useState<string | undefined>()
  const [topUsers, setTopUsers] = useState<IPositionManagers>()
  const [degenScores, setDegenScores] = useState<IDegenScore[]>()
  const [topPositions, setTopPositions] = useState<IPositions>()
  const [usersCount, setUsersCount] = useState<number | undefined>()

  const [isShowingAllUsers, setIsShowingAllUsers] = useState(false)
  const [isShowingAllPositions, setIsShowingAllPositions] = useState(false)

  const loadData = useCallback(async (params: ILoadDataParams) => {
    setLoading(true)

    if (params.resetAll) {
      setTvl(undefined)
      setTopUsers(undefined)
      setDegenScores(undefined)
      setTopPositions(undefined)
      setUsersCount(undefined)
    }

    const [topUsers, topPositions, protocolTVL, degenScorePos] = await Promise.all([
      getTopUsers(),
      getTopPositions(),
      getProtocolTVL(),
      getDegenScore(),
    ])

    setTvl(`$ ${+(+protocolTVL?.positionManagerFactory?.protocolTVL).toFixed(2)}`)
    setTopUsers(
      params.showAllUsers ? topUsers.positionManagers : topUsers.positionManagers?.slice(0, 10)
    )
    setTopPositions(
      params.showAllPositions ? topPositions.positions : topPositions.positions?.slice(0, 10)
    )
    setDegenScores(degenScorePos)
    setUsersCount(topUsers.positionManagers?.length)

    setIsShowingAllPositions(!!params.showAllPositions)
    setIsShowingAllUsers(!!params.showAllUsers)

    setLoading(false)
  }, [])

  useEffect(() => {
    loadData({ showAllUsers: false, showAllPositions: false, resetAll: true })
  }, [])

  return {
    tvl,
    topUsers,
    degenScores,
    topPositions,
    usersCount,
    loadData,
    loading,
    isShowingAllUsers,
    isShowingAllPositions,
  }
}
