import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { WalletContext } from "@components/WalletProvider";

export default function Home() {
  const router = useRouter();
  const { address, connectToWallet } = useContext(WalletContext);
  useEffect(() => {
    if (address) {
      router.push("/mintCharacter");
    }
  }, [address]);
  return (
    <div className="container">
      <Head>
        <title>Next.js Starter!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <p>私達の世界に接続してください。</p>
        <div>
          <button onClick={connectToWallet}>Connect to the World</button>
        </div>
        <p>{address}</p>
      </main>
    </div>
  );
}
