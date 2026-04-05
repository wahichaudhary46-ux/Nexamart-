
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
  { title: "Revenue", value: "₹12.4L", trend: "+12%", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-500/10" },
  { title: "Products", value: "154", trend: "+4%", icon: Package, color: "text-blue-600", bg: "bg-blue-500/10" },
  { title: "Orders", value: "28", trend: "-2%", icon: ShoppingBag, color: "text-amber-600", bg: "bg-amber-500/10" },
  { title: "Views", value: "45K", trend: "+18%", icon: Users, color: "text-purple-600", bg: "bg-purple-500/10" },
];

const recentOrders = [
  { id: "#ORD-7829", customer: "Rahul S.", date: "Oct 24", amount: "₹2,499", status: "Delivered" },
  { id: "#ORD-7828", customer: "Priya P.", date: "Oct 23", amount: "₹1,299", status: "Pending" },
  { id: "#ORD-7827", customer: "Amit K.", date: "Oct 23", amount: "₹899", status: "Processing" },
  { id: "#ORD-7826", customer: "Neha G.", date: "Oct 22", amount: "₹3,999", status: "Shipped" },
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
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  const NavItem = ({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
    <button 
      onClick={onClick}
      className={`
      w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200
      ${active ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}
    `}>
      <Icon className="w-4 h-4" />
      {isSidebarOpen && <span className="font-bold text-xs">{label}</span>}
    </button>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex transition-colors duration-300">
      {/* Sidebar - Compact */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 220 : 64 }}
        className="hidden md:flex flex-col bg-card border-r border-border sticky top-0 h-screen z-50 overflow-hidden"
      >
        <div className="p-4 flex items-center justify-between">
          {isSidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 overflow-hidden pr-2">
              <span className="text-lg font-black text-primary tracking-tighter">NexaStore</span>
            </motion.div>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>

        <nav className="flex-1 px-2 space-y-1 mt-2">
          <NavItem icon={LayoutDashboard} label="Dashboard" active />
          <NavItem icon={Package} label="Inventory" />
          <NavItem icon={ShoppingBag} label="Orders" />
          <NavItem icon={Users} label="Customers" />
          <NavItem icon={Settings} label="Settings" />
        </nav>

        <div className="p-2 border-t border-border">
          <NavItem icon={LogOut} label="Log Out" onClick={handleSignOut} />
        </div>
      </motion.aside>

      {/* Main Content - Compact */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-card border-b border-border sticky top-0 z-40 px-4 flex items-center justify-between">
          <div className="flex-1 max-w-sm">
            <div className="relative group">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground transition-colors" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full h-8 bg-muted/50 border border-border rounded-lg pl-8 pr-3 text-[11px] focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-1 ml-4">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="h-8 w-8 relative text-muted-foreground">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full border border-card" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 hover:bg-muted ml-2 p-1 rounded-lg transition-colors">
                  <Avatar className="h-7 w-7 border border-border shadow-sm">
                    <AvatarImage src={user?.photoURL || ""} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-black">
                      {userProfile.fullName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  {isSidebarOpen && (
                    <div className="hidden lg:block text-left">
                      <p className="text-xs font-black leading-none">{userProfile.fullName}</p>
                    </div>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 mt-1">
                <DropdownMenuItem onClick={handleSignOut} className="text-rose-500 text-xs font-bold">
                  <LogOut className="w-3.5 h-3.5 mr-2" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto w-full">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-3"
          >
            <div>
              <h1 className="text-xl font-black text-foreground tracking-tight">Store Dashboard</h1>
              <p className="text-[11px] text-muted-foreground font-bold mt-0.5 uppercase tracking-wider">Store performance analytics</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 text-xs font-bold rounded-lg border-border bg-card">Export</Button>
              <Button size="sm" className="h-8 text-xs font-bold rounded-lg shadow-sm">
                <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Product
              </Button>
            </div>
          </motion.div>

          {/* Metrics Grid - Compact */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {metrics.map((metric, idx) => (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="border-none shadow-sm bg-card">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`${metric.bg} p-1.5 rounded-lg`}>
                        <metric.icon className={`w-4 h-4 ${metric.color}`} />
                      </div>
                      <Badge variant="outline" className={`text-[9px] font-black border-none ${metric.trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
                        {metric.trend}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-[9px] font-black uppercase tracking-widest">{metric.title}</p>
                    <h3 className="text-lg font-black text-foreground mt-0.5">{metric.value}</h3>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Sales Analytics - Compact */}
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <Card className="border-none shadow-sm bg-card">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm font-black tracking-tight">Sales Activity</CardTitle>
                </CardHeader>
                <CardContent className="h-64 px-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesData}>
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ fontSize: '10px', backgroundColor: 'hsl(var(--card))', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                        itemStyle={{ color: 'hsl(var(--primary))', fontWeight: 'bold' }}
                      />
                      <Area type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Insights - Compact */}
            <motion.div 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="border-none shadow-sm bg-card h-full">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm font-black tracking-tight">Store Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 px-4 pb-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer border border-transparent hover:border-border">
                      <div className="bg-primary/5 p-1.5 rounded-lg shrink-0">
                        <TrendingUp className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <div>
                        <p className="text-[11px] font-black text-foreground">Traffic Spike</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">Visitor count up by 15% in Nardiganj area.</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Orders Table - Compact */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-none shadow-sm bg-card overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between border-b border-border px-4 py-3">
                <CardTitle className="text-sm font-black tracking-tight">Recent Orders</CardTitle>
                <Button variant="ghost" size="sm" className="h-7 text-[10px] text-primary font-black px-2">
                  View All <ChevronRight className="w-3 h-3 ml-0.5" />
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow className="h-10 hover:bg-transparent">
                      <TableHead className="font-black text-[10px] uppercase tracking-widest pl-4">ID</TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest">Customer</TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest text-right">Amount</TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest text-right pr-4">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id} className="h-11 hover:bg-muted/30 transition-colors border-border">
                        <TableCell className="text-xs font-bold pl-4">{order.id}</TableCell>
                        <TableCell className="text-xs font-medium text-muted-foreground">{order.customer}</TableCell>
                        <TableCell className="text-xs font-black text-right">{order.amount}</TableCell>
                        <TableCell className="pr-4 text-right">
                          <Badge className={`
                            text-[9px] font-black px-2 py-0.5 rounded-md border-none
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
