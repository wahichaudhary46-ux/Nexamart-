"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-cyan-700 via-blue-800 to-indigo-900">
      {/* Decorative circles */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-8 md:p-10">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Complete your profile</h2>
              <p className="text-white/70 text-sm mt-1">Tell us a bit about yourself</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Full Name *</label>
                <Input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Akash Sharma"
                  required
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/50 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Phone Number (optional)</label>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/50 rounded-xl"
                />
              </div>
              <Button
                type="submit"
                disabled={saving || !fullName.trim()}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold h-12 rounded-xl shadow-lg transition-all duration-200"
              >
                {saving ? <Spinner className="h-5 w-5" /> : "Continue to Dashboard →"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={signOut}
                className="text-sm text-white/60 hover:text-white/90 transition"
              >
                ← Sign out
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-indigo-900">
      <Spinner className="h-8 w-8 text-white" />
    </div>
  );
}
