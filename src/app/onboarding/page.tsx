
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import { Camera, ChevronRight, ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function OnboardingPage() {
  const { user, userProfile, loading } = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    class: "",
    city: "",
    state: "",
    country: "India",
    bio: "",
  });

  useEffect(() => {
    // Redirect logic: if not loading and no user, go to login.
    // If profile is already complete, go to home.
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (userProfile?.isProfileComplete) {
        router.push("/");
      }
    }
  }, [user, userProfile, loading, router]);

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleFinish = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const userRef = doc(db, "users", user.uid);
      const updateData = {
        fullName: formData.fullName,
        gender: formData.gender,
        class: formData.class,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        bio: formData.bio,
        isProfileComplete: true,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(userRef, updateData);
      toast({
        title: "Profile Completed",
        description: "Welcome to Nexa-Library! Your portal is ready.",
      });
      router.push("/");
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not save your profile. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="font-bold text-lg tracking-widest animate-pulse">Setting up your profile...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans p-6 flex flex-col items-center selection:bg-blue-500/30">
      {/* Progress Bar */}
      <div className="w-full max-w-sm flex justify-between mb-12 mt-10 gap-3">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-2 flex-1 rounded-full transition-all duration-500 ${
              step >= s ? "bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "bg-slate-800"
            }`}
          ></div>
        ))}
      </div>

      <div className="w-full max-w-sm">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <header>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Step 01 / 03</span>
                </div>
                <h2 className="text-3xl font-black tracking-tight mb-2">Your Details 👤</h2>
                <p className="text-slate-400 text-sm">Let's set up your member identity.</p>
              </header>

              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 bg-slate-800 rounded-[2rem] border-2 border-dashed border-slate-700 flex items-center justify-center relative overflow-hidden group hover:border-blue-500 transition-all cursor-pointer">
                  <Camera className="w-8 h-8 text-slate-500 group-hover:text-blue-400 transition-colors" />
                </div>
                <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                  <p className="text-[10px] text-orange-400 font-bold uppercase tracking-widest text-center leading-relaxed">
                    ⚠️ Name & Profile can be updated once a year!
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                  >
                    <option value="" className="bg-slate-900">Select Gender</option>
                    <option value="Male" className="bg-slate-900">Male</option>
                    <option value="Female" className="bg-slate-900">Female</option>
                    <option value="Other" className="bg-slate-900">Other</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleNext}
                disabled={!formData.fullName}
                className="w-full h-16 bg-blue-600 hover:bg-blue-700 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/40 disabled:opacity-50 transition-all active:scale-95 mt-4"
              >
                Next Step <ChevronRight className="ml-2 inline w-4 h-4" />
              </button>

              <p className="text-[9px] text-slate-600 text-center uppercase font-bold tracking-[0.2em]">
                Galti hone par Library Office se contact karein
              </p>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <header>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Step 02 / 03</span>
                </div>
                <h2 className="text-3xl font-black tracking-tight mb-2">Education 📚</h2>
                <p className="text-slate-400 text-sm">Target selection will customize your library feed.</p>
              </header>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">Class / Level</label>
                  <select
                    value={formData.class}
                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                    className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                  >
                    <option value="" className="bg-slate-900">Select Class / Level</option>
                    <option value="Class 10" className="bg-slate-900">Class 10</option>
                    <option value="Class 12" className="bg-slate-900">Class 12</option>
                    <option value="JEE" className="bg-slate-900">JEE Aspirant</option>
                    <option value="NEET" className="bg-slate-900">NEET Aspirant</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 mt-10">
                <button
                  onClick={handleBack}
                  className="flex-1 h-16 bg-slate-800 hover:bg-slate-700 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                >
                  <ArrowLeft className="mr-2 inline w-4 h-4" /> Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 h-16 bg-blue-600 hover:bg-blue-700 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-900/40"
                >
                  Next <ChevronRight className="ml-2 inline w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <header>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Step 03 / 03</span>
                </div>
                <h2 className="text-3xl font-black tracking-tight mb-2">Location 📍</h2>
                <p className="text-slate-400 text-sm">Where are you studying from?</p>
              </header>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">City</label>
                  <input
                    type="text"
                    placeholder="e.g. Nawada"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">State</label>
                  <input
                    type="text"
                    placeholder="e.g. Bihar"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="pt-8 space-y-4">
                <button
                  onClick={handleFinish}
                  disabled={saving || !formData.city || !formData.state}
                  className="w-full h-18 bg-gradient-to-br from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-[2rem] font-black text-lg uppercase tracking-widest shadow-2xl shadow-green-900/40 disabled:opacity-50 transition-all active:scale-95"
                >
                  {saving ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : "FINISH & START STUDYING 🍯"}
                </button>
                <button
                  onClick={handleBack}
                  className="w-full text-slate-500 hover:text-white transition-colors font-black text-[10px] uppercase tracking-[0.3em]"
                >
                  Back to Education
                </button>
              </div>

              <p className="text-[10px] text-slate-700 text-center uppercase font-bold tracking-widest mt-12 leading-relaxed">
                By finishing, you agree to our Digital Library Terms.<br />Your IP is logged for security.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
