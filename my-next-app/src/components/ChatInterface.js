'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, TrendingUp, BookOpen, PieChart } from 'lucide-react';

const ChatInterface = ({ sentinelCore, onModeChange }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'sentinel',
      content: "Hello! I'm Sentinel, your crypto dashboard assistant. Ask me about prices, market analysis, crypto education, or your portfolio!",
      timestamp: new Date(),
      mode: 'default'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'analysis':
        return <TrendingUp className="w-4 h-4 text-blue-500" />;
      case 'education':
        return <BookOpen className="w-4 h-4 text-green-500" />;
      case 'portfolio':
        return <PieChart className="w-4 h-4 text-purple-500" />;
      default:
        return <Bot className="w-4 h-4 text-gray-500" />;
    }
  };

  const getModeColor = (mode) => {
    switch (mode) {
      case 'analysis':
        return 'border-l-blue-500 bg-blue-50';
      case 'education':
        return 'border-l-green-500 bg-green-50';
      case 'portfolio':
        return 'border-l-purple-500 bg-purple-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
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
      
      const sentinelMessage = {
        id: messages.length + 2,
        sender: 'sentinel',
        content: response.message,
        timestamp: new Date(),
        mode: response.mode,
        data: response.data
      };

      setMessages(prev => [...prev, sentinelMessage]);
      
      // Notify parent component about mode change
      if (onModeChange) {
        onModeChange(response.mode, response.data);
      }
    } catch (error) {
      const errorMessage = {
        id: messages.length + 2,
        sender: 'sentinel',
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
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Bot className="w-6 h-6" />
          <h2 className="text-lg font-semibold">CryptoNexus Assistant</h2>
        </div>
        <div className="text-sm opacity-90">
          {messages.length > 1 ? `${messages.length - 1} messages` : 'Ready to help'}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : `${getModeColor(message.mode)} border-l-4 text-gray-800`
              }`}
            >
              {message.sender === 'sentinel' && (
                <div className="flex items-center space-x-2 mb-2">
                  {getModeIcon(message.mode)}
                  <span className="text-xs font-semibold text-gray-600 uppercase">
                    {message.mode === 'default' ? 'Sentinel' : `${message.mode} Mode`}
                  </span>
                </div>
              )}
              <p className="text-sm leading-relaxed">{message.content}</p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-1">
                  {message.sender === 'user' ? (
                    <User className="w-3 h-3 opacity-70" />
                  ) : (
                    <Bot className="w-3 h-3 opacity-70" />
                  )}
                  <span className="text-xs opacity-70">
                    {formatTimestamp(message.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 border-l-4 border-l-gray-400 px-4 py-3 rounded-lg max-w-xs">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-gray-500 animate-pulse" />
                <span className="text-xs font-semibold text-gray-600">Sentinel is typing...</span>
              </div>
              <div className="flex space-x-1 mt-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-gray-50 rounded-b-lg">
        <div className="flex space-x-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about crypto prices, education, or your portfolio..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows="1"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500 flex flex-wrap gap-2">
          <span>Try: </span>
          <button 
            onClick={() => setInputValue("What's the price of Bitcoin?")}
            className="text-blue-600 hover:underline"
          >
            "Bitcoin price"
          </button>
          <button 
            onClick={() => setInputValue("What is DeFi?")}
            className="text-green-600 hover:underline"
          >
            "What is DeFi?"
          </button>
          <button 
            onClick={() => setInputValue("Show my portfolio")}
            className="text-purple-600 hover:underline"
          >
            "My portfolio"
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
