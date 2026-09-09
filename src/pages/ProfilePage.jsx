import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from 'firebase/auth';
import { User, Camera, Mail, Shield, Calendar, Loader2, Save } from 'lucide-react';

const ProfilePage = () => {
  const { currentUser } = useAuth();
  
  const [name, setName] = useState(currentUser?.displayName || '');
  const [photoURL, setPhotoURL] = useState(currentUser?.photoURL || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setMessage(null);
      
      await updateProfile(currentUser, {
        displayName: name,
        photoURL: photoURL
      });

      // Also sync to backend if needed
      const token = await currentUser.getIdToken();
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
      
      await fetch(`${BACKEND_URL}/api/auth/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: name,
          email: currentUser.email,
          profileImage: photoURL
        })
      });

      setMessage('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-dark-green p-3 rounded-xl text-white shadow-md">
          <User size={28} />
        </div>
        <h1 className="text-3xl font-bold text-dark-green">User Profile</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
        
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8 pb-8 border-b border-gray-100">
          <div className="relative group">
            {photoURL ? (
              <img src={photoURL} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-green-50 shadow-md" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center border-4 border-green-50 shadow-md">
                <User size={40} className="text-primary-green" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className="text-white" size={24} />
            </div>
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-800">{currentUser?.displayName || 'Farmer'}</h2>
            <p className="text-gray-500 font-medium">{currentUser?.email}</p>
            <div className="mt-2 inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {currentUser?.providerData[0]?.providerId.replace('.com', '') || 'Password'} User
            </div>
          </div>
        </div>

        {message && (
          <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6 border border-green-200">
            {message}
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          {/* Editable Fields */}
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Display Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-green transition-shadow"
                placeholder="Enter your name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Photo URL (Optional)</label>
              <input 
                type="url" 
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-green transition-shadow"
                placeholder="https://example.com/photo.jpg"
              />
            </div>
          </div>

          {/* Non-editable Info */}
          <div className="bg-gray-50 rounded-xl p-5 space-y-4 border border-gray-100">
            <h3 className="font-bold text-gray-700 flex items-center gap-2 mb-4">
              <Shield size={18} /> Account Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Email Address</p>
                <p className="text-gray-800 flex items-center gap-2">
                  <Mail size={16} className="text-gray-400" />
                  {currentUser?.email}
                </p>
              </div>
              
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Account Created</p>
                <p className="text-gray-800 flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400" />
                  {currentUser?.metadata?.creationTime ? new Date(currentUser.metadata.creationTime).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Verification Status</p>
                <p className={`font-semibold ${currentUser?.emailVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                  {currentUser?.emailVerified ? 'Verified' : 'Unverified'}
                </p>
              </div>
            </div>
            
            <p className="text-xs text-gray-400 mt-4 italic">
              Note: Email, verification status, and User ID cannot be changed directly for security reasons.
            </p>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary-green hover:bg-dark-green text-white font-bold rounded-xl py-4 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              Save Profile Changes
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default ProfilePage;
