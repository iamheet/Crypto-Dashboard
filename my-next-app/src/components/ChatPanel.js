'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ChevronDown, Settings, MessageSquare, Star, X } from 'lucide-react';
import SentinelCore from '../lib/sentinelCore';

const ChatPanel = () => {
  const [sentinelCore] = useState(new SentinelCore());
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      content: "Here's what I do best—ask CryptoNexus Wallet Analyst, I dissect on-chain activity, dive through transaction patterns, and serve up technically-sound bullet points, not soft summarizations of optimism and precision.",
      timestamp: new Date(),
      mode: 'default'
    }
  ]);
  const [inputValue, setInputValue] = useState('Chat with CryptoNexus AI');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState('Wallet Analyst');
  const [showAgentDropdown, setShowAgentDropdown] = useState(false);
  const [showSpecialties, setShowSpecialties] = useState(true);
  const [specialtiesAnimating, setSpecialtiesAnimating] = useState(false);
  const messagesEndRef = useRef(null);

  const agents = [
    { name: 'Wallet Analyst', description: 'On-chain activity analysis' },
    { name: 'Market Agent', description: 'Market trends and analysis' },
    { name: 'Trading Agent', description: 'Trading strategies and signals' },
    { name: 'Blockchain Agent', description: 'Blockchain data insights' },
    { name: 'Sentiment Agent', description: 'Social sentiment analysis' },
    { name: 'Analyst Agent', description: 'Technical analysis expert' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  // Auto-hide specialties after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      hideSpecialties();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const hideSpecialties = () => {
    setSpecialtiesAnimating(true);
    setTimeout(() => {
      setShowSpecialties(false);
      setSpecialtiesAnimating(false);
    }, 300); // Match animation duration
  };

  const toggleSpecialties = () => {
    if (showSpecialties) {
      hideSpecialties();
    } else {
      setShowSpecialties(true);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await sentinelCore.processQuery(inputValue);
      
      const assistantMessage = {
        id: messages.length + 2,
        sender: 'assistant',
        content: response.message,
        timestamp: new Date(),
        mode: response.mode,
        data: response.data
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        id: messages.length + 2,
        sender: 'assistant',
        content: "I apologize, but I'm experiencing some technical difficulties. Please try again in a moment.",
        timestamp: new Date(),
        mode: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(timestamp);
  };

  return (
    <div className="w-96 bg-gray-900 border-l border-gray-800 flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">V</span>
            </div>
            <span className="text-white font-medium">User</span>
          </div>
          <div className="flex items-center space-x-2">
            <button className="text-gray-400 hover:text-white">
              <Settings className="w-4 h-4" />
            </button>
            <span className="text-gray-400 text-sm">Agent</span>
          </div>
        </div>
        
        {/* Agent Selector */}
        <div className="relative">
          <button
            onClick={() => setShowAgentDropdown(!showAgentDropdown)}
            className="w-full flex items-center justify-between p-3 bg-gray-800 rounded-lg text-left hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Bot className="w-4 h-4 text-cyan-400" />
              <span className="text-white font-medium">{selectedAgent}</span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
          
          {showAgentDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 rounded-lg border border-gray-700 z-10 max-h-48 overflow-y-auto">
              {agents.map((agent, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedAgent(agent.name);
                    setShowAgentDropdown(false);
                  }}
                  className="w-full flex flex-col items-start p-3 hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-b-0"
                >
                  <span className="text-white font-medium text-sm">{agent.name}</span>
                  <span className="text-gray-400 text-xs">{agent.description}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              {message.sender === 'user' ? (
                <User className="w-4 h-4 text-gray-400" />
              ) : (
                <Bot className="w-4 h-4 text-cyan-400" />
              )}
              <span className="text-xs text-gray-400">
                {message.sender === 'user' ? 'You' : selectedAgent}
              </span>
              <span className="text-xs text-gray-500">
                {formatTimestamp(message.timestamp)}
              </span>
            </div>
            <div className="pl-6">
              <p className="text-gray-200 text-sm leading-relaxed">
                {message.content}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <Bot className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="text-xs text-gray-400">{selectedAgent}</span>
              <span className="text-xs text-gray-500">typing...</span>
            </div>
            <div className="pl-6">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* My Specialties Section */}
      {showSpecialties && (
        <div className={`px-4 py-3 border-t border-gray-800 transition-all duration-300 ${
          specialtiesAnimating ? 'animate-fade-out' : 'animate-fade-in'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-medium text-sm">My Specialties</h3>
            <button
              onClick={hideSpecialties}
              className="text-gray-500 hover:text-gray-300 transition-colors"
              title="Hide specialties"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        <div className="space-y-2">
          <div className="text-xs text-gray-300">
            • <strong>Portfolio Analysis:</strong> Deep dive into your token holdings, asset valuations, and investment diversification with precise risk assessment and exit strategies.
          </div>
          <div className="text-xs text-gray-300">
            • <strong>Transaction Forensics:</strong> Analyze your trading patterns, transfers, and swap behaviors to identify opportunities for optimization.
          </div>
          <div className="text-xs text-gray-300">
            • <strong>P&L Performance Reports:</strong> Comprehensive profit/loss analysis with opportunity cost calculations and performance benchmarking.
          </div>
          <div className="text-xs text-gray-300">
            • <strong>Strategy Profiling:</strong> Decode your trading patterns and provide personalized strategy recommendations based on blockchain data.
          </div>
          <div className="text-xs text-gray-300">
            • <strong>Cross-Chain Analysis:</strong> Multi-chain portfolio tracking across Ethereum, Arbitrum, Polygon, BSC, and other major networks.
          </div>
          <div className="text-xs text-gray-300">
            • <strong>Actionable Insights:</strong> Clear, specific recommendations to optimize your portfolio performance and trading strategies.
          </div>
        </div>
        </div>
      )}
      
      {/* Show Specialties Button (when hidden) */}
      {!showSpecialties && (
        <div className="px-4 py-2 border-t border-gray-800">
          <button
            onClick={toggleSpecialties}
            className="text-gray-400 hover:text-cyan-400 text-xs transition-colors flex items-center space-x-1"
          >
            <span>Show My Specialties</span>
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Feedback Section */}
      <div className="px-4 py-3 border-t border-gray-800">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-white text-sm font-medium">Feedback</span>
          <button className="text-gray-400 hover:text-white">
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
            <Star className="w-3 h-3 text-white" />
          </div>
          <span className="text-gray-300 text-xs">Premium account</span>
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center space-x-2">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Chat with ${selectedAgent}`}
            className="flex-1 px-3 py-2 bg-gray-800 text-gray-200 rounded-lg border border-gray-700 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
