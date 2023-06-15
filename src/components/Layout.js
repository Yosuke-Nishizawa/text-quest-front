import { WalletProvider } from "@components/WalletProvider";

export default function Layout({ children }) {
  return <WalletProvider>{children}</WalletProvider>;
}
