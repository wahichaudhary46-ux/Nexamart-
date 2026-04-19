'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Camera, AlertCircle, Info, User, GraduationCap, MapPin, Sparkles } from 'lucide-react';

export default function Onboarding() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: '',
    profilePic: '',
    email: '',
    dob: '',
    gender: '',
    admissionNo: '1',
    bio: '',
    className: '',
    exam: '',
    stream: '',
    city: '',
    state: '',
    country: 'India'
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setFormData((prev) => ({ ...prev, email: currentUser.email || '' }));
        setLoading(false);
      } else {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Photo selection and preview function
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // File size check (under 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("Photo size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePic: reader.result as string });
      };
      reader.readAsDataURL(file); // Converts photo to base64 URL
    }
  };

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.className) {
      alert("Name और Class भरना ज़रूरी है!");
      return;
    }

    try {
      await setDoc(doc(db, "students", user.uid), {
        ...formData,
        lastUpdated: serverTimestamp(),
        role: 'student'
      });
      router.push('/profile');
    } catch (err: any) {
      alert("Error saving data: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-950 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="font-bold tracking-widest animate-pulse">Setting up your profile...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 font-sans py-10 px-4 flex flex-col items-center relative overflow-hidden">
      
      {/* 3D Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 -left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl animate-float"></div>
      </div>

      <div className="w-full max-w-3xl relative z-10 perspective-1000">
        {/* Glassmorphism Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 md:p-8 transform transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
          
          <div className="text-center mb-8">
            <div className="inline-flex p-3 bg-blue-500/20 rounded-2xl mb-3">
              <Sparkles className="w-8 h-8 text-blue-300" />
            </div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">Complete Your Profile</h1>
            <p className="text-sm text-blue-200/70 mt-1">Fill your details to unlock the full library experience</p>
          </div>

          <form onSubmit={handleFinish} className="space-y-8">
            
            {/* STEP 1: Personal Details */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in duration-500">
                <h2 className="text-lg font-bold text-blue-300 flex items-center gap-2 border-b border-blue-500/30 pb-2">
                  <User className="w-5 h-5" /> 1. Your Details
                </h2>
                
                <div className="bg-orange-500/20 border border-orange-500/40 p-4 rounded-xl flex gap-3 items-start backdrop-blur-sm">
                  <AlertCircle className="w-5 h-5 text-orange-300 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-orange-300 uppercase">Important Restriction</p>
                    <p className="text-xs text-orange-100/80 mt-1">Name & Profile Picture can only be updated <b>once a year</b>. Contact Library Office for corrections.</p>
                  </div>
                </div>

                <div className="flex flex-col items-center my-4">
                  <label htmlFor="profile-upload" className="relative w-24 h-24 bg-gray-800 rounded-full border-2 border-gray-600 flex items-center justify-center cursor-pointer hover:border-blue-500 transition-all overflow-hidden shadow-lg group">
                    {formData.profilePic ? (
                      <img src={formData.profilePic} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="text-gray-400 w-8 h-8 group-hover:text-blue-400 transition-colors" />
                    )}
                    <input 
                      id="profile-upload" 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageChange}
                    />
                  </label>
                  <span className="text-[10px] text-gray-400 mt-3 font-bold tracking-widest uppercase">Tap to Upload Photo *</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Full Name *" required value={formData.name}
                    className="w-full bg-white/10 border border-white/20 p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm text-white placeholder:text-gray-400 transition-all"
                    onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  
                  <input type="email" disabled value={formData.email}
                    className="w-full bg-white/5 border border-white/10 p-3.5 rounded-xl text-gray-400 text-sm cursor-not-allowed" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input type="date" value={formData.dob}
                    className="w-full bg-white/10 border border-white/20 p-3.5 rounded-xl outline-none text-sm text-white [color-scheme:dark]"
                    onChange={(e) => setFormData({...formData, dob: e.target.value})} />
                  
                  <select value={formData.gender}
                    className="w-full bg-white/10 border border-white/20 p-3.5 rounded-xl outline-none text-sm text-white"
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}>
                    <option value="" className="bg-gray-800">Gender</option>
                    <option value="Male" className="bg-gray-800">Male</option>
                    <option value="Female" className="bg-gray-800">Female</option>
                    <option value="Other" className="bg-gray-800">Other</option>
                  </select>
                </div>

                <textarea placeholder="Write a short bio about yourself..." value={formData.bio}
                  className="w-full bg-white/10 border border-white/20 p-3.5 rounded-xl outline-none text-sm h-20 resize-none text-white placeholder:text-gray-400"
                  onChange={(e) => setFormData({...formData, bio: e.target.value})} />

                <button type="button" onClick={() => setStep(2)} disabled={!formData.name} 
                  className="w-full bg-blue-600 py-4 rounded-xl font-bold disabled:opacity-50 mt-4 transition-all hover:bg-blue-700 active:scale-95 shadow-lg shadow-blue-900/20">
                  Next Step
                </button>
              </div>
            )}

            {/* STEP 2: Academic Details */}
            {step === 2 && (
              <div className="space-y-4 animate-in slide-in-from-right duration-500">
                <h2 className="text-lg font-bold text-blue-300 flex items-center gap-2 border-b border-blue-500/30 pb-2">
                  <GraduationCap className="w-5 h-5" /> 2. Education Details
                </h2>
                
                <div className="bg-blue-500/20 border border-blue-500/30 p-3 rounded-xl flex gap-3 items-center">
                  <Info className="w-5 h-5 text-blue-300" />
                  <p className="text-xs text-blue-100">Library material will be customized based on your selected Class.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select required value={formData.className}
                    className="w-full bg-white/10 border border-white/20 p-3.5 rounded-xl outline-none text-sm text-white"
                    onChange={(e) => setFormData({...formData, className: e.target.value})}>
                    <option value="" className="bg-gray-800">Select Class *</option>
                    <option className="bg-gray-800">Class 9</option>
                    <option className="bg-gray-800">Class 10</option>
                    <option className="bg-gray-800">Class 11</option>
                    <option className="bg-gray-800">Class 12</option>
                    <option className="bg-gray-800">JEE Aspirant</option>
                    <option className="bg-gray-800">NEET Aspirant</option>
                    <option className="bg-gray-800">UPSC</option>
                    <option className="bg-gray-800">Other Govt Exams</option>
                  </select>

                  <select value={formData.stream}
                    className="w-full bg-white/10 border border-white/20 p-3.5 rounded-xl outline-none text-sm text-white"
                    onChange={(e) => setFormData({...formData, stream: e.target.value})}>
                    <option value="" className="bg-gray-800">Stream (If Applicable)</option>
                    <option className="bg-gray-800">Science (PCM)</option>
                    <option className="bg-gray-800">Science (PCB)</option>
                    <option className="bg-gray-800">Commerce</option>
                    <option className="bg-gray-800">Arts</option>
                  </select>
                </div>

                <input type="text" placeholder="Target Exam (e.g. CBSE Boards, JEE 2025)" value={formData.exam}
                  className="w-full bg-white/10 border border-white/20 p-3.5 rounded-xl outline-none text-sm text-white placeholder:text-gray-400"
                  onChange={(e) => setFormData({...formData, exam: e.target.value})} />

                <div className="w-full bg-white/5 border border-white/10 p-3.5 rounded-xl flex justify-between items-center">
                  <span className="text-xs text-gray-400 font-bold">Admission Number:</span>
                  <span className="text-sm text-green-400 font-black">{formData.admissionNo}</span>
                </div>
                
                <div className="flex gap-4 mt-8">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 bg-gray-700 py-4 rounded-xl font-bold transition-all hover:bg-gray-600 active:scale-95">
                    Back
                  </button>
                  <button type="button" onClick={() => setStep(3)} className="flex-1 bg-blue-600 py-4 rounded-xl font-bold transition-all hover:bg-blue-700 active:scale-95 shadow-lg shadow-blue-900/20">
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Location Details */}
            {step === 3 && (
              <div className="space-y-4 animate-in slide-in-from-right duration-500">
                <h2 className="text-lg font-bold text-blue-300 flex items-center gap-2 border-b border-blue-500/30 pb-2">
                  <MapPin className="w-5 h-5" /> 3. Location Details
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="City" value={formData.city}
                    className="w-full bg-white/10 border border-white/20 p-3.5 rounded-xl outline-none text-sm text-white placeholder:text-gray-400"
                    onChange={(e) => setFormData({...formData, city: e.target.value})} />
                  
                  <input type="text" placeholder="State" value={formData.state}
                    className="w-full bg-white/10 border border-white/20 p-3.5 rounded-xl outline-none text-sm text-white placeholder:text-gray-400"
                    onChange={(e) => setFormData({...formData, state: e.target.value})} />
                </div>

                <input type="text" disabled value={formData.country}
                  className="w-full bg-white/5 border border-white/10 p-3.5 rounded-xl text-gray-400 text-sm cursor-not-allowed" />

                <div className="pt-8">
                  <button type="submit" 
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 py-4 rounded-xl font-black text-lg shadow-lg shadow-green-900/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                    FINISH & START STUDYING 🍯
                  </button>
                  <button type="button" onClick={() => setStep(2)} className="w-full mt-4 text-gray-500 font-bold hover:text-gray-400">
                    Back
                  </button>
                </div>
              </div>
            )}

          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-float {
          animation: float 10s ease-in-out infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}