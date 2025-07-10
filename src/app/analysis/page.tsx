"use client";
import React from "react";

// Mock data (replace with fetch in the future)
const mockData = {
  date: "Friday, January 29, 2021",
  timeline: [
    { start: 6, end: 7, active: false },
    { start: 7, end: 8, active: true },
    { start: 8, end: 9, active: true },
    { start: 9, end: 10, active: false },
    { start: 10, end: 11, active: true },
    { start: 11, end: 12, active: true },
    { start: 12, end: 13, active: false },
    { start: 13, end: 14, active: true },
    { start: 14, end: 15, active: true },
    { start: 15, end: 16, active: false },
    { start: 16, end: 17, active: true },
    { start: 17, end: 18, active: true },
  ],
  breakTimer: {
    sinceLastBreak: "0:42:35",
    ratio: "1 / 3.6",
    notifications: true,
    threshold: "40 min",
  },
  activity: [
    { time: "18:04:33", app: "Chrome", desc: "https://twitter.com/home" },
    { time: "18:01:15", app: "Superhuman", desc: "Inbox – unread" },
    { time: "18:00:00", app: "Airtable", desc: "Tasks" },
    { time: "17:59:43", app: "Slack", desc: "General" },
    { time: "17:54:50", app: "Superhuman", desc: "Inbox – unread" },
    { time: "17:54:36", app: "Chrome", desc: "rize.io/settings/notifications" },
    { time: "17:54:12", app: "Chrome", desc: "rize.io/settings/teams" },
    { time: "17:53:56", app: "Slack", desc: "Product Team" },
    { time: "17:53:45", app: "Sketch", desc: "Rize (Master)" },
    { time: "17:53:41", app: "Webstorm", desc: "product.js" },
    { time: "17:53:36", app: "Sketch", desc: "Rize (Master)" },
    { time: "17:53:34", app: "Webstorm", desc: "index.js" },
  ],
  workblocks: [
    { time: "9:00", label: "Daily Stand-Up", duration: "32 min", score: 97.3 },
    { time: "10:00", label: "Code", duration: "1 hr 10 min", score: 98.9 },
    { time: "11:24", label: "Documentation", duration: "34 min", score: 88.4 },
    { time: "12:00", label: "Design", duration: "23 min", score: 96.1 },
    { time: "14:09", label: "Code", duration: "42 min", score: 95.1 },
    { time: "16:00", label: "Investor Meeting", duration: "39 min", score: 96.2 },
    { time: "17:00", label: "Documentation", duration: "32 min", score: 96.2 },
  ],
  projects: [
    { percent: 45, label: "MVP Release", duration: "2 hr 46 min" },
    { percent: 10, label: "Bugs & Fixes", duration: "32 min" },
    { percent: 8, label: "Launch Campaign", duration: "32 min" },
  ],
  workHours: {
    total: "7 hr 51 min",
    percent: "98.1%",
    tracking: true,
    trackingHours: "8:00 - 18:00",
  },
  scores: {
    focus: { percent: 60, duration: "3 hr 43 min" },
    meetings: { percent: 12, duration: "55 min" },
    breaks: { percent: 18, duration: "1 hr 24 min" },
  },
  timeBreakdown: [
    { percent: 45, label: "Code", duration: "2 hr 46 min" },
    { percent: 18, label: "Meetings", duration: "1 hr 25 min" },
    { percent: 13, label: "Documentation", duration: "1 hr 15 min" },
    { percent: 10, label: "Design", duration: "45 min" },
    { percent: 7, label: "Messaging", duration: "20 min" },
    { percent: 4, label: "Email", duration: "20 min" },
    { percent: 2, label: "Task Management", duration: "11 min" },
    { percent: 1, label: "Productivity", duration: "10 min" },
    { percent: 1, label: "Miscellaneous", duration: "4 min" },
  ],
};

// Timeline Bar Component
function TimelineBar({ timeline }: { timeline: typeof mockData.timeline }) {
  return (
    <div className="flex gap-1 h-6 w-full bg-gray-800 rounded overflow-hidden">
      {timeline.map((block, i) => (
        <div
          key={i}
          className={`flex-1 ${block.active ? "bg-purple-400" : "bg-gray-700"}`}
        />
      ))}
    </div>
  );
}

