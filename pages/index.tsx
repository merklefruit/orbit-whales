import { useAsyncMemo } from "use-async-memo";

import { Title } from "@mantine/core";

import { useDegenScore } from "../hooks/useDegenScore";
import { getProtocolTVL, getTopPositions, getTopUsers } from "../lib/queries";

import type { NextPage } from 'next'
const Home: NextPage = () => {
  const { getDegenScore } = useDegenScore()

  const protocolTVL = useAsyncMemo(async () => {
    const res = await getProtocolTVL()
    return `$ ${+(+res?.positionManagerFactory?.protocolTVL).toFixed(2)}`
  }, [])

  const topUsers = useAsyncMemo(async () => {
    const res = await getTopUsers()
    return res?.positionManagers
  }, [])

  const topPositions = useAsyncMemo(async () => {
    const res = await getTopPositions()
    return res?.positions
  }, [])

  const degenScorePos = useAsyncMemo(async () => {
    const res = await getDegenScore()
    return res
  }, [])

  return (
    <div>
      {protocolTVL && topUsers && topPositions && degenScorePos ? (
        <main>
          <Title order={1}>
            Orbit{' '}
            <a
              href="https://development.orbitdefi.finance/"
              target="_blank"
              rel="noreferrer noopener"
            >
              Whales
            </a>
          </Title>

          <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
            <h2 style={{ fontWeight: '700', fontSize: '1.4rem' }}>TVL: {protocolTVL} USD</h2>
          </div>

          <div
            className="cont"
            style={{
              display: 'grid',
              placeContent: 'center',
              gridTemplateColumns: '1fr 1fr',
              gap: '1.5rem',
            }}
          >
            <div>
              <div
                style={{
                  position: 'relative',
                  borderRadius: '0.6rem',
                  border: 'solid black 2px',
                  padding: '1rem',
                }}
              >
                <h2
                  style={{
                    position: 'absolute',
                    top: '-1.8rem',
                    left: '2rem',
                    fontSize: '1.2rem',
                    backgroundColor: 'white',
                    padding: '0 0.3rem 0 0.1rem',
                  }}
                >
                  Top 10 users
                </h2>
                <div style={{ width: '650px', paddingTop: '0.5rem' }}>
                  {topUsers.map((pm, idx) => (
                    <a
                      key={idx}
                      href={`https://polygonscan.com/address/${pm.user}`}
                      className="position-link"
                      rel="noreferrer noopener"
                      target="_blank"
                      style={{
                        textAlign: 'left',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1.5rem',
                        border: '1px solid lightgray',
                        borderRadius: '0.5rem',
                        padding: '0.5rem',
                        marginBottom: '0.5rem',
                        transition: 'all 0.2s ease-in-out',
                        cursor: 'pointer',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'start',
                          gap: '1.5rem',
                        }}
                      >
                        <span>
                          <span style={{ fontWeight: '700' }}>RANK: </span>
                          {idx + 1}
                        </span>
                        <span>
                          <span style={{ fontWeight: '700' }}>USER: </span>
                          {pm.user.slice(0, 6)}...{pm.user.slice(-6)}
                        </span>
                      </div>
                      <span style={{ width: '160px' }}>
                        <span style={{ fontWeight: '700' }}>VALUE: </span> ${' '}
                        {Number(pm.totalValueLocked).toFixed(2)}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div
                style={{
                  position: 'relative',
                  borderRadius: '0.6rem',
                  border: 'solid black 2px',
                  padding: '1rem',
                }}
              >
                <h2
                  style={{
                    position: 'absolute',
                    top: '-1.8rem',
                    left: '2rem',
                    fontSize: '1.2rem',
                    backgroundColor: 'white',
                    padding: '0 0.3rem 0 0.1rem',
                  }}
                >
                  Top 10 positions
                </h2>
                <div style={{ width: '650px', paddingTop: '0.5rem' }}>
                  {topPositions.map((pos, idx) => (
                    <a
                      key={idx}
                      href={`https://app.uniswap.org/#/pool/${pos?.id}?chain=polygon`}
                      className="position-link"
                      rel="noreferrer noopener"
                      target="_blank"
                      style={{
                        textAlign: 'left',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1.5rem',
                        border: '1px solid lightgray',
                        borderRadius: '0.5rem',
                        padding: '0.5rem',
                        marginBottom: '0.5rem',
                        transition: 'all 0.2s ease-in-out',
                        cursor: 'pointer',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'start',
                          gap: '1.5rem',
                        }}
                      >
                        <span>
                          <span style={{ fontWeight: '700' }}>RANK: </span>
                          {idx + 1}
                        </span>
                        <span>
                          <span style={{ fontWeight: '700' }}>ID: </span> {pos?.id}
                        </span>
                        <span>
                          <span style={{ fontWeight: '700' }}>POOL: </span> {pos.poolName}
                        </span>
                      </div>
                      <span style={{ width: '160px' }}>
                        <span style={{ fontWeight: '700' }}>VALUE: </span> ${' '}
                        {+(+pos?.marketValueUSD).toFixed(2)}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div
                style={{
                  borderRadius: '0.6rem',
                  border: 'solid black 2px',
                  padding: '1rem',
                  position: 'relative',
                }}
              >
                <h2
                  style={{
                    position: 'absolute',
                    top: '-1.8rem',
                    left: '2rem',
                    fontSize: '1.2rem',
                    backgroundColor: 'white',
                    padding: '0 0.3rem 0 0.1rem',
                  }}
                >
                  Top 10 degens
                </h2>

                <div style={{ width: '650px', paddingTop: '0.5rem' }}>
                  {degenScorePos.map((degenScore, idx) => (
                    <a
                      key={idx}
                      href={`https://polygonscan.com/address/${degenScore.user}`}
                      className="position-link"
                      rel="noreferrer noopener"
                      target="_blank"
                      style={{
                        textAlign: 'left',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1.5rem',
                        border: '1px solid lightgray',
                        borderRadius: '0.5rem',
                        padding: '0.5rem',
                        marginBottom: '0.5rem',
                        transition: 'all 0.2s ease-in-out',
                        cursor: 'pointer',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'start',
                          gap: '1.5rem',
                        }}
                      >
                        <span>
                          <span style={{ fontWeight: '700' }}>RANK: </span>
                          {idx + 1}
                        </span>
                        <span>
                          <span style={{ fontWeight: '700' }}>USER: </span>
                          {degenScore.user.slice(0, 6)}...
                          {degenScore.user.slice(-6)}
                        </span>
                      </div>
                      <span style={{ width: '190px' }}>
                        <span style={{ fontWeight: '700' }}>DEGEN SCORE: </span>{' '}
                        {degenScore.totalDegen.toFixed(3)}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      ) : (
        <main>
          <h1>Fetching data...</h1>
        </main>
      )}
    </div>
  )
}

export default Home
