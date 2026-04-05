
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

  // Auto-detect location on mount with PIN code support
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
            const postcode = addr.postcode ? ` - ${addr.postcode}` : "";
            
            // If the detected city matches one of our primary ones, set it
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
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex flex-col pb-20 md:pb-0 font-body transition-colors duration-300">
      
      {/* Top Navbar - Compact Single Row */}
      <div className="flex items-center justify-between gap-2 px-3 py-3 bg-slate-100 dark:bg-gray-900 w-full border-b border-border transition-colors duration-300">
        <div className="flex-shrink-0">
          <Link href="/">
            <span className="text-xl md:text-2xl font-extrabold text-blue-700 dark:text-blue-400">
              NexaMart
            </span>
          </Link>
        </div>

        <div className="flex-1 mx-2">
          <div className="relative">
            <input
              type="text"
              placeholder={`Search products...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-3 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:border-blue-500 transition-all"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="flex-shrink-0">
          <button className="relative p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors">
            <Bell className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            <span className="absolute top-0 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-slate-100 dark:ring-gray-900"></span>
          </button>
        </div>
      </div>

      {/* Location Bar */}
      <div className="w-full bg-white dark:bg-black border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-semibold truncate">
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            <span className="truncate">
              Discovery in: <span className="text-primary font-black underline decoration-2 underline-offset-4">{selectedCity}</span>
            </span>
          </div>
          
          <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs font-bold text-primary hover:bg-primary/5 flex items-center gap-1 shrink-0"
              >
                Change Area
                <ChevronRight className="w-3 h-3" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-[2rem] h-[60vh] p-0 overflow-hidden">
              <SheetHeader className="p-6 border-b border-border">
                <SheetTitle className="text-xl font-black text-center">Select Your Area</SheetTitle>
                <p className="text-center text-sm text-muted-foreground font-medium">Find shops and products near you in Nawada District</p>
              </SheetHeader>
              <div className="overflow-y-auto h-full pb-20 p-4">
                <div className="grid gap-2">
                  {NAWADA_CITIES.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setSelectedCity(city);
                        setIsDrawerOpen(false);
                      }}
                      className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                        selectedCity.includes(city)
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                          : "bg-muted/50 hover:bg-muted text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className={`w-5 h-5 ${selectedCity.includes(city) ? "text-primary-foreground" : "text-primary"}`} />
                        <span className="font-bold">{city}</span>
                      </div>
                      {selectedCity.includes(city) && <Check className="w-5 h-5" />}
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
        <div className="max-w-7xl mx-auto px-4 py-8">
          
          {/* Explore Your City Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Explore Your City
              </h2>
              <div className="h-1 flex-1 mx-4 bg-slate-200 dark:bg-gray-800 rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PRIMARY_LOCATIONS.map((location) => (
                <motion.button
                  key={location.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCity(location.name)}
                  className={`
                    relative p-6 rounded-2xl text-left transition-all border-2
                    ${selectedCity === location.name 
                      ? "border-blue-600 bg-white dark:bg-gray-900 shadow-xl shadow-blue-500/10 ring-4 ring-blue-500/5" 
                      : "border-transparent bg-white dark:bg-gray-900 shadow-sm hover:shadow-md dark:shadow-none"
                    }
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">
                        {location.name}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-gray-400 font-medium mt-1">
                        {location.description}
                      </p>
                    </div>
                    <div className={`
                      p-2 rounded-xl transition-colors
                      ${selectedCity === location.name ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-gray-800 text-slate-400"}
                    `}>
                      <Navigation className="w-5 h-5" />
                    </div>
                  </div>
                  
                  {selectedCity === location.name && (
                    <motion.div 
                      layoutId="active-indicator"
                      className="absolute -top-2 -right-2 bg-blue-600 text-white p-1 rounded-full shadow-lg"
                    >
                      <Check className="w-3 h-3" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Discovery Message */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={selectedCity}
              className="pt-4 text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <p className="text-sm font-bold text-blue-700 dark:text-blue-400">
                  Showing best local shops in {selectedCity}
                </p>
              </div>
            </motion.div>
          </section>

          {/* New city-wise discovery features can be built below this spacer */}
          <div className="mt-12 h-[300px] border-2 border-dashed border-slate-200 dark:border-gray-800 rounded-[2rem] flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest text-xs">
            City discovery content coming soon
          </div>

        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-border flex items-center justify-around h-20 z-50 px-2 pb-2 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] transition-colors duration-300">
        <Link href="/" className="flex flex-col items-center gap-1.5 text-primary">
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-tighter">Home</span>
        </Link>
        <Link href="#" className="flex flex-col items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
          <Grid className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-tighter">Categories</span>
        </Link>
        <Link href="#" className="flex flex-col items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
          <Play className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-tighter">Play</span>
        </Link>
        <Link href="/account" className="flex flex-col items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
          <UserCircle className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-tighter">Account</span>
        </Link>
      </nav>
    </div>
  );
}
