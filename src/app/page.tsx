
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Search, 
  MapPin, 
  Home,
  Grid,
  Play,
  UserCircle,
  Bell,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const products = [
  { id: 1, name: "Wireless Pro Earbuds", price: "₹1,999", oldPrice: "₹3,999", rating: 4.5, shop: "Grover Electronics", img: "https://picsum.photos/seed/p1/400/400" },
  { id: 2, name: "Cotton Blend Slim Fit Shirt", price: "₹899", oldPrice: "₹1,599", rating: 4.2, shop: "Fashion Hub", img: "https://picsum.photos/seed/p2/400/400" },
  { id: 3, name: "Premium Basmati Rice 5kg", price: "₹549", oldPrice: "₹700", rating: 4.8, shop: "Daily Fresh", img: "https://picsum.photos/seed/p3/400/400" },
  { id: 4, name: "Ergonomic Office Chair", price: "₹4,299", oldPrice: "₹8,000", rating: 4.4, shop: "Comfort Decor", img: "https://picsum.photos/seed/p4/400/400" },
  { id: 5, name: "Smart Watch Series 7", price: "₹2,499", oldPrice: "₹5,999", rating: 4.6, shop: "Tech World", img: "https://picsum.photos/seed/p5/400/400" },
  { id: 6, name: "Organic Honey 500g", price: "₹320", oldPrice: "₹450", rating: 4.9, shop: "Nature Mart", img: "https://picsum.photos/seed/p6/400/400" },
];

