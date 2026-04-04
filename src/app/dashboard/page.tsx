
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuthContext } from "@/components/auth-provider";
import { Spinner } from "@/components/ui/spinner";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings, 
  Search, 
  Bell, 
  TrendingUp, 
  TrendingDown,
  MoreVertical,
  Plus,
  ArrowUpRight,
  LogOut,
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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

const chartData = [
  { name: "Mon", sales: 4000, revenue: 2400 },
  { name: "Tue", sales: 3000, revenue: 1398 },
  { name: "Wed", sales: 2000, revenue: 9800 },
  { name: "Thu", sales: 2780, revenue: 3908 },
  { name: "Fri", sales: 1890, revenue: 4800 },
  { name: "Sat", sales: 2390, revenue: 3800 },
  { name: "Sun", sales: 3490, revenue: 4300 },
];

const navigation = [
  { name: "Dashboard", icon: LayoutDashboard, active: true },
  { name: "Local Products", icon: Package, active: false },
  { name: "Orders", icon: ShoppingBag, active: false },
  { name: "Customers", icon: Users, active: false },
  { name: "Settings", icon: Settings, active: false },
];

const metrics = [
  { 
    title: "Total Revenue", 
    value: "₹12,42,500", 
    trend: "+12.5%", 
    isPositive: true, 
    icon: TrendingUp,
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-950/30"
  },
  { 
    title: "Local Products", 
    value: "154", 
    trend: "+4.2%", 
    isPositive: true, 
    icon: Package,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/30"
  },
  { 
    title: "Active Orders", 
    value: "28", 
    trend: "-2.4%", 
    isPositive: false, 
    icon: ShoppingBag,
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-950/30"
  },
  { 
    title: "Store Views", 
    value: "45.2K", 
    trend: "+18.2%", 
    isPositive: true, 
    icon: Users,
    color: "text-purple-600",
    bg: "bg-purple-50 dark:bg-purple-950/30"
  },
];

const recentOrders = [
  { id: "#ORD-7829", customer: "Rahul Sharma", date: "Oct 24, 2023", amount: "₹2,499", status: "Delivered" },
  { id: "#ORD-7828", customer: "Priya Patel", date: "Oct 23, 2023", amount: "₹1,299", status: "Pending" },
  { id: "#ORD-7827", customer: "Amit Kumar", date: "Oct 23, 2023", amount: "₹899", status: "Processing" },
  { id: "#ORD-7826", customer: "Neha Gupta", date: "Oct 22, 2023", amount: "₹3,999", status: "Shipped" },
  { id: "#ORD-7825", customer: "Vikram Singh", date: "Oct 22, 2023", amount: "₹1,499", status: "Cancelled" },
];

