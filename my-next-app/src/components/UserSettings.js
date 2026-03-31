import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { User, Edit3, Trash2, Save, X } from 'lucide-react';

const UserSettings = ({ onClose }) => {
  const { user, updateUser, deleteUser, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || ''
  });
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setMessage('');
    
    console.log('🔄 Updating user with data:', formData);
    console.log('🔑 Current user:', user);
    
    const result = await updateUser(formData);
    
    console.log('📝 Update result:', result);
    
    if (result.success) {
      setMessage('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(result.error);
    }
  };

  const handleDeleteUser = async () => {
    const result = await deleteUser();
    
    if (result.success) {
      setMessage('Account deleted successfully. Redirecting...');
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } else {
      setMessage(result.error);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold text-white">User Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${
            message.includes('successfully') 
              ? 'bg-green-900/50 text-green-400 border border-green-800' 
              : 'bg-red-900/50 text-red-400 border border-red-800'
          }`}>
            {message}
          </div>
        )}

        {!isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Username
              </label>
              <div className="text-white bg-gray-800 p-3 rounded-lg">
                {user?.username}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <div className="text-white bg-gray-800 p-3 rounded-lg">
                {user?.email}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </button>
              
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdateUser} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Save className="w-4 h-4" />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    username: user?.username || '',
                    email: user?.email || ''
                  });
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-60">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-sm mx-4">
              <h3 className="text-lg font-bold text-white mb-4">Delete Account</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete your account? This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteUser}
                  disabled={isLoading}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  {isLoading ? 'Deleting...' : 'Yes, Delete'}
                </button>
                
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSettings;