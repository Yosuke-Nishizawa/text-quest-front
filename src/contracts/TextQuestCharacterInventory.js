import abi from "@constants/abis/TextQuestCharacterInventory";
import { useState } from "react";
import { Contract } from "ethers";
import TextQuestItemShop from "@contracts/TextQuestItemShop";
import TextQuestGold from "@contracts/TextQuestGold";
import { CONTRACT_ADDRESSES } from "@constants/system";

export default async (provider, inventoryAddress) => {
  const signer = await provider.getSigner();
  const contract = new Contract(inventoryAddress, abi, signer);
  const buyItem = async (itemName, price) => {
    const bigPrice = BigInt(price) * BigInt(10 ** 18);
    const { contract: goldContract } = await TextQuestGold(provider);
    const approveData = goldContract.interface.encodeFunctionData("approve", [
      CONTRACT_ADDRESSES.itemShop,
      bigPrice,
    ]);
    const approveTx = await contract.executeCall(
      CONTRACT_ADDRESSES.gold,
      0,
      approveData
    );
    await approveTx.wait();
    const { contract: itemShopContract } = await TextQuestItemShop(provider);
    const buyItemData = itemShopContract.interface.encodeFunctionData(
      "buyItem",
      [itemName, bigPrice]
    );
    const buyItemTx = await contract.executeCall(
      CONTRACT_ADDRESSES.itemShop,
      0,
      buyItemData
    );
    await buyItemTx.wait();
  };
  return {
    buyItem,
  };
};
