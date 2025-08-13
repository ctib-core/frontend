# 1inch Integration

This directory contains the complete 1inch API and SDK integration for the trading platform.

## 📁 File Structure

```
src/lib/1inch/
├── config.ts          # API configuration and authentication
├── types.ts           # TypeScript interfaces and types
├── sdk.ts            # 1inch SDK initialization and mock implementation
├── market-data.ts    # Real-time market data and price feeds
├── tokens.ts         # Token management and popular tokens
├── limit-orders.ts   # Limit order creation and management
├── portfolio.ts      # Portfolio tracking and analytics
├── balance.ts        # Wallet balance tracking
├── ai-data.ts        # AI/LLM market data for predictions
├── test.ts           # Integration testing
├── index.ts          # Main exports
└── README.md         # This file
```

## 🚀 Quick Start

### 1. Environment Setup
Add your 1inch API key to your `.env.local` file:
```bash
NEXT_1INCH_API=your_api_key_here
```

### 2. Basic Usage
```typescript
import { 
  fetch1inchQuote, 
  getPopularTokens, 
  createLimitOrder,
  fetchPortfolioOverview 
} from '@/lib/1inch';

// Get real-time quotes
const quote = await fetch1inchQuote(
  '0xA0b86a33E6441b8c4C8C8C8C8C8C8C8C8C8C8C8C8', // USDC
  '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
  '1000000000' // 1000 USDC
);

// Get popular tokens
const tokens = await getPopularTokens();

// Create a limit order
const order = await createLimitOrder(orderParams, wallet);
```

## 🔧 Features

### ✅ Implemented
- **Real-time Market Data**: Live price quotes and market information
- **Token Management**: Dynamic token lists and popular tokens
- **Limit Orders**: Create, manage, and cancel limit orders
- **Portfolio Tracking**: Complete portfolio analytics and P&L
- **Balance Tracking**: Multi-chain wallet balance monitoring
- **AI Data**: Rich market data for LLM predictions
- **Mock Data**: Development-friendly mock implementations

### 🔄 In Progress
- **SDK Integration**: Full 1inch SDK implementation (currently mocked)
- **Real Trading**: Actual blockchain transactions
- **Order Book**: Real-time order book data
- **Advanced Analytics**: Enhanced portfolio analytics

## 📊 API Endpoints Used

### Core APIs
- **Quote API**: `/swap/v5.2/quote` - Real-time price quotes
- **Tokens API**: `/token/v1.2/chains/{chainId}/tokens` - Token information
- **Portfolio API**: `/portfolio/portfolio/v4/overview/*` - Portfolio analytics
- **Balance API**: `/balance/v1.2/chains/{chainId}/accounts/{address}/tokens` - Wallet balances

### SDK Features
- **Limit Order SDK**: Order creation and management
- **Order Book**: Market depth and liquidity
- **Multi-chain Support**: Cross-chain trading

## 🧪 Testing

Run the integration test:
```typescript
import { test1inchIntegration } from '@/lib/1inch/test';

// Test all 1inch functionality
await test1inchIntegration();
```

## 🔐 Authentication

The integration requires a 1inch API key. Get one at [1inch Developer Portal](https://portal.1inch.dev/).

## 📈 Usage Examples

### Market Data
```typescript
// Get live price for a token pair
const price = await fetchTokenPrice('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2');

// Get comprehensive market data for AI
const marketData = await fetchMarketDataForAI({
  from: '0xA0b86a33E6441b8c4C8C8C8C8C8C8C8C8C8C8C8C8',
  to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
});
```

### Portfolio Management
```typescript
// Get portfolio overview
const portfolio = await fetchPortfolioOverview(['0x1234...']);

// Get wallet balances across chains
const balances = await fetchMultiChainBalances('0x1234...');
```

### Limit Orders
```typescript
// Create a limit order
const orderParams = {
  makerAsset: '0xA0b86a33E6441b8c4C8C8C8C8C8C8C8C8C8C8C8C8',
  takerAsset: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  makingAmount: '1000000000',
  takingAmount: '500000000000000000',
  maker: walletAddress
};

const order = await createLimitOrder(orderParams, wallet);
```

## 🚨 Error Handling

All functions include comprehensive error handling:
- API key validation
- Network error handling
- Fallback to mock data for development
- Detailed error logging

## 🔄 Development vs Production

### Development Mode
- Uses mock data when API calls fail
- Detailed console logging
- No real blockchain transactions

### Production Mode
- Real API calls to 1inch
- Actual blockchain transactions
- Error handling with user feedback

## 📝 Notes

- Currently using mock implementations for SDK functions until dependencies are installed
- All API calls include proper error handling and fallbacks
- Mock data is provided for development and testing
- TypeScript interfaces ensure type safety

## 🔗 Related Files

- `src/app/app/trading/page.tsx` - Main trading interface
- `src/components/TradingViewChart.tsx` - Chart component
- `src/lib/mocks/markets.ts` - Market mock data (to be replaced)
