# Sentinel - AI Crypto Dashboard

**Your Personal Crypto AI Agent** - An intelligent cryptocurrency dashboard with AI assistant featuring real-time analysis, education, and portfolio management.

![Sentinel Dashboard](https://img.shields.io/badge/Next.js-15.5.4-black)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38bdf8)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🤖 **Dynamic AI Assistant**
Sentinel features three intelligent modes that automatically switch based on your queries:

- **📊 Analysis Mode** - Real-time crypto prices, market analysis, and technical indicators
- **📚 Education Mode** - Explain crypto concepts, DeFi, staking, and trading strategies
- **💼 Portfolio Mode** - Track holdings, P&L calculations, and portfolio insights

### 🚀 **Key Capabilities**

- **Real-time Data Integration** - Live crypto prices via CoinGecko API
- **Smart Context Switching** - AI automatically detects your intent and switches modes
- **Portfolio Management** - Track multiple assets, calculate P&L, and monitor performance
- **Interactive Chat Interface** - Natural language conversations with your crypto AI
- **Modern Dark UI** - Beautiful, responsive design with purple/blue gradients
- **Mobile Responsive** - Works perfectly on all devices

## 🛠️ **Tech Stack**

- **Frontend Framework:** Next.js 15.5.4 with App Router
- **React Version:** 19.1.0
- **Styling:** TailwindCSS 4.0
- **Icons:** Lucide React
- **Charts:** Recharts
- **API Integration:** Axios
- **Data Source:** CoinGecko API (Free Tier)

## 📁 **Project Structure**

```
src/
├── app/
│   ├── page.js              # Landing page
│   ├── dashboard/
│   │   └── page.js          # Main dashboard
│   ├── layout.js            # Root layout
│   └── globals.css          # Global styles
├── components/
│   ├── ChatInterface.js     # AI chat component
│   └── DashboardSidebar.js  # Portfolio sidebar
└── lib/
    └── sentinelCore.js      # AI logic & API integration
```

## 🚀 **Quick Start**

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sentinel-crypto-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 💡 **How to Use**

### Landing Page
- Modern landing page with hero section, features, pricing, and FAQ
- Click "Get Started" or "Start Free Trial" to access the dashboard

### Dashboard Features

#### **Chat with Sentinel**
Try these example queries:

- **Analysis Mode**
  - "What's the price of Bitcoin?"
  - "Show me Ethereum trends"
  - "Compare Bitcoin and Solana"

- **Education Mode**
  - "What is DeFi?"
  - "Explain staking rewards"
  - "How does market cap work?"

- **Portfolio Mode**
  - "Show my portfolio"
  - "What's my P&L?"
  - "Display my holdings"

#### **Portfolio Management**
- Add crypto assets with purchase price and amount
- Real-time portfolio value calculation
- Profit/Loss tracking with visual indicators
- Refresh button for latest prices

## 🔧 **Configuration**

### API Integration
The app uses CoinGecko's free API for cryptocurrency data:
- No API key required for basic usage
- Rate limits: 10-30 calls per minute
- Supports 10,000+ cryptocurrencies

### Customization
Easily customize Sentinel by modifying:

- **Trigger Keywords** (`src/lib/sentinelCore.js`)
- **Education Content** (`src/lib/sentinelCore.js`)
- **UI Colors** (`src/app/globals.css`)
- **Sample Portfolio** (`src/components/DashboardSidebar.js`)

## 🏗️ **Architecture**

### Core Components

1. **SentinelCore** - Main AI logic
   - Mode detection based on keywords
   - API integration for crypto data
   - Portfolio management
   - Response formatting

2. **ChatInterface** - Interactive chat UI
   - Message history
   - Real-time responses
   - Mode indicators
   - Typing animations

3. **DashboardSidebar** - Portfolio display
   - Asset management
   - P&L calculations
   - Market data visualization
   - Mode status indicator

### Data Flow
```
User Input → SentinelCore → Mode Detection → API Calls → Response Formatting → UI Update
```

## 📱 **Responsive Design**

- **Desktop:** Full sidebar and chat interface
- **Tablet:** Collapsible sidebar with mobile navigation
- **Mobile:** Stack layout with touch-optimized controls

## 🔒 **Security & Privacy**

- **No Private Keys Stored** - Portfolio data is client-side only
- **API Rate Limiting** - Built-in protection against excessive requests
- **CORS-Safe** - All API calls are properly configured
- **No Personal Data** - Anonymous usage, no registration required

## 🚀 **Deployment**

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Other Platforms
```bash
npm run build
npm start
```

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **CoinGecko API** for reliable cryptocurrency data
- **Lucide React** for beautiful icons
- **TailwindCSS** for utility-first styling
- **Next.js Team** for the amazing framework

## 📞 **Support**

If you encounter any issues or have questions:

- 🐛 **Bug Reports:** Open an issue with detailed reproduction steps
- 💡 **Feature Requests:** Describe your idea and use case
- ❓ **Questions:** Check existing issues or start a discussion

---

**Built with ❤️ using Next.js and the power of AI**
