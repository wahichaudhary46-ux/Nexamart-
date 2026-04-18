"use client";

import React from "react";
import Link from "next/link";
import { 
  Search, 
  BookOpen, 
  Download, 
  Library, 
  ArrowRight, 
  Bookmark, 
  Sparkles, 
  TrendingUp,
  Home,
  Compass,
  BrainCircuit,
  User
} from "lucide-react";
import { motion } from "framer-motion";

export default function NexaLibraryDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-blue-50/40 font-body pb-32 overflow-x-hidden">
      
      {/* 3D Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -left-20 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-purple-300/10 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-cyan-300/10 rounded-full blur-2xl animate-float-delayed"></div>
      </div>

      {/* 1. Header & Greeting with 3D Perspective */}
      <div className="relative perspective-1000">
        <div className="bg-gradient-to-br from-[#1a2a3f] via-[#1e2e46] to-[#16212e] px-6 py-8 rounded-b-[40px] shadow-2xl text-white relative z-10 border-b border-white/10">
          {/* 3D Floating Shapes in Header */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl transform rotate-12 -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-10 w-24 h-24 bg-blue-500/10 rounded-full blur-xl transform -translate-y-1/2"></div>
          
          <div className="flex justify-between items-center mb-6 relative z-10">
            <div className="flex items-center gap-2 transform-gpu transition-all duration-300 hover:scale-105">
              <div className="relative">
                <Library className="w-7 h-7 text-blue-400 drop-shadow-lg" />
                <Sparkles className="w-3 h-3 text-yellow-300 absolute -top-1 -right-1" />
              </div>
              <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent drop-shadow-md">Nexa-Library</h1>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-white/20 to-white/5 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-lg transform transition-all duration-300 hover:rotate-12 hover:scale-110 cursor-pointer">
              <span className="text-sm font-bold">AK</span>
            </div>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-1 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent animate-gradient-x">Hello, Student! 👋</h2>
            <p className="text-sm text-blue-200 mb-6 opacity-90 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" /> What do you want to learn today?
            </p>
          </div>

          {/* 2. 3D Search Bar with Depth */}
          <div className="relative max-w-md mx-auto transform translate-y-4 group perspective-500">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-500"></div>
            <div className="relative transform transition-all duration-300 group-hover:translate-y-[-2px] group-hover:rotate-x-2">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                className="w-full bg-white/90 backdrop-blur-sm text-gray-800 rounded-2xl py-4 pl-12 pr-4 shadow-[0_20px_35px_-10px_rgba(0,0,0,0.2)] border border-white/50 focus:outline-none focus:ring-4 focus:ring-blue-300/50 text-sm font-bold transition-all duration-300"
                placeholder="Search books, authors, or notes..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Study Categories (3D Orbs/Pills with Tilt) */}
      <div className="px-6 mt-14 mb-8 relative z-10">
        <h3 className="text-xs font-black text-gray-400 mb-4 flex items-center gap-2 uppercase tracking-[0.3em]">
          <div className="p-1 bg-blue-100 rounded-lg">
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div> Categories
        </h3>
        
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4 pt-2 perspective-500">
          {['Class 10', 'Class 12', 'JEE/NEET', 'Novels', 'PYQs'].map((category, index) => (
            <button 
              key={index} 
              className="flex-shrink-0 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-xl px-5 py-2.5 shadow-md hover:shadow-xl transition-all duration-300 text-xs font-black text-slate-500 hover:text-blue-600 transform-gpu hover:translate-y-[-3px] hover:rotate-x-3 hover:scale-105"
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Trending Books Section with 3D Glassmorphism Cards */}
      <div className="px-6 relative z-10">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2">
            <div className="bg-orange-100 p-1 rounded-lg">
              <TrendingUp className="w-4 h-4 text-orange-500" />
            </div>
            Trending Reads
          </h3>
          <span className="text-[10px] font-black text-blue-600 cursor-pointer flex items-center gap-1 transition-all duration-300 hover:translate-x-1">
            VIEW ALL <ArrowRight className="w-3 h-3" />
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-5 perspective-1000 mb-10">
          {[1, 2, 3, 4].map((book) => (
            <div 
              key={book} 
              className="group relative bg-white/90 backdrop-blur-sm rounded-3xl p-3 shadow-xl transition-all duration-500 ease-out hover:shadow-2xl border border-white/50 hover:border-blue-200/50 transform-gpu hover:translate-y-[-8px] hover:rotate-x-6 hover:rotate-y-6"
            >
              {/* 3D Bookmark Icon */}
              <button className="absolute top-3 right-3 bg-white/90 p-1.5 rounded-full backdrop-blur-md shadow-md text-gray-300 hover:text-blue-600 transition-all duration-300 z-10 transform-gpu hover:scale-110 hover:rotate-12">
                <Bookmark className="w-4 h-4" />
              </button>
              
              {/* Book Cover */}
              <div className="relative bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 h-40 rounded-2xl mb-3 flex items-center justify-center border border-white/50 shadow-inner overflow-hidden group-hover:shadow-lg transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <BookOpen className="w-10 h-10 text-blue-300/70 drop-shadow-md transform group-hover:scale-110 transition-transform duration-300" />
              </div>
              
              <h4 className="font-black text-[13px] text-slate-800 mb-0.5 truncate transition-all duration-300 group-hover:translate-x-0.5">Physics Concept {book}</h4>
              <p className="text-[10px] text-slate-400 font-bold mb-3 flex items-center gap-1">
                <span className="inline-block w-1 h-1 bg-blue-400 rounded-full"></span>
                H.C. Verma
              </p>
              
              <div className="flex gap-2">
                <button className="flex-1 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white text-[10px] font-black py-2 rounded-xl transition-all duration-300 flex justify-center items-center gap-1 shadow-sm transform-gpu hover:translate-y-[-1px]">
                  READ
                </button>
                <button className="bg-slate-50 hover:bg-slate-100 text-slate-400 p-2 rounded-xl transition-all duration-300 shadow-sm">
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

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