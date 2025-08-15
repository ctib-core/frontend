# Prediction Market Simulation Platform

A sophisticated Next.js-based prediction market simulation platform that allows users to practice trading with virtual funds, analyze market patterns, and build confidence before risking real capital in prediction markets.

## 🎯 Project Overview

This platform provides a risk-free environment for users to master prediction trading through advanced simulation features, real-time market data, and comprehensive analytics. Built with modern web technologies and blockchain integration, it offers a complete trading experience without financial risk.

## ✨ Key Features

### 🎮 Simulation Trading
- **Virtual Portfolio Management**: Practice with $50K virtual funds
- **Risk-Free Learning**: Test strategies without financial consequences
- **Real-Time Market Data**: Access live prediction market information
- **Performance Tracking**: Monitor accuracy rates and trading success

### 📊 Advanced Analytics
- **Prediction Accuracy Tracking**: Monitor success rates (87% average)
- **Portfolio Performance**: Real-time virtual profit/loss tracking
- **Market Analysis**: AI-powered market insights and trends
- **Historical Data**: Comprehensive trading history and analytics

### 🔗 Blockchain Integration
- **Particle Network ConnectKit**: Seamless wallet connectivity
- **Multi-Chain Support**: Core DAO, Core Testnet, Solana
- **Social Login**: Email, Google, Apple, Twitter, GitHub authentication
- **Universal Account SDK**: Advanced wallet management

### 🎨 Modern UI/UX
- **Dark Theme Design**: Professional crypto-focused interface
- **Responsive Layout**: Optimized for all device sizes
- **Interactive Charts**: Real-time data visualization
- **Smooth Animations**: Enhanced user experience

## 🛠️ Technology Stack

### Frontend Framework
- **Next.js 15.3.5**: React framework with App Router
- **React 19**: Latest React features and performance
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Modern utility-first CSS framework

### UI Components
- **Radix UI**: Accessible component primitives
- **Lucide React**: Beautiful icon library
- **Recharts**: Data visualization components
- **Sonner**: Toast notifications

### Blockchain & Web3
- **Particle Network**: Wallet connectivity and authentication
- **Ethers.js**: Ethereum interaction
- **Viem**: Type-safe Ethereum interactions
- **React Query**: Data fetching and caching

### Development Tools
- **ESLint**: Code linting and formatting
- **pnpm**: Fast package management
- **Turbopack**: Next.js bundler for development

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Particle Network account and API keys

### Environment Setup
Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_PROJECT_ID=your_particle_project_id
NEXT_PUBLIC_CLIENT_KEY=your_particle_client_key
NEXT_PUBLIC_APP_ID=your_particle_app_id
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ctib-core/frontend.git
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── app/               # Main application pages
│   │   │   ├── markets/       # Market trading interface
│   │   │   ├── portfolio/     # Portfolio dashboard
│   │   │   ├── trading/       # Trading interface
│   │   │   ├── wallet/        # Wallet management
│   │   │   ├── vaults/        # Vault features
│   │   │   ├── swap/          # Token swapping
│   │   │   └── ui/            # UI component examples
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing page
│   ├── components/            # Reusable components
│   │   ├── ui/               # Base UI components
│   │   ├── cryptoHub.tsx     # Market hub component
│   │   ├── hero.tsx          # Landing hero section
│   │   ├── sidebar.tsx       # Navigation sidebar
│   │   └── portfolioDashboard.tsx # Portfolio interface
│   ├── lib/                  # Utility libraries
│   │   ├── particle.tsx      # Particle Network config
│   │   └── utils.ts          # Utility functions
│   └── utils/                # Type definitions
├── public/                   # Static assets
├── package.json              # Dependencies and scripts
└── README.md                # Project documentation
```

## 🎮 Available Features

### Landing Page (`/`)
- Hero section with platform introduction
- Feature showcase with simulation benefits
- Live prediction markets display
- Call-to-action sections

### Main Application (`/app`)
- **Portfolio Dashboard**: Virtual portfolio management
- **Markets**: Live prediction market trading
- **Trading Interface**: Advanced trading tools
- **Wallet Management**: Secure wallet connectivity
- **Vaults**: Yield farming and staking
- **Swap**: Token exchange functionality

### UI Components (`/app/ui`)
- Menu styles and navigation
- Data tables and forms
- Chart components and modals
- Pricing and settings interfaces

## 🔧 Development Scripts

```bash
# Development server with Turbopack
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

## 🎨 Design System

### Color Palette
- **Primary**: `#b6ff3b` (Neon Green)
- **Background**: `#0a0f1a` (Dark Blue)
- **Card**: `rgba(16,20,26,0.85)` (Semi-transparent)
- **Border**: `#23272f` (Dark Gray)
- **Text**: `#f1f5f9` (Light Gray)

### Typography
- **Font Family**: Geist Sans (Primary), Geist Mono (Code)
- **Responsive Design**: Mobile-first approach
- **Custom Scrollbars**: Styled for dark theme

## 🔐 Security Features

- **Particle Network Integration**: Secure wallet authentication
- **Environment Variables**: Secure API key management
- **TypeScript**: Type-safe development
- **ESLint**: Code quality and security checks

## 📈 Performance Optimizations

- **Next.js 15**: Latest performance features
- **Turbopack**: Fast development bundling
- **Image Optimization**: Next.js built-in optimization
- **Code Splitting**: Automatic route-based splitting
- **React Query**: Efficient data fetching and caching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is part of the CTIB Core ecosystem. Please refer to the project maintainers for licensing information.

## 🔗 Links

- **Repository**: https://github.com/ctib-core/frontend/
- **Particle Network**: https://particle.network/
- **Next.js Documentation**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in `/app/documentation`
- Contact the development team

---

**Built with ❤️ using Next.js, React, and Particle Network**
