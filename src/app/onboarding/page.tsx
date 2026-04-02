
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

export default function OnboardingPage() {
  const { user, userProfile, loading, updateUserProfile } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    city: "",
    address: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
    if (!loading && userProfile?.isProfileComplete) {
      router.push("/dashboard");
    }
  }, [user, userProfile, loading, router]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.displayName || "",
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateUserProfile({
        ...formData,
        isProfileComplete: true,
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving profile:", error);
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><Spinner className="h-10 w-10" /></div>;
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background overflow-hidden">
      {/* Left Panel - Hero Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary items-center justify-center p-12">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 text-white space-y-12">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
              <span className="text-primary font-bold text-2xl">N</span>
            </div>
            <span className="text-2xl font-bold tracking-tight">NexaMart</span>
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl font-bold leading-tight font-headline">
              Almost there!<br />
              <span className="text-accent">Just a few details.</span>
            </h1>
            <p className="text-white/80 text-xl max-w-md">
              Complete your profile to unlock personalized recommendations and exclusive deals.
            </p>
          </div>

          <div className="space-y-6">
            {[
              { icon: CheckCircle2, text: "Personalized AI Recommendations" },
              { icon: Zap, text: "Lightning-fast Checkout" },
              { icon: ShieldCheck, text: "Secure Member Data Protection" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-accent" />
                </div>
                <span className="text-white font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <span className="text-xl font-bold text-primary">NexaMart</span>
            </div>
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-foreground font-headline">Complete Your Profile</h2>
            <p className="text-muted-foreground">Help us personalize your shopping experience</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-white/50 backdrop-blur shadow-xl border border-border p-8 rounded-3xl">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                required
                placeholder="John Doe"
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                required
                type="tel"
                placeholder="10-digit number"
                value={formData.mobileNumber}
                onChange={e => setFormData({ ...formData, mobileNumber: e.target.value })}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                required
                placeholder="Enter your city"
                value={formData.city}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                required
                placeholder="Street, locality, area"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                className="rounded-xl"
              />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full h-12 rounded-xl text-lg font-semibold gap-2 shadow-lg hover:shadow-primary/20 transition-all">
              {isSubmitting ? <Spinner className="h-5 w-5 text-white" /> : (
                <>
                  Save & Start Shopping
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            We value your privacy. Your data is encrypted and never shared.
          </p>
        </div>
      </div>
    </div>
  );
}
