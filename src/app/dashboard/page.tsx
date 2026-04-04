
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthContext } from "@/components/auth-provider";
import { Spinner } from "@/components/ui/spinner";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Search, 
  Bell, 
  TrendingUp, 
  Plus,
  LogOut,
  ChevronRight,
  Settings,
  MapPin,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { ThemeToggle } from "@/components/theme-toggle";

const salesData = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 5000 },
  { name: 'Thu', sales: 4500 },
  { name: 'Fri', sales: 6000 },
  { name: 'Sat', sales: 8000 },
  { name: 'Sun', sales: 7500 },
];

const metrics = [
  { title: "Total Revenue", value: "₹12,42,500", trend: "+12.5%", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-500/10" },
  { title: "Local Products", value: "154", trend: "+4.2%", icon: Package, color: "text-blue-600", bg: "bg-blue-500/10" },
  { title: "Active Orders", value: "28", trend: "-2.4%", icon: ShoppingBag, color: "text-amber-600", bg: "bg-amber-500/10" },
  { title: "Store Views", value: "45.2K", trend: "+18.2%", icon: Users, color: "text-purple-600", bg: "bg-purple-500/10" },
];

const recentOrders = [
  { id: "#ORD-7829", customer: "Rahul Sharma", date: "Oct 24, 2023", amount: "₹2,499", status: "Delivered" },
  { id: "#ORD-7828", customer: "Priya Patel", date: "Oct 23, 2023", amount: "₹1,299", status: "Pending" },
  { id: "#ORD-7827", customer: "Amit Kumar", date: "Oct 23, 2023", amount: "₹899", status: "Processing" },
  { id: "#ORD-7826", customer: "Neha Gupta", date: "Oct 22, 2023", amount: "₹3,999", status: "Shipped" },
  { id: "#ORD-7825", customer: "Vikram Singh", date: "Oct 22, 2023", amount: "₹1,499", status: "Cancelled" },
];

export default function DashboardPage() {
  const { user, userProfile, loading, signOut } = useAuthContext();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
    if (!loading && user && !userProfile?.isProfileComplete) router.push("/onboarding");
  }, [user, userProfile, loading, router]);

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

  const NavItem = ({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
    <button 
      onClick={onClick}
      className={`
      w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
      ${active ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}
    `}>
      <Icon className="w-5 h-5" />
      {isSidebarOpen && <span className="font-semibold text-sm">{label}</span>}
    </button>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex transition-colors duration-300">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="hidden md:flex flex-col bg-card border-r border-border sticky top-0 h-screen z-50 overflow-hidden"
      >
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 overflow-hidden pr-4">
              <Image 
                src="https://i.ibb.co/rfKvSNKL/1000128270-1.png" 
                alt="Logo" 
                width={500} 
                height={40} 
                className="w-full h-auto object-contain dark:invert" 
                unoptimized 
              />
            </motion.div>
          )}
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem icon={LayoutDashboard} label="Dashboard" active />
          <NavItem icon={Package} label="Local Products" />
          <NavItem icon={ShoppingBag} label="Orders" />
          <NavItem icon={Users} label="Customers" />
          <NavItem icon={Settings} label="Settings" />
        </nav>

        <div className="p-4 border-t border-border">
          <NavItem icon={LogOut} label="Log Out" onClick={handleSignOut} />
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-card border-b border-border sticky top-0 z-40 px-6 flex items-center justify-between">
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search analytics, orders..." 
                className="w-full h-11 bg-muted/50 border border-border rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-card" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 hover:opacity-80 transition-opacity ml-2 p-1 rounded-full hover:bg-muted">
                  <Avatar className="h-9 w-9 border-2 border-border shadow-sm">
                    <AvatarImage src={user?.photoURL || ""} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                      {userProfile.fullName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  {isSidebarOpen && (
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-bold leading-none">{userProfile.fullName}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">Store Admin</p>
                    </div>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2">
                <DropdownMenuItem onClick={handleSignOut} className="text-rose-500 font-bold">
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl font-black text-foreground tracking-tight">Store Dashboard</h1>
              <p className="text-muted-foreground font-medium mt-1">Welcome back! Your store is performing well today.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="rounded-xl font-bold border-border bg-card">Export CSV</Button>
              <Button className="rounded-xl font-bold shadow-lg shadow-primary/20">
                <Plus className="w-4 h-4 mr-2" /> Add Product
              </Button>
            </div>
          </motion.div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, idx) => (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="border-none shadow-xl shadow-foreground/5 bg-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`${metric.bg} p-2.5 rounded-xl`}>
                        <metric.icon className={`w-6 h-6 ${metric.color}`} />
                      </div>
                      <Badge variant="outline" className={`font-bold border-none ${metric.trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
                        {metric.trend}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">{metric.title}</p>
                    <h3 className="text-2xl font-black text-foreground mt-2">{metric.value}</h3>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sales Analytics */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <Card className="border-none shadow-xl shadow-foreground/5 bg-card h-full">
                <CardHeader>
                  <CardTitle className="text-lg font-black tracking-tight">Weekly Sales Analytics</CardTitle>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesData}>
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                        itemStyle={{ color: 'hsl(var(--primary))', fontWeight: 'bold' }}
                      />
                      <Area type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions / Activity */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="border-none shadow-xl shadow-foreground/5 bg-card h-full">
                <CardHeader>
                  <CardTitle className="text-lg font-black tracking-tight">Recent Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <TrendingUp className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">Peak hours detected</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Orders usually spike between 6 PM - 9 PM in South Delhi.</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Orders Table */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-none shadow-xl shadow-foreground/5 bg-card overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between border-b border-border px-6 py-5">
                <CardTitle className="text-lg font-black tracking-tight">Recent Orders</CardTitle>
                <Button variant="ghost" size="sm" className="text-primary font-bold hover:bg-primary/5">
                  View Full Report <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="font-bold text-muted-foreground text-xs uppercase tracking-widest pl-6">Order ID</TableHead>
                      <TableHead className="font-bold text-muted-foreground text-xs uppercase tracking-widest">Customer</TableHead>
                      <TableHead className="font-bold text-muted-foreground text-xs uppercase tracking-widest">Date</TableHead>
                      <TableHead className="font-bold text-muted-foreground text-xs uppercase tracking-widest text-right">Amount</TableHead>
                      <TableHead className="font-bold text-muted-foreground text-xs uppercase tracking-widest pr-6 text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-muted/30 transition-colors border-border">
                        <TableCell className="font-bold text-foreground pl-6">{order.id}</TableCell>
                        <TableCell className="text-foreground/80 font-semibold">{order.customer}</TableCell>
                        <TableCell className="text-muted-foreground">{order.date}</TableCell>
                        <TableCell className="font-bold text-foreground text-right">{order.amount}</TableCell>
                        <TableCell className="pr-6 text-right">
                          <Badge className={`
                            font-bold px-3 py-1 rounded-full border-none shadow-sm
                            ${order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-600' : 
                              order.status === 'Pending' ? 'bg-amber-500/10 text-amber-600' :
                              order.status === 'Processing' ? 'bg-blue-500/10 text-blue-600' :
                              order.status === 'Shipped' ? 'bg-purple-500/10 text-purple-600' :
                              'bg-rose-500/10 text-rose-600'}
                          `}>
                            {order.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
