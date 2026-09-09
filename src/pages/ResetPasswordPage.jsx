import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../config/firebase';
import { verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';
import { Leaf, Loader2, CheckCircle, XCircle } from 'lucide-react';

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [verifyingCode, setVerifyingCode] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  // Extract oobCode from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const oobCode = queryParams.get('oobCode');
  const mode = queryParams.get('mode');

  useEffect(() => {
    // If not a reset password action, ignore or handle differently
    if (mode !== 'resetPassword' || !oobCode) {
      setError('Invalid or missing password reset code.');
      setVerifyingCode(false);
      return;
    }

    // Verify the code and get the user's email
    verifyPasswordResetCode(auth, oobCode)
      .then((email) => {
        setEmail(email);
        setVerifyingCode(false);
      })
      .catch((err) => {
        setError('The password reset link is invalid or has expired. Please request a new one.');
        setVerifyingCode(false);
      });
  }, [oobCode, mode]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await confirmPasswordReset(auth, oobCode, newPassword);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (verifyingCode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-primary-green" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex justify-center items-center px-4">
      <div className="absolute inset-0 z-0 bg-dark-green"></div>
      
      <div className="w-full max-w-md p-8 relative z-10 bg-white rounded-3xl shadow-xl">
        <div className="flex justify-center mb-6">
          <div className="bg-primary-green p-4 rounded-2xl shadow-lg">
            <Leaf className="text-white" size={40} />
          </div>
        </div>

        <h1 className="text-2xl font-extrabold text-gray-800 text-center mb-2">Reset Password</h1>
        
        {success ? (
          <div className="text-center">
            <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
            <p className="text-gray-600 mb-6">Your password has been updated successfully.</p>
            <button 
              onClick={() => navigate('/login')}
              className="w-full bg-primary-green hover:bg-green-600 text-white font-bold rounded-xl py-3"
            >
              Go to Login
            </button>
          </div>
        ) : error ? (
          <div className="text-center">
            <XCircle className="mx-auto text-red-500 mb-4" size={48} />
            <p className="text-red-600 mb-6">{error}</p>
            <button 
              onClick={() => navigate('/login')}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl py-3"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <p className="text-sm text-gray-600 text-center mb-4">Resetting password for <strong>{email}</strong></p>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-green text-gray-900"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm New Password</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-green text-gray-900"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-primary-green hover:bg-green-600 text-white font-bold rounded-xl py-3 mt-4 flex justify-center items-center"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
