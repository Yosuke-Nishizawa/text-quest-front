import { CONTRACT_ADDRESSES } from "@constants/system";
import abi from "@constants/abis/TextQuestItemShop";
import { useState } from "react";
import { Contract } from "ethers";

export default async (provider) => {
  const signer = await provider.getSigner();
  const contract = new Contract(CONTRACT_ADDRESSES.itemShop, abi, signer);
  return {
    contract,
  };
};
