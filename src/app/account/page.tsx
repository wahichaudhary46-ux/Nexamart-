"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Mail, 
  Phone, 
  MapPin, 
  BookOpen, 
  Compass, 
  BrainCircuit, 
  User, 
  Home,
  LogOut,
  ChevronUp
} from "lucide-react";
import { useAuthContext } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AccountPage() {
  const { user, userProfile, loading, signOut } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#e0eafc]">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1a2a3f]"></div>
      </div>
    );
  }

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const nexaId = `NEXA-${user.uid.substring(0, 6).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0eafc] to-[#cfdef3] flex items-center justify-center p-4 pb-32 text-gray-800 font-body">
      
      {/* Profile Card - Compact Size */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[420px] bg-white rounded-[32px] shadow-2xl overflow-hidden"
      >
        
        {/* Header Section */}
        <div className="bg-[#1a2a3f] px-6 py-7 text-center text-white relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
          
          <h1 className="text-xl md:text-2xl font-bold tracking-tight mb-2 relative z-10">
            {userProfile?.fullName || "Student User"}
          </h1>
          
          <div className="inline-block bg-white/20 backdrop-blur-md text-xs font-medium px-4 py-1.5 rounded-full mb-3 relative z-10">
            ID: {nexaId}
          </div>
          
          <div className="text-xs text-gray-300 flex items-center justify-center gap-1.5 opacity-90 relative z-10">
            <MapPin className="w-3.5 h-3.5" /> {userProfile?.city || "Nawada, Bihar"}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 md:p-6">
          
          {/* Student Information */}
          <h2 className="text-sm font-bold text-[#1e2f3e] border-l-4 border-blue-500 pl-2 mb-4">
            Student Information
          </h2>
          
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex items-baseline border-b border-gray-100 pb-2">
              <span className="w-24 text-[10px] uppercase font-bold tracking-wider text-gray-500">Email</span>
              <span className="flex-1 text-[13px] font-medium flex items-center gap-2 text-gray-800">
                <Mail className="w-3.5 h-3.5 text-gray-400" /> {userProfile?.email}
              </span>
            </div>
            <div className="flex items-baseline border-b border-gray-100 pb-2">
              <span className="w-24 text-[10px] uppercase font-bold tracking-wider text-gray-500">Phone</span>
              <span className="flex-1 text-[13px] font-medium flex items-center gap-2 text-gray-800">
                <Phone className="w-3.5 h-3.5 text-gray-400" /> {userProfile?.mobileNumber || "Not Set"}
              </span>
            </div>
          </div>

          {/* Academic Details (3D Block) */}
          <h2 className="text-sm font-bold text-[#1e2f3e] border-l-4 border-blue-500 pl-2 mb-4">
            Academic Details
          </h2>
          
          <div className="bg-[#f8fafc] rounded-2xl p-4 shadow-inner border border-gray-100">
            <div className="flex mb-2 text-[13px]">
              <span className="w-24 font-semibold text-gray-500 text-xs uppercase tracking-widest">Board</span>
              <span className="flex-1 font-bold text-slate-700">
                 CBSE Board
              </span>
            </div>
            <div className="flex mb-2 text-[13px]">
              <span className="w-24 font-semibold text-gray-500 text-xs uppercase tracking-widest">Target</span>
              <span className="flex-1 font-bold text-blue-600">
                Board Exams 2026
              </span>
            </div>
            <div className="flex text-[13px]">
              <span className="w-24 font-semibold text-gray-500 text-xs uppercase tracking-widest">Favorite</span>
              <span className="flex-1 font-bold text-slate-700">
                Maths & Science
              </span>
            </div>
          </div>

          {/* Sign Out Button */}
          <Button 
            onClick={handleSignOut}
            variant="ghost" 
            className="w-full mt-6 h-11 rounded-2xl text-red-500 font-bold text-xs hover:bg-red-50 border border-slate-100 transition-all active:scale-[0.98]"
          >
            <LogOut className="w-4 h-4 mr-2" />
            SIGN OUT FROM STUDYHUB
          </Button>
        </div>
        
        {/* Swipe Hint */}
        <div className="text-center p-4 border-t border-gray-100 bg-gray-50/50">
          <motion.div 
            animate={{ y: [0, 3, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex flex-col items-center gap-1"
          >
            <ChevronUp className="w-4 h-4 text-blue-500" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Explore Dashboard</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Navigation Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-lg border-t border-gray-200 shadow-[0_-4px_15px_rgba(0,0,0,0.05)] z-50">
        <div className="flex justify-between items-center px-2 h-16 max-w-md mx-auto relative">
          
          <Link href="/" className="flex flex-col items-center justify-center w-1/5 text-gray-400 hover:text-blue-600 transition-colors">
            <Home className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-bold uppercase tracking-tight">Home</span>
          </Link>

          <Link href="#" className="flex flex-col items-center justify-center w-1/5 text-gray-400 hover:text-blue-600 transition-colors">
            <BookOpen className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-bold uppercase tracking-tight">Notes</span>
          </Link>

          {/* Explore (Center, Elevated) */}
          <div className="flex flex-col items-center justify-center w-1/5 relative">
            <Link href="#" className="absolute -top-10 flex flex-col items-center">
              <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-full p-3.5 shadow-[0_8px_20px_rgba(59,130,246,0.4)] text-white transform transition hover:scale-105 border-4 border-white">
                <Compass className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black mt-1.5 text-blue-600 uppercase tracking-widest">Explore</span>
            </Link>
          </div>

          <Link href="#" className="flex flex-col items-center justify-center w-1/5 text-gray-400 hover:text-blue-600 transition-colors">
            <BrainCircuit className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-bold uppercase tracking-tight">Quiz</span>
          </Link>

          <Link href="/account" className="flex flex-col items-center justify-center w-1/5 text-blue-600 transition-colors">
            <User className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-bold uppercase tracking-tight">Profile</span>
          </Link>

        </div>
      </div>
    </div>
  );
}