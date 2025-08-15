// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { 
//   validateApiKey,
//   fetch1inchQuote,
//   getPopularTokens,
//   createLimitOrder,
//   fetchPortfolioOverview,
//   fetchWalletBalances,
//   fetchMarketDataForAI
// } from './index';

// export const test1inchIntegration = async () => {
//   console.log('🧪 Testing 1inch Integration...\n');

//   // Test 1: API Key Validation
//   console.log('1. Testing API Key Validation...');
//   const hasApiKey = validateApiKey();
//   console.log(`   API Key Status: ${hasApiKey ? '✅ Found' : '❌ Not Found'}\n`);

//   // Test 2: Market Data (will use mock data if no API key)
//   console.log('2. Testing Market Data...');
//   try {
//     const quote = await fetch1inchQuote(
//       '0xA0b86a33E6441b8c4C8C8C8C8C8C8C8C8C8C8C8C8', // USDC
//       '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
//       '1000000000' // 1000 USDC
//     );
//     console.log(`   Quote Test: ✅ Success - Rate: ${quote.toTokenAmount}`);
//   } catch (error) {
//     console.log(`   Quote Test: ❌ Failed - ${error}`);
//   }

//   // Test 3: Token Management
//   console.log('\n3. Testing Token Management...');
//   try {
//     const tokens = await getPopularTokens();
//     console.log(`   Popular Tokens: ✅ Success - Found ${tokens.length} tokens`);
//   } catch (error) {
//     console.log(`   Popular Tokens: ❌ Failed - ${error}`);
//   }

//   // Test 4: Portfolio Data
//   console.log('\n4. Testing Portfolio Data...');
//   try {
//     const portfolio = await fetchPortfolioOverview(['0x1234567890123456789012345678901234567890']);
//     console.log(`   Portfolio Test: ✅ Success - Total Value: $${portfolio.totalValue}`);
//   } catch (error) {
//     console.log(`   Portfolio Test: ❌ Failed - ${error}`);
//   }

//   // Test 5: Balance Data
//   console.log('\n5. Testing Balance Data...');
//   try {
//     const balances = await fetchWalletBalances('0x1234567890123456789012345678901234567890');
//     console.log(`   Balance Test: ✅ Success - Found ${balances.length} tokens`);
//   } catch (error) {
//     console.log(`   Balance Test: ❌ Failed - ${error}`);
//   }

//   // Test 6: AI Market Data
//   console.log('\n6. Testing AI Market Data...');
//   try {
//     const aiData = await fetchMarketDataForAI({
//       from: '0xA0b86a33E6441b8c4C8C8C8C8C8C8C8C8C8C8C8C8',
//       to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
//     });
//     console.log(`   AI Data Test: ✅ Success - Volatility: ${aiData.volatility}`);
//   } catch (error) {
//     console.log(`   AI Data Test: ❌ Failed - ${error}`);
//   }

//   // Test 7: Limit Order (Mock)
//   console.log('\n7. Testing Limit Order Creation...');
//   try {
//     const mockWallet = { address: '0x1234567890123456789012345678901234567890' };
//     const orderParams = {
//       makerAsset: '0xA0b86a33E6441b8c4C8C8C8C8C8C8C8C8C8C8C8C8',
//       takerAsset: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
//       makingAmount: '1000000000',
//       takingAmount: '500000000000000000',
//       maker: '0x1234567890123456789012345678901234567890'
//     };
//     const order = await createLimitOrder(orderParams, mockWallet);
//     console.log(`   Limit Order Test: ✅ Success - Order Hash: ${order.orderHash}`);
//   } catch (error) {
//     console.log(`   Limit Order Test: ❌ Failed - ${error}`);
//   }

//   console.log('\n🎉 Integration Test Complete!');
//   console.log('\n📝 Notes:');
//   console.log('- If API key is not set, tests will use mock data');
//   console.log('- Real API calls require a valid 1inch API key');
//   console.log('- Set NEXT_1INCH_API in your .env.local file for live data');
// };

// // Run test if this file is executed directly
// if (typeof window !== 'undefined') {
//   // Browser environment - export for manual testing
//   (window as any).test1inchIntegration = test1inchIntegration;
// } else {
//   // Node environment - run test
//   test1inchIntegration().catch(console.error);
// }

// export default test1inchIntegration;
