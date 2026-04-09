
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Search, 
  MapPin, 
  Home,
  BookOpen,
  Compass,
  BrainCircuit,
  User,
  Bell,
  ChevronRight,
  Check,
  ShoppingBag,
  Zap,
  Star,
  Cpu,
  Shirt,
  Cookie
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { motion } from "framer-motion";

const NAWADA_CITIES = [
  "Nawada City",
  "Nardiganj",
  "Hisua",
  "Warsaliganj",
  "Rajauli",
  "Akbarpur",
  "Meskaur",
  "Pakribarwan"
];

const PRIMARY_LOCATIONS = [
  { id: "nardiganj", name: "Nardiganj", description: "Old Bazar Hub" },
  { id: "nawada", name: "Nawada", description: "Main City Area" },
  { id: "hisua", name: "Hisua", description: "Town Market" }
];

const CATEGORIES = [
  { name: "Notes", icon: BookOpen, color: "from-amber-400 to-orange-600" },
  { name: "Gadgets", icon: Cpu, color: "from-blue-400 to-indigo-600" },
  { name: "Fashion", icon: Shirt, color: "from-rose-400 to-purple-600" },
  { name: "Live", icon: Zap, color: "from-emerald-400 to-teal-600" },
  { name: "Home", icon: Home, color: "from-cyan-400 to-blue-600" }
];

const SHOPS = [
  { id: 1, name: "Nardiganj Study Hub", city: "Nardiganj", rating: 4.8, status: "Live: New Math Notes" },
  { id: 2, name: "Gupta Stationery", city: "Nardiganj", rating: 4.5, status: "Offers on Pens" },
  { id: 3, name: "Hisua Electronics", city: "Hisua", rating: 4.9, status: "New Tablet Launch" },
  { id: 4, name: "Nawada Fashion", city: "Nawada", rating: 4.2, status: "End of Season Sale" }
];

