
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { motion, AnimatePresence } from "framer-motion";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import { Camera, Book, GraduationCap, MapPin, User, ChevronRight, ArrowLeft, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function OnboardingPage() {
  const { user, userProfile, loading } = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    photoURL: "",
    dob: "",
    gender: "",
    bio: "",
    class: "",
    exam: "",
    stream: "",
    city: "",
    state: "",
    country: "India",
    admissionNo: ""
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
    if (!loading && user && userProfile?.isProfileComplete) {
      router.push("/");
    }
    
    if (userProfile && !formData.fullName) {
      setFormData(prev => ({
        ...prev,
        fullName: userProfile.fullName || "",
        photoURL: userProfile.photoURL || "",
        admissionNo: userProfile.admissionNo || `NEXA-${Math.floor(100000 + Math.random() * 900000)}`
      }));
    }
  }, [user, userProfile, loading, router]);

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    if (!user) return;
    setSaving(true);
    
    try {
      const userRef = doc(db, "users", user.uid);
      const updateData = {
        ...formData,
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
        <Spinner className="h-10 w-10 text-blue-500 mb-4" />
        <p className="text-sm font-black tracking-widest uppercase opacity-50">Checking Session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white font-body selection:bg-blue-500/30 overflow-x-hidden relative">
      {/* Background Mesh Glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-md mx-auto px-6 pt-12 pb-20">
        
        {/* Step Indicator */}
        <div className="flex justify-between items-center mb-12 gap-3">
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= s ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-slate-800'}`} 
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <header>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Step 01 / 03</span>
                </div>
                <h2 className="text-3xl font-black tracking-tight mb-2">Your Identity 👤</h2>
                <p className="text-slate-400 text-sm">Let's set up your member profile.</p>
              </header>

              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-slate-800 rounded-[2rem] border-2 border-dashed border-slate-700 flex items-center justify-center relative overflow-hidden group hover:border-blue-500 transition-all cursor-pointer shadow-2xl">
                  {formData.photoURL ? (
                    <img src={formData.photoURL} className="w-full h-full object-cover" alt="Profile" />
                  ) : (
                    <Camera className="w-8 h-8 text-slate-500 group-hover:text-blue-400 transition-colors" />
                  )}
                </div>
                <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl max-w-[280px]">
                  <p className="text-[10px] text-orange-400 font-bold uppercase tracking-widest text-center leading-relaxed">
                    ⚠️ Profile & Name can be updated only once a year!
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Rahul Sharma" 
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-600 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">Birth Date</label>
                    <input 
                      type="date" 
                      value={formData.dob}
                      onChange={(e) => setFormData({...formData, dob: e.target.value})}
                      className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">Gender</label>
                    <select 
                      value={formData.gender}
                      onChange={(e) => setFormData({...formData, gender: e.target.value})}
                      className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm appearance-none font-medium"
                    >
                      <option value="" className="bg-slate-900">Select</option>
                      <option value="Male" className="bg-slate-900">Male</option>
                      <option value="Female" className="bg-slate-900">Female</option>
                      <option value="Other" className="bg-slate-900">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">Short Bio</label>
                  <textarea 
                    placeholder="A brief sentence about your academic goals..." 
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-2xl h-24 outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-600 resize-none text-sm font-medium" 
                  />
                </div>
              </div>

              <Button 
                onClick={handleNext} 
                disabled={!formData.fullName}
                className="w-full h-16 bg-blue-600 hover:bg-blue-700 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/40 disabled:opacity-50 transition-all active:scale-95"
              >
                Continue to Education <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
              
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
              className="space-y-8"
            >
              <header>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Step 02 / 03</span>
                </div>
                <h2 className="text-3xl font-black tracking-tight mb-2">Education 📚</h2>
                <p className="text-slate-400 text-sm">Class select karte hi aapko usi ka material dikhega.</p>
              </header>

              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">Class / Level</label>
                  <select 
                    value={formData.class}
                    onChange={(e) => setFormData({...formData, class: e.target.value})}
                    className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm appearance-none font-medium"
                  >
                    <option value="" className="bg-slate-900">Select Level</option>
                    <option value="Class 9" className="bg-slate-900">Class 9</option>
                    <option value="Class 10" className="bg-slate-900">Class 10</option>
                    <option value="Class 11" className="bg-slate-900">Class 11</option>
                    <option value="Class 12" className="bg-slate-900">Class 12</option>
                    <option value="JEE" className="bg-slate-900">JEE Aspirant</option>
                    <option value="NEET" className="bg-slate-900">NEET Aspirant</option>
                    <option value="UPSC" className="bg-slate-900">UPSC</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">Target Exam</label>
                  <input 
                    type="text" 
                    placeholder="e.g. CBSE 2026 or JEE Advanced" 
                    value={formData.exam}
                    onChange={(e) => setFormData({...formData, exam: e.target.value})}
                    className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-600 font-medium" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">Stream</label>
                  <select 
                    value={formData.stream}
                    onChange={(e) => setFormData({...formData, stream: e.target.value})}
                    className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm appearance-none font-medium"
                  >
                    <option value="" className="bg-slate-900">Select Stream</option>
                    <option value="Science" className="bg-slate-900">Science</option>
                    <option value="Commerce" className="bg-slate-900">Commerce</option>
                    <option value="Arts" className="bg-slate-900">Arts</option>
                    <option value="General" className="bg-slate-900">General</option>
                  </select>
                </div>

                <div className="bg-blue-600/10 p-6 rounded-[2rem] border border-blue-500/30 flex items-start gap-4 shadow-inner">
                  <div className="bg-blue-500/20 p-2.5 rounded-xl shrink-0">
                    <GraduationCap className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Generated Admission ID</p>
                    <p className="text-xl font-mono font-black tracking-wider text-white">{formData.admissionNo}</p>
                    <p className="text-[9px] text-slate-500 mt-1 uppercase font-bold">Admin will verify this for full access</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={handleBack} 
                  variant="outline"
                  className="flex-1 h-16 bg-transparent border-slate-700 text-slate-300 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800"
                >
                  <ArrowLeft className="mr-2 w-4 h-4" /> Back
                </Button>
                <Button 
                  onClick={handleNext} 
                  disabled={!formData.class}
                  className="flex-1 h-16 bg-blue-600 hover:bg-blue-700 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-900/40 disabled:opacity-50"
                >
                  Location <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <header>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Step 03 / 03</span>
                </div>
                <h2 className="text-3xl font-black tracking-tight mb-2">Location 📍</h2>
                <p className="text-slate-400 text-sm">Where are you studying from?</p>
              </header>

              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">City</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Nawada" 
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-600 font-medium" 
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">State</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Bihar" 
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-600 font-medium" 
                  />
                </div>

                <div className="space-y-1.5 opacity-60">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">Country</label>
                  <input 
                    type="text" 
                    value={formData.country} 
                    readOnly 
                    className="w-full bg-slate-900 border border-slate-800 p-4 rounded-2xl text-slate-500 outline-none font-medium" 
                  />
                </div>
              </div>

              <div className="pt-6 space-y-4">
                <Button 
                  onClick={handleSubmit} 
                  disabled={saving || !formData.city || !formData.state}
                  className="w-full h-18 bg-gradient-to-br from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-[2rem] font-black text-lg uppercase tracking-widest shadow-2xl shadow-green-900/40 disabled:opacity-50 transition-all active:scale-95"
                >
                  {saving ? <Spinner className="h-6 w-6" /> : "Finish & Start Studying 🍯"}
                </Button>
                <button 
                  onClick={handleBack} 
                  className="w-full text-slate-500 hover:text-white transition-colors font-black text-[10px] uppercase tracking-[0.3em]"
                >
                  Back to Education
                </button>
              </div>

              <p className="text-[10px] text-slate-700 text-center uppercase font-bold tracking-widest mt-12 leading-relaxed">
                By finishing, you agree to our Digital Library Terms.<br/>Your IP is logged for security.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
