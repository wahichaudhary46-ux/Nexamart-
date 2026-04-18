
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/components/auth-provider';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Camera, AlertCircle, Info, User, GraduationCap, MapPin, Sparkles, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, userProfile, loading } = useAuthContext();
  const db = useFirestore();

  const [formData, setFormData] = useState({
    fullName: '',
    photoURL: '',
    dob: '',
    gender: '',
    admissionNo: '1',
    bio: '',
    class: '',
    exam: '',
    stream: '',
    city: '',
    state: '',
    country: 'India'
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (userProfile?.isProfileComplete) {
        router.push('/');
      } else if (userProfile) {
        setFormData(prev => ({
          ...prev,
          fullName: userProfile.fullName || '',
          photoURL: userProfile.photoURL || '',
        }));
      }
    }
  }, [user, userProfile, loading, router]);

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.class) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Name and Class are required fields.",
      });
      return;
    }

    setSaving(true);
    try {
      const userRef = doc(db, "users", user!.uid);
      const updateData = {
        ...formData,
        isProfileComplete: true,
        updatedAt: serverTimestamp(),
      };

      await setDoc(userRef, updateData, { merge: true });
      
      toast({
        title: "Profile Completed",
        description: "Welcome to Nexa-Library! Your portal is ready.",
      });
      
      router.push('/');
    } catch (err: any) {
      console.error("Error saving profile:", err);
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-950 flex flex-col items-center justify-center text-white">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <h2 className="font-bold tracking-widest animate-pulse">Loading setup...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 font-body py-10 px-4 flex flex-col items-center relative overflow-hidden">
      
      {/* 3D Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 -left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl animate-float"></div>
      </div>

      <div className="w-full max-w-3xl relative z-10 perspective-1000">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 md:p-8 transform transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
          
          <div className="text-center mb-8">
            <div className="inline-flex p-3 bg-blue-500/20 rounded-2xl mb-3">
              <Sparkles className="w-8 h-8 text-blue-300" />
            </div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">Complete Your Profile</h1>
            <p className="text-sm text-blue-200/70 mt-1">Fill your details to unlock the full library experience</p>
          </div>

          <form onSubmit={handleFinish} className="space-y-8">
            
            {/* SECTION 1: Personal Details */}
            <div className="space-y-4">
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
                <div className="relative group cursor-pointer">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl border-2 border-dashed border-white/30 flex items-center justify-center shadow-inner group-hover:border-blue-400 transition-all">
                    {formData.photoURL ? (
                      <img src={formData.photoURL} alt="Profile" className="w-full h-full object-cover rounded-2xl" />
                    ) : (
                      <Camera className="text-gray-400 w-7 h-7 group-hover:text-blue-300" />
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-1.5 shadow-lg">
                    <Camera className="w-3 h-3 text-white" />
                  </div>
                </div>
                <span className="text-[11px] text-gray-400 mt-2">Upload Profile Photo (optional)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Full Name *" 
                  required 
                  value={formData.fullName}
                  className="w-full bg-white/10 border border-white/20 p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm text-white placeholder:text-gray-400 transition-all"
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})} 
                />
                
                <input 
                  type="email" 
                  disabled 
                  value={user.email || ''}
                  className="w-full bg-white/5 border border-white/10 p-3.5 rounded-xl text-gray-400 text-sm cursor-not-allowed" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="date" 
                  value={formData.dob}
                  className="w-full bg-white/10 border border-white/20 p-3.5 rounded-xl outline-none text-sm text-white [color-scheme:dark]"
                  onChange={(e) => setFormData({...formData, dob: e.target.value})} 
                />
                
                <select 
                  value={formData.gender}
                  className="w-full bg-white/10 border border-white/20 p-3.5 rounded-xl outline-none text-sm text-white"
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                >
                  <option value="" className="bg-gray-800">Gender</option>
                  <option value="Male" className="bg-gray-800">Male</option>
                  <option value="Female" className="bg-gray-800">Female</option>
                  <option value="Other" className="bg-gray-800">Other</option>
                </select>
              </div>

              <textarea 
                placeholder="Write a short bio about yourself..." 
                value={formData.bio}
                className="w-full bg-white/10 border border-white/20 p-3.5 rounded-xl outline-none text-sm h-20 resize-none text-white placeholder:text-gray-400"
                onChange={(e) => setFormData({...formData, bio: e.target.value})} 
              />
            </div>

            {/* SECTION 2: Academic Details */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-blue-300 flex items-center gap-2 border-b border-blue-500/30 pb-2">
                <GraduationCap className="w-5 h-5" /> 2. Education Details
              </h2>
              
              <div className="bg-blue-500/20 border border-blue-500/30 p-3 rounded-xl flex gap-3 items-center">
                <Info className="w-5 h-5 text-blue-300" />
                <p className="text-xs text-blue-100">Library material will be customized based on your selected Class.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select 
                  required 
                  value={formData.class}
                  className="w-full bg-white/10 border border-white/20 p-3.5 rounded-xl outline-none text-sm text-white"
                  onChange={(e) => setFormData({...formData, class: e.target.value})}
                >
                  <option value="" className="bg-gray-800">Select Class *</option>
                  <option className="bg-gray-800" value="Class 9">Class 9</option>
                  <option className="bg-gray-800" value="Class 10">Class 10</option>
                  <option className="bg-gray-800" value="Class 11">Class 11</option>
                  <option className="bg-gray-800" value="Class 12">Class 12</option>
                  <option className="bg-gray-800" value="JEE">JEE Aspirant</option>
                  <option className="bg-gray-800" value="NEET">NEET Aspirant</option>
                  <option className="bg-gray-800" value="UPSC">UPSC</option>
                  <option className="bg-gray-800" value="Other">Other Govt Exams</option>
                </select>

                <select 
                  value={formData.stream}
                  className="w-full bg-white/10 border border-white/20 p-3.5 rounded-xl outline-none text-sm text-white"
                  onChange={(e) => setFormData({...formData, stream: e.target.value})}
                >
                  <option value="" className="bg-gray-800">Stream (If Applicable)</option>
                  <option className="bg-gray-800" value="Science (PCM)">Science (PCM)</option>
                  <option className="bg-gray-800" value="Science (PCB)">Science (PCB)</option>
                  <option className="bg-gray-800" value="Commerce">Commerce</option>
                  <option className="bg-gray-800" value="Arts">Arts</option>
                </select>
              </div>

              <input 
                type="text" 
                placeholder="Target Exam (e.g. CBSE Boards, JEE 2025)" 
                value={formData.exam}
                className="w-full bg-white/10 border border-white/20 p-3.5 rounded-xl outline-none text-sm text-white placeholder:text-gray-400"
                onChange={(e) => setFormData({...formData, exam: e.target.value})} 
              />

              <div className="w-full bg-white/5 border border-white/10 p-3.5 rounded-xl flex justify-between items-center">
                <span className="text-xs text-gray-400 font-bold">Admission Number:</span>
                <span className="text-sm text-green-400 font-black">{formData.admissionNo}</span>
              </div>
              <p className="text-[10px] text-gray-500 text-right mt-1">Automatically assigned. Tracked by admin.</p>
            </div>

            {/* SECTION 3: Location Details */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-blue-300 flex items-center gap-2 border-b border-blue-500/30 pb-2">
                <MapPin className="w-5 h-5" /> 3. Location Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="City" 
                  value={formData.city}
                  className="w-full bg-white/10 border border-white/20 p-3.5 rounded-xl outline-none text-sm text-white placeholder:text-gray-400"
                  onChange={(e) => setFormData({...formData, city: e.target.value})} 
                />
                
                <input 
                  type="text" 
                  placeholder="State" 
                  value={formData.state}
                  className="w-full bg-white/10 border border-white/20 p-3.5 rounded-xl outline-none text-sm text-white placeholder:text-gray-400"
                  onChange={(e) => setFormData({...formData, state: e.target.value})} 
                />
              </div>

              <input 
                type="text" 
                disabled 
                value={formData.country}
                className="w-full bg-white/5 border border-white/10 p-3.5 rounded-xl text-gray-400 text-sm cursor-not-allowed" 
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={saving || !formData.fullName || !formData.class}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 py-4 rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-blue-900/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : '🚀 SAVE & ENTER LIBRARY'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
