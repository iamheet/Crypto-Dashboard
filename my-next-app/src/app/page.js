'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  TrendingUp, 
  BarChart3, 
  Zap, 
  Users, 
  Star, 
  Check, 
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  Play,
  Globe,
  Lock,
  Smartphone
} from 'lucide-react';
import Link from 'next/link';
import AuthModal from '../components/AuthModal';
import PaymentModal from '../components/PaymentModal';
import { useAuth } from '../hooks/useAuth';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('monthly');
  const [openFaq, setOpenFaq] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pricingPlans, setPricingPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pricingLoaded, setPricingLoaded] = useState(false);
  const [upgrading, setUpgrading] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  // Ref for pricing section
  const pricingSectionRef = useRef(null);
  
  const { user } = useAuth();
  const isAuthenticated = !!user;

  // Intersection Observer for lazy loading pricing
  useEffect(() => {
    console.log('Setting up Intersection Observer for pricing section');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          console.log('Pricing section intersection:', {
            isIntersecting: entry.isIntersecting,
            pricingLoaded: pricingLoaded,
            intersectionRatio: entry.intersectionRatio
          });
          
          if (entry.isIntersecting && !pricingLoaded) {
            console.log('✅ Pricing section is visible, loading pricing data...');
            fetchPricing();
            setPricingLoaded(true);
          }
        });
      },
      {
        rootMargin: '100px', // Start loading 100px before the section is visible
        threshold: 0.1 // Trigger when 10% of the section is visible
      }
    );

    if (pricingSectionRef.current) {
      console.log('📍 Observing pricing section element');
      observer.observe(pricingSectionRef.current);
    } else {
      console.log('❌ Pricing section ref not found');
    }

    return () => {
      if (pricingSectionRef.current) {
        console.log('🧹 Cleaning up pricing section observer');
        observer.unobserve(pricingSectionRef.current);
      }
    };
  }, [pricingLoaded]);

  const fetchPricing = async () => {
    setLoading(true);
    try {
      console.log('Fetching pricing data from API...');
      const response = await fetch('http://localhost:5000/api/pricing/prices');
      const data = await response.json();
      console.log('Pricing data loaded:', data.plans?.length || 0, 'plans');
      setPricingPlans(data.plans || []);
    } catch (error) {
      console.error('Error fetching pricing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (plan) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

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
        price: activeTab === 'monthly' ? selectedPlan.monthlyPrice : selectedPlan.yearlyPrice,
        payment_id: paymentData.paymentId,
        order_id: paymentData.orderId,
        signature: paymentData.signature
      };
      
      const response = await fetch('http://localhost:5000/api/subscription/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      
      const data = await response.json();
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

  const handlePricingClick = (e) => {
    e.preventDefault();
    // Force refresh pricing data
    setPricingLoaded(false);
    setPricingPlans([]);
    
    // Scroll to pricing section
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Fetch pricing data immediately and mark as loaded
    fetchPricing();
    setPricingLoaded(true);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                CRYPTONEXUS
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-300 hover:text-white transition-colors">
                Features
              </Link>
              <Link href="#pricing" onClick={handlePricingClick} className="text-gray-300 hover:text-white transition-colors">
                Pricing
              </Link>
              <Link href="#about" className="text-gray-300 hover:text-white transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                Contact
              </Link>
              {isAuthenticated ? (
                <Link href="/dashboard" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-full hover:opacity-90 transition-opacity inline-block">
                  Go to Dashboard
                </Link>
              ) : (
                <button onClick={() => setShowAuthModal(true)} className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-full hover:opacity-90 transition-opacity">
                  Get Started
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-gray-800">
            <div className="px-4 py-4 space-y-4">
              <Link href="#features" className="block text-gray-300 hover:text-white transition-colors">
                Features
              </Link>
              <Link href="#pricing" onClick={handlePricingClick} className="block text-gray-300 hover:text-white transition-colors">
                Pricing
              </Link>
              <Link href="#about" className="block text-gray-300 hover:text-white transition-colors">
                About
              </Link>
              <Link href="/contact" className="block text-gray-300 hover:text-white transition-colors">
                Contact
              </Link>
              {isAuthenticated ? (
                <Link href="/dashboard" className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-full hover:opacity-90 transition-opacity text-center inline-block">
                  Go to Dashboard
                </Link>
              ) : (
                <button onClick={() => setShowAuthModal(true)} className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-full hover:opacity-90 transition-opacity">
                  Get Started
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm rounded-full px-6 py-2 mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-gray-300 text-sm">Now powered by advanced AI</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Beat the market with
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent italic">
              AI Intelligence
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Stay updated on market trends and discover tokens with rapid 
            liquidity growth, substantial market capitalization, active social 
            media presence, high security ratings, and more.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-16">
            {isAuthenticated ? (
              <Link href="/dashboard" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-full font-semibold hover:opacity-90 transition-opacity flex items-center space-x-2">
                <span>Go to Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-full font-semibold hover:opacity-90 transition-opacity flex items-center space-x-2">
                <span>Claim My Free 7-Day Trial</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
            <button className="border border-gray-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition-colors flex items-center space-x-2">
              <Play className="w-5 h-5" />
              <span>Watch Demo</span>
            </button>
          </div>

          {/* Dashboard Preview */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl p-1">
              <div className="bg-gray-900/90 backdrop-blur-sm rounded-3xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4">
                    <div className="text-gray-400 text-sm mb-2">Portfolio Value</div>
                    <div className="text-3xl font-bold text-white mb-2">$90,432.36</div>
                    <div className="text-green-400 text-sm flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      +12.5%
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4">
                    <div className="text-gray-400 text-sm mb-2">24h P&L</div>
                    <div className="text-3xl font-bold text-white mb-2">$4,586</div>
                    <div className="text-green-400 text-sm flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      +5.2%
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4">
                    <div className="text-gray-400 text-sm mb-2">Active Positions</div>
                    <div className="text-3xl font-bold text-white mb-2">37</div>
                    <div className="text-blue-400 text-sm">8 winners</div>
                  </div>
                </div>
                <div className="h-48 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-12 h-12 text-gray-600" />
                  <span className="ml-2 text-gray-500">Interactive Chart Preview</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Track the things that
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                matter most to you
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Monitor your crypto investments with advanced analytics,
              real-time alerts, and AI-powered insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-purple-500/50 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-time Analytics</h3>
              <p className="text-gray-400">
                Get instant insights into market trends, price movements, and portfolio performance with our advanced analytics engine.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-purple-500/50 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI-Powered Alerts</h3>
              <p className="text-gray-400">
                Receive intelligent notifications about market opportunities, risk warnings, and optimal trading times.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-purple-500/50 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure Portfolio</h3>
              <p className="text-gray-400">
                Your data is protected with enterprise-grade security while maintaining full control of your private keys.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" ref={pricingSectionRef} className="py-12 md:py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Pricing
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8 px-4">Choose the plan that fits your needs</p>
            
            {/* Toggle */}
            <div className="inline-flex bg-gray-800 rounded-full p-1 mx-4">
              <button 
                className={`px-4 md:px-6 py-2 rounded-full transition-colors text-sm md:text-base ${
                  activeTab === 'monthly' 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab('monthly')}
              >
                Monthly
              </button>
              <button 
                className={`px-4 md:px-6 py-2 rounded-full transition-colors text-sm md:text-base ${
                  activeTab === 'yearly' 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab('yearly')}
              >
                Yearly
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {!pricingLoaded ? (
              // Loading skeleton before pricing section is visible
              <div className="col-span-1 lg:col-span-3 text-center text-gray-400">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-700 animate-pulse">
                      <div className="h-5 md:h-6 bg-gray-700 rounded mb-3 md:mb-4"></div>
                      <div className="h-6 md:h-8 bg-gray-700 rounded mb-2"></div>
                      <div className="h-3 md:h-4 bg-gray-700 rounded mb-4 md:mb-6"></div>
                      <div className="space-y-2 md:space-y-3 mb-6 md:mb-8">
                        {[1, 2, 3, 4].map((j) => (
                          <div key={j} className="h-3 md:h-4 bg-gray-700 rounded"></div>
                        ))}
                      </div>
                      <div className="h-10 md:h-12 bg-gray-700 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : loading ? (
              <div className="col-span-1 lg:col-span-3 text-center text-gray-400">
                <div className="animate-spin w-6 md:w-8 h-6 md:h-8 border-2 border-purple-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-sm md:text-base">Loading pricing plans...</p>
              </div>
            ) : pricingPlans.length > 0 ? (
              pricingPlans.map((plan) => (
                <div 
                  key={plan.id}
                  className={`rounded-2xl p-6 md:p-8 border hover:scale-105 transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/50 relative lg:scale-105' 
                      : 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-purple-500/30'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 md:px-4 py-1 rounded-full text-xs md:text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="mb-6 md:mb-8">
                    <h3 className="text-xl md:text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="flex items-baseline">
                      <span className="text-3xl md:text-4xl font-bold">${activeTab === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}</span>
                      <span className="text-gray-400 ml-2 text-sm md:text-base">/{activeTab === 'monthly' ? 'month' : 'year'}</span>
                    </div>
                    {activeTab === 'yearly' && (
                      <p className="text-green-400 text-xs md:text-sm mt-2">{plan.savings}</p>
                    )}
                  </div>
                  
                  <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="w-4 md:w-5 h-4 md:h-5 text-green-400 mr-2 md:mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300 text-sm md:text-base leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {plan.popular ? (
                    isAuthenticated ? (
                      <button 
                        onClick={() => handleUpgrade(plan)}
                        disabled={upgrading === plan.id}
                        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 text-sm md:text-base font-medium"
                      >
                        {upgrading === plan.id ? 'Processing...' : 'Pay Now'}
                      </button>
                    ) : (
                      <button onClick={() => setShowAuthModal(true)} className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-full hover:opacity-90 transition-opacity text-sm md:text-base font-medium">
                        Start Free Trial
                      </button>
                    )
                  ) : (
                    <button 
                      onClick={() => handleUpgrade(plan)}
                      disabled={upgrading === plan.id || !isAuthenticated}
                      className="w-full border border-purple-500 text-purple-400 py-3 rounded-full hover:bg-purple-500/10 transition-colors disabled:opacity-50 text-sm md:text-base font-medium"
                    >
                      {upgrading === plan.id ? 'Processing...' : isAuthenticated ? 'Pay Now' : 'Sign Up First'}
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-1 lg:col-span-3 text-center text-gray-400">
                <p className="mb-4 text-sm md:text-base">No pricing plans available</p>
                <button 
                  onClick={() => {
                    setPricingLoaded(false);
                    fetchPricing();
                  }}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition-colors text-sm md:text-base"
                >
                  Retry Loading
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              You asked, 
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent italic">
                we answered.
              </span>
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "How does CryptoNexus protect my cryptocurrency data?",
                answer: "We use enterprise-grade encryption and never store your private keys. Your data is processed locally when possible, and all communications are secured with end-to-end encryption."
              },
              {
                question: "Can I connect multiple wallets and exchanges?",
                answer: "Yes, CryptoNexus supports integration with over 100 exchanges and wallet providers, allowing you to track all your crypto assets in one unified dashboard."
              },
              {
                question: "What makes CryptoNexus's AI different from other tools?",
                answer: "Our AI is specifically trained on cryptocurrency market data and uses advanced machine learning algorithms to provide personalized insights, predictive analytics, and automated trading suggestions."
              },
              {
                question: "Is there a mobile app available?",
                answer: "Yes, CryptoNexus is available on iOS and Android devices with full feature parity to the web application, including real-time notifications and portfolio management."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gray-800/50 rounded-xl border border-gray-700">
                <button
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-700/30 transition-colors"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-semibold text-white">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${
                    openFaq === index ? 'rotate-180' : ''
                  }`} />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  CRYPTONEXUS
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                Beat the market with AI - Advanced crypto intelligence platform.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">API</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Mobile App</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            © 2025 CRYPTONEXUS. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal && !isAuthenticated} onClose={() => setShowAuthModal(false)} />
      
      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={handlePaymentClose}
        plan={selectedPlan}
        user={user}
        billingCycle={activeTab}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentFailure={handlePaymentFailure}
      />
    </div>
  );
}
