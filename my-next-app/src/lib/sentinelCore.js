// CryptoNexus Core - The brain of the crypto dashboard assistant
import axios from 'axios';

class SentinelCore {
  constructor() {
    this.modes = {
      ANALYSIS: 'analysis',
      EDUCATION: 'education', 
      PORTFOLIO: 'portfolio'
    };
    
    // Trigger keywords for each mode
    this.triggers = {
      [this.modes.ANALYSIS]: ['price', 'compare', 'ma', 'trend', 'volatile', 'volume', 'metrics', 'chart', 'technical'],
      [this.modes.EDUCATION]: ['what is', 'explain', 'how to', 'define', 'learn about', 'meaning', 'help', 'tutorial'],
      [this.modes.PORTFOLIO]: ['my portfolio', 'assets', 'p&l', 'holdings', 'balance', 'wallet', 'profit', 'loss']
    };
    
    this.cryptoData = new Map();
    this.portfolio = {
      assets: [],
      totalValue: 0,
      totalPnL: 0
    };
  }

  // Determine which mode to use based on user input
  determineMode(userInput) {
    const input = userInput.toLowerCase();
    
    // Check for portfolio triggers first (highest priority)
    if (this.triggers[this.modes.PORTFOLIO].some(trigger => input.includes(trigger))) {
      return this.modes.PORTFOLIO;
    }
    
    // Check for education triggers
    if (this.triggers[this.modes.EDUCATION].some(trigger => input.includes(trigger))) {
      return this.modes.EDUCATION;
    }
    
    // Check for analysis triggers
    if (this.triggers[this.modes.ANALYSIS].some(trigger => input.includes(trigger))) {
      return this.modes.ANALYSIS;
    }
    
    // Default to education mode for unclear queries
    return this.modes.EDUCATION;
  }

  // Process user query based on determined mode
  async processQuery(userInput) {
    const mode = this.determineMode(userInput);
    
    switch (mode) {
      case this.modes.ANALYSIS:
        return await this.handleAnalysisMode(userInput);
      case this.modes.EDUCATION:
        return await this.handleEducationMode(userInput);
      case this.modes.PORTFOLIO:
        return await this.handlePortfolioMode(userInput);
      default:
        return this.getDefaultResponse();
    }
  }

  // Analysis Mode Handler
  async handleAnalysisMode(input) {
    const response = {
      mode: this.modes.ANALYSIS,
      type: 'analysis',
      data: {},
      message: ''
    };

    try {
      // Extract potential crypto symbols from input
      const symbols = this.extractCryptoSymbols(input);
      
      if (symbols.length > 0) {
        const cryptoData = await this.fetchCryptoData(symbols);
        response.data = cryptoData;
        response.message = this.formatAnalysisResponse(cryptoData, input);
      } else {
        // Provide general market analysis
        const marketData = await this.fetchMarketOverview();
        response.data = marketData;
        response.message = this.formatMarketAnalysis(marketData);
      }
    } catch (error) {
      response.message = "I'm having trouble accessing market data right now. Please try again in a moment.";
    }

    return response;
  }

  // Education Mode Handler
  async handleEducationMode(input) {
    const response = {
      mode: this.modes.EDUCATION,
      type: 'education',
      data: {},
      message: ''
    };

    const educationTopics = {
      'apy': 'APY stands for Annual Percentage Yield. It\'s the real rate of return earned on a crypto investment, taking into account the effect of compounding interest.',
      'defi': 'DeFi (Decentralized Finance) refers to financial services built on blockchain technology that operate without traditional intermediaries like banks.',
      'staking': 'Staking is the process of actively participating in transaction validation on a proof-of-stake blockchain. You can earn rewards by locking up your tokens.',
      'liquidity': 'Liquidity refers to how easily an asset can be bought or sold without significantly affecting its price. High liquidity means easier trading.',
      'market cap': 'Market capitalization is the total value of a cryptocurrency, calculated by multiplying the current price by the total supply of coins.',
      'volatility': 'Volatility measures how much the price of a cryptocurrency fluctuates over time. Higher volatility means more price swings.',
      'trading volume': 'Trading volume is the total amount of a cryptocurrency traded within a specific time period, indicating market activity.',
      'bull market': 'A bull market is a period of rising prices and optimistic investor sentiment, typically lasting several months to years.',
      'bear market': 'A bear market is a period of falling prices and pessimistic investor sentiment, usually defined as a 20% decline from recent highs.'
    };

    // Find matching education topic
    const topic = Object.keys(educationTopics).find(key => 
      input.toLowerCase().includes(key)
    );

    if (topic) {
      response.message = educationTopics[topic];
      response.data.topic = topic;
    } else {
      response.message = "I'd be happy to explain crypto concepts! Try asking about topics like APY, DeFi, staking, liquidity, market cap, or volatility.";
    }

    return response;
  }

