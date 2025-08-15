"use client"
import React from 'react'
import { createConfig, http } from '@wagmi/core'
import { mainnet, localhost, coreDao, coreTestnet2 } from '@wagmi/core/chains'
import { WagmiProvider } from 'wagmi'
export const config = createConfig({
  chains: [localhost, mainnet, coreDao, coreTestnet2],
  transports: {
    [mainnet.id]: http(),
    [coreDao.id]: http(),
    [coreTestnet2.id]: http(),
  },
})
const WagProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      {children}
    </WagmiProvider>
  )
}

export default WagProvider