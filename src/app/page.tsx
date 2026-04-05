
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Search, 
  MapPin, 
  Home,
  Grid,
  Play,
  UserCircle,
  Bell,
  ChevronRight,
  Check,
  Navigation
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
  { id: "nardiganj", name: "Nardiganj", description: "Old Bazar & Market" },
  { id: "nawada", name: "Nawada", description: "Main City & Station" },
  { id: "hisua", name: "Hisua", description: "Town & Local Hub" }
];

export default function StorefrontPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("Nardiganj");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
            
            const city = addr.city || addr.town || addr.village || addr.suburb || addr.state_district || "Nawada City";
            const matchedCity = PRIMARY_LOCATIONS.find(loc => city.includes(loc.name));
            if (matchedCity) {
              setSelectedCity(matchedCity.name);
            }
          } catch (error) {
            console.error("Reverse geocoding failed:", error);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex flex-col pb-16 md:pb-0 font-body transition-colors duration-300">
      
      {/* Top Navbar - Compact */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 bg-white dark:bg-gray-900 w-full border-b border-border sticky top-0 z-50 shadow-sm transition-colors duration-300">
        <div className="flex-shrink-0">
          <Link href="/">
            <span className="text-lg md:text-xl font-black text-blue-700 dark:text-blue-400 tracking-tighter">
              NexaMart
            </span>
          </Link>
        </div>

        <div className="flex-1 mx-1">
          <div className="relative">
            <input
              type="text"
              placeholder={`Search...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-8 pr-3 rounded-full border border-gray-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-800 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            />
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="flex-shrink-0 flex items-center gap-1">
          <button className="relative p-1.5 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900"></span>
          </button>
        </div>
      </div>

      {/* Location Bar - Compact */}
      <div className="w-full bg-white dark:bg-black border-b border-border/50">
        <div className="max-w-7xl mx-auto px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-bold truncate">
            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="truncate">
              In: <span className="text-primary font-black underline decoration-1 underline-offset-2">{selectedCity}</span>
            </span>
          </div>
          
          <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-[10px] font-black text-primary hover:bg-primary/5 px-2 flex items-center gap-0.5"
              >
                Change
                <ChevronRight className="w-3 h-3" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-2xl h-[55vh] p-0 overflow-hidden">
              <SheetHeader className="p-4 border-b border-border">
                <SheetTitle className="text-base font-black text-center">Select Area</SheetTitle>
              </SheetHeader>
              <div className="overflow-y-auto h-full pb-16 p-3">
                <div className="grid gap-1.5">
                  {NAWADA_CITIES.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setSelectedCity(city);
                        setIsDrawerOpen(false);
                      }}
                      className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                        selectedCity.includes(city)
                          ? "bg-primary text-primary-foreground shadow-md" 
                          : "bg-muted/40 hover:bg-muted text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <MapPin className={`w-4 h-4 ${selectedCity.includes(city) ? "text-primary-foreground" : "text-primary"}`} />
                        <span className="text-sm font-bold">{city}</span>
                      </div>
                      {selectedCity.includes(city) && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full bg-slate-50 dark:bg-gray-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-3 py-4">
          
          {/* Explore Your City Section - Compact Cards */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                Explore Your City
              </h2>
              <div className="h-0.5 flex-1 mx-3 bg-slate-200 dark:bg-gray-800 rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {PRIMARY_LOCATIONS.map((location) => (
                <motion.button
                  key={location.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSelectedCity(location.name)}
                  className={`
                    relative p-3 rounded-xl text-left transition-all border-2
                    ${selectedCity === location.name 
                      ? "border-blue-600 bg-white dark:bg-gray-900 shadow-lg shadow-blue-500/5" 
                      : "border-transparent bg-white dark:bg-gray-900 shadow-sm"
                    }
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white">
                        {location.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-gray-400 font-medium mt-0.5">
                        {location.description}
                      </p>
                    </div>
                    <div className={`
                      p-1.5 rounded-lg transition-colors
                      ${selectedCity === location.name ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-gray-800 text-slate-400"}
                    `}>
                      <Navigation className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Discovery Message - Compact */}
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              key={selectedCity}
              className="pt-2 text-center"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-full">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
                </span>
                <p className="text-[10px] font-black text-blue-700 dark:text-blue-400 uppercase tracking-wide">
                  Showing local shops in {selectedCity}
                </p>
              </div>
            </motion.div>
          </section>

          {/* Spacer for future content */}
          <div className="mt-8 h-40 border border-dashed border-slate-200 dark:border-gray-800 rounded-2xl flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
            New Discovery features arriving soon
          </div>

        </div>
      </main>

      {/* Mobile Bottom Navigation - Compact */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-border flex items-center justify-around h-16 z-50 px-2 pb-1 shadow-[0_-2px_10px_rgba(0,0,0,0.03)] transition-colors duration-300">
        <Link href="/" className="flex flex-col items-center gap-1 text-primary">
          <Home className="w-4 h-4" />
          <span className="text-[9px] font-black uppercase tracking-tight">Home</span>
        </Link>
        <Link href="#" className="flex flex-col items-center gap-1 text-muted-foreground">
          <Grid className="w-4 h-4" />
          <span className="text-[9px] font-black uppercase tracking-tight">Search</span>
        </Link>
        <Link href="#" className="flex flex-col items-center gap-1 text-muted-foreground">
          <Play className="w-4 h-4" />
          <span className="text-[9px] font-black uppercase tracking-tight">Play</span>
        </Link>
        <Link href="/account" className="flex flex-col items-center gap-1 text-muted-foreground">
          <UserCircle className="w-4 h-4" />
          <span className="text-[9px] font-black uppercase tracking-tight">Profile</span>
        </Link>
      </nav>
    </div>
  );
}
