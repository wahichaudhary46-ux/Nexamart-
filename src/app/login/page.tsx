'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { User, Lock, Mail, UserPlus } from 'lucide-react';

export default function LibraryAuth() {
  const router = useRouter();
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isSignUp) {
        await signUp(email, password);
        router.push('/onboarding');
      } else {
        await signIn(email, password);
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      router.push('/onboarding');
    } catch (err: any) {
      setError(err.message || 'Google Sign-In failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-cover bg-center font-sans"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2000&auto=format&fit=crop')" }}>
      
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md"></div>

      <div className="relative z-10 w-full max-w-sm mx-4 p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[30px] shadow-2xl text-white">
        
        <div className="text-center mb-6">
          <div className="bg-blue-600/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-blue-500/30">
            {isSignUp ? <UserPlus className="w-8 h-8 text-blue-400" /> : <User className="w-8 h-8 text-blue-400" />}
          </div>
          <h2 className="text-sm font-black tracking-[0.2em] uppercase">
            {isSignUp ? "Create Account" : "Member Login"}
          </h2>
        </div>

        {error && <p className="text-red-400 text-[11px] text-center mb-4 bg-red-900/30 py-2 rounded-lg border border-red-500/20">{error}</p>}

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full bg-white/5 border border-white/10 text-white px-10 py-3 text-sm rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-white/5 border border-white/10 text-white px-10 py-3 text-sm rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-900/20 transition-all active:scale-95 disabled:opacity-50">
            {loading ? "Processing..." : (isSignUp ? "SIGN UP" : "LOGIN")}
          </button>
        </form>

        <div className="relative flex py-6 items-center">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-[10px] font-bold uppercase tracking-widest">OR</span>
            <div className="flex-grow border-t border-white/10"></div>
        </div>

        <button 
          onClick={handleGoogleLogin} 
          disabled={loading}
          type="button"
          className="w-full bg-white text-gray-800 flex items-center justify-center gap-3 py-3.5 rounded-xl font-bold text-sm hover:bg-gray-100 transition-all active:scale-95 shadow-md disabled:opacity-50"
        >
          <img src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png" className="w-6 h-6" alt="Google" />
          Continue with Google
        </button>

        <div className="text-center mt-6">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            type="button"
            className="text-blue-400 hover:text-blue-300 text-xs font-bold transition-colors"
          >
            {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
