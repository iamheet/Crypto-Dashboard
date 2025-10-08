'use client';

import { useState, useEffect } from 'react';
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
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('monthly');
  const [openFaq, setOpenFaq] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const { isAuthenticated, user } = useAuth();

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
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
              <Link href="#pricing" className="text-gray-300 hover:text-white transition-colors">
                Pricing
              </Link>
              <Link href="#about" className="text-gray-300 hover:text-white transition-colors">
                About
              </Link>
              <Link href="#contact" className="text-gray-300 hover:text-white transition-colors">
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
              <Link href="#pricing" className="block text-gray-300 hover:text-white transition-colors">
                Pricing
              </Link>
              <Link href="#about" className="block text-gray-300 hover:text-white transition-colors">
                About
              </Link>
              <Link href="#contact" className="block text-gray-300 hover:text-white transition-colors">
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
      <section id="pricing" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Pricing
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">Choose the plan that fits your needs</p>
            
            {/* Toggle */}
            <div className="inline-flex bg-gray-800 rounded-full p-1">
              <button 
                className={`px-6 py-2 rounded-full transition-colors ${
                  activeTab === 'monthly' 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab('monthly')}
              >
                Monthly
              </button>
              <button 
                className={`px-6 py-2 rounded-full transition-colors ${
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Basic Plan */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">Basic</h3>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">$23</span>
                  <span className="text-gray-400 ml-2">/{activeTab === 'monthly' ? 'month' : 'year'}</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-400 mr-3" />
                  <span className="text-gray-300">Portfolio tracking up to 10 assets</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-400 mr-3" />
                  <span className="text-gray-300">Basic price alerts</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-400 mr-3" />
                  <span className="text-gray-300">Email support</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-400 mr-3" />
                  <span className="text-gray-300">Mobile app access</span>
                </li>
              </ul>
              
              <button className="w-full border border-purple-500 text-purple-400 py-3 rounded-full hover:bg-purple-500/10 transition-colors">
                Get Started
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl p-8 border border-purple-500/50 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">$39</span>
                  <span className="text-gray-400 ml-2">/{activeTab === 'monthly' ? 'month' : 'year'}</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-400 mr-3" />
                  <span className="text-gray-300">Unlimited portfolio tracking</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-400 mr-3" />
                  <span className="text-gray-300">Advanced AI analytics</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-400 mr-3" />
                  <span className="text-gray-300">Real-time alerts</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-400 mr-3" />
                  <span className="text-gray-300">Priority support</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-400 mr-3" />
                  <span className="text-gray-300">API access</span>
                </li>
              </ul>
              
              {isAuthenticated ? (
                <Link href="/dashboard" className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-full hover:opacity-90 transition-opacity text-center inline-block">
                  Go to Dashboard
                </Link>
              ) : (
                <button onClick={() => setShowAuthModal(true)} className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-full hover:opacity-90 transition-opacity">
                  Start Free Trial
                </button>
              )}
            </div>
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
    </div>
  );
}
