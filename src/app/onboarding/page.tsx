
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { motion, AnimatePresence } from "framer-motion";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import { Camera, Book, GraduationCap, MapPin, User, ChevronRight, ArrowLeft } from "lucide-react";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

export default function OnboardingPage() {
  const { user, userProfile, loading, signOut } = useAuth();
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
    if (!loading && !user) router.push("/login");
    if (!loading && user && userProfile?.isProfileComplete) router.push("/");
    
    if (userProfile) {
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
    
    const userRef = doc(db, "users", user.uid);
    const updateData = {
      ...formData,
      isProfileComplete: true,
      updatedAt: serverTimestamp(),
    };

    updateDoc(userRef, updateData)
      .then(() => {
        router.push("/");
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

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <Spinner className="h-8 w-8 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white font-body selection:bg-blue-500/30 overflow-x-hidden">
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-md mx-auto px-6 pt-10 pb-20">
        
        {/* Step Indicator */}
        <div className="flex justify-between items-center mb-10 gap-2">
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= s ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-slate-800'}`} 
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
              className="space-y-6"
            >
              <header>
                <h2 className="text-3xl font-black tracking-tight mb-2">Personal Details 👤</h2>
                <p className="text-slate-400 text-sm">Let's start with the basics.</p>
              </header>

              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-slate-800 rounded-3xl border-2 border-dashed border-slate-700 flex items-center justify-center relative overflow-hidden group hover:border-blue-500 transition-colors cursor-pointer">
                  {formData.photoURL ? (
                    <img src={formData.photoURL} className="w-full h-full object-cover" alt="Profile" />
                  ) : (
                    <Camera className="w-8 h-8 text-slate-500 group-hover:text-blue-400 transition-colors" />
                  )}
                </div>
                <p className="text-[10px] mt-3 text-orange-400 font-bold uppercase tracking-widest text-center px-4">
                  ⚠️ Profile & Name can be updated once a year!
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Rahul Sharma" 
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Birth Date</label>
                    <input 
                      type="date" 
                      value={formData.dob}
                      onChange={(e) => setFormData({...formData, dob: e.target.value})}
                      className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Gender</label>
                    <select 
                      value={formData.gender}
                      onChange={(e) => setFormData({...formData, gender: e.target.value})}
                      className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm appearance-none"
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Your Bio</label>
                  <textarea 
                    placeholder="A brief description about yourself..." 
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-2xl h-24 outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-600 resize-none" 
                  />
                </div>
              </div>

              <Button 
                onClick={handleNext} 
                disabled={!formData.fullName}
                className="w-full h-14 bg-blue-600 hover:bg-blue-700 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-900/40 disabled:opacity-50"
              >
                Next Step <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
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
                <h2 className="text-3xl font-black tracking-tight mb-2">Education 📚</h2>
                <p className="text-slate-400 text-sm">Help us personalize your study experience.</p>
              </header>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Select Class / Level</label>
                  <select 
                    value={formData.class}
                    onChange={(e) => setFormData({...formData, class: e.target.value})}
                    className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm appearance-none"
                  >
                    <option value="">Select Level</option>
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10">Class 10</option>
                    <option value="Class 11">Class 11</option>
                    <option value="Class 12">Class 12</option>
                    <option value="JEE">JEE Aspirant</option>
                    <option value="NEET">NEET Aspirant</option>
                    <option value="UPSC">UPSC</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Target Exam</label>
                  <input 
                    type="text" 
                    placeholder="e.g. CBSE 2026 or JEE Advanced" 
                    value={formData.exam}
                    onChange={(e) => setFormData({...formData, exam: e.target.value})}
                    className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-600" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Stream</label>
                  <select 
                    value={formData.stream}
                    onChange={(e) => setFormData({...formData, stream: e.target.value})}
                    className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm appearance-none"
                  >
                    <option value="">Select Stream</option>
                    <option value="Science">Science</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Arts">Arts</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div className="bg-blue-600/10 p-5 rounded-2xl border border-blue-500/30 flex items-start gap-4">
                  <div className="bg-blue-500/20 p-2 rounded-xl">
                    <GraduationCap className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Admission Number</p>
                    <p className="text-lg font-mono font-black">{formData.admissionNo}</p>
                    <p className="text-[9px] text-slate-400 mt-1 uppercase">Generated by Admin for full access</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={handleBack} 
                  variant="outline"
                  className="flex-1 h-14 bg-transparent border-slate-700 text-slate-300 rounded-2xl font-black text-xs uppercase tracking-widest"
                >
                  <ArrowLeft className="mr-2 w-4 h-4" /> Back
                </Button>
                <Button 
                  onClick={handleNext} 
                  className="flex-1 h-14 bg-blue-600 hover:bg-blue-700 rounded-2xl font-black text-xs uppercase tracking-widest"
                >
                  Next <ChevronRight className="ml-2 w-4 h-4" />
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
              className="space-y-6"
            >
              <header>
                <h2 className="text-3xl font-black tracking-tight mb-2">Location 📍</h2>
                <p className="text-slate-400 text-sm">Where are you studying from?</p>
              </header>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1">City</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Nawada" 
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-600" 
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1">State</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Bihar" 
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-600" 
                  />
                </div>

                <div className="space-y-1 opacity-60">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Country</label>
                  <input 
                    type="text" 
                    value={formData.country} 
                    readOnly 
                    className="w-full bg-slate-900 border border-slate-800 p-4 rounded-2xl text-slate-500 outline-none" 
                  />
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <Button 
                  onClick={handleSubmit} 
                  disabled={saving || !formData.city || !formData.state}
                  className="w-full h-16 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl font-black text-lg uppercase tracking-widest shadow-xl shadow-green-900/30 disabled:opacity-50"
                >
                  {saving ? <Spinner className="h-6 w-6" /> : "Finish & Start Studying 🍯"}
                </Button>
                <button 
                  onClick={handleBack} 
                  className="w-full text-slate-500 hover:text-white transition-colors font-black text-[10px] uppercase tracking-widest"
                >
                  Back to Education
                </button>
              </div>

              <p className="text-[10px] text-slate-500 text-center uppercase font-bold tracking-widest mt-10">
                Contact Library Office for corrections
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Auth Helper Sign Out */}
        <div className="mt-20 text-center">
          <button 
            onClick={signOut} 
            className="text-[10px] font-black text-slate-700 hover:text-red-500 transition-colors uppercase tracking-[0.3em]"
          >
            ← Exit Session
          </button>
        </div>
      </div>
    </div>
  );
}