export default function StorefrontPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationName, setLocationName] = useState("Detecting...");

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            // Using Nominatim for free reverse geocoding
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await res.json();
            const city = data.address.city || data.address.town || data.address.village || data.address.suburb || data.address.state_district || "Kolkata, India";
            setLocationName(`${city}, India`);
          } catch (error) {
            console.error("Reverse geocoding failed:", error);
            setLocationName("Select Location");
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocationName("Select Location");
        }
      );
    } else {
      setLocationName("Select Location");
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20 md:pb-0 font-body transition-colors duration-300">
      {/* Top Navbar */}
      <div className="flex items-center justify-between gap-2 px-3 py-3 bg-slate-100 dark:bg-gray-900 w-full border-b border-border transition-colors duration-300">
        
        {/* 1. NexaMart Logo */}
        <div className="flex-shrink-0">
          <Link href="/">
            <span className="text-xl md:text-2xl font-extrabold text-blue-700 dark:text-blue-400">
              NexaMart
            </span>
          </Link>
        </div>

        {/* 2. Search Bar */}
        <div className="flex-1 mx-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search local products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-3 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:border-blue-500 transition-all"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* 3. Notification Icon */}
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
              Location: <span className="text-primary font-black underline decoration-2 underline-offset-4">{locationName}</span>
            </span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs font-bold text-primary hover:bg-primary/5 flex items-center gap-1 shrink-0"
          >
            Change <span className="hidden sm:inline">Location</span>
            <ChevronRight className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full bg-white dark:bg-black transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
          
          {/* Hero Banner Section */}
          <section className="relative w-full h-44 md:h-96 rounded-3xl overflow-hidden shadow-sm">
            <Image 
              src="https://picsum.photos/seed/banner1/1200/400" 
              alt="Discover Local" 
              fill 
              className="object-cover"
              priority
              data-ai-hint="shopping discount"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent flex flex-col justify-center px-8 md:px-20 text-white space-y-3 md:space-y-6">
              <Badge className="w-fit bg-primary text-white font-bold px-3 py-1 border-none">HYPERLOCAL</Badge>
              <h2 className="text-2xl md:text-6xl font-black leading-tight max-w-lg uppercase">Find it at your nearest store</h2>
              <p className="text-sm md:text-xl font-medium opacity-90">Instant discovery of local inventory</p>
              <Button className="w-fit bg-white text-primary hover:bg-gray-100 font-black px-10 h-12 md:h-14 rounded-full transition-all">Explore Stores</Button>
            </div>
          </section>

          {/* Product Grid */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-foreground tracking-tight">Top Local Discoveries</h2>
              <Button variant="link" className="text-primary font-bold">View More</Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="group overflow-hidden border-none shadow-none hover:shadow-xl dark:hover:shadow-primary/5 transition-all duration-300 rounded-2xl bg-card">
                  <CardContent className="p-0">
                    <div className="relative aspect-square overflow-hidden bg-muted rounded-2xl">
                      <Image 
                        src={product.img} 
                        alt={product.name} 
                        fill 
                        className="object-cover transition-transform duration-500 group-hover:scale-105" 
                        data-ai-hint="product image"
                      />
                      <Badge className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm text-primary font-black text-[10px] border-none px-2 shadow-sm">
                        VERIFIED STOCK
                      </Badge>
                    </div>
                    
                    <div className="p-4 space-y-2">
                      <div className="flex items-center gap-1.5 text-primary">
                        <MapPin className="w-3.5 h-3.5" />
                        <p className="text-xs font-black uppercase tracking-wider">
                          Available at: <span className="text-foreground underline decoration-primary/30 font-black">{product.shop}</span>
                        </p>
                      </div>
                      
                      <h3 className="text-sm md:text-base font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[10px] font-bold">
                          ★ {product.rating}
                        </div>
                        <span className="text-[10px] text-muted-foreground font-bold uppercase">100+ views today</span>
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-border mt-2">
                        <div className="flex flex-col">
                          <span className="text-lg font-black text-foreground leading-tight">{product.price}</span>
                          <span className="text-[10px] text-muted-foreground line-through font-bold">{product.oldPrice}</span>
                        </div>
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-black text-[10px] h-9 rounded-xl px-4 shadow-sm">
                          Locate Store
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Local Shops Promotion */}
          <section className="bg-black dark:bg-card rounded-[2.5rem] p-8 md:p-16 text-white overflow-hidden relative border border-border">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full" />
            <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
              <div className="flex-1 space-y-6 text-center md:text-left">
                <h2 className="text-3xl md:text-5xl font-black uppercase">Support Your Local Shopkeepers</h2>
                <p className="text-gray-400 dark:text-muted-foreground text-lg font-medium max-w-xl">
                  NexaMart connects you directly with verified local businesses. Discover deals, check availability, and shop local.
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
                  <Button className="bg-primary hover:bg-primary/90 font-black rounded-full px-10 h-14 border-none">Find Shops Near Me</Button>
                  <Button variant="outline" className="border-white/20 dark:border-border text-white hover:bg-white/10 dark:hover:bg-muted font-black rounded-full px-10 h-14">Partner with Us</Button>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="relative w-40 h-56 md:w-56 md:h-72 rounded-3xl overflow-hidden shadow-2xl rotate-3">
                    <Image src="https://picsum.photos/seed/t1/300/400" alt="Local Shop" fill className="object-cover" />
                </div>
                <div className="relative w-40 h-56 md:w-56 md:h-72 rounded-3xl overflow-hidden shadow-2xl -rotate-6 mt-8 hidden sm:block">
                    <Image src="https://picsum.photos/seed/t2/300/400" alt="Local Inventory" fill className="object-cover" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Desktop Footer */}
      <footer className="hidden md:block bg-white dark:bg-black border-t border-border py-16 mt-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
             <div className="relative w-[120px] h-[30px] flex items-center">
               <span className="text-2xl font-black text-blue-700 dark:text-blue-400">NexaMart</span>
             </div>
             <p className="text-muted-foreground text-sm font-medium leading-relaxed">The ultimate discovery platform for local commerce. Find everything in your neighborhood instantly.</p>
          </div>
          <div className="space-y-4">
            <h4 className="font-black text-foreground uppercase text-xs tracking-widest">Platform</h4>
            <ul className="text-muted-foreground text-sm space-y-3 font-bold">
              <li className="hover:text-primary cursor-pointer transition-colors">Store Discovery</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Local Inventory</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Verified Shops</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-black text-foreground uppercase text-xs tracking-widest">Resources</h4>
            <ul className="text-muted-foreground text-sm space-y-3 font-bold">
              <li className="hover:text-primary cursor-pointer transition-colors">Terms of Service</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Privacy Policy</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Store Partner Portal</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-black text-foreground uppercase text-xs tracking-widest">Help & Social</h4>
            <ul className="text-muted-foreground text-sm space-y-3 font-bold">
              <li>support@nexamart.com</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Instagram</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Twitter</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-border text-center">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">© {new Date().getFullYear()} NEXAMART PLATFORMS INC. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>

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
