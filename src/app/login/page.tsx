
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Spinner } from "@/components/ui/spinner";
import { motion, AnimatePresence } from "framer-motion";
import { User, Lock, Mail, UserPlus, Library, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function LoginPage() {
  const { user, userProfile, loading, signIn, signUp, signInWithGoogle } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
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

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isSignUp) {
        await signUp(email, password);
        // Note: Profile completion is handled in onboarding, 
        // but we could store the name in state if needed.
        toast({
          title: "Account Created",
          description: "Welcome to Nexa-Library! Let's complete your profile.",
        });
      } else {
        await signIn(email, password);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <Spinner className="h-8 w-8 text-white" />
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col relative bg-cover bg-center font-body"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2000&auto=format&fit=crop')" }}
    >
      {/* Dark Glassy Overlay */}
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

      {/* Main Content: Auth Card */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-sm mx-auto"
        >
          {/* Glassmorphism Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[30px] shadow-2xl p-8 transition-all duration-500 overflow-hidden">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={isSignUp ? "signup" : "login"}
                initial={{ opacity: 0, x: isSignUp ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isSignUp ? -20 : 20 }}
                transition={{ duration: 0.3 }}
                className="text-center mb-8"
              >
                <div className="bg-blue-600/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-blue-500/30">
                  {isSignUp ? <UserPlus className="w-8 h-8 text-blue-400" /> : <User className="w-8 h-8 text-blue-400" />}
                </div>
                <h2 className="text-sm font-black tracking-[0.2em] uppercase text-white/90">
                  {isSignUp ? "Create Account" : "Member Login"}
                </h2>
              </motion.div>
            </AnimatePresence>

            {/* Auth Form */}
            <form onSubmit={handleAuth} className="space-y-4">
              {isSignUp && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="relative"
                >
                  <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-white px-10 py-3.5 text-sm rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-500"
                    required={isSignUp}
                  />
                </motion.div>
              )}

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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-900/40 transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? <Spinner className="h-4 w-4 mx-auto" /> : (isSignUp ? "SIGN UP" : "LOGIN")}
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex py-6 items-center">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink mx-4 text-gray-500 text-[10px] font-black uppercase tracking-widest">OR</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            {/* Google Login */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-black text-xs py-3 rounded-xl transition-all active:scale-95 disabled:opacity-70 shadow-md group"
            >
              <img src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png" className="w-6 h-6" alt="Google" />
              <span>CONTINUE WITH GOOGLE</span>
            </button>

            {/* Toggle Login/SignUp */}
            <div className="text-center mt-6">
              <button 
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-blue-400 hover:text-blue-300 text-[11px] font-black uppercase tracking-wider transition-colors"
              >
                {isSignUp ? "Already a member? Login" : "Don't have an account? Sign Up"}
              </button>
            </div>
            
            <p className="text-[9px] text-white/20 font-bold uppercase tracking-[0.2em] mt-8 text-center">
              © {new Date().getFullYear()} NexaMart Studio
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
