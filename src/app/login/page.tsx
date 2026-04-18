
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Spinner } from "@/components/ui/spinner";
import { motion } from "framer-motion";
import { Library, LogIn, User, Mail, Lock, ShieldCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function LoginPage() {
  const { user, userProfile, loading, signIn, signInWithGoogle } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      if (userProfile?.isProfileComplete) {
        router.push("/");
      } else {
        router.push("/onboarding");
      }
    }
  }, [user, userProfile, loading, router]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSigningIn(true);
    try {
      await signIn(email, password);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
      });
      setIsSigningIn(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error(err);
      setIsSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <Spinner className="h-8 w-8 text-white" />
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col relative bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop')" }}
    >
      {/* Dark Blur Overlay */}
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md"></div>

      {/* Header - Nexa Library Logo */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 w-full pt-6 pb-4 px-6 flex items-center justify-between border-b border-white/10 backdrop-blur-md bg-black/30"
      >
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm border border-white/20">
            <Library className="w-6 h-6 text-blue-300" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white">Nexa-Library</h1>
            <p className="text-[10px] uppercase font-bold text-white/50 tracking-widest -mt-0.5">digital knowledge hub</p>
          </div>
        </div>
      </motion.div>

      {/* Main Content: Login Card */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-sm mx-auto"
        >
          {/* Glassmorphism Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[24px] shadow-2xl p-8 transition-all duration-300">
            
            <div className="text-center mb-8">
              <div className="inline-flex p-3 bg-white/5 rounded-full mb-3 border border-white/10">
                <User className="w-8 h-8 text-blue-300" />
              </div>
              <h2 className="text-xs font-black text-white/90 uppercase tracking-[0.2em]">Member Login</h2>
            </div>

            {/* Email Login Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email ID"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 text-white px-10 py-3 text-sm rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 text-white px-10 py-3 text-sm rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={isSigningIn}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
              >
                {isSigningIn ? <Spinner className="h-4 w-4 mx-auto" /> : "LOGIN"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex py-6 items-center">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-[10px] uppercase font-black tracking-widest">या</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            {/* Google Login Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isSigningIn}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-900 font-black text-xs py-3 rounded-xl transition-all active:scale-95 disabled:opacity-70 group uppercase tracking-wider"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="Google" />
              Sign in with Google
            </button>

            {/* Footer */}
            <div className="text-center mt-6">
              <a href="#" className="text-white/40 hover:text-white text-[10px] font-bold italic transition-colors">
                Forgot Password? Click to reset
              </a>
              <p className="text-[9px] text-white/20 font-bold uppercase tracking-[0.2em] mt-4">
                © {new Date().getFullYear()} NexaMart Studio
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
