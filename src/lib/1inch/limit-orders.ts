/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ONECHIN_CONFIG, getAuthHeaders, validateApiKey } from './config';
import { LimitOrderParams, LimitOrder } from './types';
import { getWalletForAPI, getCurrentChainId } from './wallet';
import { initialize1inchSDK, createMockSDK } from './sdk';

export const createLimitOrder = async (
  params: LimitOrderParams,
  wallet?: any
): Promise<LimitOrder> => {
  // Use provided wallet or get from wallet manager
  const walletInfo = wallet ? { address: wallet.address, chainId: getCurrentChainId() } : getWalletForAPI();
  
  if (!validateApiKey()) {
    console.warn('No API key found, using mock data');
    return getMockLimitOrder(params, walletInfo.address);
  }

  try {
    const sdk = wallet ? initialize1inchSDK(wallet.provider) : createMockSDK();
    
    // Create order using SDK
    const order = await sdk.createOrder({
      ...params,
      maker: walletInfo.address,
      chainId: walletInfo.chainId
    });
    
    return {
      orderHash: order.orderHash,
      maker: walletInfo.address,
      makerAsset: params.makerAsset,
      takerAsset: params.takerAsset,
      makingAmount: params.makingAmount,
      takingAmount: params.takingAmount,
      salt: params.salt || Date.now().toString(),
      receiver: params.receiver || walletInfo.address,
      allowedSender: '0x0000000000000000000000000000000000000000',
      interactions: '0x',
      expiration: params.expiration || Math.floor(Date.now() / 1000) + 3600,
      nonce: 0,
      signature: '0x',
      status: 'pending',
      createdAt: Date.now()
    };
  } catch (error) {
    console.error('Error creating limit order:', error);
    return getMockLimitOrder(params, walletInfo.address);
  }
};

export const getLimitOrders = async (
  address?: string,
  chainId?: number
): Promise<LimitOrder[]> => {
  // Use provided address or get from wallet manager
  const walletInfo = address ? { address, chainId: chainId || getCurrentChainId() } : getWalletForAPI();
  
  if (!validateApiKey()) {
    console.warn('No API key found, using mock data');
    return getMockLimitOrders(walletInfo.address);
  }

  try {
    const sdk = createMockSDK(); // In real implementation, this would be initialized with provider
    
    // Get orders by maker address
    const orders = await sdk.getOrdersByMaker(walletInfo.address);
    
    return orders.map((order: any) => ({
      orderHash: order.orderHash,
      maker: order.maker,
      makerAsset: order.makerAsset,
      takerAsset: order.takerAsset,
      makingAmount: order.makingAmount,
      takingAmount: order.takingAmount,
      salt: order.salt || Date.now().toString(),
      receiver: order.receiver || walletInfo.address,
      allowedSender: order.allowedSender || '0x0000000000000000000000000000000000000000',
      interactions: order.interactions || '0x',
      expiration: order.expiration || Math.floor(Date.now() / 1000) + 3600,
      nonce: order.nonce || 0,
      signature: order.signature || '0x',
      status: order.status || 'pending',
      createdAt: order.createdAt || Date.now()
    }));
  } catch (error) {
    console.error('Error fetching limit orders:', error);
    return getMockLimitOrders(walletInfo.address);
  }
};

export const cancelLimitOrder = async (
  orderHash: string,
  wallet?: any
): Promise<boolean> => {
  // Use provided wallet or get from wallet manager
  const walletInfo = wallet ? { address: wallet.address, chainId: getCurrentChainId() } : getWalletForAPI();
  
  if (!validateApiKey()) {
    console.warn('No API key found, using mock data');
    return true; // Mock success
  }

  try {
    const sdk = wallet ? initialize1inchSDK(wallet.provider) : createMockSDK();
    
    // Cancel order using SDK
    await sdk.cancelOrder(orderHash);
    
    return true;
  } catch (error) {
    console.error('Error canceling limit order:', error);
    return false;
  }
};

