/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Bitcoin, TrendingUp, TrendingDown, DollarSign, ArrowUpDown, Plus, Minus, X, Calculator, Clock, AlertCircle, CheckCircle } from 'lucide-react'
import React from 'react'

// Mock loan data
const AVAILABLE_LOANS = [
  { id: '1', name: 'BTC Collateral Loan', asset: 'BTC', collateral: 0.5, loanAmount: 15000, interestRate: 8.5, duration: '12 months', status: 'available', ltv: 70 },
  { id: '2', name: 'ETH Collateral Loan', asset: 'ETH', collateral: 2.0, loanAmount: 8000, interestRate: 7.2, duration: '6 months', status: 'available', ltv: 65 },
  { id: '3', name: 'USDC Collateral Loan', asset: 'USDC', collateral: 10000, loanAmount: 8500, interestRate: 5.5, duration: '3 months', status: 'available', ltv: 85 },
  { id: '4', name: 'SOL Collateral Loan', asset: 'SOL', collateral: 20, loanAmount: 3000, interestRate: 9.0, duration: '9 months', status: 'available', ltv: 60 }
];

const ACTIVE_LOANS = [
  { id: '1', name: 'BTC Loan #001', asset: 'BTC', collateral: 0.3, loanAmount: 9000, interestRate: 8.5, borrowedDate: '2024-01-15', dueDate: '2024-07-15', remainingAmount: 4500, status: 'active', nextPayment: 750, nextPaymentDate: '2024-02-15' },
  { id: '2', name: 'ETH Loan #002', asset: 'ETH', collateral: 1.5, loanAmount: 6000, interestRate: 7.2, borrowedDate: '2024-01-10', dueDate: '2024-04-10', remainingAmount: 3000, status: 'active', nextPayment: 500, nextPaymentDate: '2024-02-10' }
];

const LOAN_HISTORY = [
  { id: '1', name: 'BTC Loan #001', asset: 'BTC', loanAmount: 12000, repaidAmount: 12000, interestPaid: 1020, status: 'completed', startDate: '2023-06-15', endDate: '2023-12-15' },
  { id: '2', name: 'ETH Loan #002', asset: 'ETH', loanAmount: 8000, repaidAmount: 8000, interestPaid: 576, status: 'completed', startDate: '2023-09-01', endDate: '2023-12-01' }
];

const Page = () => {
  const [selectedLoan, setSelectedLoan] = React.useState<string | null>(null);
  const [showBorrowModal, setShowBorrowModal] = React.useState(false);
  const [showRepayModal, setShowRepayModal] = React.useState(false);

  const totalBorrowed = ACTIVE_LOANS.reduce((sum, loan) => sum + loan.loanAmount, 0);
  const totalRemaining = ACTIVE_LOANS.reduce((sum, loan) => sum + loan.remainingAmount, 0);
  const totalInterest = ACTIVE_LOANS.reduce((sum, loan) => sum + (loan.loanAmount * loan.interestRate / 100), 0);

  return (
    <div className="w-full h-full">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Loans</h1>
          <Button onClick={() => setShowBorrowModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Borrow
          </Button>
        </div>

        {/* Loan Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-crypto-card border-crypto-border p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Total Borrowed</h3>
              <DollarSign className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold text-foreground">${totalBorrowed.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Active loans</div>
          </Card>

          <Card className="bg-crypto-card border-crypto-border p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Remaining Debt</h3>
              <Calculator className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold text-foreground">${totalRemaining.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">To be repaid</div>
          </Card>

          <Card className="bg-crypto-card border-crypto-border p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Total Interest</h3>
              <TrendingUp className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold text-foreground">${totalInterest.toFixed(0)}</div>
            <div className="text-sm text-muted-foreground">Accrued interest</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Available Loans */}
          <Card className="bg-crypto-card border-crypto-border p-6">
            <h3 className="text-lg font-semibold mb-4">Available Loans</h3>
            <div className="space-y-3">
              {AVAILABLE_LOANS.map((loan) => (
                <div key={loan.id} className="p-4 bg-background rounded-lg border border-crypto-border">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-medium">{loan.name}</div>
                      <div className="text-sm text-muted-foreground">{loan.asset} Collateral</div>
                    </div>
                    <Badge variant="outline">{loan.ltv}% LTV</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="text-sm text-muted-foreground">Loan Amount</div>
                      <div className="font-medium">${loan.loanAmount.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Interest Rate</div>
                      <div className="font-medium">{loan.interestRate}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Duration</div>
                      <div className="font-medium">{loan.duration}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Collateral</div>
                      <div className="font-medium">{loan.collateral} {loan.asset}</div>
                    </div>
                  </div>
                  <Button className="w-full" onClick={() => setShowBorrowModal(true)}>
                    Borrow Now
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Active Loans */}
          <Card className="bg-crypto-card border-crypto-border p-6">
            <h3 className="text-lg font-semibold mb-4">Active Loans</h3>
            {ACTIVE_LOANS.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No active loans
              </div>
            ) : (
              <div className="space-y-3">
                {ACTIVE_LOANS.map((loan) => (
                  <div key={loan.id} className="p-4 bg-background rounded-lg border border-crypto-border">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium">{loan.name}</div>
                        <div className="text-sm text-muted-foreground">{loan.asset} Collateral</div>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <div className="text-sm text-muted-foreground">Remaining</div>
                        <div className="font-medium">${loan.remainingAmount.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Interest Rate</div>
                        <div className="font-medium">{loan.interestRate}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Next Payment</div>
                        <div className="font-medium">${loan.nextPayment}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Due Date</div>
                        <div className="font-medium">{loan.nextPaymentDate}</div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Repay
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Loan History */}
        <Card className="bg-crypto-card border-crypto-border p-6">
          <h3 className="text-lg font-semibold mb-4">Loan History</h3>
          <div className="space-y-3">
            {LOAN_HISTORY.map((loan) => (
              <div key={loan.id} className="flex items-center justify-between p-4 bg-background rounded-lg border border-crypto-border">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium">{loan.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {loan.startDate} - {loan.endDate}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${loan.loanAmount.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">
                    Interest: ${loan.interestPaid}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {loan.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Loan Calculator */}
        <Card className="bg-crypto-card border-crypto-border p-6">
          <h3 className="text-lg font-semibold mb-4">Loan Calculator</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Collateral Amount</label>
                <input
                  type="number"
                  placeholder="Enter collateral amount"
                  className="w-full px-3 py-2 bg-background border border-crypto-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Collateral Type</label>
                <select className="w-full px-3 py-2 bg-background border border-crypto-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>BTC</option>
                  <option>ETH</option>
                  <option>USDC</option>
                  <option>SOL</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Loan Duration</label>
                <select className="w-full px-3 py-2 bg-background border border-crypto-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>3 months</option>
                  <option>6 months</option>
                  <option>9 months</option>
                  <option>12 months</option>
                </select>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-background rounded-lg border border-crypto-border">
                <h4 className="font-medium mb-2">Loan Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Maximum Loan:</span>
                    <span className="font-medium">$15,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Interest Rate:</span>
                    <span className="font-medium">8.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Monthly Payment:</span>
                    <span className="font-medium">$1,250</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Interest:</span>
                    <span className="font-medium">$1,020</span>
                  </div>
                </div>
              </div>
              <Button className="w-full">
                <Calculator className="w-4 h-4 mr-2" />
                Calculate Loan
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Page; 