
"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  User, 
  MapPin, 
  Moon, 
  Heart, 
  Star, 
  Store, 
  LogOut, 
  ChevronRight,
  Home,
  Grid,
  Play,
  UserCircle
} from "lucide-react";
import { useAuthContext } from "@/components/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";

export default function AccountPage() {
  const { user, userProfile, loading, signOut } = useAuthContext();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const SectionHeader = ({ children }: { children: React.ReactNode }) => (
    <h3 className="px-3 text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-1.5 mt-4">
      {children}
    </h3>
  );

  const AccountItem = ({ 
    icon: Icon, 
    label, 
    href = "#", 
    action,
    highlight = false
  }: { 
    icon: any, 
    label: string, 
    href?: string,
    action?: React.ReactNode,
    highlight?: boolean
  }) => (
    <div className="flex items-center justify-between py-2.5 px-3 bg-white dark:bg-gray-900 active:bg-slate-50 dark:active:bg-gray-800 transition-colors">
      <div className="flex items-center gap-2.5 flex-1">
        <Icon className={`w-4 h-4 ${highlight ? 'text-primary' : 'text-slate-400'}`} />
        <span className={`text-sm ${highlight ? 'font-bold text-primary' : 'text-slate-700 dark:text-gray-200 font-medium'}`}>
          {label}
        </span>
      </div>
      {action ? (
        <div className="flex-shrink-0 scale-75 origin-right">{action}</div>
      ) : (
        <Link href={href} className="flex items-center">
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        </Link>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-gray-950 pb-20 font-body transition-colors duration-300">
      {/* Header - Compact */}
      <div className="bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-gray-800 sticky top-0 z-50 px-3 h-12 flex items-center">
        <h1 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tighter">My Profile</h1>
      </div>

      <main className="max-w-md mx-auto px-2">
        {/* User Profile Brief - Compact */}
        <section className="bg-white dark:bg-gray-900 p-4 mt-2 rounded-xl border border-slate-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border border-slate-100 dark:border-gray-800">
              <AvatarImage src={user?.photoURL || ""} />
              <AvatarFallback className="bg-primary text-white text-base font-black">
                {userProfile?.fullName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                {userProfile?.fullName || "NexaMart User"}
              </h2>
              <p className="text-[10px] text-slate-500 dark:text-gray-400 font-bold truncate max-w-[200px]">
                {userProfile?.email || user?.email}
              </p>
            </div>
          </div>
        </section>

        {/* Section 1: Account Settings */}
        <SectionHeader>Account Settings</SectionHeader>
        <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-slate-200 dark:border-gray-800 divide-y divide-slate-50 dark:divide-gray-800 shadow-sm">
          <AccountItem icon={User} label="Edit Profile" />
          <AccountItem icon={MapPin} label="Saved Addresses" />
          <AccountItem 
            icon={Moon} 
            label="Dark Mode" 
            action={
              <Switch 
                checked={theme === 'dark'} 
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')} 
              />
            }
          />
        </div>

        {/* Section 2: My Activity */}
        <SectionHeader>My Activity</SectionHeader>
        <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-slate-200 dark:border-gray-800 divide-y divide-slate-50 dark:divide-gray-800 shadow-sm">
          <AccountItem icon={Heart} label="Saved Shops" />
          <AccountItem icon={Star} label="My Reviews" />
        </div>

        {/* Section 3: Partner with NexaMart */}
        <SectionHeader>Partner Program</SectionHeader>
        <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-slate-200 dark:border-gray-800 shadow-sm">
          <AccountItem 
            icon={Store} 
            label="Register Your Store" 
            highlight={true} 
            href="/dashboard"
          />
        </div>

        {/* Log Out Button - Compact */}
        <div className="mt-8 px-2">
          <Button 
            onClick={handleSignOut}
            variant="outline" 
            className="w-full h-10 bg-white dark:bg-gray-900 border-slate-200 dark:border-gray-800 text-red-600 font-black rounded-xl active:bg-slate-50 transition-colors text-xs"
          >
            <LogOut className="w-3.5 h-3.5 mr-1.5" />
            Sign Out
          </Button>
          <p className="text-center text-[9px] text-slate-400 font-bold mt-6 uppercase tracking-widest">
            NexaMart v1.0.8
          </p>
        </div>
      </main>

      {/* Mobile Bottom Navigation - Same as Home */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-slate-200 dark:border-gray-800 flex items-center justify-around h-16 z-50 px-2 pb-1 shadow-sm">
        <Link href="/" className="flex flex-col items-center gap-1 text-slate-400">
          <Home className="w-4 h-4" />
          <span className="text-[9px] font-black uppercase tracking-tight">Home</span>
        </Link>
        <Link href="#" className="flex flex-col items-center gap-1 text-slate-400">
          <Grid className="w-4 h-4" />
          <span className="text-[9px] font-black uppercase tracking-tight">Search</span>
        </Link>
        <Link href="#" className="flex flex-col items-center gap-1 text-slate-400">
          <Play className="w-4 h-4" />
          <span className="text-[9px] font-black uppercase tracking-tight">Play</span>
        </Link>
        <Link href="/account" className="flex flex-col items-center gap-1 text-primary">
          <UserCircle className="w-4 h-4" />
          <span className="text-[9px] font-black uppercase tracking-tight">Profile</span>
        </Link>
      </nav>
    </div>
  );
}
