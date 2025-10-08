'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Plus, Wallet, RefreshCw, BookOpen } from 'lucide-react';

const DashboardSidebar = ({ sentinelCore, currentMode, currentData }) => {
  const [portfolioData, setPortfolioData] = useState({
    assets: [],
    totalValue: 0,
    totalPnL: 0
  });
  const [marketData, setMarketData] = useState({});
  const [showAddAsset, setShowAddAsset] = useState(false);
  const [newAsset, setNewAsset] = useState({
    symbol: '',
    amount: '',
    purchasePrice: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Sample portfolio data for demonstration
  useEffect(() => {
    // Add some sample assets for demo purposes
    if (sentinelCore && portfolioData.assets.length === 0) {
      sentinelCore.addAsset('bitcoin', 0.1, 45000);
      sentinelCore.addAsset('ethereum', 1.5, 3000);
      sentinelCore.addAsset('solana', 10, 120);
      
      setPortfolioData({
        assets: sentinelCore.portfolio.assets,
        totalValue: sentinelCore.portfolio.totalValue,
        totalPnL: sentinelCore.portfolio.totalPnL
      });
    }
  }, [sentinelCore]);

  // Update portfolio with current data when analysis mode provides crypto prices
  useEffect(() => {
    if (currentMode === 'analysis' && currentData && sentinelCore) {
      sentinelCore.updatePortfolioValues(currentData);
      setPortfolioData({
        assets: [...sentinelCore.portfolio.assets],
        totalValue: sentinelCore.portfolio.totalValue,
        totalPnL: sentinelCore.portfolio.totalPnL
      });
    }
  }, [currentMode, currentData, sentinelCore]);

  const handleAddAsset = () => {
    if (!newAsset.symbol || !newAsset.amount || !newAsset.purchasePrice) return;

    sentinelCore.addAsset(
      newAsset.symbol.toLowerCase(),
      parseFloat(newAsset.amount),
      parseFloat(newAsset.purchasePrice)
    );

    setPortfolioData({
      assets: [...sentinelCore.portfolio.assets],
      totalValue: sentinelCore.portfolio.totalValue,
      totalPnL: sentinelCore.portfolio.totalPnL
    });

    setNewAsset({ symbol: '', amount: '', purchasePrice: '' });
    setShowAddAsset(false);
  };

  const refreshPortfolio = async () => {
    if (!sentinelCore) return;
    
    setIsLoading(true);
    try {
      // Fetch current prices for all portfolio assets
      const symbols = portfolioData.assets.map(asset => asset.symbol);
      if (symbols.length > 0) {
        const priceData = await sentinelCore.fetchCryptoData(symbols);
        sentinelCore.updatePortfolioValues(priceData);
        setPortfolioData({
          assets: [...sentinelCore.portfolio.assets],
          totalValue: sentinelCore.portfolio.totalValue,
          totalPnL: sentinelCore.portfolio.totalPnL
        });
      }
    } catch (error) {
      console.error('Error refreshing portfolio:', error);
    }
    setIsLoading(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatPercentage = (change) => {
    return `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
  };

  return (
    <div className="w-80 bg-gray-50 border-l border-gray-200 p-4 space-y-6 overflow-y-auto">
      {/* Portfolio Summary */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Wallet className="w-5 h-5 mr-2 text-purple-600" />
            Portfolio
          </h3>
          <button
            onClick={refreshPortfolio}
            disabled={isLoading}
            className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {portfolioData.assets.length > 0 ? (
          <>
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {formatCurrency(portfolioData.totalValue)}
                </div>
                <div className="text-sm text-gray-500">Total Value</div>
              </div>
              
              <div className="text-center">
                <div className={`text-lg font-semibold ${
                  portfolioData.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {portfolioData.totalPnL >= 0 ? (
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 inline mr-1" />
                  )}
                  {formatCurrency(Math.abs(portfolioData.totalPnL))}
                </div>
                <div className="text-sm text-gray-500">
                  {portfolioData.totalPnL >= 0 ? 'Profit' : 'Loss'}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t space-y-3">
              <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Holdings
              </h4>
              {portfolioData.assets.map((asset, index) => (
                <div key={index} className="flex justify-between items-center py-2">
                  <div>
                    <div className="font-medium text-gray-800 capitalize">
                      {asset.symbol}
                    </div>
                    <div className="text-xs text-gray-500">
                      {asset.amount} @ {formatCurrency(asset.purchasePrice)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-800">
                      {formatCurrency(asset.value)}
                    </div>
                    <div className={`text-xs ${
                      asset.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(asset.pnl)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <Wallet className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No assets in portfolio</p>
          </div>
        )}

        <button
          onClick={() => setShowAddAsset(!showAddAsset)}
          className="w-full mt-4 py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Asset</span>
        </button>

        {showAddAsset && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg space-y-3">
            <input
              type="text"
              placeholder="Symbol (e.g., bitcoin)"
              value={newAsset.symbol}
              onChange={(e) => setNewAsset(prev => ({ ...prev, symbol: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            />
            <input
              type="number"
              placeholder="Amount"
              value={newAsset.amount}
              onChange={(e) => setNewAsset(prev => ({ ...prev, amount: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              step="0.01"
            />
            <input
              type="number"
              placeholder="Purchase Price ($)"
              value={newAsset.purchasePrice}
              onChange={(e) => setNewAsset(prev => ({ ...prev, purchasePrice: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              step="0.01"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleAddAsset}
                className="flex-1 py-2 px-3 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddAsset(false)}
                className="flex-1 py-2 px-3 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Market Data */}
      {currentMode === 'analysis' && currentData && Object.keys(currentData).length > 0 && (
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
            Market Data
          </h3>
          <div className="space-y-3">
            {Object.entries(currentData).map(([crypto, data]) => (
              <div key={crypto} className="flex justify-between items-center">
                <div className="font-medium text-gray-800 capitalize">
                  {crypto.replace('-', ' ')}
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-800">
                    {formatCurrency(data.usd)}
                  </div>
                  {data.usd_24h_change && (
                    <div className={`text-xs ${
                      data.usd_24h_change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatPercentage(data.usd_24h_change)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mode Indicator */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Current Mode</h3>
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          currentMode === 'analysis' ? 'bg-blue-100 text-blue-800' :
          currentMode === 'education' ? 'bg-green-100 text-green-800' :
          currentMode === 'portfolio' ? 'bg-purple-100 text-purple-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {currentMode === 'analysis' ? <TrendingUp className="w-4 h-4 mr-1" /> :
           currentMode === 'education' ? <BookOpen className="w-4 h-4 mr-1" /> :
           currentMode === 'portfolio' ? <Wallet className="w-4 h-4 mr-1" /> :
           null}
          {currentMode ? `${currentMode.charAt(0).toUpperCase() + currentMode.slice(1)} Mode` : 'Standby'}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {currentMode === 'analysis' && 'Providing market analysis and price data'}
          {currentMode === 'education' && 'Explaining crypto concepts and terminology'}
          {currentMode === 'portfolio' && 'Managing and displaying portfolio information'}
          {!currentMode && 'Ready to assist with any crypto queries'}
        </p>
      </div>
    </div>
  );
};

export default DashboardSidebar;
