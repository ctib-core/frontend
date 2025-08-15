/* eslint-disable @typescript-eslint/no-explicit-any */
import { ONECHIN_CONFIG } from './config';

export interface WalletInfo {
  address: string;
  chainId: number;
  isConnected: boolean;
  provider?: any; // Web3 provider
}

export interface WalletManager {
  getCurrentWallet: () => WalletInfo | null;
  connectWallet: () => Promise<WalletInfo>;
  disconnectWallet: () => void;
  switchChain: (chainId: number) => Promise<void>;
  signMessage: (message: string) => Promise<string>;
  signTransaction: (transaction: any) => Promise<string>;
}

// Global wallet state
let currentWallet: WalletInfo | null = null;

/**
 * Get the current connected wallet
 */
export const getCurrentWallet = (): WalletInfo | null => {
  return currentWallet;
};

/**
 * Set the current wallet (used by wallet connectors)
 */
export const setCurrentWallet = (wallet: WalletInfo | null): void => {
  currentWallet = wallet;
};

/**
 * Get wallet address for API calls
 */
export const getWalletAddress = (): string | null => {
  return currentWallet?.address || null;
};

/**
 * Get current chain ID
 */
export const getCurrentChainId = (): number => {
  return currentWallet?.chainId || ONECHIN_CONFIG.DEFAULT_CHAIN_ID;
};

/**
 * Check if wallet is connected
 */
export const isWalletConnected = (): boolean => {
  return currentWallet?.isConnected || false;
};

/**
 * Validate wallet address format
 */
export const validateWalletAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

/**
 * Format wallet address for display
 */
export const formatWalletAddress = (address: string): string => {
  if (!validateWalletAddress(address)) return 'Invalid Address';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * Mock wallet for development/testing
 */
export const createMockWallet = (address?: string): WalletInfo => ({
  address: address || '0x1234567890123456789012345678901234567890',
  chainId: ONECHIN_CONFIG.DEFAULT_CHAIN_ID,
  isConnected: true
});

/**
 * Initialize wallet with address (for testing/development)
 */
export const initializeWallet = (address: string, chainId?: number): void => {
  if (!validateWalletAddress(address)) {
    throw new Error('Invalid wallet address format');
  }
  
  setCurrentWallet({
    address,
    chainId: chainId || ONECHIN_CONFIG.DEFAULT_CHAIN_ID,
    isConnected: true
  });
};

/**
 * Clear wallet state
 */
export const clearWallet = (): void => {
  setCurrentWallet(null);
};

/**
 * Get wallet info for API calls with fallback
 */
export const getWalletForAPI = (): { address: string; chainId: number } => {
  const wallet = getCurrentWallet();
  
  if (!wallet || !wallet.isConnected) {
    // Return mock wallet for development
    const mockWallet = createMockWallet();
    return {
      address: mockWallet.address,
      chainId: mockWallet.chainId
    };
  }
  
  return {
    address: wallet.address,
    chainId: wallet.chainId
  };
};

/**
 * Get multiple wallet addresses for portfolio APIs
 */
export const getWalletAddresses = (): string[] => {
  const wallet = getCurrentWallet();
  
  if (!wallet || !wallet.isConnected) {
    // Return mock addresses for development
    return [
      '0x1234567890123456789012345678901234567890',
      '0x0987654321098765432109876543210987654321'
    ];
  }
  
  return [wallet.address];
};

/**
 * Wallet connection status for UI
 */
export const getWalletStatus = () => {
  const wallet = getCurrentWallet();
  
  return {
    isConnected: wallet?.isConnected || false,
    address: wallet?.address || null,
    chainId: wallet?.chainId || ONECHIN_CONFIG.DEFAULT_CHAIN_ID,
    formattedAddress: wallet?.address ? formatWalletAddress(wallet.address) : null
  };
};
