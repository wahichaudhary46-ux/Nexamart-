
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
    <h3 className="px-4 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2 mt-6">
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
    <div className="flex items-center justify-between py-3 px-4 bg-white dark:bg-gray-900 active:bg-slate-50 dark:active:bg-gray-800 transition-colors">
      <div className="flex items-center gap-3 flex-1">
        <Icon className={`w-5 h-5 ${highlight ? 'text-primary' : 'text-slate-400'}`} />
        <span className={`text-sm ${highlight ? 'font-medium text-primary' : 'text-slate-700 dark:text-gray-200'}`}>
          {label}
        </span>
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

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-gray-950 pb-24 font-body transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-gray-800 sticky top-0 z-50 px-4 h-14 flex items-center">
        <h1 className="text-base font-bold text-slate-800 dark:text-white">Account</h1>
      </div>

      <main className="max-w-md mx-auto">
        {/* User Profile Brief */}
        <section className="bg-white dark:bg-gray-900 p-6 mb-4 border-b border-slate-200 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border border-slate-200 dark:border-gray-700 shadow-sm">
              <AvatarImage src={user?.photoURL || ""} />
              <AvatarFallback className="bg-primary text-white text-xl font-bold">
                {userProfile?.fullName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {userProfile?.fullName || "NexaMart User"}
              </h2>
              <p className="text-xs text-slate-500 dark:text-gray-400">
                {userProfile?.email || user?.email}
              </p>
            </div>
          </div>
        </section>

        {/* Section 1: Account Settings */}
        <SectionHeader>Account Settings</SectionHeader>
        <div className="bg-white dark:bg-gray-900 border-y border-slate-200 dark:border-gray-800 divide-y divide-slate-100 dark:divide-gray-800">
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
        <div className="bg-white dark:bg-gray-900 border-y border-slate-200 dark:border-gray-800 divide-y divide-slate-100 dark:divide-gray-800">
          <AccountItem icon={Heart} label="Saved Shops" />
          <AccountItem icon={Star} label="My Reviews" />
        </div>

        {/* Section 3: Partner with NexaMart */}
        <SectionHeader>Partner with NexaMart</SectionHeader>
        <div className="bg-white dark:bg-gray-900 border-y border-slate-200 dark:border-gray-800">
          <AccountItem 
            icon={Store} 
            label="Register Your Shop" 
            highlight={true} 
            href="/dashboard"
          />
        </div>

        {/* Log Out Button */}
        <div className="px-4 mt-10">
          <Button 
            onClick={handleSignOut}
            variant="outline" 
            className="w-full h-12 bg-white dark:bg-gray-900 border-slate-200 dark:border-gray-800 text-red-600 font-bold rounded-xl active:bg-slate-50 transition-colors text-sm"
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
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-slate-200 dark:border-gray-800 flex items-center justify-around h-20 z-50 px-2 pb-2 shadow-sm transition-colors duration-300">
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
        <Link href="/account" className="flex flex-col items-center gap-1.5 text-primary">
          <UserCircle className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Account</span>
        </Link>
      </nav>
    </div>
  );
}
