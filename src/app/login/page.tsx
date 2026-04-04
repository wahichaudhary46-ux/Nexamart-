
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/components/auth-provider";
import { Spinner } from "@/components/ui/spinner";
import { motion } from "framer-motion";
import { ShieldCheck, MapPin, Search, ShoppingBag } from "lucide-react";

export default function LoginPage() {
  const { user, userProfile, loading, signInWithGoogle } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!loading && user) {
      if (userProfile?.isProfileComplete) router.push("/dashboard");
      else router.push("/onboarding");
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-background px-4 py-12 transition-colors duration-300">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
      
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 15 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-card dark:bg-card rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-border p-8 md:p-10 transition-all duration-300">
          {/* Logo Integration */}
          <div className="flex justify-center mb-10">
            <div className="relative">
              <Image
                src="https://i.ibb.co/rfKvSNKL/1000128270-1.png"
                alt="NexaMart" 
                width={220}
                height={60}
                className="mx-auto object-contain drop-shadow-md dark:invert"
                priority
                unoptimized
              />
            </div>
          </div>

          <div className="text-center space-y-2 mb-8">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Welcome to NexaMart
            </h1>
            <p className="text-muted-foreground text-sm font-medium leading-relaxed max-w-[280px] mx-auto">
              Discover every product in your local area, instantly.
            </p>
          </div>

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isSigningIn}
            className="w-full flex items-center justify-center gap-3 bg-white dark:bg-black hover:bg-muted dark:hover:bg-muted text-gray-700 dark:text-gray-200 font-semibold border border-border rounded-xl px-4 py-3.5 transition-all duration-200 active:scale-[0.98] disabled:opacity-70 shadow-sm"
          >
            {isSigningIn ? (
              <Spinner className="h-5 w-5" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Hyperlocal Business Badges */}
          <div className="mt-10 pt-8 border-t border-border">
            <div className="flex flex-wrap justify-center gap-y-4 gap-x-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-[13px] font-semibold">Local Availability</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <ShoppingBag className="w-4 h-4 text-primary" />
                <span className="text-[13px] font-semibold">A to Z Products</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Search className="w-4 h-4 text-primary" />
                <span className="text-[13px] font-semibold">Easy Discovery</span>
              </div>
            </div>
          </div>

          {/* Policies Section */}
          <div className="mt-10 text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="text-[11px] uppercase tracking-widest font-bold">Secure Access</span>
            </div>
            <div className="flex justify-center gap-4 text-[12px] font-semibold">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline">Terms of Service</a>
              <span className="text-muted-foreground select-none">•</span>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline">Privacy Policy</a>
            </div>
          </div>
        </div>
        
        <p className="mt-8 text-center text-muted-foreground text-xs font-medium">
          © {new Date().getFullYear()} NexaMart Platforms Inc. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
