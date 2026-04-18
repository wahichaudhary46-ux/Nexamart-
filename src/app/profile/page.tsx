'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useFirestore } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { User, GraduationCap, MapPin, Info, Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const auth = useAuth();
  const db = useFirestore();
  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push('/login');
        return;
      }
      
      try {
        // Fetch from 'students' collection as defined in onboarding
        const docRef = doc(db, 'students', currentUser.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setStudentData(docSnap.data());
        } else {
          // Redirect to onboarding if profile is missing
          router.push('/onboarding');
        }
      } catch (error) {
        console.error("Error fetching student profile:", error);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [auth, db, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    );
  }

  if (!studentData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Glassmorphism Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl">
          
          {/* Header with Avatar */}
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start border-b border-white/20 pb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-xl">
              {studentData.name?.charAt(0) || 'U'}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{studentData.name}</h1>
              <p className="text-blue-300 text-sm opacity-80">{studentData.email}</p>
              <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                <span className="bg-blue-500/20 border border-blue-500/30 text-blue-100 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {studentData.class || studentData.className}
                </span>
                {studentData.stream && (
                  <span className="bg-indigo-500/20 border border-indigo-500/30 text-indigo-100 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {studentData.stream}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Personal Details */}
          <div className="mt-8 space-y-5">
            <h2 className="text-sm font-black text-blue-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <User size={16} /> Personal Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard label="Full Name" value={studentData.name} />
              <InfoCard label="Email" value={studentData.email} />
              <InfoCard label="Date of Birth" value={studentData.dob} />
              <InfoCard label="Gender" value={studentData.gender} />
              <InfoCard label="Bio" value={studentData.bio} fullWidth />
            </div>
          </div>

          {/* Academic Details */}
          <div className="mt-10 space-y-5">
            <h2 className="text-sm font-black text-blue-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <GraduationCap size={16} /> Academic Record
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard label="Class / Level" value={studentData.class || studentData.className} />
              <InfoCard label="Stream" value={studentData.stream} />
              <InfoCard label="Target Exam" value={studentData.exam} />
              <InfoCard label="Admission ID" value={studentData.admissionNo} />
            </div>
          </div>

          {/* Location Details */}
          <div className="mt-10 space-y-5">
            <h2 className="text-sm font-black text-blue-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <MapPin size={16} /> Campus Location
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard label="City" value={studentData.city} />
              <InfoCard label="State" value={studentData.state} />
              <InfoCard label="Country" value={studentData.country} />
            </div>
          </div>

          {/* Last Updated Footer */}
          <div className="mt-10 pt-6 border-t border-white/10 text-center">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.1em]">
              Profile Identity Verified • Last Sync: {studentData.lastUpdated ? new Date(studentData.lastUpdated.seconds * 1000).toLocaleDateString() : 'Today'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value, fullWidth = false }: { label: string; value?: string; fullWidth?: boolean }) {
  return (
    <div className={`bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-300 ${fullWidth ? 'md:col-span-2' : ''}`}>
      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-1.5">
        <Info size={10} className="text-blue-500" /> {label}
      </p>
      <p className="text-white font-bold mt-1 text-sm break-words">{value || 'Not provided'}</p>
    </div>
  );
}
