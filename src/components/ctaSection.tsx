import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-20 px-6 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-primary rounded-2xl p-12 text-center shadow-glow">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Ready to start trading?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join thousands of traders mastering prediction markets. Start with virtual funds,
            build your skills, and prepare for real-world trading success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-background text-foreground hover:bg-background/90 font-semibold px-8 py-4 text-lg cursor-pointer"
            >
              Start Free Simulation
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-background text-primary-foreground hover:bg-background/10 bg-transparent font-semibold px-8 py-4 text-lg cursor-pointer"
            >
              View Live Markets
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;