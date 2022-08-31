import Head from "next/head";
import type { NextPage } from "next";
import { useAsyncMemo } from "use-async-memo";
import { getProtocolTVL, getTopPositions, getTopUsers } from "../lib/queries";
import { useDegenScore } from "../hooks/useDegenScore";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const { getDegenScore } = useDegenScore();
  const protocolTVL = useAsyncMemo(async () => {
    const res = await getProtocolTVL();
    return `$ ${+(+res?.positionManagerFactory?.protocolTVL).toFixed(2)}`;
  }, []);

  const topUsers = useAsyncMemo(async () => {
    const res = await getTopUsers();
    return res?.positionManagers?.slice(0, 10);
  }, []);

  const topPositions = useAsyncMemo(async () => {
    const res = await getTopPositions();
    return res?.positions?.slice(0, 10);
  }, []);

  const degenScorePos: any = useAsyncMemo(async () => {
    const res = await getDegenScore();
    return res.slice(0, 10);
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Orbit Whales</title>
        <meta name="description" content="Check out the top whales!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {protocolTVL && topUsers && topPositions && degenScorePos ? (
        <main className={styles.main}>
          <h1 className={styles.title}>
            Orbit{" "}
            <a
              href="https://development.orbitdefi.finance/"
              target="_blank"
              rel="noreferrer noopener"
            >
              Whales
            </a>
          </h1>

          <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
            <h2 style={{ fontWeight: "700", fontSize: "1.4rem" }}>
              TVL: {protocolTVL} USD
            </h2>
          </div>

          <div
            className="cont"
            style={{
              display: "grid",
              placeContent: "center",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.5rem",
            }}
          >
            <div>
              <div
                style={{
                  position: "relative",
                  borderRadius: "0.6rem",
                  border: "solid black 2px",
                  padding: "1rem",
                }}
              >
                <h2
                  style={{
                    position: "absolute",
                    top: "-1.8rem",
                    left: "2rem",
                    fontSize: "1.2rem",
                    backgroundColor: "white",
                    padding: "0 0.3rem 0 0.1rem",
                  }}
                >
                  Top 10 users
                </h2>
                <div style={{ width: "650px", paddingTop: "0.5rem" }}>
                  {topUsers.map((pm: any, idx: number) => (
                    <a
                      key={idx}
                      href={`https://polygonscan.com/address/${pm.user}`}
                      className="position-link"
                      rel="noreferrer noopener"
                      target="_blank"
                      style={{
                        textAlign: "left",
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "1.5rem",
                        border: "1px solid lightgray",
                        borderRadius: "0.5rem",
                        padding: "0.5rem",
                        marginBottom: "0.5rem",
                        transition: "all 0.2s ease-in-out",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "start",
                          gap: "1.5rem",
                        }}
                      >
                        <span>
                          <span style={{ fontWeight: "700" }}>RANK: </span>
                          {idx + 1}
                        </span>
                        <span>
                          <span style={{ fontWeight: "700" }}>USER: </span>
                          {pm.user.slice(0, 6)}...{pm.user.slice(-6)}
                        </span>
                      </div>
                      <span style={{ width: "160px" }}>
                        <span style={{ fontWeight: "700" }}>VALUE: </span> ${" "}
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
                  position: "relative",
                  borderRadius: "0.6rem",
                  border: "solid black 2px",
                  padding: "1rem",
                }}
              >
                <h2
                  style={{
                    position: "absolute",
                    top: "-1.8rem",
                    left: "2rem",
                    fontSize: "1.2rem",
                    backgroundColor: "white",
                    padding: "0 0.3rem 0 0.1rem",
                  }}
                >
                  Top 10 positions
                </h2>
                <div style={{ width: "650px", paddingTop: "0.5rem" }}>
                  {topPositions.map((pos: any, idx: number) => (
                    <a
                      key={idx}
                      href={`https://app.uniswap.org/#/pool/${pos?.id}?chain=polygon`}
                      className="position-link"
                      rel="noreferrer noopener"
                      target="_blank"
                      style={{
                        textAlign: "left",
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "1.5rem",
                        border: "1px solid lightgray",
                        borderRadius: "0.5rem",
                        padding: "0.5rem",
                        marginBottom: "0.5rem",
                        transition: "all 0.2s ease-in-out",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "start",
                          gap: "1.5rem",
                        }}
                      >
                        <span>
                          <span style={{ fontWeight: "700" }}>RANK: </span>
                          {idx + 1}
                        </span>
                        <span>
                          <span style={{ fontWeight: "700" }}>ID: </span>{" "}
                          {pos?.id}
                        </span>
                        <span>
                          <span style={{ fontWeight: "700" }}>POOL: </span>{" "}
                          {pos.poolName}
                        </span>
                      </div>
                      <span style={{ width: "160px" }}>
                        <span style={{ fontWeight: "700" }}>VALUE: </span> ${" "}
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
                  borderRadius: "0.6rem",
                  border: "solid black 2px",
                  padding: "1rem",
                  position: "relative",
                }}
              >
                <h2
                  style={{
                    position: "absolute",
                    top: "-1.8rem",
                    left: "2rem",
                    fontSize: "1.2rem",
                    backgroundColor: "white",
                    padding: "0 0.3rem 0 0.1rem",
                  }}
                >
                  Top 10 degens
                </h2>

                <div style={{ width: "650px", paddingTop: "0.5rem" }}>
                  {degenScorePos.map((_: any, idx: number) => (
                    <a
                      key={idx}
                      href={`https://polygonscan.com/address/${degenScorePos[idx].user}`}
                      className="position-link"
                      rel="noreferrer noopener"
                      target="_blank"
                      style={{
                        textAlign: "left",
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "1.5rem",
                        border: "1px solid lightgray",
                        borderRadius: "0.5rem",
                        padding: "0.5rem",
                        marginBottom: "0.5rem",
                        transition: "all 0.2s ease-in-out",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "start",
                          gap: "1.5rem",
                        }}
                      >
                        <span>
                          <span style={{ fontWeight: "700" }}>RANK: </span>
                          {idx + 1}
                        </span>
                        <span>
                          <span style={{ fontWeight: "700" }}>USER: </span>
                          {degenScorePos[idx].user.slice(0, 6)}...
                          {degenScorePos[idx].user.slice(-6)}
                        </span>
                      </div>
                      <span style={{ width: "190px" }}>
                        <span style={{ fontWeight: "700" }}>DEGEN SCORE: </span>{" "}
                        {degenScorePos[idx].totalDegen.toFixed(3)}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      ) : (
        <main className={styles.main}>
          <h1 className={styles.title}>Fetching...</h1>
        </main>
      )}
    </div>
  );
};

export default Home;
