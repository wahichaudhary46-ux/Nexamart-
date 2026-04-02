
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Spinner } from "@/components/ui/spinner";

export default function HomePage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (!userProfile?.isProfileComplete) {
        router.push("/onboarding");
      } else {
        router.push("/dashboard");
      }
    }
  }, [user, userProfile, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg">
          <span className="text-primary-foreground font-bold text-xl font-headline">N</span>
        </div>
        <Spinner className="h-6 w-6" />
      </div>
    </div>
  );
}
