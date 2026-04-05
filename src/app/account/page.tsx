
"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  User, 
  MapPin, 
  Moon, 
  CreditCard, 
  Bell, 
  Globe, 
  Store, 
  LogOut, 
  ChevronRight,
  Home,
  Grid,
  Play,
  UserCircle,
  ShieldCheck
} from "lucide-react";
import { useAuthContext } from "@/components/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export default function AccountPage() {
  const { user, userProfile, loading, signOut } = useAuthContext();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black">
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

  // Generate a premium-looking ID badge based on UID
  const nexaId = `NEXA-${user.uid.substring(0, 6).toUpperCase()}`;

  const SectionHeader = ({ children }: { children: React.ReactNode }) => (
    <h3 className="px-1 text-[10px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-2 mt-6">
      {children}
    </h3>
  );

  const AccountItem = ({ 
    icon: Icon, 
    label, 
    href = "#", 
    action,
    highlight = false,
    isSeller = false
  }: { 
    icon: any, 
    label: string, 
    href?: string,
    action?: React.ReactNode,
    highlight?: boolean,
    isSeller?: boolean
  }) => (
    <div 
      className={`
        flex items-center justify-between py-3.5 px-4 transition-all
        ${isSeller ? 'bg-blue-50/40 dark:bg-blue-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/20' : 'bg-white dark:bg-gray-900 hover:bg-slate-50 dark:hover:bg-gray-800'}
        active:scale-[0.99] cursor-pointer
      `}
    >
      <div className="flex items-center gap-3 flex-1">
        <div className={`p-1.5 rounded-lg ${highlight ? 'bg-primary/10' : 'bg-slate-100 dark:bg-gray-800'}`}>
          <Icon className={`w-4 h-4 ${highlight ? 'text-primary' : 'text-slate-500 dark:text-gray-400'}`} />
        </div>
        <span className={`text-sm ${highlight ? 'font-black text-primary' : 'text-slate-700 dark:text-gray-200 font-bold'}`}>
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
    <div className="min-h-screen bg-slate-50 dark:bg-black pb-24 font-body transition-colors duration-300">
      {/* Header - Compact */}
      <div className="bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-gray-800 sticky top-0 z-50 px-4 h-14 flex items-center justify-between shadow-sm">
        <h1 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tighter">Profile</h1>
        <ThemeToggleCompact />
      </div>

      <main className="max-w-md mx-auto px-4">
        {/* Premium ID Section - 3D Effect */}
        <section className="mt-4 mb-2">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-md relative overflow-hidden group"
          >
            {/* Subtle Gradient Background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/10 transition-colors" />
            
            <div className="flex items-center gap-4 relative z-10">
              <Avatar className="h-16 w-16 border-2 border-primary/20 p-0.5 bg-white dark:bg-gray-900 shadow-sm">
                <AvatarImage src={user?.photoURL || ""} className="rounded-full" />
                <AvatarFallback className="bg-primary text-white text-xl font-black">
                  {userProfile?.fullName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight leading-none">
                  {userProfile?.fullName || "NexaMart User"}
                </h2>
                <div className="inline-flex items-center">
                  <span className="bg-slate-900 text-[10px] font-black text-white px-2 py-0.5 rounded-md tracking-widest uppercase border border-slate-700 shadow-sm">
                    {nexaId}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Card 1: Account Settings (Raised 3D Card) */}
        <SectionHeader>Account Settings</SectionHeader>
        <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-gray-800 divide-y divide-slate-100 dark:divide-gray-800 shadow-md">
          <AccountItem icon={User} label="Personal Information" />
          <AccountItem icon={MapPin} label="Saved Addresses" />
          <AccountItem 
            icon={Moon} 
            label="Dark Mode" 
            action={
              <Switch 
                checked={theme === 'dark'} 
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')} 
                className="scale-90"
              />
            }
          />
        </div>

        {/* Card 2: Payment & Preferences */}
        <SectionHeader>Payment & Preferences</SectionHeader>
        <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-gray-800 divide-y divide-slate-100 dark:divide-gray-800 shadow-md">
          <AccountItem icon={CreditCard} label="Saved Cards & UPI" />
          <AccountItem icon={Bell} label="Notification Preferences" />
          <AccountItem icon={Globe} label="App Language" action={<span className="text-[10px] font-black text-slate-400">ENGLISH</span>} />
        </div>

        {/* Card 3: Business & Seller (Distinctive Background) */}
        <SectionHeader>Seller Program</SectionHeader>
        <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-gray-800 shadow-md">
          <AccountItem 
            icon={Store} 
            label="Register Your Shop" 
            highlight={true} 
            isSeller={true}
            href="/dashboard"
          />
          <div className="bg-blue-50/20 dark:bg-blue-900/5 px-4 py-3 border-t border-slate-100 dark:border-gray-800">
            <p className="text-[10px] text-slate-500 dark:text-gray-400 font-bold leading-tight">
              Start selling in your local area and grow your business with NexaMart.
            </p>
          </div>
        </div>

        {/* Card 4: Personal Info (Compact Email display) */}
        <SectionHeader>Contact Details</SectionHeader>
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-slate-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
             <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary Email</span>
                <span className="text-xs font-bold text-slate-700 dark:text-gray-300">{userProfile?.email || user?.email}</span>
             </div>
             <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
        </div>

        {/* Log Out - Neumorphic Style */}
        <div className="mt-10 px-2">
          <Button 
            onClick={handleSignOut}
            variant="outline" 
            className="w-full h-11 bg-white dark:bg-gray-900 border-slate-200 dark:border-gray-800 text-red-600 font-black rounded-2xl shadow-sm active:scale-[0.98] transition-all text-xs"
          >
            <LogOut className="w-4 h-4 mr-2" />
            SIGN OUT
          </Button>
          <p className="text-center text-[9px] text-slate-400 font-bold mt-8 uppercase tracking-widest opacity-60">
            NexaMart v1.1.2 • Secure Profile
          </p>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-slate-200 dark:border-gray-800 flex items-center justify-around h-16 z-50 px-2 pb-1 shadow-[0_-4px_10px_rgba(0,0,0,0.03)] transition-colors duration-300">
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

function ThemeToggleCompact() {
  const { theme, setTheme } = useTheme();
  return (
    <button 
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-xl bg-slate-100 dark:bg-gray-800 text-slate-500 dark:text-gray-400 active:scale-90 transition-all shadow-inner"
    >
      {theme === 'dark' ? <Globe className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}
