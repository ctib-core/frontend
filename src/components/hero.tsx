import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrendingUp, BarChart3, DollarSign } from "lucide-react";

const HeroSection = () => {
  return (
    <section className=" py-20 px-6 flex flex-col md:flex-row items-center justify-between gap-12 px-8 pt-16 pb-24 max-w-7xl mx-auto z-10 relative">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Trade the <span className="text-primary">future with</span>
            </h1>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              prediction <span className="text-primary">markets</span>
            </h1>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              simulation
            </h1>
          </div>

          <p className="text-xl text-muted-foreground max-w-xl">
            Master the art of prediction trading with our advanced simulation platform.
            Practice with virtual funds, analyze market patterns, and build confidence
            before risking real capital in the world's most sophisticated prediction markets.
          </p>

          <div className="flex space-x-4">
            <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90 font-semibold px-8 py-3">
              Start Trading
            </Button>
            <Button variant="outline" className="border-crypto-border text-foreground hover:text-primary px-8 py-3">
              View Markets
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-crypto-card border-crypto-border p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">Prediction Accuracy</span>
              </div>
              <span className="text-2xl font-bold text-primary">+87.3%</span>
            </div>
            <div className="text-3xl font-bold text-foreground mb-2">Virtual Portfolio</div>
            <div className="text-sm text-muted-foreground">$50K → $78K simulated</div>

            <div className="mt-4 h-24 bg-gradient-to-r from-primary/20 to-primary/40 rounded-lg flex items-end">
              <div className="w-full h-12 bg-gradient-primary rounded-lg opacity-80"></div>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-crypto-card border-crypto-border p-4 shadow-card">
              <div className="flex items-center space-x-2 mb-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Predictions</span>
              </div>
              <div className="text-lg font-bold text-foreground">156</div>
            </Card>

            <Card className="bg-crypto-card border-crypto-border p-4 shadow-card">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Virtual Profit</span>
              </div>
              <div className="text-lg font-bold text-foreground">+$28K</div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;