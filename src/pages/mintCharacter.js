import { useContext } from "react";
import { WalletContext } from "@components/WalletProvider";
export default function mintCharacter() {
  const { address, connectToWallet } = useContext(WalletContext);
  return (
    <div className="container">
      <main>
        <p>
          あなたをこの世界に召喚します。
          <br />
          名前を教えてください。
        </p>
      </main>
    </div>
  );
}
