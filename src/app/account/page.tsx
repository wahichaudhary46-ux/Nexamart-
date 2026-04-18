
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  MapPin, 
  Clock, 
  Flame, 
  BookOpen, 
  Play, 
  Pause, 
  RotateCcw, 
  Bell, 
  Map, 
  Calendar, 
  LogOut, 
  AlertCircle, 
  RefreshCw, 
  User, 
  CreditCard, 
  Bookmark, 
  TrendingUp, 
  Library,
  ChevronUp,
  Home,
  Compass,
  BrainCircuit
} from "lucide-react";
import { useAuthContext } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function AccountPage() {
  const { user, userProfile, loading, signOut } = useAuthContext();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  
  // --- Study Timer Logic ---
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [currentSubject, setCurrentSubject] = useState('Physics');

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => setSeconds(s => s + 1), 1000);
    } else if (!isTimerRunning && seconds !== 0) {
      if (interval) clearInterval(interval);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isTimerRunning]);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // --- Seat / Zone Shifting Logic ---
  const [currentZone, setCurrentZone] = useState('Zone A (Silent Study)');
  const [shiftStartTime, setShiftStartTime] = useState('10:00 AM');
  const [shiftEndTime, setShiftEndTime] = useState('12:00 PM');
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [selectedNewZone, setSelectedNewZone] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

  const zones = [
    { name: 'Zone A (Silent Study)', slots: ['10:00 AM - 12:00 PM', '12:00 PM - 2:00 PM', '2:00 PM - 4:00 PM'] },
    { name: 'Zone B (Group Discussion)', slots: ['10:00 AM - 1:00 PM', '1:00 PM - 4:00 PM'] },
    { name: 'Zone C (Digital Lab)', slots: ['9:00 AM - 11:00 AM', '11:00 AM - 1:00 PM', '2:00 PM - 4:00 PM'] },
  ];

  const requestShift = () => {
    if (selectedNewZone && selectedTimeSlot) {
      const [start, end] = selectedTimeSlot.split(' - ');
      setCurrentZone(selectedNewZone);
      setShiftStartTime(start);
      setShiftEndTime(end);
      setShowShiftModal(false);
      setSelectedNewZone('');
      setSelectedTimeSlot('');
    }
  };

  const borrowedBooks = [
    { id: 1, title: 'Concepts of Physics (Vol 1)', author: 'H.C. Verma', dueDate: '2026-04-25', daysLeft: 7, progress: 45 },
    { id: 2, title: 'Mathematics for Class 12', author: 'R.D. Sharma', dueDate: '2026-04-28', daysLeft: 10, progress: 20 },
    { id: 3, title: 'Organic Chemistry', author: 'Morrison & Boyd', dueDate: '2026-04-20', daysLeft: 2, progress: 80 },
  ];

  const totalFine = 25;
  const weeklyGoal = 15;
  const currentStreak = 5;
  const totalStudyHours = 127;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-900"></div>
      </div>
    );
  }

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  const nexaId = `NEXA-${user.uid.substring(0, 6).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-slate-50 font-body pb-24 text-gray-800">
      
      {/* Header with Profile & Library Info */}
      <div className="relative bg-gradient-to-br from-[#1a2a3f] to-[#0f172a] px-6 pt-8 pb-20 rounded-b-[40px] shadow-2xl text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div className="flex gap-4 items-center">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-2xl shadow-lg flex items-center justify-center border-2 border-white/20 transform rotate-2">
                <span className="text-2xl font-black text-white">
                  {userProfile?.fullName?.charAt(0) || "U"}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-[#1a2a3f]" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">{userProfile?.fullName || "Student User"}</h1>
              <p className="text-[10px] uppercase font-bold text-blue-200 tracking-widest opacity-80">ID: {nexaId}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded-full border border-white/10">Premium Student</span>
              </div>
            </div>
          </div>
          <button className="bg-white/10 p-2 rounded-full backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all relative">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[8px] flex items-center justify-center font-bold">2</span>
          </button>
        </div>

        {/* Live Location & Shifting Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 relative z-10 mt-2 shadow-inner">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-green-500/20 p-2 rounded-xl">
                <MapPin className="w-4 h-4 text-green-300" />
              </div>
              <div>
                <p className="text-[10px] text-blue-200 font-bold uppercase tracking-wider">Current Location</p>
                <p className="font-bold text-sm">{currentZone}</p>
                <p className="text-[10px] text-blue-200 opacity-80">Shift: {shiftStartTime} - {shiftEndTime}</p>
              </div>
            </div>
            <Button 
              size="sm"
              variant="outline"
              onClick={() => setShowShiftModal(true)}
              className="bg-white/10 hover:bg-white/20 border-white/20 text-white rounded-xl text-[10px] font-black h-8"
            >
              <RefreshCw className="w-3 h-3 mr-1" /> REQUEST SHIFT
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="px-6 -mt-10 relative z-20">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-3 shadow-md border border-gray-100 flex flex-col items-center">
            <Flame className="w-5 h-5 text-orange-500 mb-1" />
            <span className="text-base font-black">{currentStreak}</span>
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Day Streak</span>
          </div>
          <div className="bg-white rounded-2xl p-3 shadow-md border border-gray-100 flex flex-col items-center">
            <Clock className="w-5 h-5 text-blue-500 mb-1" />
            <span className="text-base font-black">{totalStudyHours}h</span>
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Total Study</span>
          </div>
          <div className="bg-white rounded-2xl p-3 shadow-md border border-gray-100 flex flex-col items-center">
            <CreditCard className="w-5 h-5 text-red-500 mb-1" />
            <span className="text-base font-black">₹{totalFine}</span>
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Total Fine</span>
          </div>
        </div>
      </div>

      {/* Live Focus Timer */}
      <div className="px-6 mt-6">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-5 shadow-xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          <div className="flex justify-between items-start mb-2 relative z-10">
            <h3 className="text-[10px] font-black text-blue-100 uppercase tracking-widest">Live Focus Session</h3>
            <select 
              value={currentSubject} 
              onChange={(e) => setCurrentSubject(e.target.value)}
              className="bg-white/20 text-[10px] font-bold rounded-lg px-2 py-1 border border-white/20 outline-none"
            >
              <option className="text-gray-800">Physics</option>
              <option className="text-gray-800">Chemistry</option>
              <option className="text-gray-800">Mathematics</option>
              <option className="text-gray-800">Biology</option>
            </select>
          </div>
          <div className="text-4xl font-black font-mono tracking-[0.2em] mb-4 text-center relative z-10">{formatTime(seconds)}</div>
          <div className="flex gap-2 relative z-10">
            <Button 
              onClick={() => setIsTimerRunning(!isTimerRunning)} 
              className={`flex-1 py-4 rounded-xl font-black text-xs flex justify-center items-center gap-2 shadow-lg transition-all active:scale-[0.98] ${isTimerRunning ? 'bg-orange-500 hover:bg-orange-600' : 'bg-white text-blue-700 hover:bg-gray-100'}`}
            >
              {isTimerRunning ? <><Pause className="w-4 h-4"/> PAUSE SESSION</> : <><Play className="w-4 h-4"/> START FOCUS</>}
            </Button>
            <Button 
              onClick={() => { setIsTimerRunning(false); setSeconds(0); }} 
              variant="outline"
              className="bg-white/20 border-white/30 text-white p-2 w-12 rounded-xl h-auto"
            >
              <RotateCcw className="w-5 h-5"/>
            </Button>
          </div>
          <div className="mt-3 text-[10px] font-bold text-blue-200 text-center opacity-80 uppercase tracking-wider">
            Today's Goal: {weeklyGoal}h • Achieved: {Math.floor(seconds/3600)}h
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-6 mt-8">
        <div className="flex bg-gray-200/50 p-1 rounded-xl">
          {['overview', 'bookshelf', 'analytics', 'library'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)} 
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-tight rounded-lg transition-all ${activeTab === tab ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-6 mt-6 space-y-4">
        {activeTab === 'overview' && (
          <>
            {/* Currently Reading */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-blue-600"/> Currently Reading
              </h3>
              {borrowedBooks.slice(0,1).map(book => (
                <div key={book.id} className="flex gap-3">
                  <div className="w-14 h-18 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
                    <BookOpen className="w-5 h-5 text-blue-300"/>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-[13px] text-gray-800">{book.title}</h4>
                    <p className="text-[11px] text-gray-400 font-bold">{book.author}</p>
                    <div className="mt-2 h-1.5 bg-gray-100 rounded-full">
                      <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${book.progress}%` }} />
                    </div>
                    <p className="text-[9px] font-black text-gray-400 text-right mt-1 uppercase">{book.progress}% Completed</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Borrowed Books List */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-red-500"/> Borrowed Books ({borrowedBooks.length})
              </h3>
              <div className="space-y-3">
                {borrowedBooks.map(book => (
                  <div key={book.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="font-bold text-[13px] text-gray-800">{book.title}</p>
                      <p className="text-[11px] text-gray-400 font-bold uppercase">Due: {book.dueDate}</p>
                    </div>
                    <div className={`text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-tighter ${book.daysLeft <= 2 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                      {book.daysLeft} days left
                    </div>
                  </div>
                ))}
              </div>
              {totalFine > 0 && (
                <div className="mt-4 bg-red-50 p-3 rounded-xl flex items-start gap-2 text-red-600 text-[10px] font-bold leading-tight">
                  <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0"/> 
                  <span>Attention: You have ₹{totalFine} in outstanding fines. Please clear before issuing new resources.</span>
                </div>
              )}
            </div>
          </>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-gray-800 uppercase">Weekly Study Goal</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                {Math.floor(seconds/3600)} / {weeklyGoal} hrs
              </span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-1000" 
                style={{ width: `${Math.min(((Math.floor(seconds/3600)/weeklyGoal)*100), 100)}%` }} 
              />
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-50 p-3 rounded-xl border border-gray-100 text-center">
                <span className="text-lg font-black block text-gray-800">{currentStreak}</span>
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Day Streak</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-gray-100 text-center">
                <span className="text-lg font-black block text-gray-800">{totalStudyHours}</span>
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Hours</span>
              </div>
            </div>
          </div>
        )}

        {/* Library Services Tab */}
        {activeTab === 'library' && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
            <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider mb-2">Library Facilities</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-gray-100 transition-colors hover:bg-gray-100">
                <span className="text-[11px] font-bold text-gray-700">Seat Availability</span>
                <span className="text-[10px] font-black text-green-600 uppercase tracking-tighter">12 Seats Free in Zone A</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-gray-100 transition-colors hover:bg-gray-100">
                <span className="text-[11px] font-bold text-gray-700">Digital Lab Status</span>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">Available</span>
              </div>
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black h-11 mt-2">
              REQUEST NEW BOOK
            </Button>
          </div>
        )}
      </div>

      {/* Logout Button */}
      <div className="px-6 mt-8">
        <Button 
          onClick={handleSignOut}
          variant="ghost" 
          className="w-full h-12 rounded-2xl text-red-500 font-black text-xs hover:bg-red-50 border border-red-50"
        >
          <LogOut className="w-4 h-4 mr-2" />
          SIGN OUT FROM STUDENT PORTAL
        </Button>
      </div>

      {/* Zone Shift Modal */}
      <AnimatePresence>
        {showShiftModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-4"
          >
            <motion.div 
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="bg-white rounded-t-[32px] sm:rounded-[32px] max-w-md w-full p-8 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-2 rounded-xl">
                  <Library className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-black text-lg text-gray-800 tracking-tight">Shift Seat / Zone</h3>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-2">Select New Zone</label>
                  <select 
                    className="w-full p-4 bg-slate-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none appearance-none"
                    value={selectedNewZone}
                    onChange={(e) => { setSelectedNewZone(e.target.value); setSelectedTimeSlot(''); }}
                  >
                    <option value="">Choose a different zone</option>
                    {zones.map(zone => <option key={zone.name} value={zone.name}>{zone.name}</option>)}
                  </select>
                </div>
                
                {selectedNewZone && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-2">Available Time Slots</label>
                    <div className="grid grid-cols-1 gap-2">
                      {zones.find(z => z.name === selectedNewZone)?.slots.map(slot => (
                        <button
                          key={slot}
                          onClick={() => setSelectedTimeSlot(slot)}
                          className={`w-full text-left p-4 rounded-2xl text-xs font-bold border transition-all ${selectedTimeSlot === slot ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-inner' : 'border-gray-100 bg-slate-50 hover:border-gray-200'}`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
                
                <div className="flex gap-3 pt-4">
                  <Button variant="ghost" onClick={() => setShowShiftModal(false)} className="flex-1 h-12 rounded-2xl font-black text-xs text-gray-400">CANCEL</Button>
                  <Button onClick={requestShift} disabled={!selectedTimeSlot} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-2xl text-xs font-black shadow-lg">CONFIRM SHIFT</Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-lg border-t border-gray-200 shadow-[0_-4px_15px_rgba(0,0,0,0.05)] z-[60]">
        <div className="flex justify-between items-center px-2 h-16 max-w-md mx-auto relative">
          <Link href="/" className="flex flex-col items-center justify-center w-1/5 text-gray-400 hover:text-blue-600 transition-colors">
            <Home className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-black uppercase tracking-tight">Home</span>
          </Link>
          <Link href="#" className="flex flex-col items-center justify-center w-1/5 text-gray-400 hover:text-blue-600 transition-colors">
            <BookOpen className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-black uppercase tracking-tight">Notes</span>
          </Link>
          <div className="flex flex-col items-center justify-center w-1/5 relative">
            <Link href="/" className="absolute -top-10 flex flex-col items-center">
              <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-full p-3.5 shadow-[0_8px_20px_rgba(59,130,246,0.4)] text-white transform transition hover:scale-105 border-4 border-white">
                <Compass className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black mt-1.5 text-blue-600 uppercase tracking-widest">Explore</span>
            </Link>
          </div>
          <Link href="#" className="flex flex-col items-center justify-center w-1/5 text-gray-400 hover:text-blue-600 transition-colors">
            <BrainCircuit className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-black uppercase tracking-tight">Quiz</span>
          </Link>
          <Link href="/account" className="flex flex-col items-center justify-center w-1/5 text-blue-600 transition-colors">
            <User className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-black uppercase tracking-tight">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
