import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, TrendingUp, DollarSign, Lock, Zap, Building } from "lucide-react";

const FeaturesSection = () => {
  return (
    <section className="py-20 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Trading Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-foreground">
              Master the art of <span className="text-primary">prediction</span>
            </h2>
            <h2 className="text-4xl font-bold text-foreground">
              and <span className="text-primary">simulation</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Practice with virtual funds, test strategies, and learn from market movements
              without financial risk. Build confidence before real trading.
            </p>
            <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90">
              Start Simulation →
            </Button>
          </div>

          <Card className="bg-crypto-card border-crypto-border p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">SIMULATION PORTFOLIO</span>
              <div className="bg-primary/20 px-3 py-1 rounded-full">
                <span className="text-primary text-sm font-semibold">94% Accuracy</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground mb-2">$50K Virtual</div>
            <div className="bg-gradient-primary h-2 rounded-full w-3/4 mb-4"></div>
            <div className="text-2xl font-bold text-primary">+$12,450</div>
          </Card>
        </div>

        {/* Income Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <Card className="bg-crypto-card border-crypto-border p-6 shadow-card order-2 md:order-1">
            <h3 className="text-2xl font-bold text-foreground mb-6">Build your</h3>
            <h3 className="text-2xl font-bold text-primary mb-6">prediction skills</h3>
            <p className="text-muted-foreground mb-6">
              Track your prediction accuracy and learn from market patterns
              to improve your trading decision-making abilities.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-3xl font-bold text-primary">87%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">156</div>
                <div className="text-sm text-muted-foreground">Predictions Made</div>
              </div>
            </div>
          </Card>

          <div className="space-y-6 order-1 md:order-2">
            <h2 className="text-4xl font-bold text-foreground">
              Build your
            </h2>
            <h2 className="text-4xl font-bold text-primary">
              prediction skills
            </h2>
            <p className="text-lg text-muted-foreground">
              Track your prediction accuracy and learn from market patterns
              to improve your trading decision-making abilities.
            </p>
          </div>
        </div>

        {/* Trust Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-foreground">
              The most <span className="text-primary">trusted</span>
            </h2>
            <h2 className="text-4xl font-bold text-primary">
              cryptocurrency platform
            </h2>
            <p className="text-lg text-muted-foreground">
              Coinbase is the trusted and secured platform that lets
              you buy, sell and store cryptocurrency.
            </p>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6 text-primary" />
                <div>
                  <h4 className="font-semibold text-foreground">Secure storage</h4>
                  <p className="text-sm text-muted-foreground">We store the vast majority of the digital assets in secure offline storage.</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Lock className="w-6 h-6 text-primary" />
                <div>
                  <h4 className="font-semibold text-foreground">Protected by insurance</h4>
                  <p className="text-sm text-muted-foreground">Coinbase maintains crypto insurance and all USD cash balances are covered by FDIC insurance.</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Building className="w-6 h-6 text-primary" />
                <div>
                  <h4 className="font-semibold text-foreground">Industry best practices</h4>
                  <p className="text-sm text-muted-foreground">Coinbase supports a variety of the most popular digital currencies.</p>
                </div>
              </div>
            </div>
          </div>

          <Card className="bg-crypto-card border-crypto-border p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">PRODUCTS</span>
              <div className="bg-primary/20 px-3 py-1 rounded-full">
                <span className="text-primary text-sm font-semibold">Active</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground mb-2">$85,914.20</div>
            <div className="text-sm text-muted-foreground mb-4">Balance details</div>

            <div className="space-y-3">
              <div className="text-2xl font-bold text-primary">$3,236,091.00</div>
              <div className="text-sm text-muted-foreground">In wallets (64 BTC)</div>

              <div className="flex justify-between">
                <span className="text-foreground">$9,191.00</span>
                <span className="text-foreground">$3,191.00</span>
              </div>

              <div className="bg-primary/20 px-4 py-2 rounded-lg">
                <span className="text-primary font-semibold">COMPLIANT</span>
              </div>

              <div className="text-xl font-bold text-foreground">$23,124.50</div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;