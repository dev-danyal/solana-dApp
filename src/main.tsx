import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { Buffer } from "buffer";

const wallets = [new PhantomWalletAdapter(), new SolflareWalletAdapter()];

window.Buffer = Buffer; 

ReactDOM.createRoot(document.getElementById("root")!).render(
  <WalletProvider wallets={wallets} autoConnect>
    <WalletModalProvider>
      <App />
    </WalletModalProvider>
  </WalletProvider>
);