export const getOrderByHash = async (
  orderHash: string,
  chainId?: number
): Promise<LimitOrder | null> => {
  const walletInfo = getWalletForAPI();
  const targetChainId = chainId || walletInfo.chainId;
  
  if (!validateApiKey()) {
    console.warn('No API key found, using mock data');
    return getMockLimitOrder({
      makerAsset: '0x1234567890123456789012345678901234567890',
      takerAsset: '0x0987654321098765432109876543210987654321',
      makingAmount: '1000000000000000000',
      takingAmount: '500000000000000000',
      maker: walletInfo.address
    }, walletInfo.address);
  }

  try {
    const sdk = createMockSDK(); // In real implementation, this would be initialized with provider
    
    // Get specific order by hash
    const order = await sdk.getOrderByHash(orderHash);
    
    if (!order) return null;
    
    return {
      orderHash: order.orderHash,
      maker: order.maker,
      makerAsset: order.makerAsset,
      takerAsset: order.takerAsset,
      makingAmount: order.makingAmount,
      takingAmount: order.takingAmount,
      salt: order.salt || Date.now().toString(),
      receiver: order.receiver || order.maker,
      allowedSender: order.allowedSender || '0x0000000000000000000000000000000000000000',
      interactions: order.interactions || '0x',
      expiration: order.expiration || Math.floor(Date.now() / 1000) + 3600,
      nonce: order.nonce || 0,
      signature: order.signature || '0x',
      status: order.status || 'pending',
      createdAt: order.createdAt || Date.now()
    };
  } catch (error) {
    console.error('Error fetching order by hash:', error);
    return null;
  }
};

// Helper function to format order parameters
export const formatOrderParams = (
  makerToken: string,
  takerToken: string,
  makerAmount: string,
  takerAmount: string,
  makerAddress: string
): LimitOrderParams => {
  return {
    makerAsset: makerToken,
    takerAsset: takerToken,
    makingAmount: makerAmount,
    takingAmount: takerAmount,
    maker: makerAddress,
    expiration: Math.floor(Date.now() / 1000) + 3600, // 1 hour
    salt: Date.now().toString()
  };
};

// Mock data for development
const getMockLimitOrder = (params: LimitOrderParams, makerAddress: string): LimitOrder => ({
  orderHash: `mock_order_${Date.now()}`,
  maker: makerAddress,
  makerAsset: params.makerAsset,
  takerAsset: params.takerAsset,
  makingAmount: params.makingAmount,
  takingAmount: params.takingAmount,
  salt: params.salt || Date.now().toString(),
  receiver: params.receiver || makerAddress,
  allowedSender: '0x0000000000000000000000000000000000000000',
  interactions: '0x',
  expiration: params.expiration || Math.floor(Date.now() / 1000) + 3600,
  nonce: 0,
  signature: '0x',
  status: 'pending',
  createdAt: Date.now() - 3600000 // 1 hour ago
});

const getMockLimitOrders = (makerAddress: string): LimitOrder[] => [
  getMockLimitOrder({
    makerAsset: '0xA0b86a33E6441b8c4C8C8C8C8C8C8C8C8C8C8C8', // USDC
    takerAsset: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
    makingAmount: '1000000000', // 1000 USDC
    takingAmount: '500000000000000000', // 0.5 WETH
    maker: makerAddress,
    salt: '123456789',
    receiver: makerAddress,
    expiration: Math.floor(Date.now() / 1000) + 3600
  }, makerAddress),
  getMockLimitOrder({
    makerAsset: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
    takerAsset: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', // WBTC
    makingAmount: '2000000000', // 2000 USDT
    takingAmount: '10000000', // 0.1 WBTC
    maker: makerAddress,
    salt: '987654321',
    receiver: makerAddress,
    expiration: Math.floor(Date.now() / 1000) + 3600
  }, makerAddress)
];
