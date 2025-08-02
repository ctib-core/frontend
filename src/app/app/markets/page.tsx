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
import { mockMarkets } from '@/lib/mocks/markets'
import { cryptoCurrencies } from '@/lib/mocks/markets'
import axios from 'axios'

// Types for API responses
interface TickerData {
  ticker: string;
  name: string;
  base_currency_symbol: string;
  base_currency_name: string;
}

interface OHLCData {
  ticker: string;
  name: string;
  price: number;
  change: number;
  volume: number;
  high: number;
  low: number;
}

interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
}

interface CryptoTableData {
  rank: number;
  name: string;
  symbol: string;
  price: string;
  marketCap: string;
  circulating: string;
  volume: string;
  change1h: string;
  change24h: string;
  change7d: string;
}

// Polygon API key (replace with your own or use env variable)
const POLYGON_API_KEY = process.env.NEXT_PUBLIC_POLYGON_API_KEY;

// Trending tokens to fetch - using specific trading pairs
const TRENDING_TOKENS = ['BTCUSD', 'ETHUSD', 'SOLUSD', 'DOGEUSD'];

// Cache duration for different data types
const TICKER_LIST_CACHE_TIME = 24 * 60 * 60 * 1000; // 24 hours
const OHLC_CACHE_TIME = 5 * 60 * 1000; // 5 minutes

// Helper function to get token name
function getTokenName(ticker: string): string {
  const symbol = ticker.replace('X:', '');
  switch (symbol) {
    case 'BTCUSD': return 'Bitcoin';
    case 'ETHUSD': return 'Ethereum';
    case 'SOLUSD': return 'Solana';
    case 'DOGEUSD': return 'Dogecoin';
    default: return symbol.replace('USD', '');
  }
}

// Helper function to get fallback price
function getFallbackPrice(ticker: string): number {
  const symbol = ticker.replace('X:', '');
  switch (symbol) {
    case 'BTCUSD': return 45000;
    case 'ETHUSD': return 3000;
    case 'SOLUSD': return 100;
    case 'DOGEUSD': return 0.08;
    default: return 100;
  }
}

// Helper function to get fallback change
function getFallbackChange(ticker: string): number {
  const symbol = ticker.replace('X:', '');
  switch (symbol) {
    case 'BTCUSD': return 2.5;
    case 'ETHUSD': return 1.8;
    case 'SOLUSD': return -0.5;
    case 'DOGEUSD': return 0.3;
    default: return 0;
  }
}

