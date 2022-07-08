import type { NextPage } from "next";
import { useAsyncMemo } from "use-async-memo";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { getProtocolTVL, getTopPositions, getTopUsers } from "../lib/queries";

const Home: NextPage = () => {
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

  return (
    <div className={styles.container}>
      <Head>
        <title>Orbit Whales</title>
        <meta name="description" content="Check out the top whales!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Orbit <a href="#">Whales</a>
        </h1>

        <div style={{ marginTop: "1rem" }}>
          TVL: {protocolTVL ?? "fetching..."}
        </div>

        <div style={{ marginTop: "1rem" }}>
          <h2 style={{ textAlign: "center" }}>Top 10 users</h2>
          {topUsers ? (
            <div>
              {topUsers.map((pm: any, idx: number) => (
                <div key={idx}>
                  {idx + 1} - {pm?.user} -{" "}
                  <b>$ {+(+pm?.totalValueLocked).toFixed(2)}</b>
                </div>
              ))}
            </div>
          ) : (
            "fetching..."
          )}
        </div>

        <div style={{ marginTop: "1rem" }}>
          <h2 style={{ textAlign: "center" }}>Top 10 positions</h2>
          {topPositions ? (
            <div>
              {topPositions.map((pos: any, idx: number) => (
                <div key={idx}>
                  {idx + 1} - {pos?.id} - {pos.poolName} -
                  <b>$ {+(+pos?.marketValueUSD).toFixed(2)}</b>
                </div>
              ))}
            </div>
          ) : (
            "fetching..."
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
