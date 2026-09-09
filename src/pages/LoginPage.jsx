import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Leaf, Loader2, ArrowLeft, MailCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // States
  const [mode, setMode] = useState('login'); // 'login', 'signup', 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null); // For success messages

  const { loginWithGoogle, logout } = useAuth();

  const handleGoogleLogin = () => {
    setError(null);
    setMessage(null);
    loginWithGoogle()
      .then(async (userCredential) => {
        // Trigger login notification securely via backend
        try {
          const token = await userCredential.user.getIdToken();
          const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
          await fetch(`${BACKEND_URL}/api/auth/notify-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ method: 'Google' })
          });
        } catch (e) {
          console.error("Failed to send login notification", e);
        }
        navigate('/');
      })
      .catch((err) => {
        console.error("Firebase Error:", err);
        setLoading(false);
        if (err.code === 'auth/popup-blocked') {
          setError('Your browser blocked the Google Login window. Please allow popups.');
        } else if (err.code === 'auth/popup-closed-by-user') {
          setError('You cancelled the Google login. Please try again.');
        } else if (err.code === 'auth/network-request-failed') {
          setError('Network error. Please check your internet connection.');
        } else if (err.code === 'auth/operation-not-allowed') {
          setError('Google Sign-in is not enabled. Please enable it in your Firebase Console.');
        } else if (err.code === 'auth/unauthorized-domain') {
          setError('This domain is not authorized for Google Sign-in. Add it in Firebase Console.');
        } else {
          setError(`Authentication failed: ${err.message}`);
        }
      });
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    if (mode !== 'forgot' && !password) {
      setError('Please enter your password');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setMessage(null);
      
      if (mode === 'signup') {
        // Create new account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Send verification email
        await sendEmailVerification(userCredential.user);
        // Log them out immediately to force verification
        await logout();
        
        setMessage('Registration successful! A verification email has been sent to your inbox. Please verify before logging in.');
        setMode('login');
        setPassword('');
        
      } else if (mode === 'forgot') {
        // Password Reset
        await sendPasswordResetEmail(auth, email);
        setMessage('A password reset link has been sent to your email.');
        setMode('login');
        setPassword('');
        
      } else {
        // Login existing account
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        if (!userCredential.user.emailVerified) {
          await logout();
          setError('Please verify your email before logging in. Check your inbox for the verification link.');
          return;
        }

        // Trigger login notification securely via backend
        try {
          const token = await userCredential.user.getIdToken();
          const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
          await fetch(`${BACKEND_URL}/api/auth/notify-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ method: 'Email/Password' })
          });
        } catch (e) {
          console.error("Failed to send login notification", e);
        }
        
        // On success, go to dashboard
        navigate('/');
      }
      
    } catch (err) {
      console.error("Firebase Error:", err);
      
      // Friendly error messages
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('This email is already registered. Please login instead.');
          setMode('login');
          break;
        case 'auth/invalid-credential':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setError('Invalid email or password. Please try again.');
          break;
        case 'auth/weak-password':
          setError('Password must be at least 6 characters long.');
          break;
        case 'auth/too-many-requests':
          setError('Too many failed attempts. Please reset your password or try again later.');
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
        <div className="absolute inset-0 bg-dark-green/60 backdrop-blur-[2px]"></div>
      </div>

      <div className="w-full max-w-md p-8 relative z-10 rounded-3xl shadow-2xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/30 text-white animate-fade-in">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
        
        <div className="relative z-10">
          
          {mode === 'forgot' && (
            <button 
              onClick={() => { setMode('login'); setError(null); setMessage(null); }}
              className="absolute left-0 top-0 p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
          )}

          <div className="flex justify-center mb-6">
            <div className="bg-primary-green p-4 rounded-2xl shadow-[0_0_20px_rgba(34,197,94,0.4)]">
              <Leaf className="text-white" size={40} />
            </div>
          </div>
          
          <h1 className="text-3xl font-extrabold text-white text-center mb-2 drop-shadow-md">
            {mode === 'signup' ? 'Create Account' : mode === 'forgot' ? 'Reset Password' : (t('login.title') || 'Welcome Back')}
          </h1>
          <p className="text-green-50 text-center mb-6 drop-shadow-sm font-medium">
            {mode === 'signup' ? 'Join Smart Farm AI today' : mode === 'forgot' ? 'Enter email to receive reset link' : (t('login.subtitle') || 'Log in to your account')}
          </p>

          {error && (
            <div className="bg-red-500/80 backdrop-blur-sm text-white p-3 rounded-lg text-sm mb-4 border border-red-400/50 shadow-lg">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-500/80 backdrop-blur-sm text-white p-3 rounded-lg text-sm mb-4 border border-green-400/50 shadow-lg flex items-start gap-2">
              <MailCheck size={20} className="shrink-0 mt-0.5" />
              <span>{message}</span>
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
                required
              />
            </div>
            
            {mode !== 'forgot' && (
              <div>
                <label className="block text-sm font-semibold text-green-50 mb-2">{t('login.password') || 'Password'}</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-green transition-all"
                  placeholder="••••••••" 
                  required
                />
              </div>
            )}
            
            {mode === 'login' && (
              <div className="flex justify-end">
                <button 
                  type="button" 
                  onClick={() => { setMode('forgot'); setError(null); setMessage(null); }}
                  className="text-sm font-medium text-harvest-yellow hover:text-yellow-300 hover:underline transition-colors"
                >
                  {t('login.forgotPassword') || 'Forgot password?'}
                </button>
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full bg-primary-green hover:bg-green-500 text-white font-bold rounded-xl py-4 text-lg transition-all duration-300 shadow-[0_4px_14px_0_rgba(34,197,94,0.39)] hover:shadow-[0_6px_20px_rgba(34,197,94,0.23)] hover:-translate-y-1 disabled:opacity-70 flex justify-center items-center">
              {loading ? <Loader2 className="animate-spin" size={24} /> : (mode === 'signup' ? 'Sign Up' : mode === 'forgot' ? 'Send Reset Link' : (t('login.login') || 'Log In'))}
            </button>
          </form>

          {mode !== 'forgot' && (
            <>
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
            </>
          )}
          
          {mode !== 'forgot' && (
            <p className="text-center mt-8 text-green-50/80 font-medium">
              {mode === 'signup' ? 'Already have an account?' : (t('login.noAccount') || "Don't have an account?")}{' '}
              <button 
                type="button"
                onClick={() => { setMode(mode === 'signup' ? 'login' : 'signup'); setError(null); setMessage(null); }} 
                className="text-harvest-yellow font-bold hover:text-yellow-300 hover:underline transition-colors"
              >
                {mode === 'signup' ? 'Login Here' : (t('login.createAccount') || 'Sign up here')}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
