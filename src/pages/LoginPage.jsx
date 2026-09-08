import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Leaf, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // States
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { loginWithGoogle } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      console.error("Firebase Error:", err);
      if (err.code === 'auth/popup-blocked') {
        setError('[auth/popup-blocked] Your browser blocked the Google Login window. Please allow popups.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('You cancelled the Google login. Please try again.');
      } else if (err.code === 'auth/network-request-failed') {
        setError('Network error. Please check your internet connection.');
      } else {
        setError(`Authentication failed: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      if (isSignUp) {
        // Create new account
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        // Login existing account
        await signInWithEmailAndPassword(auth, email, password);
      }
      
      // On success, go to dashboard
      navigate('/');
      
    } catch (err) {
      console.error("Firebase Error:", err);
      
      // Friendly error messages
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('This email is already registered. Please login instead.');
          break;
        case 'auth/invalid-credential':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setError('Invalid email or password.');
          break;
        case 'auth/weak-password':
          setError('Password must be at least 6 characters long.');
          break;
        case 'auth/internal-error':
          setError('Server error: Please make sure "Email/Password" authentication is enabled in your Firebase Console.');
          break;
        default:
          setError(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex justify-center items-center px-4 py-12 md:py-24">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/assets/login_bg.jpg" 
          alt="Agriculture Background" 
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-dark-green/60 backdrop-blur-[2px]"></div>
      </div>

      <div className="w-full max-w-md p-8 relative z-10 rounded-3xl shadow-2xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/30 text-white animate-fade-in">
        {/* Soft internal gradient for glass effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <div className="bg-primary-green p-4 rounded-2xl shadow-[0_0_20px_rgba(34,197,94,0.4)]">
              <Leaf className="text-white" size={40} />
            </div>
          </div>
          
          <h1 className="text-3xl font-extrabold text-white text-center mb-2 drop-shadow-md">
            {isSignUp ? 'Create Account' : t('login.title')}
          </h1>
          <p className="text-green-50 text-center mb-6 drop-shadow-sm font-medium">
            {isSignUp ? 'Join Smart Farm AI today' : t('login.subtitle')}
          </p>

          {error && (
            <div className="bg-red-500/80 backdrop-blur-sm text-white p-3 rounded-lg text-sm mb-4 border border-red-400/50 shadow-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailAuth} className="space-y-5 mb-6">
            <div>
              <label className="block text-sm font-semibold text-green-50 mb-2">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-green transition-all"
                placeholder="farmer@example.com" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-green-50 mb-2">{t('login.password')}</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-green transition-all"
                placeholder="••••••••" 
              />
            </div>
            
            {!isSignUp && (
              <div className="flex justify-end">
                <a href="#" className="text-sm font-medium text-harvest-yellow hover:text-yellow-300 hover:underline transition-colors">{t('login.forgotPassword')}</a>
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full bg-primary-green hover:bg-green-500 text-white font-bold rounded-xl py-4 text-lg transition-all duration-300 shadow-[0_4px_14px_0_rgba(34,197,94,0.39)] hover:shadow-[0_6px_20px_rgba(34,197,94,0.23)] hover:-translate-y-1 disabled:opacity-70 flex justify-center items-center">
              {loading ? <Loader2 className="animate-spin" size={24} /> : (isSignUp ? 'Sign Up' : t('login.login'))}
            </button>
          </form>

          <div className="relative flex items-center justify-center my-6">
            <div className="absolute border-t border-white/20 w-full"></div>
            <span className="bg-transparent px-4 text-white/70 text-sm relative z-10 font-medium tracking-widest">OR</span>
          </div>

          <div className="space-y-4 text-center">
            <button 
              type="button"
              onClick={handleGoogleLogin} 
              disabled={loading}
              className="w-full py-3 px-4 bg-white hover:bg-gray-50 rounded-xl flex items-center justify-center gap-3 font-bold text-gray-700 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 border-none"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              {t('login.continueGoogle') || 'Continue with Google'}
            </button>
          </div>
          
          <p className="text-center mt-8 text-green-50/80 font-medium">
            {isSignUp ? 'Already have an account?' : t('login.noAccount')}{' '}
            <button 
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); setError(null); }} 
              className="text-harvest-yellow font-bold hover:text-yellow-300 hover:underline transition-colors"
            >
              {isSignUp ? 'Login Here' : t('login.createAccount')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
