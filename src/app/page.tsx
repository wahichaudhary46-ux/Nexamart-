
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  MapPin, 
  ChevronRight,
  Home,
  Grid,
  ShoppingBag,
  UserCircle,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuthContext } from "@/components/auth-provider";
import { Card, CardContent } from "@/components/ui/card";

const categories = [
  { name: "Groceries", icon: "https://picsum.photos/seed/grocery/100/100", hint: "fresh vegetables" },
  { name: "Electronics", icon: "https://picsum.photos/seed/elec/100/100", hint: "mobile phones" },
  { name: "Fashion", icon: "https://picsum.photos/seed/fashion/100/100", hint: "clothing apparel" },
  { name: "Home", icon: "https://picsum.photos/seed/home/100/100", hint: "furniture decor" },
  { name: "Appliances", icon: "https://picsum.photos/seed/app/100/100", hint: "washing machine" },
  { name: "Toys", icon: "https://picsum.photos/seed/toys/100/100", hint: "kids toys" },
  { name: "Beauty", icon: "https://picsum.photos/seed/beauty/100/100", hint: "cosmetics makeup" },
];

const products = [
  { id: 1, name: "Wireless Pro Earbuds", price: "₹1,999", oldPrice: "₹3,999", rating: 4.5, shop: "Grover Electronics", img: "https://picsum.photos/seed/p1/400/400" },
  { id: 2, name: "Cotton Blend Slim Fit Shirt", price: "₹899", oldPrice: "₹1,599", rating: 4.2, shop: "Fashion Hub", img: "https://picsum.photos/seed/p2/400/400" },
  { id: 3, name: "Premium Basmati Rice 5kg", price: "₹549", oldPrice: "₹700", rating: 4.8, shop: "Daily Fresh", img: "https://picsum.photos/seed/p3/400/400" },
  { id: 4, name: "Ergonomic Office Chair", price: "₹4,299", oldPrice: "₹8,000", rating: 4.4, shop: "Comfort Decor", img: "https://picsum.photos/seed/p4/400/400" },
  { id: 5, name: "Smart Watch Series 7", price: "₹2,499", oldPrice: "₹5,999", rating: 4.6, shop: "Tech World", img: "https://picsum.photos/seed/p5/400/400" },
  { id: 6, name: "Organic Honey 500g", price: "₹320", oldPrice: "₹450", rating: 4.9, shop: "Nature Mart", img: "https://picsum.photos/seed/p6/400/400" },
];

