
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/components/auth-provider";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, LogIn, UserPlus } from "lucide-react";

export default function LoginPage() {
  const { user, userProfile, loading, signIn, signUp, signInWithGoogle } = useAuthContext();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && user) {
      if (userProfile?.isProfileComplete) {
        router.push("/dashboard");
      } else if (userProfile) {
        router.push("/onboarding");
      }
    }
  }, [user, userProfile, loading, router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please enter both email and password.",
      });
      return;
    }

    setIsSigningIn(true);
    try {
      if (isSignUpMode) {
        await signUp(email, password);
        toast({
          title: "Account Created",
          description: "Welcome to NexaMart! Let's set up your profile.",
        });
      } else {
        await signIn(email, password);
        toast({
          title: "Welcome Back",
          description: "Signed in successfully.",
        });
      }
    } catch (error: any) {
      let errorMessage = "An unexpected error occurred. Please try again.";
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = "Invalid email or password.";
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = "An account with this email already exists. Try signing in instead.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password should be at least 6 characters.";
      }

      toast({
        variant: "destructive",
        title: isSignUpMode ? "Sign-up Failed" : "Sign-in Failed",
        description: errorMessage,
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
      // Manual redirect after 2 seconds
      setTimeout(() => {
        router.push("/onboarding");
      }, 2000);
    } catch (error: any) {
      console.error(error);
      setIsSigningIn(false);
      
      if (error.code === 'auth/unauthorized-domain') {
        toast({
          variant: "destructive",
          title: "Domain Not Authorized",
          description: "This domain is not authorized in the Firebase Console. Please add it to your Authorized Domains.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: error.message || "Could not sign in with Google.",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className={`mb-12 transition-all duration-1000 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-xl">
              <span className="text-primary-foreground font-bold text-3xl">N</span>
            </div>
            <h1 className="text-3xl font-bold text-primary tracking-tight">NexaMart</h1>
          </div>
        </div>

        <div className={`w-full max-w-md transition-all duration-1000 ease-out delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/60 p-8 md:p-10">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2 font-headline">
                {isSignUpMode ? "Create Account" : "Welcome Back"}
              </h2>
              <p className="text-muted-foreground text-sm">
                {isSignUpMode ? "Start your shopping journey today" : "Sign in to continue to NexaMart"}
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 rounded-xl h-12 bg-white/50 border-border focus:ring-primary/20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {!isSignUpMode && (
                    <button type="button" className="text-xs text-primary hover:underline font-medium">
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 rounded-xl h-12 bg-white/50 border-border focus:ring-primary/20"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 rounded-xl text-lg font-semibold gap-2 shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98]"
                disabled={isSigningIn}
              >
                {isSigningIn ? (
                  <Spinner className="h-5 w-5 text-white" />
                ) : (
                  <>
                    {isSignUpMode ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                    {isSignUpMode ? "Sign Up" : "Sign In"}
                  </>
                )}
              </Button>
            </form>

            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground font-bold tracking-widest uppercase">OR</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={isSigningIn}
              className="w-full h-12 rounded-xl border-border bg-white hover:bg-muted/30 gap-3 font-semibold transition-all shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.9 3.16-1.92 4.16-1.24 1.24-3.16 2.52-6.4 2.52-5.12 0-9.28-4.12-9.28-9.24s4.16-9.24 9.28-9.24c2.8 0 4.92 1.08 6.44 2.52l2.32-2.32C18.44 1.44 15.64 0 12.48 0 5.6 0 0 5.6 0 12.48s5.6 12.48 12.48 12.48c3.68 0 6.48-1.2 8.64-3.48 2.24-2.24 2.96-5.4 2.96-7.88 0-.76-.08-1.48-.2-2.16h-11.4z"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="mt-8 pt-6 border-t border-border flex flex-col items-center gap-4">
              <p className="text-sm text-muted-foreground">
                {isSignUpMode ? "Already have an account?" : "Don't have an account?"}
              </p>
              <Button
                variant="outline"
                onClick={() => setIsSignUpMode(!isSignUpMode)}
                className="w-full rounded-xl h-12 font-semibold hover:bg-primary/5 hover:text-primary transition-colors"
              >
                {isSignUpMode ? "Sign In Instead" : "Create New Account"}
              </Button>
            </div>
          </div>
        </div>

        <p className={`text-center text-xs text-muted-foreground mt-8 px-4 max-w-md transition-all duration-1000 ease-out delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          By continuing, you agree to our <a href="#" className="text-primary hover:underline font-medium">Terms</a> and <a href="#" className="text-primary hover:underline font-medium">Privacy Policy</a>
        </p>
      </div>

      <footer className={`relative z-10 py-6 text-center transition-all duration-1000 ease-out delay-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        <p className="text-sm text-muted-foreground">© 2024 NexaMart. All rights reserved.</p>
      </footer>
    </div>
  );
}
