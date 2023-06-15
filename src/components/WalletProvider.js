import { useEffect, useState, createContext } from "react";
import Web3Modal from "web3modal";
import { ethers, formatEther } from "ethers";
import { CHAIN_INFO } from "@constants/system";

const web3modalStorageKey = "WEB3_CONNECT_CACHED_PROVIDER";

export const WalletContext = createContext({});

export const WalletProvider = ({ children }) => {
  const [address, setAddress] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [networkId, setNetworkId] = useState(undefined);
  const [error, setError] = useState(false);
  const web3Modal =
    typeof window !== "undefined" && new Web3Modal({ cacheProvider: true });

  /* This effect will fetch wallet address if user has already connected his/her wallet */
  useEffect(() => {
    async function checkConnection() {
      try {
        if (window && window.ethereum) {
          // Check if web3modal wallet connection is available on storage
          if (localStorage.getItem(web3modalStorageKey)) {
            await connectToWallet();
          }
        } else {
          console.log("window or window.ethereum is not available");
        }
      } catch (error) {
        console.log(error, "Catch error Account is not connected");
      }
    }
    checkConnection().then();
  }, []);

  const setWalletAddress = async (provider) => {
    try {
      const signer = await provider.getSigner();
      if (signer) {
        const web3Address = await signer.getAddress();
        setAddress(web3Address);
        getBalance(provider, web3Address);
      }
    } catch (error) {
      console.log(
        error,
        "Account not connected; logged from setWalletAddress function"
      );
    }
  };

  const getSigner = () => {
    if (address === undefined) return undefined;
    const provider = getProvider();
    return provider?.getSigner();
  };

  const getProvider = () => {
    if (typeof window == "undefined") {
      return undefined;
    }
    return new ethers.BrowserProvider(window.ethereum);
  };

  const getBalance = async (provider, walletAddress) => {
    const walletBalance = await provider.getBalance(walletAddress);
    const balanceInEth = formatEther(walletBalance);
    setBalance(balanceInEth);
  };

  const disconnectWallet = () => {
    setAddress(undefined);
    web3Modal && web3Modal.clearCachedProvider();
  };

  const checkIfExtensionIsAvailable = () => {
    if (
      (window && window.web3 === undefined) ||
      (window && window.ethereum === undefined)
    ) {
      setError(true);
      web3Modal && web3Modal.toggleModal();
    }
  };

  const getNetworkId = async (provider) => {
    const network = await provider.getNetwork();
    const networkId = network.chainId;
    return "0x" + networkId;
  };
  const checkNetwork = async (provider) => {
    const networkId = await getNetworkId(provider);
    return networkId == CHAIN_INFO.chainId;
  };

  // const switchNetwork = async () => {
  //   await window.ethereum.request({
  //     method: "wallet_addEthereumChain",
  //     params: [CHAIN_INFO],
  //   });
  // };

  const connectToWallet = async () => {
    try {
      setLoading(true);
      checkIfExtensionIsAvailable();
      const connection = web3Modal && (await web3Modal.connect());
      const provider = new ethers.BrowserProvider(connection);
      await subscribeProvider(connection);
      const networkId = await getNetworkId(provider);
      setNetworkId(networkId);
      await setWalletAddress(provider);
    } catch (error) {
      console.log(
        error,
        "got this error on connectToWallet catch block while connecting the wallet"
      );
    } finally {
      setLoading(false);
    }
  };

  const checkIsTargetNetwork = () => {
    // walletに接続していなければtrue
    if (!address) return true;
    return networkId == CHAIN_INFO.chainId;
  };

  const subscribeProvider = async (connection) => {
    // close -> disconnect
    connection.on("disconnect", () => {
      disconnectWallet();
    });
    connection.on("accountsChanged", async (accounts) => {
      if (accounts?.length) {
        setAddress(accounts[0]);
        const provider = new ethers.BrowserProvider(connection);
        getBalance(provider, accounts[0]);
      } else {
        disconnectWallet();
      }
    });
    connection.on("chainChanged", async (chainId) => {
      console.log("chainChanged", chainId);
      try {
        if ("0x" + chainId == CHAIN_INFO.chainId) {
          return;
        }
        await connectToWallet();
      } catch (error) {
        console.log(error, "cancel switch network");
      }
    });
  };

  return (
    <WalletContext.Provider
      value={{
        address,
        balance,
        loading,
        error,
        connectToWallet,
        disconnectWallet,
        getProvider,
        getSigner,
        checkIsTargetNetwork,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
