"use client";

import { useEffect, useState } from 'react';
import { 
  useMiniKit, 
  useAddFrame, 
  useOpenUrl, 
  useClose, 
  usePrimaryButton,
  useViewProfile,
  useNotification,
  useComposeCast
} from '@coinbase/onchainkit/minikit';
import { ConnectButton } from "@particle-network/connectkit";
import { SimpleTrading } from '@/components/simpleTrading';

const COLORS = {
  bg: "#0a0f1a",
  card: "rgba(16,20,26,0.85)",
  accent: "#b6ff3b",
  accent2: "#00ffb0",
  text: "#f1f5f9",
  muted: "#94a3b8",
  border: "#23272f",
};

export default function MiniAppPage() {
  const { setFrameReady, isFrameReady, context, notificationProxyUrl } = useMiniKit();
  const addFrame = useAddFrame();
  const openUrl = useOpenUrl();
  const close = useClose();
  const sendNotification = useNotification();
  const composeCast = useComposeCast();
  const viewProfile = useViewProfile();
  
  const [activeTab, setActiveTab] = useState<'trading' | 'game'>('trading');
  const [gameState, setGameState] = useState<'RUNNING' | 'PAUSED'>('RUNNING');
  const [score, setScore] = useState(0);
  const [notificationSent, setNotificationSent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Set frame ready when component mounts
  useEffect(() => {
    const initializeFrame = async () => {
      try {
        if (!isFrameReady) {
          await setFrameReady();
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize frame:', error);
        setIsLoading(false);
      }
    };

    initializeFrame();
  }, [setFrameReady, isFrameReady]);

  // Primary button for tab switching
  usePrimaryButton(
    { text: activeTab === 'trading' ? 'SWITCH TO GAME' : 'SWITCH TO TRADING' },
    () => {
      setActiveTab(activeTab === 'trading' ? 'game' : 'trading');
    }
  );

  const handleAddFrame = async () => {
    try {
      const result = await addFrame();
      if (result) {
        console.log('Frame added:', result.url, result.token);
        // In production, save these to your database
      }
    } catch (error) {
      console.error('Failed to add frame:', error);
    }
  };

  const handleSendNotification = async () => {
    try {
      await sendNotification({
        title: 'New High Score! 🎉',
        body: 'Congratulations on achieving a new high score!'
      });
      setNotificationSent(true);
      setTimeout(() => setNotificationSent(false), 30000);
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  };

  const handleShareScore = () => {
    composeCast({
      text: `Just scored ${score} points on Pulley! 🚀`,
    });
  };

  const handleViewProfile = () => {
    viewProfile();
  };

  if (isLoading) {
    return (
      <main className="relative min-h-screen text-[#f1f5f9] font-sans overflow-x-hidden flex items-center justify-center" style={{ background: COLORS.bg }}>
        <div className="text-center">
          <div className="w-16 h-16 bg-[#b6ff3b] rounded-full animate-pulse mx-auto mb-4"></div>
          <p className="text-[#b6ff3b] text-lg">Loading Pulley...</p>
        </div>
      </main>
    );
  }

  return (
    <main
      className="relative min-h-screen text-[#f1f5f9] font-sans overflow-x-hidden"
      style={{ background: COLORS.bg }}
    >
      {/* Header */}
      <header className="flex justify-between items-center px-4 py-4 z-10 relative">
        <div className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
          <span className="w-6 h-6 bg-[#b6ff3b] rounded grid place-items-center font-black text-[#0a0f1a]">P</span>
          <span>Pulley</span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleViewProfile}
            className="cursor-pointer bg-transparent font-semibold text-sm px-2 py-1 rounded border border-[#b6ff3b] text-[#b6ff3b] hover:bg-[#b6ff3b] hover:text-[#0a0f1a] transition"
          >
            PROFILE
          </button>
          <button
            type="button"
            onClick={close}
            className="cursor-pointer bg-transparent font-semibold text-sm px-2 py-1 rounded border border-[#b6ff3b] text-[#b6ff3b] hover:bg-[#b6ff3b] hover:text-[#0a0f1a] transition"
          >
            CLOSE
          </button>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="flex gap-2 px-4 mb-4">
        <button
          onClick={() => setActiveTab('trading')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            activeTab === 'trading' 
              ? 'bg-[#b6ff3b] text-[#0a0f1a]' 
              : 'bg-transparent border border-[#b6ff3b] text-[#b6ff3b]'
          }`}
        >
          Trading
        </button>
        <button
          onClick={() => setActiveTab('game')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            activeTab === 'game' 
              ? 'bg-[#b6ff3b] text-[#0a0f1a]' 
              : 'bg-transparent border border-[#b6ff3b] text-[#b6ff3b]'
          }`}
        >
          Game
        </button>
      </div>

      {/* Main Content */}
      <div className="px-4 pb-20">
        {activeTab === 'trading' ? (
          <SimpleTrading />
        ) : (
          <div className="space-y-6">
            {/* Score Display */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-[#b6ff3b] mb-2">Score: {score}</h1>
              <p className="text-[#94a3b8]">Game Status: {gameState}</p>
            </div>

            {/* Game Controls */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setScore(prev => prev + 10)}
                className="p-4 rounded-lg bg-[#b6ff3b] text-[#0a0f1a] font-bold hover:bg-[#caff4d] transition"
              >
                +10 Points
              </button>
              <button
                onClick={() => setScore(prev => Math.max(0, prev - 5))}
                className="p-4 rounded-lg bg-[#00ffb0] text-[#0a0f1a] font-bold hover:bg-[#33ffc3] transition"
              >
                -5 Points
              </button>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleAddFrame}
                className="w-full p-4 rounded-lg bg-[#b6ff3b] text-[#0a0f1a] font-bold hover:bg-[#caff4d] transition"
              >
                Save Frame
              </button>
              
              {context?.client.added && (
                <button
                  onClick={handleSendNotification}
                  disabled={notificationSent}
                  className="w-full p-4 rounded-lg bg-[#00ffb0] text-[#0a0f1a] font-bold hover:bg-[#33ffc3] transition disabled:opacity-50"
                >
                  {notificationSent ? 'Notification Sent!' : 'Send Notification'}
                </button>
              )}
              
              <button
                onClick={handleShareScore}
                className="w-full p-4 rounded-lg bg-[#b6ff3b] text-[#0a0f1a] font-bold hover:bg-[#caff4d] transition"
              >
                Share Score
              </button>
            </div>
          </div>
        )}

        {/* Wallet Connection */}
        <div className="mt-8 text-center">
          <ConnectButton />
        </div>

        {/* Debug Info (remove in production) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-3 bg-[#23272f] rounded text-xs text-[#94a3b8]">
            <p>Frame Ready: {isFrameReady ? 'Yes' : 'No'}</p>
            <p>Context: {context ? 'Available' : 'None'}</p>
            <p>Notification Proxy: {notificationProxyUrl}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 flex items-center w-screen max-w-[520px] justify-center">
        <button
          type="button"
          className="px-4 py-2 rounded-lg font-semibold opacity-60 border border-[#b6ff3b] text-[#b6ff3b] text-xs hover:bg-[#b6ff3b] hover:text-[#0a0f1a] transition"
          onClick={() => openUrl('https://base.org/builders/minikit')}
        >
          BUILT WITH MINIKIT
        </button>
      </footer>
    </main>
  );
}
