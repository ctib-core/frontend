import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Bitcoin, ChevronDown, Icon, Minus, Plus, User } from 'lucide-react'
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

const page = () => {
  return (
    <div className="flex-1 flex">
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
                  <TableRow className='border-b-2 border-gray-50'>
                    <TableCell className="font-medium"><Bitcoin /></TableCell>
                    <TableCell>Bitcoin</TableCell>
                    <TableCell>$120,090</TableCell>
                    <TableCell className="text-right">+2.3%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </Card>
          <Card className="bg-crypto-card border-crypto-border p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <h3>Top gainers</h3>
              </div>
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
                  <TableRow>
                    <TableCell className="font-medium"><Bitcoin /></TableCell>
                    <TableCell>Bitcoin</TableCell>
                    <TableCell>$120,090</TableCell>
                    <TableCell className="text-right">+2.3%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </Card>
          {/* Markets Section */}
        </div>
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

export default page