  // Portfolio Mode Handler
  async handlePortfolioMode(input) {
    const response = {
      mode: this.modes.PORTFOLIO,
      type: 'portfolio',
      data: this.portfolio,
      message: ''
    };

    if (this.portfolio.assets.length === 0) {
      response.message = "Your portfolio is currently empty. Connect your wallet or add assets to start tracking your holdings.";
    } else {
      if (input.includes('balance') || input.includes('value')) {
        response.message = `Your current portfolio value is $${this.portfolio.totalValue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}.`;
      } else if (input.includes('p&l') || input.includes('profit') || input.includes('loss')) {
        const pnlText = this.portfolio.totalPnL >= 0 ? 'profit' : 'loss';
        const pnlColor = this.portfolio.totalPnL >= 0 ? 'green' : 'red';
        response.message = `Your realized ${pnlText} is $${Math.abs(this.portfolio.totalPnL).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}.`;
        response.data.pnlColor = pnlColor;
      } else {
        response.message = `You have ${this.portfolio.assets.length} assets in your portfolio with a total value of $${this.portfolio.totalValue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}.`;
      }
    }

    return response;
  }

  // Utility Functions
  extractCryptoSymbols(input) {
    const commonCryptos = ['btc', 'bitcoin', 'eth', 'ethereum', 'ada', 'cardano', 'dot', 'polkadot', 'sol', 'solana', 'matic', 'polygon', 'avax', 'avalanche'];
    return commonCryptos.filter(symbol => input.toLowerCase().includes(symbol));
  }

  async fetchCryptoData(symbols) {
    try {
      // Using CoinGecko API - free tier
      const coinGeckoIds = this.mapSymbolsToCoinGeckoIds(symbols);
      const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price`, {
        params: {
          ids: coinGeckoIds.join(','),
          vs_currencies: 'usd',
          include_24hr_change: true,
          include_24hr_vol: true,
          include_market_cap: true
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      throw error;
    }
  }

  async fetchMarketOverview() {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/global');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching market overview:', error);
      throw error;
    }
  }

  mapSymbolsToCoinGeckoIds(symbols) {
    const mapping = {
      'btc': 'bitcoin',
      'bitcoin': 'bitcoin',
      'eth': 'ethereum', 
      'ethereum': 'ethereum',
      'ada': 'cardano',
      'cardano': 'cardano',
      'dot': 'polkadot',
      'polkadot': 'polkadot',
      'sol': 'solana',
      'solana': 'solana',
      'matic': 'matic-network',
      'polygon': 'matic-network',
      'avax': 'avalanche-2',
      'avalanche': 'avalanche-2'
    };
    
    return symbols.map(symbol => mapping[symbol] || symbol);
  }

  formatAnalysisResponse(data, originalInput) {
    const cryptoNames = Object.keys(data);
    if (cryptoNames.length === 1) {
      const crypto = cryptoNames[0];
      const info = data[crypto];
      const change = info.usd_24h_change || 0;
      const changeText = change >= 0 ? 'up' : 'down';
      const volume = info.usd_24h_vol || 0;
      
      return `The current price of ${crypto.toUpperCase()} is $${info.usd.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}. It's ${changeText} ${Math.abs(change).toFixed(2)}% in the last 24 hours with a trading volume of $${(volume / 1000000).toFixed(1)}M.`;
    } else {
      return "Here's the current market data for the requested cryptocurrencies.";
    }
  }

  formatMarketAnalysis(marketData) {
    const totalMarketCap = marketData.total_market_cap?.usd || 0;
    const marketCapChange = marketData.market_cap_change_percentage_24h_usd || 0;
    const changeText = marketCapChange >= 0 ? 'up' : 'down';
    
    return `The total cryptocurrency market cap is $${(totalMarketCap / 1000000000).toFixed(1)}B, ${changeText} ${Math.abs(marketCapChange).toFixed(2)}% in the last 24 hours.`;
  }

  getDefaultResponse() {
    return {
      mode: 'default',
      type: 'greeting',
      data: {},
      message: "Hello! I'm CryptoNexus, your crypto AI assistant. Ask me about prices, market analysis, crypto education, or your portfolio!"
    };
  }

  // Portfolio management methods
  addAsset(symbol, amount, purchasePrice) {
    this.portfolio.assets.push({
      symbol,
      amount,
      purchasePrice,
      currentPrice: 0,
      value: 0,
      pnl: 0
    });
  }

  updatePortfolioValues(priceData) {
    this.portfolio.totalValue = 0;
    this.portfolio.totalPnL = 0;

    this.portfolio.assets.forEach(asset => {
      const currentPrice = priceData[asset.symbol]?.usd || asset.purchasePrice;
      asset.currentPrice = currentPrice;
      asset.value = asset.amount * currentPrice;
      asset.pnl = (currentPrice - asset.purchasePrice) * asset.amount;
      
      this.portfolio.totalValue += asset.value;
      this.portfolio.totalPnL += asset.pnl;
    });
  }
}

export default SentinelCore;
