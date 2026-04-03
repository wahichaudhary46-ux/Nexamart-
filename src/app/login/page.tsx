"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/components/auth-provider";
import { Spinner } from "@/components/ui/spinner";
import { motion } from "framer-motion";
import { ShieldCheck, Truck, Star } from "lucide-react";

export default function LoginPage() {
  const { user, userProfile, loading, signInWithGoogle } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!loading && user) {
      if (userProfile?.isProfileComplete) {
        router.push("/dashboard");
      } else if (userProfile) {
        router.push("/onboarding");
      }
    }
  }, [user, userProfile, loading, router]);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error(err);
      setIsSigningIn(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-900 via-indigo-950 to-purple-950">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-500/20 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 30 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-lg"
        >
          <div className="relative overflow-hidden rounded-[2.5rem] bg-white shadow-2xl">
            {/* Top decorative bar with brand colors */}
            <div className="h-2 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
            
            <div className="p-8 md:p-12">
              {/* Logo Integration - Perfectly Centered & Premium */}
              <div className="flex justify-center mb-10">
                <div className="relative transition-transform duration-500 hover:scale-105">
                  <Image 
                    src="/logo.png" 
                    alt="NexaMart" 
                    width={220} 
                    height={80} 
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              <div className="text-center space-y-3 mb-10">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                  Welcome back
                </h1>
                <p className="text-slate-500 font-medium text-lg leading-relaxed italic">
                  Experience the future of premium shopping at your fingertips.
                </p>
              </div>

              {/* Login Button */}
              <button
                onClick={handleGoogleSignIn}
                disabled={isSigningIn}
                className="group relative w-full flex items-center justify-center gap-4 bg-slate-950 text-white rounded-2xl px-6 py-4 transition-all duration-300 hover:bg-slate-800 hover:shadow-xl hover:shadow-blue-500/10 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
              >
                {isSigningIn ? (
                  <Spinner className="h-6 w-6 border-white/30 border-t-white" />
                ) : (
                  <>
                    <div className="bg-white p-1 rounded-full">
                      <svg className="w-6 h-6" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                    </div>
                    <span className="font-bold text-lg">
                      {isSigningIn ? "Authorizing..." : "Continue with Google"}
                    </span>
                  </>
                )}
              </button>

              {/* Sleek Trust Badges */}
              <div className="mt-12 pt-8 border-t border-slate-100 grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center text-center gap-2 group">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 transition-colors group-hover:bg-blue-100">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">100% Secure</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2 group">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 transition-colors group-hover:bg-purple-100">
                    <Truck className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Fast Delivery</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2 group">
                  <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-600 transition-colors group-hover:bg-pink-100">
                    <Star className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Top Quality</span>
                </div>
              </div>

              {/* Policy Section - Professional & Visible */}
              <div className="mt-12 space-y-4 text-center">
                <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-400">
                  <a href="#" className="hover:text-blue-600 transition-colors uppercase tracking-widest">Terms of Service</a>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                  <a href="#" className="hover:text-blue-600 transition-colors uppercase tracking-widest">Privacy Policy</a>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed max-w-[320px] mx-auto font-medium">
                  Your security is our priority. By signing in, you agree to NexaMart's data protection and service excellence policies.
                </p>
              </div>
            </div>
          </div>
          
          <p className="mt-8 text-center text-white/50 text-sm font-medium">
            Need assistance? <a href="#" className="text-white hover:underline transition-all">Contact Support</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
        </div>
      </div>
    </div>
  );
}