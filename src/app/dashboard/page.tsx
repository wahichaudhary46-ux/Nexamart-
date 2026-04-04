
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
  ChevronRight
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

const metrics = [
  { title: "Total Revenue", value: "₹12,42,500", trend: "+12.5%", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
  { title: "Local Products", value: "154", trend: "+4.2%", icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
  { title: "Active Orders", value: "28", trend: "-2.4%", icon: ShoppingBag, color: "text-amber-600", bg: "bg-amber-50" },
  { title: "Store Views", value: "45.2K", trend: "+18.2%", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Image
                src="https://i.ibb.co/rfKvSNKL/1000128270-1.png"
                alt="NexaMart"
                width={140}
                height={40}
                className="object-contain"
                unoptimized
              />
              <nav className="hidden md:flex items-center gap-6">
                <button className="text-sm font-bold text-primary flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </button>
                <button className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Products</button>
                <button className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Orders</button>
                <button className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Customers</button>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center relative">
                <Search className="absolute left-3 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="bg-gray-100 border-none rounded-lg pl-9 pr-4 h-9 w-48 lg:w-64 text-sm focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5 text-gray-500" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 hover:opacity-80 transition-opacity ml-2">
                    <Avatar className="h-8 w-8 border border-gray-200">
                      <AvatarImage src={user?.photoURL || ""} />
                      <AvatarFallback className="bg-primary text-white text-xs">
                        {userProfile.fullName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-sm font-bold">{userProfile.fullName}</p>
                    <p className="text-xs text-gray-500 truncate">{userProfile.email}</p>
                  </div>
                  <DropdownMenuItem className="cursor-pointer">Profile Settings</DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">Store Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-rose-500 font-medium">
                    <LogOut className="w-4 h-4 mr-2" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Store Dashboard</h1>
            <p className="text-gray-500 text-sm">Welcome back, {userProfile.fullName}. Here is your store summary.</p>
          </div>
          <Button className="rounded-lg font-bold bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" /> Add New Product
          </Button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric) => (
            <Card key={metric.title} className="border-gray-200 shadow-sm rounded-xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className={`${metric.bg} p-2 rounded-lg`}>
                    <metric.icon className={`w-5 h-5 ${metric.color}`} />
                  </div>
                  <span className={`text-xs font-bold ${metric.trend.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {metric.trend}
                  </span>
                </div>
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">{metric.title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</h3>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Orders Table */}
        <Card className="border-gray-200 shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 px-6 py-4">
            <CardTitle className="text-lg font-bold">Recent Orders</CardTitle>
            <Button variant="ghost" size="sm" className="text-primary font-bold hover:bg-primary/5">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-bold text-gray-600 text-xs uppercase tracking-wider pl-6">Order ID</TableHead>
                  <TableHead className="font-bold text-gray-600 text-xs uppercase tracking-wider">Customer</TableHead>
                  <TableHead className="font-bold text-gray-600 text-xs uppercase tracking-wider">Date</TableHead>
                  <TableHead className="font-bold text-gray-600 text-xs uppercase tracking-wider text-right">Amount</TableHead>
                  <TableHead className="font-bold text-gray-600 text-xs uppercase tracking-wider pr-6 text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell className="font-bold text-gray-900 pl-6">{order.id}</TableCell>
                    <TableCell className="text-gray-600 font-medium">{order.customer}</TableCell>
                    <TableCell className="text-gray-500">{order.date}</TableCell>
                    <TableCell className="font-bold text-gray-900 text-right">{order.amount}</TableCell>
                    <TableCell className="pr-6 text-right">
                      <Badge variant="outline" className={`
                        font-bold px-3 py-1 rounded-full border-none
                        ${order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700' : 
                          order.status === 'Pending' ? 'bg-amber-50 text-amber-700' :
                          order.status === 'Processing' ? 'bg-blue-50 text-blue-700' :
                          order.status === 'Shipped' ? 'bg-purple-50 text-purple-700' :
                          'bg-rose-50 text-rose-700'}
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
      </main>
    </div>
  );
}
