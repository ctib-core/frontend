"use client";
import React from "react";


// Mock data for widgets
const stakingData = [
  {
    name: "Ethereum (ETH)",
    icon: "Ξ",
    rate: 18.74,
    change: 6.29,
    chart: [4, 5, 6, 7, 6, 8, 7],
    color: "bg-lime-400",
    reward: true,
  },
  {
    name: "Tron (TRX)",
    icon: "T",
    rate: 6.28,
    change: -1.01,
    chart: [2, 3, 2, 4, 3, 2, 3],
    color: "bg-pink-400",
    reward: false,
  },
  {
    name: "Polygon (POL)",
    icon: "P",
    rate: 24.56,
    change: 7.54,
    chart: [3, 4, 5, 6, 5, 7, 6],
    color: "bg-yellow-400",
    reward: true,
  },
];

const topAssets = [
  {
    rank: 1,
    name: "Bitcoin",
    symbol: "BTC",
    price: "$84,333.10",
    change: 2.45,
    marketCap: "$2,271,802,053,097",
    volume: "$48,629,094,996",
    chart: [7, 8, 7, 9, 8, 10, 9],
    color: "bg-yellow-400",
  },
  {
    rank: 2,
    name: "Ethereum",
    symbol: "ETH",
    price: "$5,333.10",
    change: 4.15,
    marketCap: "$591,889,123,274",
    volume: "$30,629,094,996",
    chart: [5, 6, 5, 7, 6, 8, 7],
    color: "bg-lime-400",
  },
];

function StakingCard({ data }: { data: typeof stakingData[0] }) {
  return (
    <div className="bg-[#005f73] rounded-xl p-5 flex flex-col gap-2 shadow border border-gray-800 min-w-[220px]">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{data.icon}</span>
        <span className="font-semibold text-gray-100">{data.name}</span>
      </div>
      <div className="text-2xl font-bold text-gray-100">{data.rate}%</div>
      <div className="flex items-center gap-2 text-xs">
        <span className={data.reward ? "text-green-400" : "text-red-400"}>{data.reward ? `▲ ${data.change}%` : `▼ ${Math.abs(data.change)}%`}</span>
        <span className="text-gray-400">Reward Rate</span>
      </div>
      {/* Simple bar chart mock */}
      <div className="flex gap-1 mt-2 h-8 items-end">
        {data.chart.map((v, i) => (
          <div key={i} className={`${data.color} rounded w-2`} style={{ height: `${v * 6}px` }} />
        ))}
      </div>
    </div>
  );
}

function TopAssetsTable() {
  return (
    <div className="bg-[#23243a] rounded-xl p-5 shadow border border-gray-800 mt-4">
      <div className="flex justify-between items-center mb-4">
        <span className="font-semibold text-gray-100 text-lg">Top 100 Crypto Assets</span>
        <div className="flex gap-2">
          <button className="bg-gray-800 px-3 py-1 rounded text-gray-200 text-xs">24H</button>
          <button className="bg-gray-800 px-3 py-1 rounded text-gray-200 text-xs">All</button>
        </div>
      </div>
      <table className="w-full text-xs text-gray-300">
        <thead>
          <tr className="text-gray-400">
            <th className="text-left">#</th>
            <th className="text-left">Name</th>
            <th className="text-right">Price</th>
            <th className="text-right">Change</th>
            <th className="text-right">Market Cap</th>
            <th className="text-right">Volume</th>
            <th className="text-right">Chart</th>
          </tr>
        </thead>
        <tbody>
          {topAssets.map((asset) => (
            <tr key={asset.rank} className="border-b border-gray-800 last:border-0">
              <td>{asset.rank}</td>
              <td className="flex items-center gap-2 py-2">
                <span className={`w-2 h-2 rounded-full ${asset.color}`} />
                <span className="font-semibold text-gray-100">{asset.name}</span>
                <span className="text-gray-400 text-xs">{asset.symbol}</span>
              </td>
              <td className="text-right">{asset.price}</td>
              <td className={`text-right ${asset.change > 0 ? "text-green-400" : "text-red-400"}`}>{asset.change > 0 ? `▲ ${asset.change}%` : `▼ ${Math.abs(asset.change)}%`}</td>
              <td className="text-right">{asset.marketCap}</td>
              <td className="text-right">{asset.volume}</td>
              <td className="text-right">
                <div className="flex gap-1 justify-end items-end h-6">
                  {asset.chart.map((v, i) => (
                    <div key={i} className={`${asset.color} rounded w-1`} style={{ height: `${v * 2}px` }} />
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AnalysisPage() {
  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-gray-100">Crypto Prediction</span>
          <div className="flex gap-2">
            <button className="bg-gray-800 px-3 py-1 rounded text-gray-200 text-xs">All</button>
            <button className="bg-gray-800 px-3 py-1 rounded text-gray-200 text-xs">Week</button>
            <button className="bg-gray-800 px-3 py-1 rounded text-gray-200 text-xs">Month</button>
            <button className="bg-gray-800 px-3 py-1 rounded text-gray-200 text-xs">Year</button>
          </div>
          <div className="text-xs text-gray-400">18 Jan, 2025 – 18 Jun, 2025</div>
        </div>
        <div className="flex gap-6 mb-8 flex-wrap">
          {stakingData.map((data) => (
            <StakingCard key={data.name} data={data} />
          ))}
        </div>
      </div>
      <TopAssetsTable />
    </>
  );
} 