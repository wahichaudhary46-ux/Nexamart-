
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  MapPin, 
  LogOut, 
  Home,
  Grid,
  Play,
  UserCircle,
  Mail,
  Phone,
  Info,
  Globe,
  Hash,
  ChevronUp
} from "lucide-react";
import { useAuthContext } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AccountPage() {
  const { user, userProfile, loading, signOut } = useAuthContext();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#e0eafc]">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1a2a3f]"></div>
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

  const nexaId = `NEXA-${user.uid.substring(0, 6).toUpperCase()}`;

  const InfoRow = ({ label, value, icon: Icon }: { label: string, value: string | null | undefined, icon?: any }) => (
    <div className="flex items-baseline py-3 border-b border-slate-100 last:border-0">
      <span className="w-24 text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
        {Icon && <Icon className="w-3 h-3" />}
        {label}
      </span>
      <span className="flex-1 text-[13px] font-bold text-slate-800 dark:text-gray-200 truncate">
        {value || "Not Set"}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0eafc] to-[#cfdef3] dark:from-slate-900 dark:to-slate-950 flex items-center justify-center p-4 pb-24 font-body">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[400px] w-full bg-white dark:bg-gray-900 rounded-[36px] shadow-2xl overflow-hidden border border-white/20"
      >
        {/* Header - Dark & Premium */}
        <header className="bg-[#1a2a3f] p-8 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
          
          <h1 className="text-xl md:text-2xl font-black tracking-tight mb-2 relative z-10">
            {userProfile?.fullName || "User Profile"}
          </h1>
          
          <div className="inline-block bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold mb-4 relative z-10">
            ID: {nexaId}
          </div>
          
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold opacity-80 uppercase tracking-widest relative z-10">
            <span className="text-blue-400">📍</span>
            {userProfile?.city || "Location Not Set"}
          </div>
        </header>

        {/* Content Section */}
        <div className="p-6 md:p-8 space-y-6">
          
          {/* Section: Personal Info */}
          <section>
            <h2 className="text-sm font-black text-[#1e2f3e] dark:text-white mb-4 border-l-4 border-blue-500 pl-3">
              Personal Information
            </h2>
            <div className="space-y-1">
              <InfoRow label="Email" value={userProfile?.email} icon={Mail} />
              <InfoRow label="Phone" value={userProfile?.mobileNumber} icon={Phone} />
              <InfoRow label="Bio" value="NexaMart Verified Shopper" icon={Info} />
            </div>
          </section>

          {/* Section: Address Block */}
          <section>
            <h2 className="text-sm font-black text-[#1e2f3e] dark:text-white mb-4 border-l-4 border-blue-500 pl-3">
              Default Address
            </h2>
            <div className="bg-[#f8fafc] dark:bg-slate-800/50 rounded-[24px] p-5 shadow-inner border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary Hub</span>
                <Globe className="w-3.5 h-3.5 text-slate-300" />
              </div>
              <p className="text-[13px] font-bold text-slate-800 dark:text-gray-200 leading-relaxed mb-4">
                {userProfile?.address || "No address saved yet."}
              </p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-400 uppercase">City</span>
                  <span className="text-xs font-bold">{userProfile?.city || "N/A"}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-400 uppercase">State</span>
                  <span className="text-xs font-bold">Bihar</span>
                </div>
              </div>
            </div>
          </section>

          {/* Log Out */}
          <Button 
            onClick={handleSignOut}
            variant="ghost" 
            className="w-full h-11 rounded-2xl text-red-500 font-black text-xs hover:bg-red-50 dark:hover:bg-red-950/20 border border-slate-100 dark:border-slate-800 transition-all active:scale-[0.98]"
          >
            <LogOut className="w-4 h-4 mr-2" />
            SIGN OUT FROM NEXAMART
          </Button>
        </div>

        {/* Footer Swipe Hint */}
        <div className="py-6 border-t border-slate-100 dark:border-slate-800 text-center">
          <motion.div 
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500"
          >
            <ChevronUp className="w-5 h-5 text-blue-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Explore Area</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-black/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 flex items-center justify-around h-16 z-50 px-2 pb-1 transition-colors duration-300">
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
        <Link href="/account" className="flex flex-col items-center gap-1 text-blue-600">
          <UserCircle className="w-4 h-4" />
          <span className="text-[9px] font-black uppercase tracking-tight">Profile</span>
        </Link>
      </nav>
    </div>
  );
}
