'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Heart,
  Wallet,
  TrendingUp,
  Activity,
  Rss,
  Settings,
  DollarSign,
  Search,
  Twitter,
  Send,
  Mail,
  HelpCircle,
  LogOut,
  Clock,
  Crown,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = ({ activeItem, onItemClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout, getRemainingTrialDays } = useAuth();

  const navigationItems = [
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'favourites', label: 'Favourites', icon: Heart },
    { id: 'wallet', label: 'Wallet Tracking', icon: Wallet },
    { id: 'strategies', label: 'Strategies', icon: TrendingUp },
    { id: 'trending', label: 'Trending', icon: Activity },
    { id: 'feed', label: 'Feed', icon: Rss },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
  ];

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Send, href: '#', label: 'Telegram' },
    { icon: Mail, href: '#', label: 'Email' },
    { icon: HelpCircle, href: '#', label: 'Help' },
  ];

  return (
    <div className="w-64 bg-gray-900 h-screen flex flex-col border-r border-gray-800">
      {/* Logo */}
      <div className="p-6">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-cyan-400 rounded">
            <div className="w-full h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">N</span>
            </div>
          </div>
          <span className="text-white font-bold text-lg">
            CRYPTO<span className="text-cyan-400">NEXUS</span>.AI
          </span>
        </Link>
      </div>

      {/* User Profile */}
      {user && (
        <div className="px-6 pb-4">
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-full flex items-center space-x-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 text-left">
                <div className="text-white text-sm font-medium">{user.name}</div>
                <div className="flex items-center space-x-1 text-xs">
                  {user.isPremium ? (
                    <>
                      <Crown className="w-3 h-3 text-yellow-400" />
                      <span className="text-yellow-400">Premium</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-3 h-3 text-cyan-400" />
                      <span className="text-cyan-400">{getRemainingTrialDays()} days left</span>
                    </>
                  )}
                </div>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 rounded-lg border border-gray-700 z-10">
                <button
                  onClick={() => {
                    onItemClick('settings');
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors border-b border-gray-700"
                >
                  <Settings className="w-4 h-4" />
                  <span className="text-sm">Settings</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-red-400 hover:bg-gray-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4">
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onItemClick(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                    activeItem === item.id
                      ? 'bg-gray-800 text-cyan-400 border-l-2 border-cyan-400'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Search */}
      <div className="px-4 py-4 border-t border-gray-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 text-gray-300 rounded-lg border border-gray-700 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm"
          />
          <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500 bg-gray-700 px-1.5 py-0.5 rounded">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Social Links */}
      <div className="px-4 py-4 border-t border-gray-800">
        <div className="flex items-center justify-center space-x-4">
          {socialLinks.map((social, index) => {
            const Icon = social.icon;
            return (
              <a
                key={index}
                href={social.href}
                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-cyan-400 transition-colors"
                title={social.label}
              >
                <Icon className="w-4 h-4" />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
