'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import Sidebar from '../../components/Sidebar';
import MainContent from '../../components/MainContent';
import ChatPanel from '../../components/ChatPanel';
import UserSettings from '../../components/UserSettings';

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState('chat');
  const [showUserSettings, setShowUserSettings] = useState(false);
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  const handleSectionClick = (section) => {
    if (section === 'settings') {
      setShowUserSettings(true);
    } else {
      setActiveSection(section);
    }
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg mx-auto mb-4 animate-pulse">
            <div className="w-full h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">N</span>
            </div>
          </div>
          <p className="text-gray-400">Loading CryptoNexus...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Left Sidebar */}
      <Sidebar 
        activeItem={activeSection} 
        onItemClick={handleSectionClick} 
      />
      
      {/* Main Content Area */}
      <MainContent activeSection={activeSection} />
      
      {/* Right Chat Panel */}
      <ChatPanel />
      
      {/* User Settings Modal */}
      {showUserSettings && (
        <UserSettings onClose={() => setShowUserSettings(false)} />
      )}
    </div>
  );
}
