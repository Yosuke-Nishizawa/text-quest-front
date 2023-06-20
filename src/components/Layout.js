import Head from "next/head";
import Link from "next/link";
import { WalletProvider } from "@components/WalletProvider";

export default function Layout({ children }) {
  return (
    <WalletProvider>
      <Head>
        <title>Text Quest</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="py-4 bg-black text-white">
        <nav className="flex justify-around">
          <Link href="/mint-character">
            <a className="hover:underline">キャラクター召喚</a>
          </Link>
          <Link href="/items-shop">
            <a className="hover:underline">道具屋</a>
          </Link>
          <Link href="/battle">
            <a className="hover:underline">バトル</a>
          </Link>
        </nav>
      </header>
      <main>{children}</main>
    </WalletProvider>
  );
}
