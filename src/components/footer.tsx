const Footer = () => {
  return (
    <footer className="bg-background border-t border-crypto-border py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-lg">T</span>
              </div>
              <span className="text-xl font-bold text-foreground">DIGITAL MONEY</span>
            </div>
            <p className="text-muted-foreground">
              First and digital wallet rights reserved.
            </p>
            <div className="flex space-x-3">
              <div className="w-8 h-8 bg-crypto-card rounded-full flex items-center justify-center">
                <span className="text-primary text-sm">f</span>
              </div>
              <div className="w-8 h-8 bg-crypto-card rounded-full flex items-center justify-center">
                <span className="text-primary text-sm">t</span>
              </div>
              <div className="w-8 h-8 bg-crypto-card rounded-full flex items-center justify-center">
                <span className="text-primary text-sm">in</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Features</h4>
            <div className="space-y-2">
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Trading</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Wallet</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Exchange</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">API</a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Exchange</h4>
            <div className="space-y-2">
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Buy Crypto</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Sell Crypto</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Trade</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Markets</a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">About Us</h4>
            <div className="space-y-2">
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Company</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Careers</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Contact</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Support</a>
            </div>
          </div>
        </div>

        <div className="border-t border-crypto-border pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2024 Digital Money. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm mt-4 md:mt-0">
            The Future of Financial Privacy - Digital currency.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;