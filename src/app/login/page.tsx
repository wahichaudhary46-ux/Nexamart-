"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/components/auth-provider";
import { Spinner } from "@/components/ui/spinner";
import { motion } from "framer-motion";

export default function LoginPage() {
  const { user, userProfile, loading, signInWithGoogle } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => setMounted(true), []);

  // Matrix rain effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    const charArray = chars.split("");
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];
    for (let i = 0; i < columns; i++) drops[i] = 1;

    function draw() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0f0";
      ctx.font = `${fontSize}px "Courier New", monospace`;
      for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    }
    const interval = setInterval(draw, 35);
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

  if (loading) return <LoadingSpinner />;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Matrix canvas background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-40" />

      {/* Neon grid overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_100%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00ff0010_1px,transparent_1px),linear-gradient(to_bottom,#00ff0010_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Main content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotateX: 15 }}
          animate={{ opacity: mounted ? 1 : 0, scale: mounted ? 1 : 0.8, rotateX: mounted ? 0 : 15 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="w-full max-w-md"
        >
          <div className="relative rounded-2xl border border-[#00ff00] bg-black/70 backdrop-blur-md shadow-[0_0_30px_rgba(0,255,0,0.3)] p-8 md:p-10 overflow-hidden group">
            {/* Animated neon border glitch */}
            <div className="absolute inset-0 border-2 border-[#00ff00] rounded-2xl pointer-events-none animate-pulse" />
            <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-[#00ff00] to-transparent opacity-30 blur-md group-hover:opacity-70 transition duration-1000" />

            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="relative w-32 h-32">
                <Image
                  src="https://kommodo.ai/i/X4P1PzNfygTBx6OQF4vx"
                  alt="Logo"
                  fill
                  className="object-contain drop-shadow-[0_0_15px_#00ff00]"
                  unoptimized
                />
              </div>
            </div>

            {/* Glitch text */}
            <h1 className="text-4xl font-mono font-bold text-center text-[#00ff00] mb-2 relative">
              <span className="relative inline-block animate-pulse">
                ACCESS GRANTED
                <span className="absolute inset-0 text-[#00ff00] blur-sm opacity-70">ACCESS GRANTED</span>
              </span>
            </h1>
            <div className="text-center text-[#00ff00]/70 text-sm mb-8 tracking-wider font-mono">
              {">>_ AUTHENTICATE YOUR IDENTITY_"}
            </div>

            {/* Google button with neon effect */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isSigningIn}
              className="group relative w-full flex items-center justify-center gap-3 bg-black border-2 border-[#00ff00] text-[#00ff00] hover:bg-[#00ff00] hover:text-black rounded-lg px-4 py-3 transition-all duration-300 font-mono font-bold tracking-wide shadow-[0_0_10px_rgba(0,255,0,0.5)] hover:shadow-[0_0_20px_rgba(0,255,0,0.8)] disabled:opacity-50"
            >
              {isSigningIn ? (
                <Spinner className="h-5 w-5 text-[#00ff00]" />
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#00ff00" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#00ff00" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#00ff00" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#00ff00" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>{isSigningIn ? ">>_ AUTHENTICATING..." : ">>_ CONTINUE WITH GOOGLE"}</span>
                </>
              )}
            </button>

            {/* Terminal-style footer */}
            <div className="mt-8 text-center text-[#00ff00]/40 text-xs font-mono">
              <span className="inline-block border-t border-[#00ff00]/30 pt-4 w-full">
                [ v1.0.0 ] // SECURE ENCRYPTED CHANNEL
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 border-4 border-[#00ff00] border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );
}
