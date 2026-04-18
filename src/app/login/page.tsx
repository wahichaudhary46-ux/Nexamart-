
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Spinner } from "@/components/ui/spinner";
import { motion, AnimatePresence } from "framer-motion";
import { User, Lock, Mail, UserPlus, Library } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function LoginPage() {
  const { user, userProfile, loading, signIn, signUp, signInWithGoogle } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading && user) {
      if (userProfile?.isProfileComplete) {
        router.push("/");
      } else {
        router.push("/onboarding");
      }
    }
  }, [user, userProfile, loading, router, mounted]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isSignUp) {
        // Sign up now only requires email and password
        await signUp(email, password);
        toast({
          title: "Account Created",
          description: "Welcome to Nexa-Library! Let's complete your profile.",
        });
        // Redirection is handled by the useEffect once user state updates
      } else {
        await signIn(email, password);
        // Redirection is handled by the useEffect
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: isSignUp ? "Registration Failed" : "Login Failed",
        description: err.message || "Something went wrong. Please check your credentials.",
      });
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <Spinner className="h-8 w-8 text-white" />
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative bg-cover bg-center font-sans"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2000&auto=format&fit=crop')" }}
    >
      {/* Dark Glassy Overlay */}
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md"></div>

      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 w-full max-w-sm mx-4 p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[30px] shadow-2xl text-white"
      >
        <div className="text-center mb-6">
          <div className="bg-blue-600/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-blue-500/30">
            {isSignUp ? <UserPlus className="w-8 h-8 text-blue-400" /> : <User className="w-8 h-8 text-blue-400" />}
          </div>
          <h2 className="text-sm font-black tracking-[0.2em] uppercase text-white">
            {isSignUp ? "Create Account" : "Member Login"}
          </h2>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white px-10 py-3.5 text-sm rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-500"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white px-10 py-3.5 text-sm rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-500"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-900/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? <Spinner className="h-4 w-4 mx-auto" /> : (isSignUp ? "SIGN UP" : "LOGIN")}
          </button>
        </form>

        <div className="relative flex py-6 items-center">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-[10px] font-bold uppercase tracking-widest">OR</span>
            <div className="flex-grow border-t border-white/10"></div>
        </div>

        <button 
          onClick={handleGoogleSignIn} 
          disabled={isSubmitting}
          className="w-full bg-white text-gray-800 flex items-center justify-center gap-3 py-3 rounded-xl font-bold text-sm hover:bg-gray-100 transition-all active:scale-95 shadow-md"
        >
          <img src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png" className="w-6 h-6" alt="Google" />
          Google
        </button>

        <div className="text-center mt-6">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-400 hover:text-blue-300 text-xs font-bold transition-colors"
          >
            {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
