"use client";

import { MiniKitProvider } from '@coinbase/onchainkit/minikit';
import { base } from 'wagmi/chains';
import { ParticleConnectkit } from "@/lib/particle";
import WagProvider from "@/utils/provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagProvider>
      <ParticleConnectkit>
        <MiniKitProvider 
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          chain={base}
          config={{
            appearance: {
              mode: 'auto',
              theme: 'dark',
              name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || 'Pulley',
              logo: process.env.NEXT_PUBLIC_APP_ICON || '/favicon.ico',
            },
          }}
        >
          {children}
        </MiniKitProvider>
      </ParticleConnectkit>
    </WagProvider>
  );
}
