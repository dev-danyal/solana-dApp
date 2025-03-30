import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram } from "@solana/web3.js";

const network = "https://api.devnet.solana.com";
const connection = new Connection(network, "confirmed");

const SendToken = () => {
  const { publicKey, sendTransaction } = useWallet();
  const [recipient, setRecipient] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [txSignature, setTxSignature] = useState<string | null>(null);

  const sendSOL = async () => {
    if (!publicKey || !recipient || !amount) {
      alert("Please fill all fields and connect your wallet!");
      return;
    }

    try {
      const recipientPubKey = new PublicKey(recipient);
      const lamports = parseFloat(amount) * LAMPORTS_PER_SOL;

      const { blockhash } = await connection.getLatestBlockhash();

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubKey,
          lamports,
        })
      );

      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      const signature = await sendTransaction(transaction, connection);
      setTxSignature(signature);

      // Auto-close modal after 5 seconds
      setTimeout(() => setTxSignature(null), 5000);
    } catch (error) {
      alert("Transaction Failed: ");
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md mt-6 w-full max-w-2xl">
      <h2 className="text-xl font-semibold mb-2">Send SOL</h2>
      <input
        type="text"
        placeholder="Recipient Public Key"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        className="w-full p-2 text-black rounded-md mb-2"
      />
      <input
        type="number"
        placeholder="Amount to send"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 text-black rounded-md mb-2"
      />
      <button onClick={sendSOL} className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-400">
        Send SOL
      </button>

      {/* Modal Popup for Signature */}
      {txSignature && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-black">
            <h3 className="text-lg font-semibold mb-2">Transaction Successful!</h3>
            <p className="text-sm break-all">{txSignature}</p>
            <button
              onClick={() => navigator.clipboard.writeText(txSignature)}
              className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-md hover:bg-blue-400"
            >
              Copy Signature
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SendToken;
