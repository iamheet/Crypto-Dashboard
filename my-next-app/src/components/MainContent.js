'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Crown, Check } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import UserProfile from './UserProfile';
import PaymentModal from './PaymentModal';

const MainContent = ({ activeSection }) => {
  const { user } = useAuth();
  const [pricingPlans, setPricingPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [upgrading, setUpgrading] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  // Fetch pricing plans when pricing section is active
  useEffect(() => {
    if (activeSection === 'pricing') {
      fetchPricing();
    }
  }, [activeSection]);

  const fetchPricing = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/pricing/prices');
      const data = await response.json();
      setPricingPlans(data.plans || []);
    } catch (error) {
      console.error('Error fetching pricing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (plan) => {
    if (!user) return;

    console.log('User object:', user);
    console.log('User ID being sent:', user.id);

    // Set selected plan and show payment modal
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (paymentData) => {
    console.log('Payment successful:', paymentData);
    setUpgrading(selectedPlan.id);
    
    try {
      const requestBody = {
        user_id: user.id,
        plan: selectedPlan.name,
        price: selectedPlan.monthlyPrice,
        payment_id: paymentData.paymentId,
        order_id: paymentData.orderId,
        signature: paymentData.signature
      };
      
      console.log('Request body:', requestBody);
      
      const response = await fetch('http://localhost:5000/api/subscription/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      
      const data = await response.json();
      console.log('Response status:', response.status);
      console.log('Response data:', data);
      
      if (data.success) {
        alert(`Successfully upgraded to ${selectedPlan.name} plan! Payment ID: ${paymentData.paymentId}`);
      } else {
        alert(`Upgrade failed: ${data.message || 'Please try again.'}`);
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('Upgrade failed. Please try again.');
    } finally {
      setUpgrading(null);
      setShowPaymentModal(false);
      setSelectedPlan(null);
    }
  };

  const handlePaymentFailure = (error) => {
    console.error('Payment failed:', error);
    alert(`Payment failed: ${error.description || 'Please try again.'}`);
    setShowPaymentModal(false);
    setSelectedPlan(null);
  };

  const handlePaymentClose = () => {
    console.log('Payment modal closed');
    setShowPaymentModal(false);
    setSelectedPlan(null);
  };
  
  // Mock function for trial days (since new hook doesn't have this)
  const getRemainingTrialDays = () => {
    if (!user?.trialExpiresAt) return 7;
    const now = new Date();
    const expiryDate = new Date(user.trialExpiresAt);
    const diffTime = expiryDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };
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
                Welcome back, {user?.username || 'User'}!
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

      case 'profile':
        return (
          <div className="h-full p-6 overflow-y-auto">
            <UserProfile />
          </div>
        );

      case 'pricing':
        return (
          <div className="h-full p-6 overflow-y-auto">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-white mb-4">
                  Choose Your Plan
                </h1>
                <p className="text-gray-400 text-lg">
                  Upgrade your CryptoNexus experience with advanced AI features
                </p>
              </div>

              {loading ? (
                <div className="text-center text-gray-400">
                  <div className="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                  Loading pricing plans...
                </div>
              ) : pricingPlans.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {pricingPlans.map((plan) => (
                    <div 
                      key={plan.id}
                      className={`relative rounded-2xl p-8 border ${
                        plan.popular
                          ? 'bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/50'
                          : 'bg-gray-900 border-gray-700'
                      }`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center">
                            <Crown className="w-3 h-3 mr-1" />
                            Most Popular
                          </span>
                        </div>
                      )}
                      
                      <div className="mb-8">
                        <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                        <div className="flex items-baseline mb-4">
                          <span className="text-4xl font-bold text-white">${plan.monthlyPrice}</span>
                          <span className="text-gray-400 ml-2">/month</span>
                        </div>
                        <div className="text-sm text-green-400">
                          {plan.savings}
                        </div>
                      </div>
                      
                      <ul className="space-y-4 mb-8">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-gray-300">
                            <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <button
                        onClick={() => {
                          console.log('Button clicked for plan:', plan.name);
                          console.log('User exists:', !!user);
                          console.log('Upgrading state:', upgrading);
                          handleUpgrade(plan);
                        }}
                        disabled={upgrading === plan.id}
                        className={`w-full py-3 px-6 rounded-lg font-semibold transition-all disabled:opacity-50 ${
                          plan.popular
                            ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:opacity-90'
                            : 'border border-purple-500 text-purple-400 hover:bg-purple-500/10'
                        }`}
                      >
                        {upgrading === plan.id ? 'Processing...' : 'Pay Now'}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <p>No pricing plans available at the moment.</p>
                  <button 
                    onClick={fetchPricing}
                    className="mt-4 bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              )}
            </div>
            
            {/* Payment Modal */}
            <PaymentModal
              isOpen={showPaymentModal}
              onClose={handlePaymentClose}
              plan={selectedPlan}
              user={user}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentFailure={handlePaymentFailure}
            />
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
