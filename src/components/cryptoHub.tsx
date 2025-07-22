import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown } from "lucide-react";

const CryptoHub = () => {
  const predictionMarkets = [
    { name: "BTC $100K", symbol: "BTC", confidence: "78%", payout: "2.3x", trend: "up" },
    { name: "ETH ATH", symbol: "ETH", confidence: "65%", payout: "1.8x", trend: "up" },
    { name: "Fed Rate Cut", symbol: "FED", confidence: "43%", payout: "3.1x", trend: "down" },
    { name: "SOL $300", symbol: "SOL", confidence: "71%", payout: "2.7x", trend: "up" },
    { name: "Tech Crash", symbol: "TECH", confidence: "28%", payout: "4.2x", trend: "down" },
    { name: "Gold Rally", symbol: "GOLD", confidence: "82%", payout: "1.5x", trend: "up" },
    { name: "Oil Spike", symbol: "OIL", confidence: "55%", payout: "2.9x", trend: "up" },
    { name: "Housing Drop", symbol: "REIT", confidence: "38%", payout: "3.8x", trend: "down" },
    { name: "USD Strong", symbol: "DXY", confidence: "90%", payout: "1.2x", trend: "up" },
  ];

  return (
    <section className="py-20 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Live Prediction
          </h2>
          <h2 className="text-4xl font-bold text-primary">
            Markets
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
          {predictionMarkets.map((market, index) => (
            <Card key={index} className="bg-crypto-card border-crypto-border p-4 hover:border-primary/50 transition-all duration-300 cursor-pointer">
              <div className="text-center space-y-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-full mx-auto flex items-center justify-center">
                  <span className="text-xs font-bold text-primary-foreground">
                    {market.symbol.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">{market.name}</h3>
                  <p className="text-xs text-muted-foreground">{market.symbol}</p>
                </div>
                <div className="text-sm font-bold text-foreground">{market.confidence}</div>
                <div className={`flex items-center justify-center space-x-1 text-xs ${market.trend === 'up' ? 'text-primary' : market.trend === 'down' ? 'text-red-500' : 'text-muted-foreground'
                  }`}>
                  {market.trend === 'up' && <TrendingUp className="w-3 h-3" />}
                  {market.trend === 'down' && <TrendingDown className="w-3 h-3" />}
                  <span>{market.payout}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Unique Features */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-foreground">
              Why choose our <span className="text-primary">prediction platform?</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Experience the most advanced prediction market simulation with real-time data,
              sophisticated analytics, and risk-free trading to master your skills.
            </p>

            <div className="space-y-4">
              <div className="bg-crypto-card border border-crypto-border rounded-lg p-4">
                <h4 className="font-semibold text-foreground mb-2">AI-Powered Market Analysis</h4>
              </div>
              <div className="bg-crypto-card border border-crypto-border rounded-lg p-4">
                <h4 className="font-semibold text-foreground mb-2">Real-Time Prediction Tracking</h4>
              </div>
            </div>
          </div>

          <Card className="bg-crypto-card border-crypto-border p-6 shadow-card">
            <div className="text-center mb-6">
              <div className="text-sm text-muted-foreground mb-2">Portfolio Performance</div>
              <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto mb-4"></div>
              <div className="text-sm text-muted-foreground">Virtual trading gains</div>
            </div>

            <div className="space-y-4">
              {[
                { name: "BTC $100K", profit: "+$2,450", status: "Won", icon: "₿" },
                { name: "ETH Rally", profit: "+$1,890", status: "Won", icon: "Ξ" },
                { name: "Fed Cut", profit: "+$3,200", status: "Active", icon: "📈" },
                { name: "Tech Crash", profit: "-$890", status: "Lost", icon: "📉" }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-primary-foreground">{item.icon}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-foreground text-sm">{item.name}</div>
                      <div className={`text-xs ${item.profit.startsWith('+') ? 'text-primary' : 'text-red-500'}`}>{item.profit}</div>
                    </div>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded ${item.status === 'Won' ? 'text-primary bg-primary/20' :
                      item.status === 'Lost' ? 'text-red-500 bg-red-500/20' :
                        'text-yellow-500 bg-yellow-500/20'
                    }`}>
                    {item.status}
                  </div>
                </div>
              ))}
            </div>

            <Button className="w-full mt-6 bg-gradient-primary text-primary-foreground hover:opacity-90">
              View All Trades →
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CryptoHub;