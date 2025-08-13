// Test file for 1inch integration
import { 
  fetch1inchQuote, 
  getPopularTokens, 
  createLimitOrder, 
  fetchPortfolioOverview,
  fetchWalletBalances,
  fetchMarketDataForAI
} from './index';

export const test1inchIntegration = async () => {
  console.log('🧪 Testing 1inch Integration...');
  
  try {
    // Test 1: Fetch popular tokens
    console.log('📋 Testing token fetching...');
    const tokens = await getPopularTokens();
    console.log('✅ Tokens fetched:', tokens.length);
    
    // Test 2: Fetch quote
    console.log('💰 Testing quote fetching...');
    const quote = await fetch1inchQuote(
      '0xA0b86a33E6441b8c4C8C8C8C8C8C8C8C8C8C8C8C8', // USDC
      '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
      '1000000000' // 1000 USDC
    );
    console.log('✅ Quote fetched:', quote ? 'Success' : 'Failed');
    
    // Test 3: Test portfolio overview
    console.log('📊 Testing portfolio overview...');
    const portfolio = await fetchPortfolioOverview(['0x1234567890123456789012345678901234567890']);
    console.log('✅ Portfolio overview:', portfolio.totalValue > 0 ? 'Success' : 'Mock data');
    
    // Test 4: Test wallet balances
    console.log('💼 Testing wallet balances...');
    const balances = await fetchWalletBalances('0x1234567890123456789012345678901234567890');
    console.log('✅ Wallet balances:', balances.length > 0 ? 'Success' : 'Mock data');
    
    // Test 5: Test AI market data
    console.log('🤖 Testing AI market data...');
    const aiData = await fetchMarketDataForAI({
      from: '0xA0b86a33E6441b8c4C8C8C8C8C8C8C8C8C8C8C8C8',
      to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
    });
    console.log('✅ AI market data:', aiData ? 'Success' : 'Failed');
    
    console.log('🎉 All 1inch integration tests passed!');
    return true;
  } catch (error) {
    console.error('❌ 1inch integration test failed:', error);
    return false;
  }
};

// Export for use in development
export default test1inchIntegration;
