
"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  User, 
  MapPin, 
  Globe, 
  Bell, 
  Heart, 
  Star, 
  Store, 
  FileText, 
  HelpCircle, 
  ChevronRight,
  LogOut,
  Home,
  Grid,
  Play,
  UserCircle
} from "lucide-react";
import { useAuthContext } from "@/components/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AccountPage() {
  const { user, userProfile, loading, signOut } = useAuthContext();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
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

  const AccountItem = ({ icon: Icon, label, href = "#" }: { icon: any, label: string, href?: string }) => (
    <Link href={href} className="flex items-center justify-between py-4 group active:bg-muted/50 transition-colors">
      <div className="flex items-center gap-4">
        <div className="text-muted-foreground group-hover:text-primary transition-colors">
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-sm font-medium text-foreground">{label}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground/30" />
    </Link>
  );

  return (
    <div className="min-h-screen bg-background pb-24 font-body transition-colors duration-300">
      {/* Header */}
      <div className="bg-background border-b border-border sticky top-0 z-50 px-4 h-14 flex items-center justify-between">
        <h1 className="text-lg font-bold text-foreground">My Account</h1>
        <ThemeToggle />
      </div>

      <main className="max-w-md mx-auto">
        {/* User Brief Section */}
        <section className="bg-card p-6 mb-2 border-b border-border">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-border shadow-sm">
              <AvatarImage src={user?.photoURL || ""} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                {userProfile?.fullName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-black text-foreground leading-tight">
                {userProfile?.fullName || "User Name"}
              </h2>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">
                {userProfile?.email || user?.email}
              </p>
            </div>
            <Button variant="ghost" size="sm" className="text-primary font-bold text-xs uppercase tracking-wider">
              Edit
            </Button>
          </div>
        </section>

        {/* Section 1: Account Settings */}
        <section className="bg-card px-4 mb-2 border-b border-border">
          <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest pt-4 pb-2">Account Settings</h3>
          <div className="flex flex-col">
            <AccountItem icon={User} label="Edit Profile" />
            <Separator className="bg-border" />
            <AccountItem icon={MapPin} label="Saved Local Areas / Addresses" />
            <Separator className="bg-border" />
            <AccountItem icon={Globe} label="Select Language" />
            <Separator className="bg-border" />
            <AccountItem icon={Bell} label="Notification Settings" />
          </div>
        </section>

        {/* Section 2: My Activity */}
        <section className="bg-card px-4 mb-2 border-b border-border">
          <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest pt-4 pb-2">My Activity</h3>
          <div className="flex flex-col">
            <AccountItem icon={Heart} label="Saved Products & Shops" />
            <Separator className="bg-border" />
            <AccountItem icon={Star} label="My Reviews & Ratings" />
          </div>
        </section>

        {/* Section 3: Grow with NexaMart */}
        <section className="bg-card px-4 mb-2 border-b border-border">
          <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest pt-4 pb-2">Business</h3>
          <Link href="/dashboard" className="flex items-center justify-between py-5 px-4 bg-primary/5 rounded-2xl border border-primary/10 mt-2 mb-4 group active:scale-[0.98] transition-all">
            <div className="flex items-center gap-4">
              <div className="bg-primary text-primary-foreground p-2.5 rounded-xl shadow-lg shadow-primary/20">
                <Store className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black text-foreground">Register Your Shop</span>
                <span className="text-[11px] text-muted-foreground font-bold uppercase tracking-tight">Partner with us today</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-primary" />
          </Link>
        </section>

        {/* Section 4: Feedback & Information */}
        <section className="bg-card px-4 mb-2 border-b border-border">
          <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest pt-4 pb-2">Feedback & Information</h3>
          <div className="flex flex-col">
            <AccountItem icon={FileText} label="Terms, Policies and Licenses" />
            <Separator className="bg-border" />
            <AccountItem icon={HelpCircle} label="Browse FAQs" />
          </div>
        </section>

        {/* Logout Button */}
        <div className="px-4 mt-6">
          <Button 
            onClick={handleSignOut}
            variant="outline" 
            className="w-full h-12 bg-card border-border text-primary font-black rounded-xl shadow-sm active:bg-muted transition-colors uppercase tracking-widest text-xs"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </Button>
          <p className="text-center text-[10px] text-muted-foreground/50 font-bold mt-8 uppercase tracking-[0.2em]">
            NexaMart v1.0.4
          </p>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border flex items-center justify-around h-20 z-50 px-2 pb-2 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <Link href="/" className="flex flex-col items-center gap-1.5 text-muted-foreground">
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-tighter">Home</span>
        </Link>
        <Link href="#" className="flex flex-col items-center gap-1.5 text-muted-foreground">
          <Grid className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-tighter">Categories</span>
        </Link>
        <Link href="#" className="flex flex-col items-center gap-1.5 text-muted-foreground">
          <Play className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-tighter">Play</span>
        </Link>
        <Link href="/account" className="flex flex-col items-center gap-1.5 text-primary">
          <UserCircle className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-tighter">Account</span>
        </Link>
      </nav>
    </div>
  );
}
