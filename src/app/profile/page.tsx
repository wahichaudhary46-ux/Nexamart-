'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { User, BookOpen, MapPin, Calendar, LogOut, Mail, GraduationCap, Info } from 'lucide-react';

export default function UserProfile() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Firebase से Onboarding का डेटा मँगाना
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const docRef = doc(db, 'students', currentUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            console.log("No data found! Redirecting to onboarding...");
            router.push('/onboarding');
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      
      {/* --- 1. Top Header & Profile Card --- */}
      <div className="bg-blue-600 px-6 pt-12 pb-24 rounded-b-[40px] shadow-lg text-white relative">
        <h1 className="text-center text-lg font-black tracking-widest uppercase mb-6">My Profile</h1>
        
        <div className="absolute -bottom-16 left-0 w-full px-6">
          <div className="bg-white rounded-[24px] p-6 shadow-xl border border-gray-100 flex flex-col items-center text-center">
            
            <div className="w-24 h-24 bg-gradient-to-tr from-blue-100 to-blue-50 rounded-full border-4 border-white shadow-md flex items-center justify-center -mt-16 mb-3 overflow-hidden">
              {userData?.profilePic ? (
                <img src={userData.profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-blue-400" />
              )}
            </div>
            
            <h2 className="text-xl font-black text-gray-800">{userData?.name || "Student Name"}</h2>
            <p className="text-sm font-bold text-gray-400 flex items-center justify-center gap-1 mt-1">
              <Mail className="w-3.5 h-3.5" /> {userData?.email}
            </p>

            <div className="mt-4 inline-flex items-center gap-2 bg-green-50 px-4 py-1.5 rounded-full border border-green-100">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-black text-green-700 tracking-wider">ADMISSION NO: {userData?.admissionNo || "1"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Spacing for the overlapping card */}
      <div className="mt-24 px-6 space-y-4">

        {/* --- 2. Academic Details --- */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-blue-500" /> Academic Info
          </h3>
          <div className="grid grid-cols-2 gap-y-4">
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Class / Level</p>
              <p className="text-sm font-bold text-gray-800">{userData?.className || "N/A"}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Target Exam</p>
              <p className="text-sm font-bold text-gray-800">{userData?.exam || "N/A"}</p>
            </div>
            {userData?.stream && (
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Stream</p>
                <p className="text-sm font-bold text-gray-800">{userData?.stream}</p>
              </div>
            )}
          </div>
        </div>

        {/* --- 3. Personal Details --- */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-500" /> Personal Info
          </h3>
          <div className="grid grid-cols-2 gap-y-4">
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Date of Birth</p>
              <p className="text-sm font-bold text-gray-800">{userData?.dob || "N/A"}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Gender</p>
              <p className="text-sm font-bold text-gray-800">{userData?.gender || "N/A"}</p>
            </div>
            <div className="col-span-2">
              <p className="text-[10px] text-gray-400 font-bold uppercase">Bio</p>
              <p className="text-sm font-medium text-gray-600 mt-1">{userData?.bio || "No bio provided."}</p>
            </div>
          </div>
        </div>

        {/* --- 4. Location Details --- */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-500" /> Location
          </h3>
          <p className="text-sm font-bold text-gray-800">
            {userData?.city ? `${userData.city}, ${userData.state}, ${userData.country}` : "N/A"}
          </p>
        </div>

        {/* --- 5. Logout / Actions --- */}
        <div className="pt-4">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 font-bold py-4 rounded-xl hover:bg-red-100 transition-colors"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
          <p className="text-center text-[10px] text-gray-400 mt-4 font-medium">
            Name & Profile updates are restricted to once a year. Contact Admin for changes.
          </p>
        </div>

      </div>

    </div>
  );
}
