import { useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { WalletContext } from "@components/WalletProvider";
import characterContract from "@contracts/TextQuestCharacter";
import inventoryContract from "@contracts/TextQuestCharacterInventory";

export default function ItemsShop() {
  const { getProvider } = useContext(WalletContext);
  const [characterName, setCharacterName] = useState("");
  const [gold, setGold] = useState(0);
  const [itemName, setItemName] = useState("");
  const [messages, setMessages] = useState([]);
  const [loopBlocks, setLoopBlocks] = useState([]);
  const loginCharacterTokenId = Cookies.get("loginCharacterTokenId");
  const fetchTokenURI = async () => {
    const { tokenURI } = await characterContract(getProvider());
    const metadata = await tokenURI(loginCharacterTokenId);
    setCharacterName(metadata.name);
    setGold(metadata.gold);
  };
  const onNext = async () => {
    setLoopBlocks((items) => [
      ...items,
      <LoopBlock onNext={onNext} key={items.length} />,
    ]);
    await fetchTokenURI();
  };
  useEffect(() => {
    onNext();
  }, []);
  return (
    <div>
      <div>
        <p>マスター</p>
      </div>
      <div>
        <span>{characterName}</span>
        <span>{gold}G</span>
      </div>
      <div>
        <p>
          君は{characterName}と言うのかよろしく。
          <br />
          私はこの道具屋マスターだ。
        </p>
        <p>
          君は最強を目指すらしいじゃないか。
          <br />
          金さえあればどんなアイテムでも提供するよ。
        </p>
        {loopBlocks.map((loopBlock) => loopBlock)}
      </div>
    </div>
  );
}

function LoopBlock({ onNext }) {
  const [gold, setGold] = useState(null);
  const [itemName, setItemName] = useState("");
  const [showItemSubmit, setShowItemSubmit] = useState(true);
  const priceItem = async (event) => {
    event.preventDefault();
    setShowItemSubmit(false);
    const response = await fetch(
      `/api/price-item?${new URLSearchParams({ itemName })}`
    );
    if (response.ok) {
      const { price } = await response.json();
      setGold(price);
    } else {
      setGold(-1);
      onNext();
    }
  };
  return (
    <>
      <p>何が欲しい？</p>
      <form onSubmit={priceItem}>
        <input
          type="text"
          onChange={(e) => setItemName(e.target.value)}
          value={itemName}
        />
        {showItemSubmit ? <button type="submit">決定</button> : <></>}
      </form>
      <AfterPriceMessage itemName={itemName} gold={gold} onNext={onNext} />
    </>
  );
}

function AfterPriceMessage({ itemName, gold, onNext }) {
  if (gold === null) return <></>;
  if (gold === -1) return <p>{itemName}は売っていないよ。</p>;
  const [showSubmit, setShowSubmit] = useState(true);
  const [afterBuyMessage, setAfterBuyMessage] = useState("");
  const { getProvider } = useContext(WalletContext);
  const cancel = () => {
    setShowSubmit(false);
    onNext();
  };
  const buyItem = async () => {
    setShowSubmit(false);
    setAfterBuyMessage("ちょっと待ってろ");
    const provider = getProvider();
    const character = await characterContract(provider);
    const loginCharacterTokenId = Cookies.get("loginCharacterTokenId");
    const inventoryAddress = await character.getCharacterInventory(
      loginCharacterTokenId
    );
    const inventory = await inventoryContract(provider, inventoryAddress);
    try {
      await inventory.buyItem(itemName, gold);
      setAfterBuyMessage("毎度あり！");
    } catch (e) {
      console.log(e);
      setAfterBuyMessage("悪いが出直してきてくれ");
    }
    onNext();
  };
  return (
    <>
      <p>
        {itemName}は{gold}Gだよ。買っていくかい？
        {showSubmit ? (
          <button type="button" onClick={cancel}>
            買わない
          </button>
        ) : (
          <></>
        )}
        {showSubmit ? (
          <button type="button" onClick={buyItem}>
            買う
          </button>
        ) : (
          <></>
        )}
      </p>
      {afterBuyMessage ? <p>{afterBuyMessage}</p> : <></>}
    </>
  );
}
