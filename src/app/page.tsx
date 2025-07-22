import CryptoHub from "@/components/cryptoHub";
import CTASection from "@/components/ctaSection";
import FeaturesSection from "@/components/featureSection";
import Footer from "@/components/footer";
import HeroSection from "@/components/hero";
// import Navigation from "@/components/navigation";
// import { useState } from "react";

// Custom colors from the sample
const COLORS = {
  bg: "#0a0f1a",
  card: "rgba(16,20,26,0.85)",
  accent: "#b6ff3b",
  accent2: "#00ffb0",
  text: "#f1f5f9",
  muted: "#94a3b8",
  border: "#23272f",
};

// const markets = [
//   { name: "BTC > $70k by Dec 2024", odds: "2.5x" },
//   { name: "ETH > $5k by Dec 2024", odds: "3.1x" },
//   { name: "SOL > $500 by Dec 2024", odds: "4.2x" },
// ];

function GridOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 bg-gradient-hero"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    />
  );
}

// function MockSimulation() {
//   const [walletConnected, setWalletConnected] = useState(false);
//   const [selectedMarket, setSelectedMarket] = useState(markets[0].name);
//   const [amount, setAmount] = useState(100);
//   const [result, setResult] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   function handleConnect() {
//     setWalletConnected(true);
//   }

//   function handleSimulate() {
//     setLoading(true);
//     setTimeout(() => {
//       const win = Math.random() > 0.5;
//       setResult(
//         win
//           ? `🎉 You won! Payout: $${(amount * 2.5).toFixed(2)}`
//           : "😢 You lost your stake. Try again!"
//       );
//       setLoading(false);
//     }, 1200);
//   }

//   return (
//     <div
//       className="rounded-2xl p-8 shadow-xl max-w-md w-full mx-auto mt-8"
//       style={{
//         background: COLORS.card,
//         border: `1.5px solid ${COLORS.border}`,
//         backdropFilter: "blur(8px)",
//       }}
//     >
//       <h3 className="text-2xl font-bold mb-4" style={{ color: COLORS.accent }}>
//         Simulate a Trade
//       </h3>
//       {!walletConnected ? (
//         <button
//           onClick={handleConnect}
//           className="w-full py-2 rounded bg-[#b6ff3b] text-[#0a0f1a] font-semibold text-lg hover:bg-[#caff4d] transition mb-2 shadow-lg"
//         >
//           Connect Wallet (Mock)
//         </button>
//       ) : (
//         <>
//           <label className="block mb-2 font-medium">Select Market</label>
//           <select
//             className="w-full p-2 rounded bg-[#10141a] border border-[#23272f] mb-4 text-[#f1f5f9]"
//             value={selectedMarket}
//             onChange={e => setSelectedMarket(e.target.value)}
//           >
//             {markets.map(m => (
//               <option key={m.name} value={m.name}>
//                 {m.name} ({m.odds})
//               </option>
//             ))}
//           </select>
//           <label className="block mb-2 font-medium">Stake Amount ($)</label>
//           <input
//             type="number"
//             min={1}
//             className="w-full p-2 rounded bg-[#10141a] border border-[#23272f] mb-4 text-[#f1f5f9]"
//             value={amount}
//             onChange={e => setAmount(Number(e.target.value))}
//           />
//           <button
//             onClick={handleSimulate}
//             disabled={loading}
//             className="w-full py-2 rounded bg-[#b6ff3b] text-[#0a0f1a] font-semibold text-lg hover:bg-[#caff4d] transition mb-2 shadow-lg disabled:opacity-60"
//           >
//             {loading ? "Simulating..." : "Simulate Trade"}
//           </button>
//           {result && <div className="mt-4 text-lg text-center">{result}</div>}
//         </>
//       )}
//     </div>
//   );
// }

export default function Home() {
  return (
    <main
      className="relative min-h-screen text-[#f1f5f9] font-sans overflow-x-hidden"
      style={{ background: COLORS.bg }}
    >
      <GridOverlay />
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-6 z-10 relative">
        <div className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
          <span className="w-6 h-6 bg-[#b6ff3b] rounded grid place-items-center font-black text-[#0a0f1a]">P</span>
          <span>Prediction Market</span>
        </div>
        <nav className="hidden md:flex gap-8 text-[#b6ff3b] font-medium">
          <a href="#features" className="hover:underline">Features</a>
          <a href="#how" className="hover:underline">How it works</a>
          <a href="#simulate" className="hover:underline">Simulate</a>
        </nav>
        <div className="flex gap-4">
          <button className="px-6 py-2 rounded bg-transparent border border-[#b6ff3b] text-[#b6ff3b] font-bold hover:bg-[#b6ff3b] hover:text-[#0a0f1a] transition">Login</button>
          <button className="px-6 py-2 rounded bg-[#b6ff3b] text-[#0a0f1a] font-bold shadow-lg hover:bg-[#caff4d] transition">Sign up</button>
        </div>
      </header>

      {/* Hero Section */}


      {/* <Navigation /> */}
      <HeroSection />
      <FeaturesSection />
      <CryptoHub />
      <CTASection />
      <Footer />

    </main>
  );
}
