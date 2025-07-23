"use client"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Bitcoin, ChevronDown, Minus, Plus, User } from 'lucide-react'
import React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useQuery } from '@tanstack/react-query'
// import axios from 'axios' // Removed axios import for now

// Polygon API key (replace with your own or use env variable)
const POLYGON_API_KEY = process.env.NEXT_PUBLIC_POLYGON_API_KEY || 'YOUR_API_KEY_HERE';

// Mock data fallback
const mockMarkets = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 120090,
    change: 2.3,
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    price: 3400,
    change: 1.1,
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    price: 150,
    change: -0.8,
  },
  {
    symbol: 'DOGE',
    name: 'Dogecoin',
    price: 0.15,
    change: 4.2,
  },
]

// Add mock data for the top 24 cryptocurrencies
const cryptoCurrencies = [
  {
    rank: 1,
    name: 'Bitcoin',
    symbol: 'BTC',
    marketCap: '$2,350,694,068,409',
    price: '$118,147.54',
    circulating: '19,896,259 BTC',
    volume: '$69,739,068,011',
    change1h: '-0.27%',
    change24h: '-0.26%',
    change7d: '-0.86%',
  },
  {
    rank: 2,
    name: 'Ethereum',
    symbol: 'ETH',
    marketCap: '$442,292,478,267',
    price: '$3,664.05',
    circulating: '120,711,314 ETH *',
    volume: '$37,056,407,724',
    change1h: '-0.74%',
    change24h: '0.09%',
    change7d: '15.92%',
  },
  {
    rank: 3,
    name: 'XRP',
    symbol: 'XRP',
    marketCap: '$204,505,604,281',
    price: '$3.45',
    circulating: '59,182,189,917 XRP *',
    volume: '$6,815,915,578',
    change1h: '-0.43%',
    change24h: '-0.58%',
    change7d: '17.03%',
  },
  {
    rank: 4,
    name: 'Tether USDt',
    symbol: 'USDT',
    marketCap: '$162,012,484,433',
    price: '$1.00',
    circulating: '161,940,579,168 USDT *',
    volume: '$127,597,229,877',
    change1h: '0.01%',
    change24h: '0.01%',
    change7d: '0.03%',
  },
  {
    rank: 5,
    name: 'BNB',
    symbol: 'BNB',
    marketCap: '$110,500,371,128',
    price: '$793.31',
    circulating: '139,288,802 BNB *',
    volume: '$3,200,795,431',
    change1h: '0.03%',
    change24h: '4.16%',
    change7d: '14.18%',
  },
  {
    rank: 6,
    name: 'Solana',
    symbol: 'SOL',
    marketCap: '$106,620,618,712',
    price: '$198.11',
    circulating: '538,169,672 SOL *',
    volume: '$9,993,047,040',
    change1h: '-0.72%',
    change24h: '0.17%',
    change7d: '18.51%',
  },
  {
    rank: 7,
    name: 'USDC',
    symbol: 'USDC',
    marketCap: '$64,752,918,763',
    price: '$0.9999',
    circulating: '64,754,654,647 USDC *',
    volume: '$14,616,892,447',
    change1h: '0.01%',
    change24h: '0.01%',
    change7d: '<0.01%',
  },
  {
    rank: 8,
    name: 'Dogecoin',
    symbol: 'DOGE',
    marketCap: '$38,694,682,377',
    price: '$0.2575',
    circulating: '150,212,976,384 DOGE',
    volume: '$3,099,703,601',
    change1h: '-1.23%',
    change24h: '-3.36%',
    change7d: '27.92%',
  },
  {
    rank: 9,
    name: 'Cardano',
    symbol: 'ADA',
    marketCap: '$30,588,656,858',
    price: '$0.8641',
    circulating: '35,398,491,999 ADA *',
    volume: '$1,491,804,631',
    change1h: '-0.88%',
    change24h: '-0.68%',
    change7d: '15.17%',
  },
  {
    rank: 10,
    name: 'TRON',
    symbol: 'TRX',
    marketCap: '$30,098,106,679',
    price: '$0.3177',
    circulating: '94,736,618,069 TRX *',
    volume: '$1,188,854,419',
    change1h: '-0.18%',
    change24h: '1.59%',
    change7d: '5.19%',
  },
  {
    rank: 11,
    name: 'Hyperliquid',
    symbol: 'HYPE',
    marketCap: '$14,654,529,201',
    price: '$43.88',
    circulating: '333,928,180 HYPE *',
    volume: '$366,983,771',
    change1h: '-0.96%',
    change24h: '-0.29%',
    change7d: '-8.46%',
  },
  {
    rank: 12,
    name: 'Stellar',
    symbol: 'XLM',
    marketCap: '$14,545,500,357',
    price: '$0.4671',
    circulating: '31,134,019,346 XLM *',
    volume: '$583,678,481',
    change1h: '-0.86%',
    change24h: '2.08%',
    change7d: '0.41%',
  },
  {
    rank: 13,
    name: 'Sui',
    symbol: 'SUI',
    marketCap: '$13,491,859,605',
    price: '$3.90',
    circulating: '3,455,015,253 SUI *',
    volume: '$1,559,506,791',
    change1h: '-1.38%',
    change24h: '1.29%',
    change7d: '-3.24%',
  },
  {
    rank: 14,
    name: 'Chainlink',
    symbol: 'LINK',
    marketCap: '$12,871,081,683',
    price: '$18.98',
    circulating: '678,099,970 LINK *',
    volume: '$799,056,874',
    change1h: '-0.96%',
    change24h: '0.24%',
    change7d: '15.00%',
  },
  {
    rank: 15,
    name: 'Hedera',
    symbol: 'HBAR',
    marketCap: '$11,299,121,976',
    price: '$0.2665',
    circulating: '42,392,670,019 HBAR *',
    volume: '$528,175,044',
    change1h: '-0.87%',
    change24h: '1.36%',
    change7d: '12.10%',
  },
  {
    rank: 16,
    name: 'Avalanche',
    symbol: 'AVAX',
    marketCap: '$10,606,695,251',
    price: '$25.11',
    circulating: '422,275,285 AVAX *',
    volume: '$899,874,756',
    change1h: '-1.45%',
    change24h: '-1.05%',
    change7d: '13.75%',
  },
  {
    rank: 17,
    name: 'Bitcoin Cash',
    symbol: 'BCH',
    marketCap: '$10,469,438,675',
    price: '$526.07',
    circulating: '19,901,138 BCH',
    volume: '$487,652,906',
    change1h: '-0.33%',
    change24h: '1.02%',
    change7d: '5.18%',
  },
  {
    rank: 18,
    name: 'Litecoin',
    symbol: 'LTC',
    marketCap: '$8,930,262,025',
    price: '$117.34',
    circulating: '76,105,377 LTC',
    volume: '$1,186,018,112',
    change1h: '-0.43%',
    change24h: '3.03%',
    change7d: '20.29%',
  },
  {
    rank: 19,
    name: 'Shiba Inu',
    symbol: 'SHIB',
    marketCap: '$8,753,153,069',
    price: '$0.00001485',
    circulating: '589,246,858,589,927 SHIB *',
    volume: '$333,073,531',
    change1h: '-1.09%',
    change24h: '-0.73%',
    change7d: '7.27%',
  },
  {
    rank: 20,
    name: 'UNUS SED LEO',
    symbol: 'LEO',
    marketCap: '$8,296,732,367',
    price: '$8.98',
    circulating: '923,042,100 LEO *',
    volume: '$3,134,022',
    change1h: '0.12%',
    change24h: '0.13%',
    change7d: '2.30%',
  },
  {
    rank: 21,
    name: 'Toncoin',
    symbol: 'TON',
    marketCap: '$8,151,538,608',
    price: '$3.29',
    circulating: '2,470,383,779 TON *',
    volume: '$721,120,922',
    change1h: '-0.74%',
    change24h: '1.92%',
    change7d: '5.74%',
  },
  {
    rank: 22,
    name: 'Polkadot',
    symbol: 'DOT',
    marketCap: '$7,000,293,963',
    price: '$4.37',
    circulating: '1,599,813,185 DOT *',
    volume: '$407,568,287',
    change1h: '-1.44%',
    change24h: '0.72%',
    change7d: '6.46%',
  },
  {
    rank: 23,
    name: 'Uniswap',
    symbol: 'UNI',
    marketCap: '$6,550,499,712',
    price: '$10.41',
    circulating: '628,739,837 UNI *',
    volume: '$538,265,787',
    change1h: '-0.87%',
    change24h: '0.35%',
    change7d: '13.95%',
  },
  {
    rank: 24,
    name: 'Ethena USDe',
    symbol: 'USDe',
    marketCap: '$6,511,269,432',
    price: '$1.00',
    circulating: '6,504,551,290 USDe *',
    volume: '$227,525,605',
    change1h: '0.00%',
    change24h: '-0.01%',
    change7d: '0.05%',
  },
]

