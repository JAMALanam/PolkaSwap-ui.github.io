import React, { useEffect, useState } from "react";

const TOKEN_LIST_URL = "https://tokens.uniswap.org/";

export default function PolkaSwap() {
  const [tokens, setTokens] = useState([]);
  const [loadingTokens, setLoadingTokens] = useState(true);
  const [fromToken, setFromToken] = useState(null);
  const [toToken, setToToken] = useState(null);
  const [fromAmount, setFromAmount] = useState(0);
  const [toAmount, setToAmount] = useState(0);
  const [walletAddr, setWalletAddr] = useState(null);

  useEffect(() => {
    async function fetchTokens() {
      try {
        setLoadingTokens(true);
        const res = await fetch(TOKEN_LIST_URL);
        const json = await res.json();
        const list = json.tokens || [];
        setTokens(list);
        const defaultFrom = list.find((t) => t.symbol === "WETH") || list[0] || null;
        const defaultTo = list.find((t) => t.symbol === "USDC") || list[1] || null;
        setFromToken(defaultFrom);
        setToToken(defaultTo);
      } catch (e) {
        console.error("Failed to load token list", e);
      } finally {
        setLoadingTokens(false);
      }
    }
    fetchTokens();
  }, []);

  useEffect(() => {
    if (fromAmount === 0) setToAmount(0);
    else setToAmount((+fromAmount * 1).toFixed(6));
  }, [fromAmount]);

  function swapDirection() {
    const prevFrom = fromToken;
    const prevTo = toToken;
    setFromToken(prevTo);
    setToToken(prevFrom);
    const prevAmt = fromAmount;
    setFromAmount(toAmount);
    setToAmount(prevAmt);
  }

  function connectMock() {
    if (!walletAddr) setWalletAddr("0xABcD...1234");
    else setWalletAddr(null);
  }

  return (
    <div className="min-h-screen bg-black text-red-300 font-sans relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-black via-[#2b0202] to-black opacity-95"></div>

      <header className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" className="logo-glow">
              <circle cx="12" cy="12" r="11" stroke="rgba(255,0,0,0.12)" strokeWidth="1" />
              <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="12" fontWeight="700" fill="currentColor">P</text>
            </svg>
            <h1 className="text-4xl font-bold logo-gradient">PolkaSwap</h1>
          </div>
        </div>

        <div className="text-right">
          <button onClick={connectMock} className="px-4 py-2 border rounded-lg border-red-700 text-red-200 hover:bg-red-900/30 transition">
            {walletAddr ? walletAddr : "Connect Wallet"}
          </button>
          {walletAddr && (
            <div className="mt-2 text-sm text-red-400">
              <button className="block">Switch Wallet</button>
              <button className="block">Logout</button>
            </div>
          )}
        </div>
      </header>

      <div className="mx-12 h-0.5 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-80"></div>

      <main className="flex items-center justify-center mt-12 px-6">
        <div className="w-full max-w-md bg-[#0b0b0b] border border-red-900/40 rounded-xl p-8 shadow-2xl">
          <h2 className="text-center text-2xl mb-6 text-red-300">Swap</h2>

          <label className="block mb-3">
            <div className="text-sm text-red-400 mb-2">From</div>
            <div className="flex gap-2">
              <input
                type="number"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                className="flex-1 bg-transparent border border-red-800 rounded-lg px-4 py-2 outline-none"
                placeholder="0.0"
              />

              <select
                value={fromToken ? fromToken.address : ""}
                onChange={(e) => setFromToken(tokens.find((t) => t.address === e.target.value))}
                className="bg-red-900/10 border border-red-800 rounded-lg px-3 py-2">
                {loadingTokens ? <option>Loading...</option> : tokens.map((t) => (
                  <option key={t.address} value={t.address}>{t.symbol} — {t.name}</option>
                ))}
              </select>
            </div>
          </label>

          <div className="flex items-center justify-center my-4">
            <button onClick={swapDirection} className="p-2 rounded-full border border-red-800 hover:bg-red-900/30">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M7 7h10v4" stroke="#ff5555" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M17 17H7v-4" stroke="#ff5555" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <label className="block mb-3">
            <div className="text-sm text-red-400 mb-2">To</div>
            <div className="flex gap-2">
              <input type="text" readOnly value={toAmount} className="flex-1 bg-transparent border border-red-800 rounded-lg px-4 py-2 outline-none" placeholder="0.0" />

              <select
                value={toToken ? toToken.address : ""}
                onChange={(e) => setToToken(tokens.find((t) => t.address === e.target.value))}
                className="bg-red-900/10 border border-red-800 rounded-lg px-3 py-2">
                {loadingTokens ? <option>Loading...</option> : tokens.map((t) => (
                  <option key={t.address} value={t.address}>{t.symbol} — {t.name}</option>
                ))}
              </select>
            </div>
          </label>

          <div className="mt-6 text-center">
            <button className="w-full py-3 rounded-lg bg-gradient-to-r from-red-700 to-red-500 text-black font-bold">SWAP</button>
            <div className="mt-4 text-red-400">Fees: 0.02$</div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .logo-gradient {
          background: linear-gradient(90deg, #ff6b4d, #ff3a3a, #b30000);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: logoShift 4s linear infinite;
        }

        @keyframes logoShift {
          0% { filter: hue-rotate(0deg); }
          50% { filter: hue-rotate(-20deg) saturate(1.2); }
          100% { filter: hue-rotate(0deg); }
        }

        .logo-glow { color: #ff6b4d; filter: drop-shadow(0 6px 24px rgba(255,20,20,0.18)); }
      `}</style>
    </div>
  );
}