// Fetcher function for getting all crypto tickers
async function fetchCryptoTickers(): Promise<TickerData[]> {
  try {
    const response = await fetch(
      `https://api.polygon.io/v3/reference/tickers?market=crypto&active=true&order=asc&limit=1000&sort=ticker&apiKey=${POLYGON_API_KEY}`
    );
    
    if (!response.ok) {
      if (response.status === 429) {
        console.warn('Rate limit hit for ticker list, using fallback');
        throw new Error('Rate limit exceeded');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Failed to fetch crypto tickers:', error);
    // Return fallback ticker list
    return [
      { ticker: 'X:BTCUSD', name: 'Bitcoin - United States Dollar', base_currency_symbol: 'BTC', base_currency_name: 'Bitcoin' },
      { ticker: 'X:ETHUSD', name: 'Ethereum - United States Dollar', base_currency_symbol: 'ETH', base_currency_name: 'Ethereum' },
      { ticker: 'X:SOLUSD', name: 'Solana - United States Dollar', base_currency_symbol: 'SOL', base_currency_name: 'Solana' },
      { ticker: 'X:DOGEUSD', name: 'Dogecoin - United States Dollar', base_currency_symbol: 'DOGE', base_currency_name: 'Dogecoin' },
    ];
  }
}

// Fetcher function for getting OHLC data for a specific ticker
async function fetchTickerOHLC(ticker: string): Promise<OHLCData> {
  try {
    const response = await fetch(
      `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${POLYGON_API_KEY}`
    );
    
    if (!response.ok) {
      if (response.status === 429) {
        console.warn(`Rate limit hit for ${ticker}, using fallback data`);
        throw new Error('Rate limit exceeded');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const result = data.results?.[0];
    
    if (!result) {
      throw new Error('No data available');
    }
    
    return {
      ticker: ticker.replace('X:', ''),
      name: getTokenName(ticker),
      price: result.c,
      change: Number((((result.c - result.o) / result.o) * 100).toFixed(2)),
      volume: result.v,
      high: result.h,
      low: result.l,
    };
  } catch (error) {
    console.warn(`Failed to fetch ${ticker}:`, error);
    // Return fallback data for this ticker
    return {
      ticker: ticker.replace('X:', ''),
      name: getTokenName(ticker),
      price: getFallbackPrice(ticker),
      change: getFallbackChange(ticker),
      volume: 0,
      high: 0,
      low: 0,
    };
  }
}

// Fetcher function for trending markets
async function fetchTrendingMarkets(): Promise<MarketData[]> {
  try {
    const results = await Promise.all(
      TRENDING_TOKENS.map(async (ticker) => {
        const ohlcData = await fetchTickerOHLC(`X:${ticker}`);
        return {
          symbol: ohlcData.ticker, // Use the full ticker (e.g., "BTCUSD")
          name: ohlcData.name,
          price: ohlcData.price,
          change: ohlcData.change,
        };
      })
    );
    return results;
  } catch (error) {
    console.error('Failed to fetch trending markets:', error);
    return mockMarkets;
  }
}

// Fetcher function for all crypto data (for the main table)
async function fetchAllCryptoData(): Promise<CryptoTableData[]> {
  try {
    // First get the list of all crypto tickers
    const tickers = await fetchCryptoTickers();
    
    // Use all available tickers (up to 1000)
    const limitedTickers = tickers.slice(0, 1000);
    
    // Fetch OHLC data for each ticker
    const results = await Promise.all(
      limitedTickers.map(async (tickerData: TickerData, index: number) => {
        try {
          const ohlcData = await fetchTickerOHLC(tickerData.ticker);
          // Extract the symbol from the ticker (e.g., "X:BTCUSD" -> "BTCUSD")
          const symbol = tickerData.ticker.replace('X:', '');
          return {
            rank: index + 1,
            name: tickerData.base_currency_name || ohlcData.name,
            symbol: symbol, // Use the full ticker symbol
            price: `$${ohlcData.price.toLocaleString()}`,
            marketCap: `$${(ohlcData.price * (Math.random() * 1000000 + 100000)).toLocaleString()}`,
            circulating: `${(Math.random() * 1000000 + 100000).toLocaleString()}`,
            volume: `$${(ohlcData.volume * ohlcData.price).toLocaleString()}`,
            change1h: `${(Math.random() * 10 - 5).toFixed(2)}%`,
            change24h: `${ohlcData.change.toFixed(2)}%`,
            change7d: `${(Math.random() * 20 - 10).toFixed(2)}%`,
          };
        } catch (error) {
          console.warn(`Failed to fetch data for ${tickerData.ticker}:`, error);
          const symbol = tickerData.ticker.replace('X:', '');
          return {
            rank: index + 1,
            name: tickerData.base_currency_name || 'Unknown',
            symbol: symbol, // Use the full ticker symbol
            price: '$0.00',
            marketCap: '$0',
            circulating: '0',
            volume: '$0',
            change1h: '0.00%',
            change24h: '0.00%',
            change7d: '0.00%',
          };
        }
      })
    );
    
    return results;
  } catch (error) {
    console.error('Failed to fetch all crypto data:', error);
    return cryptoCurrencies;
  }
}

// Rename page to Page for React component convention
const Page = () => {
  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage] = React.useState(30);
  
  // Filter and search state
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortBy, setSortBy] = React.useState<'name' | 'price' | 'volume' | 'change24h'>('name');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
  const [volumeFilter, setVolumeFilter] = React.useState<'all' | 'high' | 'medium' | 'low'>('all');

  const { data: markets = mockMarkets } = useQuery({
    queryKey: ['trending-markets'],
    queryFn: fetchTrendingMarkets,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 4, // Only retry once to avoid hitting rate limits
    retryDelay: 60000, // Wait 1 minute before retrying
  })

  const { data: cryptoTableData = cryptoCurrencies } = useQuery({
    queryKey: ['crypto-table-data'],
    queryFn: fetchAllCryptoData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2, // Only retry twice to avoid hitting rate limits
    retryDelay: 60000, // Wait 1 minute before retrying
  })

  // For demo, favorites are just the first two
  const favorites = markets.slice(0, 2)

  // Filter and sort the crypto data
  const filteredAndSortedData = React.useMemo(() => {
    let filtered = cryptoTableData;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(token => 
        token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.symbol.replace('USD', '').toLowerCase().includes(searchTerm.toLowerCase()) // Search by base currency too
      );
    }

    // Apply volume filter
    if (volumeFilter !== 'all') {
      filtered = filtered.filter(token => {
        const volume = parseFloat(token.volume.replace(/[$,]/g, ''));
        switch (volumeFilter) {
          case 'high': return volume > 1000000; // > $1M
          case 'medium': return volume > 100000 && volume <= 1000000; // $100K - $1M
          case 'low': return volume <= 100000; // < $100K
          default: return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = parseFloat(a.price.replace(/[$,]/g, ''));
          bValue = parseFloat(b.price.replace(/[$,]/g, ''));
          break;
        case 'volume':
          aValue = parseFloat(a.volume.replace(/[$,]/g, ''));
          bValue = parseFloat(b.volume.replace(/[$,]/g, ''));
          break;
        case 'change24h':
          aValue = parseFloat(a.change24h.replace('%', ''));
          bValue = parseFloat(b.change24h.replace('%', ''));
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [cryptoTableData, searchTerm, sortBy, sortOrder, volumeFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredAndSortedData.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, sortOrder, volumeFilter]);

  return (
    <div className="w-full h-full">
      {/* Main Content */}
      <div className="p-4 lg:p-6 space-y-4 lg:space-y-6 min-w-0">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Markets</h1>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
          {/* Markets Section */}
          <Card className="bg-crypto-card border-crypto-border p-4 lg:p-6">
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
                        {token.symbol.includes('BTC') && <Bitcoin />}
                        {token.symbol.includes('ETH') && <User />}
                        {token.symbol.includes('SOL') && <User />}
                        {token.symbol.includes('DOGE') && <User />}
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
          <Card className="bg-crypto-card border-crypto-border p-4 lg:p-6">
            <div className="flex items-center justify-between mb-4 lg:mb-6">
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
                        {token.symbol.includes('BTC') && <Bitcoin />}
                        {token.symbol.includes('ETH') && <User />}
                        {token.symbol.includes('SOL') && <User />}
                        {token.symbol.includes('DOGE') && <User />}
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
        <Card className="bg-crypto-card border-crypto-border p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 lg:mb-6 gap-4">
            <div className="flex items-center space-x-4">
              <h3>Crypto currency</h3>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Top {filteredAndSortedData.length} tokens</span>
              <Button variant="default" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add favorites
              </Button>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-col lg:flex-row gap-4 mb-4 p-4 bg-background rounded-lg border border-crypto-border">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search tokens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-crypto-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Volume Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Volume:</span>
              <select
                value={volumeFilter}
                onChange={(e) => setVolumeFilter(e.target.value as any)}
                className="px-3 py-2 bg-background border border-crypto-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All</option>
                <option value="high">High (&gt;$1M)</option>
                <option value="medium">Medium ($100K-$1M)</option>
                <option value="low">Low (&lt;$100K)</option>
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-background border border-crypto-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="volume">Volume</option>
                <option value="change24h">24h Change</option>
              </select>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-2"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </div>
          </div>

          <div className="gap-4 overflow-x-auto custom-scrollbar">
            <Table className='w-full min-w-[600px] lg:min-w-[800px] xl:min-w-[1000px]'>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Rank</TableHead>
                  <TableHead className="min-w-[120px]">Name</TableHead>
                  <TableHead className="w-16">Symbol</TableHead>
                  <TableHead className="min-w-[100px] hidden lg:table-cell">Market Cap</TableHead>
                  <TableHead className="min-w-[80px]">Price</TableHead>
                  <TableHead className="min-w-[120px] hidden xl:table-cell">Circulating Supply</TableHead>
                  <TableHead className="min-w-[100px] hidden lg:table-cell">Volume(24h)</TableHead>
                  <TableHead className="w-16">% 1h</TableHead>
                  <TableHead className="w-16">% 24h</TableHead>
                  <TableHead className="w-16 hidden md:table-cell">% 7d</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((token) => (
                  <TableRow key={token.rank}>
                    <TableCell className="w-12">{token.rank}</TableCell>
                    <TableCell className="min-w-[120px]">{token.name}</TableCell>
                    <TableCell className="w-16">{token.symbol}</TableCell>
                    <TableCell className="min-w-[100px] hidden lg:table-cell">{token.marketCap}</TableCell>
                    <TableCell className="min-w-[80px]">{token.price}</TableCell>
                    <TableCell className="min-w-[120px] hidden xl:table-cell">{token.circulating}</TableCell>
                    <TableCell className="min-w-[100px] hidden lg:table-cell">{token.volume}</TableCell>
                    <TableCell className="w-16">{token.change1h}</TableCell>
                    <TableCell className="w-16">{token.change24h}</TableCell>
                    <TableCell className="w-16 hidden md:table-cell">{token.change7d}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-crypto-border">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedData.length)} of {filteredAndSortedData.length} tokens
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:text-white"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center space-x-1">
                  {/* Always show first page */}
                  <Button
                    variant={currentPage === 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(1)}
                    className="w-8 h-8 p-0 hover:text-white"
                  >
                    1
                  </Button>

                  {/* Show ellipsis if there are pages before current */}
                  {currentPage > 4 && (
                    <span className="text-sm text-muted-foreground px-2">...</span>
                  )}

                  {/* Show pages around current page */}
                  {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (currentPage <= 3) {
                      pageNum = i + 2; // Show pages 2, 3, 4
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 3 + i; // Show last 3 pages
                    } else {
                      pageNum = currentPage - 1 + i; // Show current page and 2 around it
                    }
                    
                    // Only show if page number is valid and not already shown
                    if (pageNum > 1 && pageNum < totalPages && pageNum !== 1) {
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className="w-8 h-8 p-0 hover:text-white"
                        >
                          {pageNum}
                        </Button>
                      );
                    }
                    return null;
                  })}

                  {/* Show ellipsis if there are pages after current */}
                  {currentPage < totalPages - 3 && (
                    <span className="text-sm text-muted-foreground px-2">...</span>
                  )}

                  {/* Always show last page if there are more than 1 page */}
                  {totalPages > 1 && (
                    <Button
                      variant={currentPage === totalPages ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(totalPages)}
                      className="w-8 h-8 p-0 hover:text-white"
                    >
                      {totalPages}
                    </Button>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:text-white"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
        <Card className="bg-crypto-card border-crypto-border p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 lg:mb-6 gap-4">
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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