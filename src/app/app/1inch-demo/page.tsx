"use client"
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import OneInchTradingExample from '@/components/OneInchTradingExample';
import { test1inchIntegration } from '@/lib/1inch';
import { ArrowLeft, Play, Zap } from 'lucide-react';
import Link from 'next/link';

export default function OneInchDemoPage() {
  const handleTestIntegration = async () => {
    try {
      await test1inchIntegration();
    } catch (error) {
      console.error('Integration test failed:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/app/trading">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Trading
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">1inch Integration Demo</h1>
            <p className="text-muted-foreground">
              Real-time trading with 1inch APIs and Limit Order Protocol
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleTestIntegration} variant="outline">
            <Play className="h-4 w-4 mr-2" />
            Test Integration
          </Button>
          <Badge variant="secondary">
            <Zap className="h-3 w-3 mr-1" />
            Live Demo
          </Badge>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Real-time Quotes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">Live</p>
            <p className="text-xs text-muted-foreground">
              Get instant price quotes from 1inch aggregator
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Limit Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">SDK</p>
            <p className="text-xs text-muted-foreground">
              Create and manage limit orders with 1inch Protocol
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">Multi-chain</p>
            <p className="text-xs text-muted-foreground">
              Track balances across multiple blockchains
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Demo */}
      <OneInchTradingExample 
        walletAddress="0x1234567890123456789012345678901234567890"
      />

      {/* Features List */}
      <Card>
        <CardHeader>
          <CardTitle>1inch Integration Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold">✅ Implemented</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Real-time market data and quotes</li>
                <li>• Token management and popular tokens</li>
                <li>• Limit order creation (mock implementation)</li>
                <li>• Portfolio overview and analytics</li>
                <li>• Multi-chain wallet balance tracking</li>
                <li>• AI-ready market data for predictions</li>
                <li>• Comprehensive error handling</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">🔄 In Progress</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Real SDK integration (currently mocked)</li>
                <li>• Actual blockchain transactions</li>
                <li>• Real-time order book data</li>
                <li>• Advanced portfolio analytics</li>
                <li>• Cross-chain trading</li>
                <li>• Gas optimization</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Status */}
      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Required Environment Variables</h4>
              <div className="bg-muted p-3 rounded-md">
                <code className="text-sm">NEXT_1INCH_API=your_1inch_api_key</code>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Get API Key</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Visit the 1inch Developer Portal to get your API key:
              </p>
              <Button asChild variant="outline" size="sm">
                <a 
                  href="https://portal.1inch.dev/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Get API Key
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
