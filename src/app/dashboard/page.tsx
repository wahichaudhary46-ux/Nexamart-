
'use client';

import React, { useEffect, useState } from 'react';
import { auth, db } from '@/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { User, Mail, GraduationCap, MapPin, LogOut, ShieldCheck, Loader2 } from 'lucide-react';

export default function CleanDashboard() {
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch data from Firestore
        const docRef = doc(db, "students", user.uid);
        try {
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setStudent(docSnap.data());
          } else {
            // Redirect to onboarding if profile is missing
            router.push('/onboarding');
          }
        } catch (error) {
          console.error("Error fetching student record:", error);
        } finally {
          setLoading(false);
        }
      } else {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
        <p className="font-bold tracking-widest animate-pulse">Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 pb-20">
      
      {/* 1. Header Area */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-black tracking-tighter">LIBRARY <span className="text-blue-500">PRO</span></h1>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Student Dashboard</p>
        </div>
        <button 
          onClick={handleSignOut} 
          className="p-3 bg-red-500/10 rounded-2xl text-red-500 hover:bg-red-500/20 transition-colors"
          title="Sign Out"
        >
          <LogOut size={20} />
        </button>
      </div>

      {/* 2. Main Profile Card */}
      <div className="bg-white/5 border border-white/10 rounded-[35px] p-8 mb-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
          <ShieldCheck size={100} />
        </div>
        
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full border-4 border-blue-500 p-1 mb-4 shadow-2xl shadow-blue-500/20 overflow-hidden">
            <img 
              src={student?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(student?.name || 'User')}&background=0D8ABC&color=fff`} 
              className="w-full h-full rounded-full object-cover" 
              alt="Profile" 
            />
          </div>
          <h2 className="text-2xl font-black">{student?.name}</h2>
          <div className="bg-blue-600 px-4 py-1 rounded-full text-[10px] font-black mt-2 uppercase tracking-widest shadow-lg shadow-blue-900/40">
            Admission No: {student?.admissionNo}
          </div>
        </div>
      </div>

      {/* 3. Details Grid (The Clean Part) */}
      <div className="grid grid-cols-1 gap-4">
        
        {/* Email Box */}
        <div className="bg-white/5 border border-white/5 p-5 rounded-3xl flex items-center gap-4 hover:bg-white/10 transition-colors">
          <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400">
            <Mail size={20} />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Registered Email</p>
            <p className="text-sm font-bold">{student?.email}</p>
          </div>
        </div>

        {/* Education Box */}
        <div className="bg-white/5 border border-white/5 p-5 rounded-3xl flex items-center gap-4 hover:bg-white/10 transition-colors">
          <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400">
            <GraduationCap size={20} />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Class & Goal</p>
            <p className="text-sm font-bold">{student?.className} • {student?.exam}</p>
          </div>
        </div>

        {/* Location Box */}
        <div className="bg-white/5 border border-white/5 p-5 rounded-3xl flex items-center gap-4 hover:bg-white/10 transition-colors">
          <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-400">
            <MapPin size={20} />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Home Town</p>
            <p className="text-sm font-bold">{student?.city}, {student?.state}</p>
          </div>
        </div>

      </div>

      {/* 4. Footer Note */}
      <div className="mt-10 text-center">
        <p className="text-[10px] text-gray-500 font-bold leading-relaxed tracking-widest uppercase">
          Profile is locked for 1 year.<br/>
          For any errors, contact library admin office.
        </p>
      </div>

    </div>
  );
}
