
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuthContext } from "@/components/auth-provider";
import { Spinner } from "@/components/ui/spinner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, ShoppingCart, Laptop, Shirt, Home, Heart, Star, 
  Sparkles, ChevronRight, Menu, LogOut, Package, User, AlertCircle
} from "lucide-react";
import { personalizedProductRecommendations } from "@/ai/flows/personalized-product-recommendations-flow";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const categories = [
  { name: "Electronics", icon: Laptop, count: 1240 },
  { name: "Fashion", icon: Shirt, count: 3420 },
  { name: "Home & Living", icon: Home, count: 890 },
  { name: "Beauty", icon: Sparkles, count: 560 },
];

const featuredProducts = [
  { id: 1, name: "Wireless Earbuds Pro", price: 2999, originalPrice: 4999, imageId: "earbuds", rating: 4.8 },
  { id: 2, name: "Smart Watch Series X", price: 12999, originalPrice: 18999, imageId: "watch", rating: 4.6 },
  { id: 3, name: "Premium Backpack", price: 1499, originalPrice: 2499, imageId: "backpack", rating: 4.9 },
  { id: 4, name: "Minimalist Desk Lamp", price: 899, originalPrice: 1299, imageId: "lamp", rating: 4.7 },
];

export default function DashboardPage() {
  const { user, userProfile, loading, signOut } = useAuthContext();
  const router = useRouter();
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiError, setAiError] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
    if (!loading && user && !userProfile?.isProfileComplete) {
      router.push("/onboarding");
    }
  }, [user, userProfile, loading, router]);

  useEffect(() => {
    async function getRecommendations() {
      if (userProfile?.fullName) {
        setLoadingAI(true);
        setAiError(false);
        try {
          const res = await personalizedProductRecommendations({
            browsingHistory: ["Premium electronics", "Home decor"],
            userProfile: { fullName: userProfile.fullName, city: userProfile.city }
          });
          setRecommendations(res.recommendations || []);
        } catch (error: any) {
          setAiError(true);
        } finally {
          setLoadingAI(false);
        }
      }
    }
    getRecommendations();
  }, [userProfile]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  if (loading || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-white/95 dark:bg-gray-900/95 backdrop-blur-md transition-colors duration-300">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="https://i.ibb.co/rfKvSNKL/1000128270-1.png"
              alt="NexaMart"
              width={180}
              height={50}
              className="object-contain"
              priority
              unoptimized
            />
          </div>

          {/* Global Search */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative group w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Search products, brands..."
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-muted/20 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <Button variant="ghost" size="icon" className="relative hover:bg-primary/5 rounded-full">
              <ShoppingCart className="w-5 h-5 text-foreground" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent text-accent-foreground text-[10px] flex items-center justify-center font-bold border-2 border-white shadow-sm">3</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-primary/5 rounded-full transition-all">
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarImage src={user?.photoURL || ""} />
                    <AvatarFallback className="bg-primary text-white font-bold">
                      {userProfile.fullName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block text-sm font-semibold">{userProfile.fullName?.split(" ")[0]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl border-border shadow-xl">
                <div className="px-3 py-3 border-b border-border mb-2">
                  <p className="text-sm font-bold text-foreground">{userProfile.fullName}</p>
                  <p className="text-xs text-muted-foreground truncate">{userProfile.email}</p>
                </div>
                <DropdownMenuItem className="rounded-xl gap-2 cursor-pointer focus:bg-primary/5 focus:text-primary"><User className="w-4 h-4" /> My Profile</DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl gap-2 cursor-pointer focus:bg-primary/5 focus:text-primary"><Package className="w-4 h-4" /> My Orders</DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl gap-2 cursor-pointer focus:bg-primary/5 focus:text-primary"><Heart className="w-4 h-4" /> Wishlist</DropdownMenuItem>
                <DropdownMenuSeparator className="my-2" />
                <DropdownMenuItem onClick={handleSignOut} className="rounded-xl gap-2 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                  <LogOut className="w-4 h-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Welcome Banner */}
        <section>
          <div className="rounded-[2.5rem] bg-primary p-8 md:p-14 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full border-[25px] border-white" />
              <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full border-[15px] border-accent" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="space-y-6 text-center md:text-left max-w-2xl">
                <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.1] font-headline">
                  Welcome back, {userProfile.fullName?.split(" ")[0]}!
                </h1>
                <p className="text-white/80 text-lg md:text-xl font-medium">
                  Discover curated picks and amazing seasonal deals picked just for you in {userProfile.city || "your area"}.
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-2xl h-14 px-10 font-bold text-lg shadow-xl shadow-accent/20 transition-all hover:scale-105 active:scale-95">
                    Explore New Arrivals
                  </Button>
                  <Button variant="outline" className="bg-transparent text-white border-white/30 hover:bg-white/10 rounded-2xl h-14 px-10 font-bold text-lg backdrop-blur-sm transition-all">
                    View Offers
                  </Button>
                </div>
              </div>
              <div className="hidden lg:block relative w-72 h-72">
                <div className="absolute inset-0 bg-accent rounded-[3.5rem] rotate-12 scale-95 blur-lg opacity-30" />
                <div className="relative w-full h-full bg-white/10 backdrop-blur-xl rounded-[3.5rem] border border-white/20 p-8 flex flex-col items-center justify-center text-white text-center gap-4">
                  <Sparkles className="w-16 h-16 text-accent animate-pulse" />
                  <span className="font-black text-2xl tracking-tight">VIP ACCESS</span>
                  <span className="text-sm font-medium text-white/70">Exclusive access to local launches!</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Recommendations */}
        <section className="bg-primary/5 p-8 md:p-12 rounded-[3.5rem] border border-primary/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-2xl">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-foreground font-headline tracking-tight">Picks for You</h2>
                <p className="text-muted-foreground font-medium">AI-powered suggestions based on your taste</p>
              </div>
            </div>
            <Button variant="outline" className="rounded-xl font-bold">Refresh AI</Button>
          </div>
          
          {loadingAI ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Spinner className="h-12 w-12" />
              <p className="text-muted-foreground animate-pulse font-medium">Curating your collection...</p>
            </div>
          ) : aiError ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <p className="text-xl font-bold text-foreground">Recommendations Unavailable</p>
                <p className="text-muted-foreground max-w-sm mx-auto">We're experiencing high demand for AI features. Please refresh or check back in a few minutes.</p>
              </div>
              <Button variant="outline" onClick={() => window.location.reload()} className="rounded-xl h-12 px-8 font-bold">Try Again</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8">
              {recommendations.map((item) => (
                <div key={item.id} className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-5 shadow-sm hover:shadow-2xl transition-all duration-500 border border-border group cursor-pointer overflow-hidden">
                  <div className="aspect-square relative mb-5 rounded-[2rem] overflow-hidden bg-muted">
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-[0.15em] text-primary font-black">{item.category}</p>
                    <h4 className="font-bold text-base truncate text-foreground group-hover:text-primary transition-colors">{item.name}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-1 font-medium">{item.description}</p>
                    <p className="font-black text-xl text-primary pt-3">₹{item.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Categories */}
        <section>
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-black text-foreground font-headline tracking-tight">Shop by Category</h2>
            <Button variant="ghost" className="text-primary font-bold hover:bg-primary/5 rounded-xl">View All <ChevronRight className="ml-1 w-5 h-5" /></Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {categories.map((category) => (
              <div
                key={category.name}
                className="group p-10 rounded-[3rem] border border-border bg-white dark:bg-gray-900 hover:border-primary/30 hover:shadow-2xl transition-all duration-500 cursor-pointer text-center flex flex-col items-center"
              >
                <div className="w-20 h-20 rounded-3xl bg-muted/50 dark:bg-gray-800 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm group-hover:rotate-[15deg]">
                  <category.icon className="w-10 h-10" />
                </div>
                <h3 className="font-black text-foreground text-xl mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">
                  {category.count.toLocaleString()} Items
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section>
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-black text-foreground font-headline tracking-tight">Featured Products</h2>
            <Button variant="ghost" className="text-primary font-bold hover:bg-primary/5 rounded-xl">See Everything</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {featuredProducts.map((product) => {
              const placeholder = PlaceHolderImages.find(p => p.id === product.imageId);
              return (
                <div
                  key={product.id}
                  className="group rounded-[3rem] border border-border bg-white dark:bg-gray-900 overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 cursor-pointer flex flex-col"
                >
                  <div className="aspect-[4/5] relative overflow-hidden bg-muted">
                    <Image
                      src={placeholder?.imageUrl || `https://picsum.photos/seed/${product.id}/400/500`}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-1000"
                      data-ai-hint={placeholder?.imageHint || "product image"}
                    />
                    <div className="absolute top-6 left-6">
                      <div className="bg-accent/90 backdrop-blur px-4 py-1.5 rounded-full text-[11px] font-black text-accent-foreground shadow-lg tracking-widest">NEW</div>
                    </div>
                    <button className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/80 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white text-destructive shadow-lg">
                      <Heart className="w-6 h-6" />
                    </button>
                    <div className="absolute bottom-6 left-6 right-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <Button className="w-full bg-primary/95 backdrop-blur text-white rounded-[1.5rem] h-14 shadow-2xl font-black text-lg">Quick Add</Button>
                    </div>
                  </div>
                  <div className="p-8 space-y-4 flex-1 flex flex-col">
                    <div className="flex items-center justify-between">
                      <h3 className="font-black text-foreground truncate text-xl group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-accent fill-accent" : "text-muted"}`} />
                        ))}
                      </div>
                      <span className="text-xs font-black text-muted-foreground dark:text-gray-400 ml-1">{product.rating}</span>
                    </div>
                    <div className="flex items-center gap-4 pt-2 mt-auto">
                      <span className="text-2xl font-black text-foreground">
                        ₹{product.price.toLocaleString()}
                      </span>
                      <span className="text-sm text-muted-foreground line-through font-bold">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
