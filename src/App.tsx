import { useState } from "react";
import { useWallet, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Connection, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";
import { useEffect, FC, useMemo } from "react";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import SendToken from "./SendToken"; // Import SendToken component
import "@solana/wallet-adapter-react-ui/styles.css";
import "./index.css"; // Tailwind styles

const network = clusterApiUrl("devnet");
const connection = new Connection(network);

const App: FC = () => {
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number>(0);
  const [airdropAmount, setAirdropAmount] = useState<string>("");

  useEffect(() => {
    if (publicKey) {
      connection.getBalance(publicKey).then((bal) => setBalance(bal / LAMPORTS_PER_SOL));
    }
  }, [publicKey]);

  const requestAirdrop = async () => {
    if (!publicKey || !airdropAmount) return alert("Enter an amount & connect wallet!");
    const lamports = parseFloat(airdropAmount) * LAMPORTS_PER_SOL;
    try {
      const tx = await connection.requestAirdrop(publicKey, lamports);
      alert(`Airdrop requested! Tx: ${tx}`);
    } catch (error) {
      alert("Airdrop failed: " + error);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Solana DApp</h1>
      <WalletMultiButton className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500" />

      {publicKey && (
        <div className="bg-gray-800 rounded-lg p-4 mt-4 w-full max-w-2xl">
          <p className="text-lg">Wallet: <span className="font-semibold text-green-400">{publicKey.toBase58()}</span></p>
          <p className="text-lg">Balance: <span className="font-semibold">{balance} SOL</span></p>
        </div>
      )}

      {/* Airdrop Section */}
      {publicKey && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mt-6 w-full max-w-2xl">
          <h2 className="text-xl font-semibold mb-2">Airdrop SOL</h2>
          <input
            type="number"
            placeholder="Enter amount (e.g., 1, 1.5, 2.5)"
            value={airdropAmount}
            onChange={(e) => setAirdropAmount(e.target.value)}
            className="w-full p-2 text-black rounded-md mb-2"
          />
          <button onClick={requestAirdrop} className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-400">
            Request Airdrop
          </button>
        </div>
      )}

      {/* Send SOL Section */}
      {publicKey && <SendToken />}
    </div>
  );
};

// Wallet Provider Setup
const WalletApp: FC = () => {
  const wallets = useMemo(() => [new SolflareWalletAdapter()], []);
  return (
    <WalletProvider wallets={wallets} autoConnect>
      <WalletModalProvider>
        <App />
      </WalletModalProvider>
    </WalletProvider>
  );
};

export default WalletApp;