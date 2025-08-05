"use client";
import React, { useState, useMemo } from "react";

// Types
interface AgentStatsType {
  simulations: number;
  successRate: number;
  cycles: number;
  cpu: number;
}

interface AgentType {
  id: string;
  name: string;
  description: string;
  avatar: string;
  stats: AgentStatsType;
  tags: string[];
}

// Mock agent data
const agents: AgentType[] = [
  {
    id: "1",
    name: "AlphaBot",
    description: "A general-purpose AI agent for automation.",
    avatar: "🤖",
    stats: {
      simulations: 1200,
      successRate: 0.92,
      cycles: 34000,
      cpu: 0.67,
    },
    tags: ["automation", "general"],
  },
  {
    id: "2",
    name: "TradeGenie",
    description: "AI agent specialized in crypto trading.",
    avatar: "📈",
    stats: {
      simulations: 800,
      successRate: 0.81,
      cycles: 21000,
      cpu: 0.54,
    },
    tags: ["trading", "crypto"],
  },
  {
    id: "3",
    name: "SupportBot",
    description: "Customer support conversational agent.",
    avatar: "💬",
    stats: {
      simulations: 2300,
      successRate: 0.95,
      cycles: 41000,
      cpu: 0.72,
    },
    tags: ["support", "chat"],
  },
  {
    id: "4",
    name: "VisionAI",
    description: "Image recognition and analysis agent.",
    avatar: "🖼️",
    stats: {
      simulations: 1500,
      successRate: 0.89,
      cycles: 37000,
      cpu: 0.61,
    },
    tags: ["vision", "image"],
  },
];

const allTags: string[] = Array.from(new Set(agents.flatMap((a) => a.tags)));

function StatBar({ label, value, max = 1, color = "bg-purple-500", format = (v: number) => v }: {
  label: string;
  value: number;
  max?: number;
  color?: string;
  format?: (v: number) => React.ReactNode;
}) {
  return (
    <div className="mb-2">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>{label}</span>
        <span>{format(value)}</span>
      </div>
      <div className="w-full h-2 bg-gray-800 rounded">
        <div
          className={`h-2 rounded ${color}`}
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
    </div>
  );
}

function AgentCard({ agent, selected, onClick }: {
  agent: AgentType;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`flex flex-col items-start p-4 rounded-lg border-2 transition-all text-left shadow-md bg-gray-900 hover:border-purple-500 focus:outline-none w-full ${selected ? "border-purple-500" : "border-transparent"}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{agent.avatar}</span>
        <span className="font-semibold text-gray-100 text-lg">{agent.name}</span>
      </div>
      <div className="text-xs text-gray-400 mb-2 line-clamp-2">{agent.description}</div>
      <div className="flex gap-1 flex-wrap">
        {agent.tags.map((tag: string) => (
          <span key={tag} className="bg-gray-800 text-purple-300 px-2 py-0.5 rounded text-[10px]">{tag}</span>
        ))}
      </div>
    </button>
  );
}

function AgentStats({ stats }: { stats: AgentStatsType }) {
  return (
    <div className="bg-gray-900 rounded-lg p-6 shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-200">Agent Stats</h3>
      <StatBar label="Total Simulations" value={stats.simulations} max={3000} color="bg-blue-500" format={(v) => v.toLocaleString()} />
      <StatBar label="Success Rate" value={stats.successRate} max={1} color="bg-green-500" format={(v) => `${Math.round(v * 100)}%`} />
      <StatBar label="Cycles" value={stats.cycles} max={50000} color="bg-yellow-500" format={(v) => v.toLocaleString()} />
      <StatBar label="CPU Utilization" value={stats.cpu} max={1} color="bg-pink-500" format={(v) => `${Math.round(v * 100)}%`} />
    </div>
  );
}

export default function AgentsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [selectedId, setSelectedId] = useState(agents[0].id);

  const filteredAgents = useMemo(() => {
    return agents.filter((a) =>
      (!search || a.name.toLowerCase().includes(search.toLowerCase()) || a.description.toLowerCase().includes(search.toLowerCase())) &&
      (!filter || a.tags.includes(filter))
    );
  }, [search, filter]);

  const selectedAgent = agents.find((a) => a.id === selectedId) || filteredAgents[0];

  return (
    <div className="min-h-screen bg-gradient-to-br text-gray-100 flex">

      {/* Main Content */}
      <main className="flex-1 p-8 flex flex-col gap-8">
        {/* Overview */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="hidden">
            <h1 className="text-2xl font-bold mb-1">AI Agent Dashboard</h1>
            <div className="text-gray-400 text-sm">Search and analyze your AI agents</div>
          </div>
          <div className="flex gap-2 w-full">
            <input
              className="bg-gray-800 border border-gray-700 px-3  py-1 text-gray-200 focus:outline-none focus:border-purple-500 w-full rounded-xl"
              placeholder="Search agents..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select
              className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-gray-200 focus:outline-none focus:border-purple-500"
              value={filter}
              onChange={e => setFilter(e.target.value)}
            >
              <option value="">All Tags</option>
              {allTags.map((tag: string) => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </div>
        {/* Agent List & Details */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Agent List */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 max-w-md">
            {filteredAgents.length === 0 ? (
              <div className="text-gray-400">No agents found.</div>
            ) : (
              filteredAgents.map((agent: AgentType) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  selected={selectedAgent && agent.id === selectedAgent.id}
                  onClick={() => setSelectedId(agent.id)}
                />
              ))
            )}
          </div>
          {/* Agent Overview & Stats */}
          <div className="flex-1 flex flex-col gap-6">
            {selectedAgent && (
              <div className="bg-gray-900 rounded-lg p-6 shadow-md mb-4">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-4xl">{selectedAgent.avatar}</span>
                  <div>
                    <div className="text-xl font-bold text-gray-100">{selectedAgent.name}</div>
                    <div className="text-gray-400 text-sm">{selectedAgent.description}</div>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap mt-2">
                  {selectedAgent.tags.map((tag: string) => (
                    <span key={tag} className="bg-gray-800 text-purple-300 px-2 py-0.5 rounded text-xs">{tag}</span>
                  ))}
                </div>
              </div>
            )}
            {selectedAgent && <AgentStats stats={selectedAgent.stats} />}
          </div>
        </div>
      </main>
    </div>
  );
}