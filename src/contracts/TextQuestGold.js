import { CONTRACT_ADDRESSES } from "@constants/system";
import abi from "@constants/abis/TextQuestGold";
import { useState } from "react";
import { Contract } from "ethers";

export default async (provider) => {
  const signer = await provider.getSigner();
  const contract = new Contract(CONTRACT_ADDRESSES.gold, abi, signer);
  const mint = async (address, amount) => {
    const bigAmount = BigInt(amount) * BigInt(10 ** 18);
    const tx = await contract.mint(address, bigAmount);
    await tx.wait();
  };
  return {
    contract,
    mint,
  };
};