// Section Card Wrapper
function SectionCard({ title, children, className = "" }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-gray-900 rounded-lg p-4 shadow-md ${className}`}>
      {title && <h3 className="text-lg font-semibold mb-2 text-gray-200">{title}</h3>}
      {children}
    </div>
  );
}

// Main Page
export default function AnalysisPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#181c2f] to-[#2a2250] text-gray-100 p-6 sm:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold">RIZE</h1>
            <div className="text-gray-400 text-sm">{mockData.date}</div>
          </div>
          <div className="flex gap-2">
            <button className="bg-gray-800 px-4 py-2 rounded text-gray-200">Calendar</button>
            <button className="bg-gray-800 px-4 py-2 rounded text-gray-200">Day</button>
            <button className="bg-gray-800 px-4 py-2 rounded text-gray-200">Week</button>
          </div>
        </div>
        {/* Timeline */}
        <SectionCard>
          <TimelineBar timeline={mockData.timeline} />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            {[...Array(13)].map((_, i) => (
              <span key={i}>{6 + i}:00</span>
            ))}
          </div>
        </SectionCard>
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Left Column */}
          <div className="flex flex-col gap-6">
            <SectionCard title="Break Timer">
              <div className="flex flex-col gap-2">
                <div className="text-3xl font-mono">{mockData.breakTimer.sinceLastBreak}</div>
                <div className="text-xs text-gray-400">Break to work ratio: {mockData.breakTimer.ratio}</div>
                <div className="flex items-center gap-2 mt-2">
                  <button className="bg-purple-500 px-3 py-1 rounded text-white text-xs">Start Break</button>
                  <span className="text-xs text-gray-400">Notifications: {mockData.breakTimer.notifications ? "On" : "Off"} (Threshold: {mockData.breakTimer.threshold})</span>
                </div>
              </div>
            </SectionCard>
            <SectionCard title="Activity">
              <div className="h-48 overflow-y-auto text-xs">
                <table className="w-full">
                  <tbody>
                    {mockData.activity.map((a, i) => (
                      <tr key={i} className="border-b border-gray-800 last:border-0">
                        <td className="pr-2 text-gray-400 whitespace-nowrap">{a.time}</td>
                        <td className="pr-2 text-gray-300 whitespace-nowrap">{a.app}</td>
                        <td className="text-gray-400">{a.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          </div>
          {/* Middle Column */}
          <div className="flex flex-col gap-6">
            <SectionCard title="Workblocks">
              <div className="flex flex-col gap-2 text-xs">
                {mockData.workblocks.map((w, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-gray-800 last:border-0 py-1">
                    <span className="text-gray-400 w-12">{w.time}</span>
                    <span className="flex-1 text-gray-200">{w.label}</span>
                    <span className="w-20 text-right text-gray-300">{w.duration}</span>
                    <span className="w-12 text-right text-purple-400">{w.score}</span>
                  </div>
                ))}
              </div>
            </SectionCard>
            <SectionCard title="Projects">
              <div className="flex flex-col gap-2 text-xs">
                {mockData.projects.map((p, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-12 text-purple-400 font-bold">{p.percent}%</div>
                    <div className="flex-1 text-gray-200">{p.label}</div>
                    <div className="w-24 text-right text-gray-300">{p.duration}</div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
          {/* Right Column */}
          <div className="flex flex-col gap-6">
            <SectionCard title="Work Hours">
              <div className="flex flex-col gap-2 text-xs">
                <div className="text-2xl font-mono text-gray-100">{mockData.workHours.total}</div>
                <div className="text-gray-400">Percent of work day: {mockData.workHours.percent}</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-400">Tracking: {mockData.workHours.tracking ? "On" : "Off"}</span>
                  <button className="bg-gray-800 px-2 py-1 rounded text-xs text-gray-200">Disable Tracking</button>
                </div>
                <div className="text-xs text-gray-400">Tracking Hours: {mockData.workHours.trackingHours}</div>
              </div>
            </SectionCard>
            <SectionCard title="Scores">
              <div className="flex gap-4 text-xs">
                <div className="flex flex-col items-center flex-1">
                  <div className="text-2xl font-bold text-purple-400">{mockData.scores.focus.percent}%</div>
                  <div className="text-gray-300">Focus</div>
                  <div className="text-gray-400">{mockData.scores.focus.duration}</div>
                </div>
                <div className="flex flex-col items-center flex-1">
                  <div className="text-2xl font-bold text-blue-400">{mockData.scores.meetings.percent}%</div>
                  <div className="text-gray-300">Meetings</div>
                  <div className="text-gray-400">{mockData.scores.meetings.duration}</div>
                </div>
                <div className="flex flex-col items-center flex-1">
                  <div className="text-2xl font-bold text-green-400">{mockData.scores.breaks.percent}%</div>
                  <div className="text-gray-300">Breaks</div>
                  <div className="text-gray-400">{mockData.scores.breaks.duration}</div>
                </div>
              </div>
            </SectionCard>
            <SectionCard title="Time Breakdown">
              <div className="flex flex-col gap-2 text-xs">
                {mockData.timeBreakdown.map((t, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-10 text-purple-400 font-bold">{t.percent}%</div>
                    <div className="flex-1 text-gray-200">{t.label}</div>
                    <div className="w-24 text-right text-gray-300">{t.duration}</div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
} 