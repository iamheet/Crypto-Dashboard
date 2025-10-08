'use client';

import { ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const MainContent = ({ activeSection }) => {
  const { user, getRemainingTrialDays } = useAuth();
  const renderContent = () => {
    switch (activeSection) {
      case 'chat':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="max-w-2xl mx-auto">
              {/* Logo */}
              <div className="mb-8">
                <div className="inline-flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg">
                    <div className="w-full h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xl font-bold">N</span>
                    </div>
                  </div>
                  <span className="text-white font-bold text-2xl">
                    CRYPTO<span className="text-cyan-400">NEXUS</span>
                    <span className="text-cyan-400 text-lg ml-1">AI</span>
                  </span>
                </div>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Welcome back, {user?.name?.split(' ')[0]}!
                <br />
                <span className="text-cyan-400">
                  {user?.isPremium ? 'Premium Access' : `${getRemainingTrialDays()} days left in trial`}
                </span>
              </h1>

              {/* Description */}
              <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
                Stay updated on market trends and discover tokens with rapid 
                liquidity growth, substantial market capitalization, active social 
                media presence, high security ratings, and more.
              </p>

              {/* CTA Button */}
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-4">
                  {user?.isPremium 
                    ? 'You have full access to all premium features'
                    : `Your trial expires in ${getRemainingTrialDays()} days`
                  }
                </p>
                {!user?.isPremium && getRemainingTrialDays() <= 3 && (
                  <button className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl">
                    <span>Upgrade to Premium</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        );

      case 'favourites':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">💖</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Your Favourites</h2>
              <p className="text-gray-400 mb-6">
                Save your favorite cryptocurrencies, strategies, and market insights for quick access.
              </p>
              <button className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors">
                Add First Favourite
              </button>
            </div>
          </div>
        );

      case 'wallet':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">👛</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Wallet Tracking</h2>
              <p className="text-gray-400 mb-6">
                Connect your wallets to track portfolio performance, analyze transactions, and get AI-powered insights.
              </p>
              <button className="bg-cyan-500 text-white px-6 py-3 rounded-lg hover:bg-cyan-600 transition-colors">
                Connect Wallet
              </button>
            </div>
          </div>
        );

      case 'strategies':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">📈</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">AI Trading Strategies</h2>
              <p className="text-gray-400 mb-6">
                Discover and implement AI-generated trading strategies based on market analysis and historical data.
              </p>
              <button className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors">
                Explore Strategies
              </button>
            </div>
          </div>
        );

      case 'trending':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🔥</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Trending Now</h2>
              <p className="text-gray-400 mb-6">
                Stay ahead with real-time trending cryptocurrencies, market movements, and social sentiment analysis.
              </p>
              <button className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors">
                View Trends
              </button>
            </div>
          </div>
        );

      case 'feed':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">📰</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">News Feed</h2>
              <p className="text-gray-400 mb-6">
                Get personalized crypto news, market analysis, and AI-curated insights delivered to your feed.
              </p>
              <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
                Read Latest News
              </button>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">⚙️</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Settings</h2>
              <p className="text-gray-400 mb-6">
                Customize your CryptoNexus experience, manage notifications, and configure AI preferences.
              </p>
              <button className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors">
                Open Settings
              </button>
            </div>
          </div>
        );

      case 'pricing':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">💰</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Pricing Plans</h2>
              <p className="text-gray-400 mb-6">
                Choose the perfect plan for your trading needs. Start with our free trial and upgrade anytime.
              </p>
              <button className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors">
                View Plans
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="max-w-2xl mx-auto">
              {/* Logo */}
              <div className="mb-8">
                <div className="inline-flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg">
                    <div className="w-full h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xl font-bold">N</span>
                    </div>
                  </div>
                  <span className="text-white font-bold text-2xl">
                    CRYPTO<span className="text-cyan-400">NEXUS</span>
                    <span className="text-cyan-400 text-lg ml-1">AI</span>
                  </span>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Beat the market with AI
                <br />
                <span className="text-cyan-400">7-day Free Trial</span>
              </h1>

              <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
                Stay updated on market trends and discover tokens with rapid 
                liquidity growth, substantial market capitalization, active social 
                media presence, high security ratings, and more.
              </p>

              <button className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl">
                <span>Claim My Free 7-Day Trial</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 bg-gray-950 flex flex-col">
      <div className="flex-1 p-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default MainContent;
