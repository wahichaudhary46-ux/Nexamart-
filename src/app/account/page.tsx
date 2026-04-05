
"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  User, 
  MapPin, 
  Heart, 
  Star, 
  Store, 
  ChevronRight,
  LogOut,
  Home,
  Grid,
  Play,
  UserCircle,
  Moon
} from "lucide-react";
import { useAuthContext } from "@/components/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AccountPage() {
  const { user, userProfile, loading, signOut } = useAuthContext();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    router.push("/login");
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const AccountItem = ({ 
    icon: Icon, 
    label, 
    href = "#", 
    action 
  }: { 
    icon: any, 
    label: string, 
    href?: string,
    action?: React.ReactNode
  }) => (
    <div className="flex items-center justify-between py-4 px-4 bg-white active:bg-slate-50 transition-colors">
      <div className="flex items-center gap-4 flex-1">
        <div className="text-slate-400">
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-sm font-medium text-slate-700">{label}</span>
      </div>
      {action ? (
        <div className="flex-shrink-0">{action}</div>
      ) : (
        <Link href={href} className="flex items-center">
          <ChevronRight className="w-4 h-4 text-slate-300" />
        </Link>
      )}
    </div>
  );

  const SectionHeader = ({ children }: { children: React.ReactNode }) => (
    <h3 className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-6">
      {children}
    </h3>
  );

  return (
    <div className="min-h-screen bg-slate-100 pb-24 font-body transition-colors duration-300">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50 px-4 h-14 flex items-center justify-between">
        <h1 className="text-base font-bold text-slate-800">Account</h1>
      </div>

      <main className="max-w-md mx-auto">
        {/* User Brief Section */}
        <section className="bg-white p-6 mb-2 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border border-slate-200 shadow-sm">
              <AvatarImage src={user?.photoURL || ""} />
              <AvatarFallback className="bg-blue-600 text-white text-xl font-bold">
                {userProfile?.fullName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-slate-900 leading-tight">
                {userProfile?.fullName || "User Name"}
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {userProfile?.email || user?.email}
              </p>
            </div>
          </div>
        </section>

        {/* Section 1: Account Settings */}
        <SectionHeader>Account Settings</SectionHeader>
        <div className="bg-white border-y border-slate-200 divide-y divide-slate-100">
          <AccountItem icon={User} label="Edit Profile" />
          <AccountItem icon={MapPin} label="Saved Addresses" />
          <AccountItem 
            icon={Moon} 
            label="Dark Mode" 
            action={<ThemeToggle />}
          />
        </div>

        {/* Section 2: My Activity */}
        <SectionHeader>My Activity</SectionHeader>
        <div className="bg-white border-y border-slate-200 divide-y divide-slate-100">
          <AccountItem icon={Heart} label="Saved Shops" />
          <AccountItem icon={Star} label="My Reviews" />
        </div>

        {/* Section 3: Partner with NexaMart */}
        <SectionHeader>Partner with NexaMart</SectionHeader>
        <div className="px-4">
          <Link href="/dashboard" className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100 group active:scale-[0.98] transition-all">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <Store className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-blue-900">Register Your Shop</span>
                <span className="text-[10px] text-blue-600 font-bold uppercase tracking-tight">Become a Partner</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-blue-400" />
          </Link>
        </div>

        {/* Logout Button */}
        <div className="px-4 mt-10">
          <Button 
            onClick={handleSignOut}
            variant="outline" 
            className="w-full h-12 bg-white border-slate-200 text-red-600 font-bold rounded-xl active:bg-slate-50 transition-colors text-sm"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </Button>
          <p className="text-center text-[10px] text-slate-400 font-bold mt-8 uppercase tracking-widest">
            NexaMart v1.0.4
          </p>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex items-center justify-around h-20 z-50 px-2 pb-2 shadow-sm transition-colors duration-300">
        <Link href="/" className="flex flex-col items-center gap-1.5 text-slate-400">
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Home</span>
        </Link>
        <Link href="#" className="flex flex-col items-center gap-1.5 text-slate-400">
          <Grid className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Categories</span>
        </Link>
        <Link href="#" className="flex flex-col items-center gap-1.5 text-slate-400">
          <Play className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Play</span>
        </Link>
        <Link href="/account" className="flex flex-col items-center gap-1.5 text-blue-600">
          <UserCircle className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Account</span>
        </Link>
      </nav>
    </div>
  );
}
