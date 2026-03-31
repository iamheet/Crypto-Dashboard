'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Calendar, Shield, Loader, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { getUserProfile, user } = useAuth();

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await getUserProfile();
      
      if (result.success) {
        setProfile(result.profile);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Something went wrong');
    }
    
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <p className="text-gray-300">Please login to view your profile</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <User className="w-6 h-6 mr-2" />
          User Profile
        </h2>
        <button
          onClick={fetchProfile}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50"
        >
          {loading ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Shield className="w-4 h-4" />
          )}
          <span>{loading ? 'Loading...' : 'Refresh Profile'}</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader className="w-8 h-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-300">Fetching profile...</span>
        </div>
      ) : profile ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <User className="w-5 h-5 text-blue-400 mr-2" />
                <span className="text-gray-300 text-sm">Username</span>
              </div>
              <p className="text-white">{user.username}</p>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Mail className="w-5 h-5 text-green-400 mr-2" />
                <span className="text-gray-300 text-sm">Email</span>
              </div>
              <p className="text-white">{user.email}</p>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Calendar className="w-5 h-5 text-purple-400 mr-2" />
                <span className="text-gray-300 text-sm">Member Since</span>
              </div>
              <p className="text-white text-sm">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Shield className="w-5 h-5 text-green-400 mr-2" />
                <span className="text-gray-300 text-sm">Account Status</span>
              </div>
              <p className="text-green-400">Active</p>
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2">Account Information</h3>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-green-400">✅ Account verified and active</span>
            </div>
            <p className="text-gray-400 text-sm mt-2">Your account is in good standing with full access to all features.</p>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <User className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No profile data available</p>
        </div>
      )}
    </div>
  );
};

export default UserProfile;