import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { WalletContext } from "@components/WalletProvider";
import characterContract from "@contracts/TextQuestCharacter";
import goldContract from "@contracts/TextQuestGold";
import Cookies from "js-cookie";

export default function Battle() {
  const router = useRouter();
  const { getProvider } = useContext(WalletContext);
  const [tokens, setTokens] = useState([]);
  const [battleResult, setBattleResult] = useState({
    battleText: [],
    winner: "",
    gold: 0,
  });
  const loginCharacterTokenId = Cookies.get("loginCharacterTokenId");
  useEffect(() => {
    const fetchTokens = async () => {
      const character = await characterContract(getProvider());
      const totalSupply = await character.totalSupply();
      const newTokens = [];
      for (let i = 0; i < totalSupply; i++) {
        const metadata = await character.tokenURI(i);
        newTokens.push(metadata);
      }
      setTokens(newTokens);
    };
    fetchTokens();
  }, []);
  const onClickEnemy = async (enemyMetadata) => {
    const playerMetadata = tokens[parseInt(loginCharacterTokenId)];
    const response = await fetch("/api/battle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        player: { name: playerMetadata.name, items: playerMetadata.items },
        enemy: { name: enemyMetadata.name, items: enemyMetadata.items },
      }),
    });
    const result = await response.json();
    setBattleResult(result);
  };

  return (
    <main>
      <div className="h-1/2">
        <div className="grid grid-cols-3 gap-4 justify-items-center items-start h-full">
          {tokens
            .filter((token) => token.tokenId !== loginCharacterTokenId)
            .map((token, index) => (
              <div
                key={index}
                className="cursor-pointer w-full h-1/2"
                onClick={async () => await onClickEnemy(token)}
              >
                <img src={token.image} className="w-full h-full" />
              </div>
            ))}
        </div>
      </div>
      <BattleMessage battleResult={battleResult} />
    </main>
  );
}
function BattleMessage({ battleResult }) {
  if (battleResult.battleText.length === 0) return <></>;
  const [goldMintStatus, setGoldMintStatus] = useState("");
  const [showGetGoldButton, setShowGetGoldButton] = useState(true);
  const { getProvider } = useContext(WalletContext);
  useEffect(() => {
    setShowGetGoldButton(battleResult.winner === "player");
  }, [battleResult.winner]);
  const getGold = async () => {
    setShowGetGoldButton(false);
    setGoldMintStatus("獲得中。。。");
    const gold = await goldContract(getProvider());
    const character = await characterContract(getProvider());
    const loginCharacterTokenId = Cookies.get("loginCharacterTokenId");
    const inventoryAddress = await character.getCharacterInventory(
      loginCharacterTokenId
    );
    await gold.mint(inventoryAddress, battleResult.gold);
    setGoldMintStatus("獲得完了！");
  };
  return (
    <div className="h-1/2">
      {battleResult.battleText.map((text, index) => (
        <p key={index}>{text}</p>
      ))}
      <p>
        {battleResult.winner === "player"
          ? `勝利！！ ${battleResult.gold}G 獲得。`
          : "敗北"}
      </p>
      {showGetGoldButton ? (
        <button onClick={getGold}>賞金をもらう</button>
      ) : (
        <></>
      )}
      <p>{goldMintStatus}</p>
    </div>
  );
}
