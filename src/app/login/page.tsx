"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Spinner } from "@/components/ui/spinner";
import { motion } from "framer-motion";

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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000" />
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="w-full max-w-md"
        >
          <div className="relative rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-8 md:p-10">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-3xl">N</span>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-center text-white mb-2">
              Welcome back
            </h1>
            <p className="text-center text-white/70 mb-8">
              Sign in to continue to NexaMart
            </p>

            <button
              onClick={handleGoogleSignIn}
              disabled={isSigningIn}
              className="group relative w-full flex items-center justify-center gap-3 bg-white/90 hover:bg-white rounded-xl px-4 py-3 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70"
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
                  <span className="text-gray-800 font-medium">
                    {isSigningIn ? "Signing in..." : "Continue with Google"}
                  </span>
                </>
              )}
            </button>

            <p className="text-xs text-center text-white/50 mt-8">
              By continuing, you agree to our Terms and Privacy Policy.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900">
      <Spinner className="h-8 w-8 text-white" />
    </div>
  );
}