export default function StorefrontPage() {
  const { user, userProfile } = useAuthContext();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20 md:pb-0">
      {/* Top Navbar */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="https://i.ibb.co/rfKvSNKL/1000128270-1.png"
              alt="NexaMart"
              width={140}
              height={40}
              className="object-contain"
              unoptimized
            />
          </Link>

          <div className="flex-1 hidden md:flex items-center relative group">
            <div className="absolute left-3 text-gray-400">
              <Search className="w-5 h-5" />
            </div>
            <Input 
              placeholder="Search for products, stores and more..." 
              className="pl-10 h-10 w-full bg-gray-100 border-none rounded-lg focus-visible:ring-primary/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            <Link href={user ? (userProfile?.isProfileComplete ? "/dashboard" : "/onboarding") : "/login"}>
              <Button variant="ghost" className="flex items-center gap-2 font-bold text-gray-700 hidden md:flex">
                <User className="w-5 h-5" />
                {user ? (userProfile?.fullName?.split(' ')[0] || 'Account') : 'Login'}
              </Button>
            </Link>

            <Button variant="ghost" size="icon" className="relative text-gray-700">
              <ShoppingCart className="w-6 h-6" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-white text-[10px] border-2 border-white">
                0
              </Badge>
            </Button>

            <Button variant="ghost" size="icon" className="md:hidden text-gray-700">
              <Search className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Search Bar */}
      <div className="md:hidden bg-white px-4 pb-3 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Search products..." 
            className="pl-9 h-10 bg-gray-100 border-none rounded-lg"
          />
        </div>
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-4 space-y-6">
        {/* Category Strip */}
        <div className="flex items-center gap-6 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
          {categories.map((cat) => (
            <div key={cat.name} className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white border border-gray-100 shadow-sm overflow-hidden p-1 transition-transform group-hover:scale-105">
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <Image 
                    src={cat.icon} 
                    alt={cat.name} 
                    fill 
                    className="object-cover" 
                    data-ai-hint={cat.hint}
                  />
                </div>
              </div>
              <span className="text-xs md:text-sm font-bold text-gray-700">{cat.name}</span>
            </div>
          ))}
        </div>

        {/* Hero Banner Section */}
        <section className="relative w-full h-40 md:h-80 rounded-2xl overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700">
          <Image 
            src="https://picsum.photos/seed/banner1/1200/400" 
            alt="Big Saving Days" 
            fill 
            className="object-cover opacity-90"
            priority
            data-ai-hint="shopping discount"
          />
          <div className="absolute inset-0 bg-black/10 flex flex-col justify-center px-8 md:px-16 text-white space-y-2 md:space-y-4">
            <Badge className="w-fit bg-yellow-400 text-black font-bold">LIMITED OFFER</Badge>
            <h2 className="text-2xl md:text-5xl font-black leading-tight">BIG SAVING DAYS</h2>
            <p className="text-sm md:text-lg font-medium opacity-90">Up to 70% Off on Local Brands</p>
            <Button className="w-fit bg-white text-primary hover:bg-white/90 font-bold px-8">Shop Now</Button>
          </div>
        </section>

        {/* Location Tag */}
        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
          <MapPin className="w-4 h-4 text-primary" />
          <span>Showing stores near <span className="text-gray-900 font-bold">A-45, South Delhi</span></span>
          <ChevronRight className="w-4 h-4" />
        </div>

        {/* Product Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-gray-900">Discover Local Products</h2>
            <Button variant="link" className="text-primary font-bold">View All</Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product) => (
              <Card key={product.id} className="group overflow-hidden border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <Image 
                      src={product.img} 
                      alt={product.name} 
                      fill 
                      className="object-cover transition-transform group-hover:scale-105" 
                      data-ai-hint="product image"
                    />
                    <Badge className="absolute top-2 left-2 bg-emerald-500 text-white font-bold border-none">
                      In Stock
                    </Badge>
                  </div>
                  <div className="p-3 space-y-1">
                    <p className="text-xs text-gray-500 font-medium">{product.shop}</p>
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{product.name}</h3>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-xs font-bold text-gray-600">{product.rating}</span>
                    </div>
                    <div className="pt-1 flex items-baseline gap-2">
                      <span className="text-lg font-black text-gray-900">{product.price}</span>
                      <span className="text-xs text-gray-400 line-through font-medium">{product.oldPrice}</span>
                    </div>
                    <Button className="w-full mt-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs h-9">
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Trending Section */}
        <section className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 space-y-2 text-center md:text-left">
              <h2 className="text-2xl font-black text-primary">NexaMart Local Choice</h2>
              <p className="text-gray-600 font-medium">Verified products from top-rated local shopkeepers.</p>
              <Button className="bg-primary font-bold rounded-lg px-8">Explore Stores</Button>
            </div>
            <div className="flex gap-4 overflow-hidden">
               <div className="relative w-32 h-32 rounded-xl overflow-hidden shadow-lg rotate-3">
                  <Image src="https://picsum.photos/seed/t1/300/300" alt="Trend" fill className="object-cover" />
               </div>
               <div className="relative w-32 h-32 rounded-xl overflow-hidden shadow-lg -rotate-3">
                  <Image src="https://picsum.photos/seed/t2/300/300" alt="Trend" fill className="object-cover" />
               </div>
            </div>
          </div>
        </section>
      </main>

      {/* Desktop Footer */}
      <footer className="hidden md:block bg-gray-900 text-white py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
             <Image src="https://i.ibb.co/rfKvSNKL/1000128270-1.png" alt="NexaMart" width={140} height={40} className="brightness-0 invert object-contain" unoptimized />
             <p className="text-gray-400 text-sm">Empowering local stores with the reach of the internet. Shop smart, shop local.</p>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold">Company</h4>
            <ul className="text-gray-400 text-sm space-y-2">
              <li className="hover:text-white cursor-pointer transition-colors">About Us</li>
              <li className="hover:text-white cursor-pointer transition-colors">Careers</li>
              <li className="hover:text-white cursor-pointer transition-colors">Blog</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold">Support</h4>
            <ul className="text-gray-400 text-sm space-y-2">
              <li className="hover:text-white cursor-pointer transition-colors">Help Center</li>
              <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
              <li className="hover:text-white cursor-pointer transition-colors">Terms of Service</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold">Contact</h4>
            <ul className="text-gray-400 text-sm space-y-2">
              <li>support@nexamart.com</li>
              <li>+91 1800-LOCAL-MART</li>
            </ul>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex items-center justify-around h-16 z-50 px-2">
        <Link href="/" className="flex flex-col items-center gap-1 text-primary">
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold">Home</span>
        </Link>
        <Link href="#" className="flex flex-col items-center gap-1 text-gray-500">
          <Grid className="w-5 h-5" />
          <span className="text-[10px] font-bold">Categories</span>
        </Link>
        <Link href="#" className="flex flex-col items-center gap-1 text-gray-500">
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px] font-bold">My Orders</span>
        </Link>
        <Link href={user ? "/dashboard" : "/login"} className="flex flex-col items-center gap-1 text-gray-500">
          <UserCircle className="w-5 h-5" />
          <span className="text-[10px] font-bold">Account</span>
        </Link>
      </nav>
    </div>
  );
}