export default function NextGenDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("Nardiganj");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [pinCode, setPinCode] = useState("");

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await res.json();
            const addr = data.address;
            const city = addr.city || addr.town || addr.village || addr.suburb || "Nawada City";
            const code = addr.postcode || "";
            
            setPinCode(code);
            const matchedCity = PRIMARY_LOCATIONS.find(loc => city.includes(loc.name));
            if (matchedCity) setSelectedCity(matchedCity.name);
          } catch (error) {
            console.error("Location lookup failed:", error);
          }
        }
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-100 flex flex-col pb-32 font-body transition-colors duration-500 overflow-x-hidden">
      
      {/* Navbar - Compact & Glass */}
      <nav className="flex items-center justify-between gap-2 px-3 py-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md w-full border-b border-white/20 sticky top-0 z-50 shadow-sm transition-all duration-300">
        <div className="flex-shrink-0">
          <Link href="/">
            <span className="text-xl font-black text-blue-700 dark:text-blue-400 tracking-tighter">
              StudyHub
            </span>
          </Link>
        </div>

        <div className="flex-1 mx-1">
          <div className="relative group">
            <input
              type="text"
              placeholder={`Search in ${selectedCity}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-3 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-gray-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-inner"
            />
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
        </div>

        <div className="flex-shrink-0 flex items-center">
          <button className="relative p-1.5 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-gray-900"></span>
          </button>
        </div>
      </nav>

      {/* Location Bar - Compact Glass */}
      <div className="w-full bg-white/40 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-bold truncate">
            <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate">
              {selectedCity} {pinCode && `- ${pinCode}`}
            </span>
          </div>
          
          <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-[10px] font-black text-blue-600 hover:bg-blue-50 px-2 flex items-center gap-0.5 rounded-full"
              >
                Change
                <ChevronRight className="w-3 h-3" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-[40px] h-[60vh] p-0 border-t-0 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
              <SheetHeader className="p-6 border-b border-slate-100">
                <SheetTitle className="text-lg font-black text-center tracking-tight">Select Study Area</SheetTitle>
              </SheetHeader>
              <div className="overflow-y-auto h-full pb-20 p-4 space-y-2">
                {NAWADA_CITIES.map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      setSelectedCity(city);
                      setIsDrawerOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-4 rounded-[24px] transition-all duration-300 ${
                      selectedCity.includes(city)
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-[1.02]" 
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${selectedCity.includes(city) ? "bg-white/20" : "bg-white shadow-sm"}`}>
                        <MapPin className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold">{city}</span>
                    </div>
                    {selectedCity.includes(city) && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* MAIN DASHBOARD */}
      <main className="flex-1 w-full px-4 py-6 space-y-8 overflow-x-hidden">
        
        {/* 1. Local Live Radar (Smart Island) */}
        <div className="mx-1 py-2.5 px-4 bg-black/85 backdrop-blur-xl border border-white/10 rounded-full flex items-center gap-3 shadow-[0_8px_32px_rgba(0,0,0,0.2),0_0_20px_rgba(59,130,246,0.4)] relative group overflow-hidden">
          <div className="relative shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_#10b981]" />
          </div>
          
          <div className="flex-1 overflow-hidden">
            <div className="flex whitespace-nowrap animate-marquee">
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white pr-20">
                Live: Class 10th Math Notes uploaded at Study Hub • New Quiz: Science Chapter 1 • 20% Off at Gupta Stationery • 
              </span>
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white pr-20">
                Live: Class 10th Math Notes uploaded at Study Hub • New Quiz: Science Chapter 1 • 20% Off at Gupta Stationery • 
              </span>
            </div>
          </div>
        </div>

        {/* 2. 3D Floating Orbs (Categories) */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Hub Categories</h2>
          </div>
          
          <div className="flex gap-5 overflow-x-auto no-scrollbar pb-4 pt-2 -mx-4 px-4">
            {CATEGORIES.map((cat, idx) => (
              <motion.button
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center gap-3 shrink-0 group"
              >
                <div className={`
                  w-16 h-16 rounded-full bg-gradient-to-br ${cat.color} 
                  shadow-[inset_0_-8px_16px_rgba(0,0,0,0.3),0_12px_24px_rgba(0,0,0,0.15)]
                  flex items-center justify-center animate-float relative
                `} style={{ animationDelay: `${idx * 0.5}s` }}>
                  <cat.icon className="w-7 h-7 text-white drop-shadow-xl" />
                  <div className="absolute inset-0 rounded-full border border-white/20" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-tighter text-slate-500 group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* 3. 3D Glassmorphism Storefronts */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Best In {selectedCity}</h2>
            <Link href="#" className="text-[10px] font-black text-blue-600 uppercase tracking-widest">See All</Link>
          </div>

          <div className="flex gap-5 overflow-x-auto no-scrollbar pb-10 -mx-4 px-4 pt-2">
            {SHOPS.filter(s => s.city === selectedCity).map((shop, idx) => (
              <motion.div
                key={shop.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.15 }}
                className="shrink-0 w-64 group"
              >
                <div className="relative h-80 bg-white/40 backdrop-blur-2xl border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[40px] p-6 flex flex-col justify-between overflow-hidden transition-all duration-700 hover:rotate-y-12 hover:scale-[1.05] perspective-1000">
                  
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl group-hover:bg-blue-400/20 transition-all" />
                  
                  <div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="bg-white/60 p-3 rounded-2xl shadow-sm">
                        <ShoppingBag className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex items-center gap-1 bg-white/60 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span className="text-[10px] font-black">{shop.rating}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight mb-1 relative z-10">
                      {shop.name}
                    </h3>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest relative z-10">
                      {shop.city} Study Area
                    </p>
                  </div>

                  <div className="relative z-10">
                    <div className="bg-blue-50/50 rounded-2xl p-3 mb-4 border border-blue-100/30">
                      <p className="text-[10px] font-black text-blue-700 uppercase leading-none mb-1">Status Update</p>
                      <p className="text-xs font-bold text-slate-700 line-clamp-1">{shop.status}</p>
                    </div>
                    
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl h-11 shadow-lg shadow-blue-500/20 transition-all group-hover:shadow-blue-500/40">
                      VISIT HUB
                    </Button>
                  </div>

                </div>
              </motion.div>
            ))}
          </div>
        </section>

      </main>

      {/* Navigation Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-lg border-t border-gray-200 shadow-[0_-4px_15px_rgba(0,0,0,0.05)] z-50">
        <div className="flex justify-between items-center px-2 h-16 max-w-md mx-auto relative">
          
          <Link href="/" className="flex flex-col items-center justify-center w-1/5 text-blue-600 p-2 rounded-2xl bg-blue-50/50">
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

          <Link href="/account" className="flex flex-col items-center justify-center w-1/5 text-gray-400 hover:text-blue-600 transition-colors">
            <User className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-bold uppercase tracking-tight">Profile</span>
          </Link>

        </div>
      </div>
    </div>
  );
}
