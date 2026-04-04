
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
          // 429 errors are handled in the flow with retries, 
          // but we still catch failures here to update the UI
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
      <header className="sticky top-0 z-50 border-b border-border bg-white/80 dark:bg-gray-900/80 backdrop-blur-md transition-colors duration-300">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/logo.png"
              alt="NexaMart"
              width={140}
              height={40}
              className="object-contain"
              priority
            />
          </div>

          {/* Global Search */}
          <div className="flex-1 max-w-xl mx-4 sm:mx-8">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Search products, brands..."
                className="w-full h-11 pl-10 pr-4 rounded-2xl border border-border bg-muted/30 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" size="icon" className="relative hover:bg-primary/5 rounded-full">
              <ShoppingCart className="w-6 h-6 text-foreground" />
              <span className="absolute top-0 right-0 w-5 h-5 rounded-full bg-accent text-accent-foreground text-[10px] flex items-center justify-center font-bold border-2 border-white shadow-sm">3</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-primary/5 rounded-full transition-all">
                  <Avatar className="h-8 w-8 border border-border">
                    <AvatarImage src={user?.photoURL || ""} />
                    <AvatarFallback className="bg-primary text-white">
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
          <div className="rounded-[2rem] bg-primary p-8 md:p-12 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full border-[20px] border-white" />
              <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full border-[10px] border-accent" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 text-center md:text-left">
                <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight font-headline">
                  Welcome back, {userProfile.fullName?.split(" ")[0]}!
                </h1>
                <p className="text-white/80 text-lg max-w-md">
                  Discover curated picks and amazing seasonal deals picked just for you in {userProfile.city || "your area"}.
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-2xl h-14 px-8 font-bold text-lg shadow-xl shadow-accent/20 transition-all hover:scale-105 active:scale-95">
                    Explore New Arrivals
                  </Button>
                  <Button variant="outline" className="bg-transparent text-white border-white/30 hover:bg-white/10 rounded-2xl h-14 px-8 font-bold text-lg backdrop-blur-sm transition-all">
                    View Offers
                  </Button>
                </div>
              </div>
              <div className="hidden lg:block relative w-64 h-64">
                <div className="absolute inset-0 bg-accent rounded-[3rem] rotate-6 scale-95 blur-md opacity-20" />
                <div className="relative w-full h-full bg-white/10 backdrop-blur-md rounded-[3rem] border border-white/20 p-6 flex flex-col items-center justify-center text-white text-center gap-2">
                  <Sparkles className="w-12 h-12 text-accent" />
                  <span className="font-bold text-xl">Member Perk</span>
                  <span className="text-sm text-white/70">Exclusive access to local launches!</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground font-headline">Shop by Category</h2>
            <Button variant="ghost" className="text-primary font-semibold hover:bg-primary/5 rounded-xl">View All <ChevronRight className="ml-1 w-4 h-4" /></Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div
                key={category.name}
                className="group p-8 rounded-[2rem] border border-border bg-white dark:bg-gray-900 hover:border-primary/20 hover:shadow-2xl transition-all duration-500 cursor-pointer text-center flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-muted/50 dark:bg-gray-800 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm group-hover:rotate-12">
                  <category.icon className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-foreground text-lg mb-1 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground font-medium">
                  {category.count.toLocaleString()} Items
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* AI Recommendations */}
        <section className="bg-primary/5 p-8 rounded-[3rem] border border-primary/10">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-accent/20 p-2 rounded-xl">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground font-headline">Picks for You</h2>
              <p className="text-muted-foreground text-sm">AI-powered suggestions based on your taste</p>
            </div>
          </div>
          
          {loadingAI ? (
            <div className="flex justify-center py-12"><Spinner className="h-10 w-10" /></div>
          ) : aiError ? (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-foreground">Recommendations Temporarily Unavailable</p>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">We're experiencing high demand. Please refresh the page or check back in a few moments.</p>
              </div>
              <Button variant="outline" onClick={() => window.location.reload()} className="rounded-xl">Try Again</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {recommendations.map((item) => (
                <div key={item.id} className="bg-white dark:bg-gray-900 rounded-3xl p-4 shadow-sm hover:shadow-md transition-all border border-border group cursor-pointer overflow-hidden">
                  <div className="aspect-square relative mb-4 rounded-2xl overflow-hidden bg-muted">
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-wider text-primary font-bold">{item.category}</p>
                    <h4 className="font-bold text-sm truncate">{item.name}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
                    <p className="font-bold text-primary pt-2">₹{item.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Featured Products */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground font-headline">Featured Products</h2>
            <Button variant="ghost" className="text-primary font-semibold hover:bg-primary/5 rounded-xl">See Everything</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => {
              const placeholder = PlaceHolderImages.find(p => p.id === product.imageId);
              return (
                <div
                  key={product.id}
                  className="group rounded-[2.5rem] border border-border bg-white dark:bg-gray-900 overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer"
                >
                  <div className="aspect-[4/5] relative overflow-hidden bg-muted">
                    <Image
                      src={placeholder?.imageUrl || `https://picsum.photos/seed/${product.id}/400/500`}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      data-ai-hint={placeholder?.imageHint || "product image"}
                    />
                    <div className="absolute top-4 left-4">
                      <div className="bg-accent/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-accent-foreground shadow-lg">NEW</div>
                    </div>
                    <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white text-destructive shadow-lg">
                      <Heart className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-4 left-4 right-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <Button className="w-full bg-primary/90 backdrop-blur text-white rounded-2xl h-12 shadow-xl">Quick Add</Button>
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-foreground truncate text-lg group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? "text-accent fill-accent" : "text-muted"}`} />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-muted-foreground dark:text-gray-400 ml-1">{product.rating}</span>
                    </div>
                    <div className="flex items-center gap-3 pt-1">
                      <span className="text-xl font-extrabold text-foreground">
                        ₹{product.price.toLocaleString()}
                      </span>
                      <span className="text-sm text-muted-foreground line-through font-medium">
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
