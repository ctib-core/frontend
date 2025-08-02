"use client"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Search, BookOpen, FileText, Code, Download, ExternalLink, ChevronRight, Star, GitBranch, Calendar } from 'lucide-react'
import React from 'react'

// Mock README content
const README_SECTIONS = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    content: `# Predict - DeFi Trading Platform

## Overview
Predict is a comprehensive DeFi trading platform built with Next.js, React, and TypeScript. It provides advanced trading capabilities, portfolio management, and yield farming features.

## Features
- **CFD Trading**: Advanced contract for difference trading with real-time charts
- **Portfolio Management**: Track your crypto assets and performance
- **Yield Farming**: Earn rewards through liquidity provision
- **Lending Platform**: Borrow against your crypto collateral
- **Token Swapping**: Seamless token exchange with low fees
- **Wallet Integration**: Secure wallet management with Particle Network

## Quick Start
1. Clone the repository
2. Install dependencies: \`npm install\`
3. Set up environment variables
4. Run the development server: \`npm run dev\`
5. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables
\`\`\`env
NEXT_PUBLIC_POLYGON_API_KEY=your_polygon_api_key
NEXT_PUBLIC_PARTICLE_PROJECT_ID=your_particle_project_id
NEXT_PUBLIC_PARTICLE_CLIENT_KEY=your_particle_client_key
NEXT_PUBLIC_PARTICLE_APP_ID=your_particle_app_id
\`\`\``
  },
  {
    id: 'trading-guide',
    title: 'Trading Guide',
    content: `# Trading Guide

## CFD Trading
Our platform supports Contract for Difference (CFD) trading on major cryptocurrencies:

### Supported Tokens
- **BTCUSD**: Bitcoin/USD pair
- **ETHUSD**: Ethereum/USD pair  
- **USDCUSD**: USD Coin/USD pair
- **USDTUSD**: Tether/USD pair

### Trading Features
- **Real-time Charts**: Powered by TradingView
- **Lot Size Management**: Micro, Mini, and Standard lots
- **Take Profit/Stop Loss**: Automated risk management
- **Risk:Reward Ratios**: 1:3, 1:5, 1:7 presets
- **Position History**: Track all your trades

### How to Trade
1. Select your preferred token
2. Choose Buy or Sell position
3. Set your lot size
4. Configure Take Profit and Stop Loss
5. Review and confirm your trade

### Risk Management
- Always use stop losses
- Never risk more than 2% per trade
- Diversify your portfolio
- Monitor market conditions`
  },
  {
    id: 'api-reference',
    title: 'API Reference',
    content: `# API Reference

## Polygon.io Integration
We use Polygon.io for real-time market data:

### Endpoints
- **Ticker List**: \`/v3/reference/tickers\`
- **OHLC Data**: \`/v2/aggs/ticker/{ticker}/prev\`
- **Crypto Open/Close**: \`/v1/open-close/crypto/{from}/{to}/{date}\`

### Rate Limits
- Free tier: 5 requests per minute
- Paid tier: 1000 requests per minute

## TradingView Integration
Real-time charts powered by TradingView:

### Configuration
\`\`\`typescript
const widgetConfig = {
  symbol: 'BINANCE:BTCUSDT',
  interval: '15',
  theme: 'dark',
  style: '1',
  studies: ['RSI@tv-basicstudies']
}
\`\`\`

## Particle Network
Wallet integration using Particle Network:

### Authentication
- Social logins (Google, Twitter, etc.)
- Email/password authentication
- Wallet connection (MetaMask, WalletConnect)

### Features
- Multi-chain support
- Transaction signing
- Account abstraction`
  },
  {
    id: 'deployment',
    title: 'Deployment',
    content: `# Deployment Guide

## Production Build
\`\`\`bash
npm run build
npm start
\`\`\`

## Vercel Deployment
1. Connect your GitHub repository
2. Configure environment variables
3. Deploy automatically on push

## Docker Deployment
\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

## Environment Setup
- **Development**: \`npm run dev\`
- **Production**: \`npm start\`
- **Testing**: \`npm test\`

## Performance Optimization
- Image optimization with Next.js
- Code splitting and lazy loading
- CDN integration for static assets
- Caching strategies for API calls`
  }
];

const Page = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeSection, setActiveSection] = React.useState('getting-started');

  const filteredSections = README_SECTIONS.filter(section =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeContent = README_SECTIONS.find(section => section.id === activeSection);

  return (
    <div className="w-full h-full">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Documentation</h1>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              View on GitHub
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <Card className="bg-crypto-card border-crypto-border p-6 lg:col-span-1">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Search Documentation</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search docs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-background border border-crypto-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3">Table of Contents</h3>
                <div className="space-y-1">
                  {README_SECTIONS.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        activeSection === section.id
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-crypto-card'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-4 h-4" />
                        <span>{section.title}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-crypto-border">
                <h4 className="text-sm font-semibold mb-2">Quick Links</h4>
                <div className="space-y-1">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Code className="w-4 h-4 mr-2" />
                    API Reference
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Trading Guide
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    GitHub Repository
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Main Content */}
          <Card className="bg-crypto-card border-crypto-border p-6 lg:col-span-3">
            <div className="space-y-6">
              {/* Breadcrumb */}
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>Documentation</span>
                <ChevronRight className="w-4 h-4" />
                <span>{activeContent?.title}</span>
              </div>

              {/* Content */}
              <div className="prose prose-invert max-w-none">
                <div className="bg-background rounded-lg p-6 border border-crypto-border">
                  <pre className="whitespace-pre-wrap text-sm font-mono text-foreground">
                    {activeContent?.content}
                  </pre>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-crypto-border">
                <Button variant="outline" size="sm">
                  <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
                  Previous
                </Button>
                <div className="flex items-center space-x-4">
                  <Badge variant="outline">
                    <Star className="w-3 h-3 mr-1" />
                    Updated 2 days ago
                  </Badge>
                  <Badge variant="outline">
                    <GitBranch className="w-3 h-3 mr-1" />
                    v1.2.0
                  </Badge>
                </div>
                <Button variant="outline" size="sm">
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Additional Resources */}
        <Card className="bg-crypto-card border-crypto-border p-6">
          <h3 className="text-lg font-semibold mb-4">Additional Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-background rounded-lg border border-crypto-border">
              <div className="flex items-center space-x-3 mb-2">
                <BookOpen className="w-5 h-5 text-blue-500" />
                <h4 className="font-medium">Tutorials</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Step-by-step guides for getting started with trading
              </p>
            </div>
            <div className="p-4 bg-background rounded-lg border border-crypto-border">
              <div className="flex items-center space-x-3 mb-2">
                <Code className="w-5 h-5 text-green-500" />
                <h4 className="font-medium">API Docs</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Complete API reference for developers
              </p>
            </div>
            <div className="p-4 bg-background rounded-lg border border-crypto-border">
              <div className="flex items-center space-x-3 mb-2">
                <FileText className="w-5 h-5 text-purple-500" />
                <h4 className="font-medium">Examples</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Code examples and use cases
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Page; 