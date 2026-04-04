
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { motion } from "framer-motion";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

export default function OnboardingPage() {
  const { user, userProfile, loading, signOut } = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
    if (!loading && user && userProfile?.isProfileComplete) router.push("/dashboard");
    if (userProfile?.fullName) setFullName(userProfile.fullName);
  }, [user, userProfile, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !user) return;
    setSaving(true);
    
    const userRef = doc(db, "users", user.uid);
    const updateData = {
      fullName,
      mobileNumber: phone || "",
      isProfileComplete: true,
      updatedAt: serverTimestamp(),
    };

    updateDoc(userRef, updateData)
      .then(() => {
        router.push("/dashboard");
      })
      .catch(async (error: any) => {
        if (error.code === 'permission-denied') {
          const permissionError = new FirestorePermissionError({
            path: userRef.path,
            operation: 'update',
            requestResourceData: updateData,
          });
          errorEmitter.emit('permission-error', permissionError);
        }
      })
      .finally(() => {
        setSaving(false);
      });
  };

  if (loading || !user) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex items-center justify-center px-4 py-12 transition-colors duration-300">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 dark:border-gray-800 p-8 md:p-10 transition-all duration-300">
          <div className="flex justify-center mb-8">
            <Image
              src="/logo.png"
              alt="NexaMart"
              width={180}
              height={60}
              className="object-contain"
              priority
            />
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Complete your profile</h2>
            <p className="text-slate-500 dark:text-gray-400 text-sm mt-1">Please provide your details to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-gray-300 ml-1">Full Name *</label>
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Akash Sharma"
                required
                className="h-12 rounded-xl border-slate-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-primary/20"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-gray-300 ml-1">Phone Number (optional)</label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="h-12 rounded-xl border-slate-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-primary/20"
              />
            </div>
            <Button
              type="submit"
              disabled={saving || !fullName.trim()}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-xl shadow-lg transition-all"
            >
              {saving ? <Spinner className="h-5 w-5" /> : "Continue to Dashboard"}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={signOut}
              className="text-xs font-bold text-slate-400 hover:text-primary transition-colors uppercase tracking-widest"
            >
              ← Sign out
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-gray-950">
      <Spinner className="h-8 w-8 text-primary" />
    </div>
  );
}
