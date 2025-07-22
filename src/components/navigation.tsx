import { Button } from "@/components/ui/button";

const Navigation = () => {
  return (
    <nav className="bg-background border-b border-crypto-border px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-lg">T</span>
          </div>
          <span className="text-xl font-bold text-foreground">DIGITAL MONEY</span>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-foreground hover:text-primary transition-colors">Features</a>
          <a href="#" className="text-foreground hover:text-primary transition-colors">Exchange</a>
          <a href="#" className="text-foreground hover:text-primary transition-colors">About Us</a>
          <a href="#" className="text-foreground hover:text-primary transition-colors">Contact us</a>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-foreground hover:text-primary">
            Login
          </Button>
          <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90 font-semibold">
            Sign up
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;