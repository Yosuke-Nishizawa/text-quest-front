import { CONTRACT_ADDRESSES } from "@constants/system";
import abi from "@constants/abis/TextQuestCharacter";
import { useState } from "react";
import { Contract } from "ethers";

export default async (provider) => {
  const signer = await provider.getSigner();
  const contract = new Contract(CONTRACT_ADDRESSES.character, abi, signer);
  const safeMint = async (name) => {
    try {
      const address = signer.getAddress();
      const tx = await contract.safeMint(address, name);
      await tx.wait();
      console.log("Token mint successful!");
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  const getLastTokenId = async () => {
    const address = signer.getAddress();
    const balance = await contract.balanceOf(address);
    return await contract.tokenOfOwnerByIndex(address, balance - 1n);
  };
  const tokenURI = async (tokenId) => {
    const jsonStr = await contract.tokenURI(parseInt(tokenId));
    return JSON.parse(jsonStr.replace("data:application/json,", ""));
  };
  const getCharacterInventory = async (tokenId) => {
    return await contract.getCharacterInventory(parseInt(tokenId));
  };
  const totalSupply = async () => {
    return await contract.totalSupply();
  };
  return {
    safeMint,
    getLastTokenId,
    tokenURI,
    getCharacterInventory,
    totalSupply,
  };
};
