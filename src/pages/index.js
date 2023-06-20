import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { WalletContext } from "@components/WalletProvider";

export default function Home() {
  const router = useRouter();
  const { address, connectToWallet } = useContext(WalletContext);
  useEffect(() => {
    if (address) {
      router.push("/mint-character");
    }
  }, [address]);
  return (
    <div className="container">
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