const statusStyles = {
  Delivered: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  Pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  Processing: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  Shipped: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
  Cancelled: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400",
};

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex transition-colors duration-300">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden hidden md:flex flex-col"
      >
        <div className="p-6 h-20 flex items-center gap-3">
          <Image
            src="https://i.ibb.co/rfKvSNKL/1000128270-1.png"
            alt="NexaMart"
            width={140}
            height={40}
            className={`object-contain transition-opacity duration-300 ${isSidebarOpen ? "opacity-100" : "opacity-0"}`}
            unoptimized
          />
          {!isSidebarOpen && (
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-xl">N</span>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navigation.map((item) => (
            <button
              key={item.name}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
                item.active 
                  ? "bg-primary text-white shadow-lg shadow-primary/25" 
                  : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <item.icon className={`w-5 h-5 shrink-0 ${item.active ? "text-white" : "group-hover:scale-110 transition-transform"}`} />
              <span className={`font-semibold whitespace-nowrap transition-opacity duration-300 ${isSidebarOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}>
                {item.name}
              </span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all group"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className={`font-semibold whitespace-nowrap transition-opacity duration-300 ${isSidebarOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}>
              Sign Out
            </span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "md:ml-[280px]" : "md:ml-[80px]"}`}>
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 h-20">
          <div className="h-full px-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="hidden md:flex rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
                Welcome back, {userProfile.fullName?.split(" ")[0]}
              </h1>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden lg:flex items-center relative group">
                <Search className="absolute left-3 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search analytics, orders..." 
                  className="bg-gray-100 dark:bg-gray-800 border-none rounded-2xl pl-10 pr-4 h-11 w-64 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-gray-900" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 pl-2 hover:opacity-80 transition-opacity">
                      <Avatar className="h-10 w-10 border-2 border-primary/20 p-0.5">
                        <AvatarImage src={user?.photoURL || ""} />
                        <AvatarFallback className="bg-primary text-white font-bold">
                          {userProfile.fullName?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl">
                    <div className="px-3 py-3 border-b border-gray-100 dark:border-gray-800 mb-2">
                      <p className="text-sm font-bold">{userProfile.fullName}</p>
                      <p className="text-xs text-gray-500 truncate">{userProfile.email}</p>
                    </div>
                    <DropdownMenuItem className="rounded-xl cursor-pointer">Profile Settings</DropdownMenuItem>
                    <DropdownMenuItem className="rounded-xl cursor-pointer">Store Preferences</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="rounded-xl cursor-pointer text-rose-500 focus:text-rose-500">
                      Log Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 space-y-8">
          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, idx) => (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="border-none shadow-lg shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`${metric.bg} p-3 rounded-2xl`}>
                        <metric.icon className={`w-6 h-6 ${metric.color}`} />
                      </div>
                      <div className={`flex items-center gap-1 text-sm font-bold ${metric.isPositive ? "text-emerald-500" : "text-rose-500"}`}>
                        {metric.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {metric.trend}
                      </div>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{metric.title}</p>
                    <h3 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">{metric.value}</h3>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Orders */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2"
            >
              <Card className="border-none shadow-lg shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden">
                <CardHeader className="p-8 flex flex-row items-center justify-between border-b border-gray-100 dark:border-gray-800">
                  <div>
                    <CardTitle className="text-xl font-black">Recent Orders</CardTitle>
                    <p className="text-sm text-gray-500 font-medium">Monitoring your store's latest transactions</p>
                  </div>
                  <Button variant="outline" className="rounded-xl font-bold">View Reports</Button>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-gray-50/50 dark:bg-gray-800/50">
                      <TableRow className="border-none hover:bg-transparent">
                        <TableHead className="py-5 pl-8 font-bold text-gray-400 text-xs uppercase tracking-widest">Order ID</TableHead>
                        <TableHead className="font-bold text-gray-400 text-xs uppercase tracking-widest">Customer</TableHead>
                        <TableHead className="font-bold text-gray-400 text-xs uppercase tracking-widest">Date</TableHead>
                        <TableHead className="font-bold text-gray-400 text-xs uppercase tracking-widest">Amount</TableHead>
                        <TableHead className="font-bold text-gray-400 text-xs uppercase tracking-widest pr-8">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentOrders.map((order) => (
                        <TableRow key={order.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                          <TableCell className="py-5 pl-8 font-bold text-gray-900 dark:text-white">{order.id}</TableCell>
                          <TableCell className="font-medium">{order.customer}</TableCell>
                          <TableCell className="text-gray-500">{order.date}</TableCell>
                          <TableCell className="font-black">{order.amount}</TableCell>
                          <TableCell className="pr-8">
                            <Badge className={`${statusStyles[order.status as keyof typeof statusStyles]} border-none px-4 py-1.5 rounded-full font-bold shadow-sm`}>
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

            {/* Sales Analytics Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="border-none shadow-lg shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2.5rem] h-full">
                <CardHeader className="p-8 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-black">Sales Analytics</CardTitle>
                      <p className="text-sm text-gray-500 font-medium">Weekly revenue growth</p>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 p-2 rounded-xl">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 flex flex-col justify-center">
                  <div className="h-[250px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Tooltip 
                          contentStyle={{ 
                            borderRadius: '16px', 
                            border: 'none', 
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            backgroundColor: '#fff'
                          }} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#2563eb" 
                          strokeWidth={4}
                          fillOpacity={1} 
                          fill="url(#colorRevenue)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-8 space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-primary rounded-full" />
                        <span className="text-sm font-bold text-gray-600 dark:text-gray-400">Net Profit</span>
                      </div>
                      <span className="font-black text-gray-900 dark:text-white">₹4,20,000</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-purple-500 rounded-full" />
                        <span className="text-sm font-bold text-gray-600 dark:text-gray-400">Gross Sales</span>
                      </div>
                      <span className="font-black text-gray-900 dark:text-white">₹8,12,000</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Quick Actions Footer */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-4 pt-4"
          >
            <Button size="lg" className="rounded-2xl h-14 px-8 font-bold bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20">
              <Plus className="w-5 h-5 mr-2" /> Add New Product
            </Button>
            <Button size="lg" variant="outline" className="rounded-2xl h-14 px-8 font-bold border-gray-200 dark:border-gray-800">
              Manage Inventory
            </Button>
            <Button size="lg" variant="outline" className="rounded-2xl h-14 px-8 font-bold border-gray-200 dark:border-gray-800">
              Export Sales Data
            </Button>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
