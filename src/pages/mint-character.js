import { useContext, useState } from "react";
import { useRouter } from "next/router";
import { WalletContext } from "@components/WalletProvider";
import characterContract from "@contracts/TextQuestCharacter";
import { sleep } from "@utils/utils";
import Cookies from "js-cookie";

export default function mintCharacter() {
  const router = useRouter();
  const { getProvider } = useContext(WalletContext);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const message = `${name}、この世界で最強を目指してください。`;

  const mintNFT = async (event) => {
    event.preventDefault();
    const character = await characterContract(getProvider());
    setStatus("Minting...");
    const result = await character.safeMint(name);
    const status = result ? message : "Error minting NFT.";
    setStatus(status);
    if (result) {
      const mintTokenId = await character.getLastTokenId();
      Cookies.set("loginCharacterTokenId", mintTokenId.toString());
      await sleep(100);
      router.push("/items-shop");
    }
  };
  return (
    <div className="container">
      <main>
        <p>
          あなたをこの世界に召喚します。
          <br />
          名前を教えてください。
        </p>
        <form onSubmit={mintNFT}>
          <label htmlFor="name">Name:</label>
          <br />
          <input
            id="name"
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <br />

          <button type="submit">Mint NFT</button>
        </form>

        <p>{status}</p>
      </main>
    </div>
  );
}
