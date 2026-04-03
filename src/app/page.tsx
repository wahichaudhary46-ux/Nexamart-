
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/components/auth-provider";
import { Spinner } from "@/components/ui/spinner";

export default function HomePage() {
  const { user, userProfile, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && userProfile) {
      if (userProfile.isProfileComplete) {
        router.push("/dashboard");
      } else {
        router.push("/onboarding");
      }
    } else if (!loading && !user) {
      router.push("/login");
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