// Fetcher function for Polygon API
async function fetchMarkets() {
  try {
    const symbols = ['BTC', 'ETH', 'SOL', 'DOGE']
    const results = await Promise.all(
      symbols.map(async (symbol) => {
        const res = await fetch(
          `https://api.polygon.io/v2/aggs/ticker/X:${symbol}USD/prev?adjusted=true&apiKey=${POLYGON_API_KEY}`
        )
        const json = await res.json()
        const data = json.results[0]
        return {
          symbol,
          name: symbol === 'BTC' ? 'Bitcoin' : symbol === 'ETH' ? 'Ethereum' : symbol === 'SOL' ? 'Solana' : 'Dogecoin',
          price: data.c,
          change: Number((((data.c - data.o) / data.o) * 100).toFixed(2)),
        }
      })
    )
    return results
  } catch {
    // fallback to mock data
    return mockMarkets
  }
}

// Rename page to Page for React component convention
const Page = () => {
  const { data: markets = mockMarkets } = useQuery({
    queryKey: ['markets'],
    queryFn: fetchMarkets,
    staleTime: 60 * 1000,
  })

  // For demo, favorites are just the first two
  const favorites = markets.slice(0, 2)

  return (
    <div className="flex-5 flex overflow-y-scroll ">
      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Markets</h1>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          {/* Markets Section */}
          <Card className="bg-crypto-card border-crypto-border p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <h3>Trending</h3>
              </div>
              {/* <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">12 favorite tokens</span>
                <Button variant="default" size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Add favorites
                </Button>
              </div> */}
            </div>

            <div className="gap-4">
              <Table className='w-full'>
                <TableCaption>A list of trending tokens.</TableCaption>
                {/* <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Invoice</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader> */}
                <TableBody>
                  {markets.map((token) => (
                    <TableRow key={token.symbol} className=''>
                      <TableCell className="font-medium">
                        {token.symbol === 'BTC' && <Bitcoin />}
                        {token.symbol === 'ETH' && <User />}
                        {token.symbol === 'SOL' && <User />}
                        {token.symbol === 'DOGE' && <User />}
                      </TableCell>
                      <TableCell>{token.name}</TableCell>
                      <TableCell>${token.price.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{token.change > 0 ? '+' : ''}{token.change}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
          <Card className="bg-crypto-card border-crypto-border p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <h3>My favorites</h3>
              </div>
            </div>

            <div className="gap-4">
              <Table className='w-full'>
                {/* <TableCaption>A list of my favorite tokens.</TableCaption> */}
                {/* <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Invoice</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader> */}
                <TableBody>
                  {favorites.map((token) => (
                    <TableRow key={token.symbol}>
                      <TableCell className="font-medium">
                        {token.symbol === 'BTC' && <Bitcoin />}
                        {token.symbol === 'ETH' && <User />}
                        {token.symbol === 'SOL' && <User />}
                        {token.symbol === 'DOGE' && <User />}
                      </TableCell>
                      <TableCell>{token.name}</TableCell>
                      <TableCell>${token.price.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{token.change > 0 ? '+' : ''}{token.change}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
          {/* Markets Section */}
        </div>
        <Card className="bg-crypto-card border-crypto-border p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h3>Crypto currency</h3>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Top 24 tokens</span>
              <Button variant="default" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add favorites
              </Button>
            </div>
          </div>
          <div className="gap-4 overflow-x-auto">
            <Table className='w-full min-w-[1200px]'>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Market Cap</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Circulating Supply</TableHead>
                  <TableHead>Volume(24h)</TableHead>
                  <TableHead>% 1h</TableHead>
                  <TableHead>% 24h</TableHead>
                  <TableHead>% 7d</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cryptoCurrencies.map((token) => (
                  <TableRow key={token.rank}>
                    <TableCell>{token.rank}</TableCell>
                    <TableCell>{token.name}</TableCell>
                    <TableCell>{token.symbol}</TableCell>
                    <TableCell>{token.marketCap}</TableCell>
                    <TableCell>{token.price}</TableCell>
                    <TableCell>{token.circulating}</TableCell>
                    <TableCell>{token.volume}</TableCell>
                    <TableCell>{token.change1h}</TableCell>
                    <TableCell>{token.change24h}</TableCell>
                    <TableCell>{token.change7d}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
        <Card className="bg-crypto-card border-crypto-border p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h3>Trending</h3>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">12 favorite tokens</span>
              <Button variant="default" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add favorites
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-background border-crypto-border p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-primary rounded-full"></div>
                  <span className="font-semibold text-foreground">Curve</span>
                  <Badge variant="secondary" className="text-xs">Farm Pool</Badge>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <h4 className="font-semibold text-foreground">sETH 2 to ETH</h4>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">APR 10%</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Become a liquidity provider to allow instantaneous swaps between sETH ETH
                  StakeWise users
                </p>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                CHECK GUIDE
              </Button>
            </Card>

            <Card className="bg-background border-crypto-border p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-muted rounded-full"></div>
                  <span className="font-semibold text-foreground">Moonbeam</span>
                  <Badge variant="secondary" className="text-xs">Farm Pool</Badge>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <h4 className="font-semibold text-foreground">ETH to DAI</h4>
                <p className="text-xs text-muted-foreground">
                  Become a liquidity provider to allow instantaneous swaps between ETH DAI
                  StakeWise users
                </p>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                CHECK GUIDE
              </Button>
            </Card>
          </div>
        </Card>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 bg-crypto-card border-l border-crypto-border p-6 space-y-6 hidden">
        {/* Token Selector */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-crypto-border">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-primary rounded-full"></div>
              <span className="font-semibold text-foreground">ETH</span>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </div>

          <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-crypto-border">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-muted rounded-full"></div>
              <span className="font-semibold text-foreground">USDC</span>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>

        {/* Commission */}
        <div className="">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Commission</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-foreground">0.01%</div>
              <div className="text-xs text-muted-foreground">0% select</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-foreground">0.05%</div>
              <div className="text-xs text-muted-foreground">56% select</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-foreground">0.3%</div>
              <div className="text-xs text-muted-foreground">42% select</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-foreground">1%</div>
              <div className="text-xs text-muted-foreground">2% select</div>
            </div>
          </div>
        </div>

        {/* Price Controls */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Low price</span>
              <div className="flex space-x-1">
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Plus className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Minus className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <div className="text-lg font-semibold text-foreground">1644.2381</div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">High price</span>
              <div className="flex space-x-1">
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Plus className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Minus className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <div className="text-lg font-semibold text-foreground">1654.1327</div>
          </div>
        </div>

        {/* Add Liquidity Button */}
        <Button className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90">
          ADD LIQUIDITY
        </Button>
      </div>
    </div>
  )
}

export default Page