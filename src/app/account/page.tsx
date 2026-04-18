
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MapPin, Clock, Flame, BookOpen, Play, Pause, RotateCcw, 
  Bell, Map, Calendar, LogOut, AlertCircle, RefreshCw, 
  User, CreditCard, Bookmark, TrendingUp, ChevronRight, 
  Library, Wifi, QrCode, Navigation, Coffee, Sun, Moon,
  BarChart3, History, Repeat, Timer, Coffee as BreakIcon,
  Home, Compass, BrainCircuit, Sparkles, Award, CheckCircle2
} from 'lucide-react';
import { useAuthContext } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// ---------- Helper: Format time (HH:MM:SS) ----------
const formatTime = (totalSeconds: number) => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export default function AdvancedStudentProfile() {
  const { user, userProfile, loading, signOut } = useAuthContext();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  // ======================= LOCATION BASED FEATURES =======================
  const [branches] = useState([
    { id: 1, name: 'Central Library (Main)', distance: '0.5 km', openNow: true },
    { id: 2, name: 'West Zone Digital Hub', distance: '1.2 km', openNow: true },
    { id: 3, name: 'North Campus Library', distance: '2.8 km', openNow: false }
  ]);
  const [selectedBranch, setSelectedBranch] = useState(branches[0]);
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);

  // Seat booking (real-time mock)
  const [seats] = useState([
    { id: 'A01', zone: 'Zone A', available: true, bookedBy: null },
    { id: 'A02', zone: 'Zone A', available: false, bookedBy: 'You' },
    { id: 'A03', zone: 'Zone A', available: true, bookedBy: null },
    { id: 'B01', zone: 'Zone B', available: false, bookedBy: 'Anjali' },
    { id: 'B02', zone: 'Zone B', available: true, bookedBy: null },
    { id: 'C01', zone: 'Zone C', available: true, bookedBy: null },
  ]);
  const [showSeatModal, setShowSeatModal] = useState(false);

  // Check-in / Check-out
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);

  const handleCheckIn = () => {
    setIsCheckedIn(true);
    setCheckInTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  const handleCheckOut = () => {
    setIsCheckedIn(false);
    setCheckInTime(null);
  };

  // ======================= TIME BASED FEATURES =======================
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [currentSubject, setCurrentSubject] = useState('Physics');
  const [breakReminder, setBreakReminder] = useState(false);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isTimerRunning) {
      timerInterval.current = setInterval(() => {
        setSeconds(prev => {
          const newSec = prev + 1;
          // Break reminder every 45 minutes (2700 seconds)
          if (newSec % 2700 === 0 && newSec !== 0) {
            setBreakReminder(true);
            setTimeout(() => setBreakReminder(false), 5000);
          }
          return newSec;
        });
      }, 1000);
    } else {
      if (timerInterval.current) clearInterval(timerInterval.current);
    }
    return () => { if (timerInterval.current) clearInterval(timerInterval.current); };
  }, [isTimerRunning]);

  // Session History (mock data)
  const [sessionHistory] = useState([
    { date: 'Mon', hours: 3.5 },
    { date: 'Tue', hours: 4.2 },
    { date: 'Wed', hours: 2.8 },
    { date: 'Thu', hours: 5.0 },
    { date: 'Fri', hours: 3.0 },
    { date: 'Sat', hours: 6.1 },
  ]);
  const weeklyTotal = sessionHistory.reduce((acc, day) => acc + day.hours, 0);

  // Book Due Dates
  const [borrowedBooks] = useState([
    { id: 1, title: 'Concepts of Physics Vol 1', author: 'H.C. Verma', dueDate: 'Apr 25', daysLeft: 6, progress: 45 },
    { id: 2, title: 'Mathematics Class 12', author: 'R.D. Sharma', dueDate: 'Apr 28', daysLeft: 9, progress: 20 },
    { id: 3, title: 'Organic Chemistry', author: 'Morrison', dueDate: 'Apr 20', daysLeft: 1, progress: 85 },
  ]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-900"></div>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  const nexaId = `NEXA-${user.uid.substring(0, 6).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-slate-50 font-body pb-24 text-gray-800 selection:bg-blue-100">
      
      {/* 1. Header Area - Immersive Navy */}
      <div className="relative bg-[#1a2a3f] px-6 pt-8 pb-20 rounded-b-[40px] shadow-2xl text-white overflow-hidden">
        {/* Static 3D Glows (No Pulse) */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div className="flex gap-4 items-center">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-2xl shadow-lg flex items-center justify-center border-2 border-white/20 transform rotate-2">
                <span className="text-xl font-black text-white">
                  {userProfile?.fullName?.charAt(0) || "U"}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-green-500 w-3.5 h-3.5 rounded-full border-2 border-[#1a2a3f]" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight">{userProfile?.fullName || "Student User"}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-black bg-blue-500/20 text-blue-200 px-2 py-0.5 rounded-full border border-white/10">ID: {nexaId}</span>
                <span className="text-[10px] font-bold text-blue-200/60 uppercase tracking-widest">Premium</span>
              </div>
            </div>
          </div>
          <button className="bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all relative">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-[8px] flex items-center justify-center font-bold">2</span>
          </button>
        </div>

        {/* Floating Location Card (Smart Pill) */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-3 border border-white/20 relative z-10 mt-2 shadow-inner">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="bg-blue-500/20 p-2 rounded-xl">
                <MapPin className="w-4 h-4 text-blue-300" />
              </div>
              <div className="relative">
                <button 
                  onClick={() => setShowBranchDropdown(!showBranchDropdown)}
                  className="text-xs font-black flex items-center gap-1 group"
                >
                  {selectedBranch.name} <ChevronRight className={`w-3 h-3 transition-transform ${showBranchDropdown ? 'rotate-90' : ''}`} />
                </button>
                <p className="text-[10px] text-blue-200/70 font-bold uppercase tracking-tighter">
                  {isCheckedIn ? `Checked-in • ${checkInTime}` : 'Not Checked-in'}
                </p>
                
                <AnimatePresence>
                  {showBranchDropdown && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-2 bg-[#1a2a3f] border border-white/10 rounded-xl p-1 z-50 w-48 shadow-2xl"
                    >
                      {branches.map(b => (
                        <button 
                          key={b.id} 
                          onClick={() => { setSelectedBranch(b); setShowBranchDropdown(false); }} 
                          className="flex items-center justify-between w-full text-left px-3 py-2 text-[10px] font-bold hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <span>{b.name}</span>
                          <span className="text-blue-300/50">{b.distance}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            {!isCheckedIn ? (
              <Button 
                onClick={handleCheckIn}
                size="sm"
                className="bg-green-600 hover:bg-green-700 h-8 rounded-xl text-[10px] font-black px-3"
              >
                <QrCode className="w-3 h-3 mr-1.5" /> CHECK-IN
              </Button>
            ) : (
              <Button 
                onClick={handleCheckOut}
                size="sm"
                variant="destructive"
                className="h-8 rounded-xl text-[10px] font-black px-3"
              >
                <LogOut className="w-3 h-3 mr-1.5" /> CHECK-OUT
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Quick Stats Grid (3D Orbs) */}
      <div className="px-6 -mt-8 relative z-20">
        <div className="grid grid-cols-3 gap-2.5">
          <div className="bg-white rounded-2xl p-3 shadow-md border border-gray-100 flex flex-col items-center transform transition-transform active:scale-95">
            <Flame className="w-5 h-5 text-orange-500 mb-1" />
            <span className="text-sm font-black">{userProfile?.isProfileComplete ? '5' : '0'}</span>
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Day Streak</span>
          </div>
          <div className="bg-white rounded-2xl p-3 shadow-md border border-gray-100 flex flex-col items-center transform transition-transform active:scale-95">
            <Clock className="w-5 h-5 text-blue-500 mb-1" />
            <span className="text-sm font-black">127h</span>
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Total Study</span>
          </div>
          <div className="bg-white rounded-2xl p-3 shadow-md border border-gray-100 flex flex-col items-center transform transition-transform active:scale-95">
            <CreditCard className="w-5 h-5 text-rose-500 mb-1" />
            <span className="text-sm font-black">₹25</span>
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Fine</span>
          </div>
        </div>
      </div>

      {/* 3. Advanced Study Timer with Break Logic */}
      <div className="px-6 mt-4">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[32px] p-5 shadow-xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          
          <AnimatePresence>
            {breakReminder && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-0 bg-indigo-900/80 backdrop-blur-md flex items-center justify-center z-30"
              >
                <div className="bg-white text-indigo-900 p-4 rounded-2xl flex flex-col items-center gap-2 shadow-2xl">
                  <Coffee className="w-8 h-8 animate-bounce" />
                  <p className="text-xs font-black uppercase tracking-widest">Time for a Break!</p>
                  <p className="text-[10px] font-bold opacity-60">You've focused for 45 minutes.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between items-start mb-2 relative z-10">
            <h3 className="text-[10px] font-black text-blue-100 uppercase tracking-widest">Live Focus session</h3>
            <select 
              value={currentSubject} 
              onChange={(e) => setCurrentSubject(e.target.value)}
              className="bg-white/20 text-[9px] font-black rounded-lg px-2 py-1 border border-white/10 outline-none"
            >
              <option className="text-gray-800">Physics</option>
              <option className="text-gray-800">Chemistry</option>
              <option className="text-gray-800">Maths</option>
              <option className="text-gray-800">Biology</option>
            </select>
          </div>
          
          <div className="text-4xl font-black font-mono tracking-[0.2em] mb-4 text-center relative z-10">{formatTime(seconds)}</div>
          
          <div className="flex gap-2 relative z-10">
            <Button 
              onClick={() => setIsTimerRunning(!isTimerRunning)} 
              className={`flex-1 h-10 rounded-xl font-black text-[10px] flex justify-center items-center gap-2 shadow-lg transition-all active:scale-95 ${isTimerRunning ? 'bg-orange-500 hover:bg-orange-600' : 'bg-white text-indigo-700 hover:bg-gray-100'}`}
            >
              {isTimerRunning ? <><Pause className="w-3.5 h-3.5"/> PAUSE</> : <><Play className="w-3.5 h-3.5"/> START FOCUS</>}
            </Button>
            <Button 
              onClick={() => { setIsTimerRunning(false); setSeconds(0); }} 
              variant="outline"
              className="bg-white/20 border-white/30 text-white w-10 h-10 p-0 rounded-xl"
            >
              <RotateCcw className="w-4 h-4"/>
            </Button>
          </div>
          
          <div className="mt-3 text-[9px] font-bold text-blue-200 text-center opacity-60 uppercase tracking-widest">
            Break every 45 min • Target: 6h Daily
          </div>
        </div>
      </div>

      {/* 4. Tab Navigation (Flipkart Style) */}
      <div className="px-6 mt-6">
        <div className="flex bg-gray-200/50 p-1 rounded-xl">
          {['overview', 'location', 'analytics', 'library'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)} 
              className={`flex-1 py-1.5 text-[9px] font-black uppercase tracking-tight rounded-lg transition-all ${activeTab === tab ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Tab Content Area */}
      <div className="px-6 mt-4 space-y-3">
        {activeTab === 'overview' && (
          <>
            {/* Borrowed Books Card */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h3 className="text-[10px] font-black text-gray-800 uppercase tracking-widest flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-blue-600"/> Borrowed resources
              </h3>
              <div className="space-y-3">
                {borrowedBooks.map(book => (
                  <div key={book.id} className="group">
                    <div className="flex justify-between items-start mb-1.5">
                      <div className="flex-1">
                        <h4 className="font-black text-[12px] text-gray-800 leading-none">{book.title}</h4>
                        <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-tighter">By {book.author}</p>
                      </div>
                      <div className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${book.daysLeft <= 2 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        {book.daysLeft}d left
                      </div>
                    </div>
                    <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full transition-all duration-1000" style={{ width: `${book.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements Card */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-amber-100 p-2 rounded-xl">
                  <Award className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-gray-800">Early Bird</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">5 Day Study Streak</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </div>
          </>
        )}

        {activeTab === 'location' && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-[10px] font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                <Navigation className="w-4 h-4 text-indigo-600"/> Seat Availability
              </h3>
              <span className="text-[9px] font-black text-green-600 uppercase tracking-widest">Live Updates</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {['A01', 'A02', 'A03', 'B01', 'B02', 'C01'].map((seat, i) => (
                <div key={seat} className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${i % 3 === 0 ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                  <span className="text-[10px] font-black">{seat}</span>
                  <span className="text-[8px] font-bold uppercase tracking-tighter">{i % 3 === 0 ? 'Free' : 'Occupied'}</span>
                </div>
              ))}
            </div>
            
            <Button className="w-full bg-blue-600 hover:bg-blue-700 h-9 rounded-xl text-[10px] font-black shadow-lg">
              BOOK NEXT SESSION
            </Button>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h3 className="text-[10px] font-black text-gray-800 uppercase tracking-widest flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-orange-500"/> Weekly session report
            </h3>
            
            <div className="flex items-end justify-between gap-1 h-24 mb-4 px-2">
              {sessionHistory.map(day => (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-blue-500 rounded-t-md transition-all duration-1000" 
                    style={{ height: `${(day.hours / 7) * 100}%` }}
                  />
                  <span className="text-[8px] font-black text-gray-400 uppercase">{day.date}</span>
                </div>
              ))}
            </div>
            
            <div className="pt-3 border-t border-gray-50 flex justify-between items-center">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Week Total</p>
              <p className="text-xs font-black text-blue-600">{weeklyTotal.toFixed(1)} Hours</p>
            </div>
          </div>
        )}

        {activeTab === 'library' && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-2">
            <h3 className="text-[10px] font-black text-gray-800 uppercase tracking-widest mb-2">Campus Facilities</h3>
            <div className="space-y-1.5">
              {[
                { label: 'High-speed WiFi', status: 'Online', icon: Wifi },
                { label: 'Cafe & Breakroom', status: 'Open', icon: Coffee },
                { label: 'Digital Archive', status: 'Ready', icon: Compass },
              ].map(item => (
                <div key={item.label} className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2">
                    <item.icon className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-[11px] font-bold text-gray-700">{item.label}</span>
                  </div>
                  <span className="text-[9px] font-black text-green-600 uppercase tracking-widest">{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Logout Link */}
      <div className="px-6 mt-8">
        <Button 
          onClick={handleSignOut}
          variant="ghost" 
          className="w-full h-10 rounded-2xl text-rose-500 font-black text-[10px] uppercase tracking-widest hover:bg-rose-50"
        >
          <LogOut className="w-3.5 h-3.5 mr-2" />
          EXIT STUDENT PORTAL
        </Button>
      </div>

      {/* Navigation Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-lg border-t border-gray-200 shadow-[0_-4px_15px_rgba(0,0,0,0.05)] z-[60]">
        <div className="flex justify-between items-center px-2 h-16 max-w-md mx-auto relative">
          <Link href="/" className="flex flex-col items-center justify-center w-1/5 text-gray-400 hover:text-blue-600 transition-colors">
            <Home className="w-5 h-5 mb-1" />
            <span className="text-[9px] font-black uppercase tracking-tight">Home</span>
          </Link>
          <Link href="#" className="flex flex-col items-center justify-center w-1/5 text-gray-400 hover:text-blue-600 transition-colors">
            <BookOpen className="w-5 h-5 mb-1" />
            <span className="text-[9px] font-black uppercase tracking-tight">Notes</span>
          </Link>
          <div className="flex flex-col items-center justify-center w-1/5 relative">
            <Link href="/" className="absolute -top-10 flex flex-col items-center">
              <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-full p-3.5 shadow-[0_8px_20px_rgba(59,130,246,0.4)] text-white transform transition hover:scale-105 border-4 border-white">
                <Compass className="w-6 h-6" />
              </div>
              <span className="text-[9px] font-black mt-1.5 text-blue-600 uppercase tracking-widest">Explore</span>
            </Link>
          </div>
          <Link href="#" className="flex flex-col items-center justify-center w-1/5 text-gray-400 hover:text-blue-600 transition-colors">
            <BrainCircuit className="w-5 h-5 mb-1" />
            <span className="text-[9px] font-black uppercase tracking-tight">Quiz</span>
          </Link>
          <Link href="/account" className="flex flex-col items-center justify-center w-1/5 text-blue-600 transition-colors">
            <User className="w-5 h-5 mb-1" />
            <span className="text-[9px] font-black uppercase tracking-tight">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
