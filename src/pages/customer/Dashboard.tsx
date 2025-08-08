import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Package,
  Truck,
  MapPin,
  Clock,
  Plus,
  TrendingUp,
  DollarSign,
  Calendar,
  Bell,
  Filter,
  Eye,
  AlertCircle
} from "lucide-react";

interface Booking {
  id: string;
  from: string;
  to: string;
  status: string;
  date: string;
  amount: number;
  progress: number;
}

interface Stats {
  totalBookings: number;
  activeDeliveries: number;
  completedDeliveries: number;
  totalSpent: number;
}

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalBookings: 0,
    activeDeliveries: 0,
    completedDeliveries: 0,
    totalSpent: 0
  });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, bookingsResponse] = await Promise.all([
        fetch('/api/bookings/stats', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }),
        fetch('/api/bookings/recent?limit=3', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
      ]);

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        setRecentBookings(bookingsData);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "bg-green-600 text-white";
      case "In Transit": return "bg-orange-500 text-white";
      case "Pending": return "bg-yellow-400 text-black";
      default: return "bg-gray-500 text-white";
    }
  };

  const handleViewBooking = (bookingId: string) => {
    navigate(`/tracking?id=${bookingId}`);
  };

  const handleCreateBooking = () => {
    navigate('/booking');
  };

  const handleMarkNotificationRead = () => {
    toast({
      title: "Notifications Cleared",
      description: "All notifications have been marked as read.",
    });
  };

  return (
    <div className="space-y-8 bg-[#18181b] min-h-screen px-2 sm:px-6 py-8">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-1">Welcome back, {user?.name || 'User'}!</h1>
          <p className="text-gray-400 text-lg">Track your shipments and manage your bookings</p>
        </div>
        <Button asChild className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
          <Link to="/booking">
            <Plus className="mr-2 h-5 w-5" />
            New Booking
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-[#23232b] border border-gray-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Package className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalBookings}</div>
            <p className="text-xs text-green-500 mt-1">+12% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-[#23232b] border border-gray-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deliveries</CardTitle>
            <Truck className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activeDeliveries}</div>
            <p className="text-xs text-gray-400 mt-1">Currently in transit</p>
          </CardContent>
        </Card>
        <Card className="bg-[#23232b] border border-gray-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.completedDeliveries}</div>
            <p className="text-xs text-green-500 mt-1">98.5% success rate</p>
          </CardContent>
        </Card>
        <Card className="bg-[#23232b] border border-gray-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${stats.totalSpent.toFixed(2)}</div>
            <p className="text-xs text-gray-400 mt-1">This year</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card className="bg-[#23232b] border border-gray-700 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Recent Bookings</CardTitle>
              <CardDescription className="text-gray-400">Your latest shipment activities</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm" asChild className="border-gray-600 text-gray-300">
                <Link to="/tracking">View All</Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-4 border border-gray-700 rounded-lg bg-[#18181b] hover:bg-[#23232b] transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-700 p-2 rounded-full">
                    <Package className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-lg">#{booking.id}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-400 mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {booking.from} → {booking.to}
                    </div>
                    {booking.status === "In Transit" && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                          <span>Progress</span>
                          <span>{booking.progress}%</span>
                        </div>
                        <Progress value={booking.progress} className="h-1 bg-gray-700" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right space-y-2 min-w-[110px]">
                  <p className="font-semibold text-lg">${booking.amount.toFixed(2)}</p>
                  <div className="flex items-center text-sm text-gray-400">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(booking.date).toLocaleDateString()}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewBooking(booking.id)}
                    className="w-full border-gray-600 text-gray-300"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Track
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-[#23232b] border border-gray-700 text-white hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center text-lg font-bold">
              <Plus className="mr-2 h-6 w-6 text-blue-600" />
              Create Booking
            </CardTitle>
            <CardDescription className="text-gray-400">
              Schedule a new delivery with instant pricing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleCreateBooking} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
              Get Started
            </Button>
          </CardContent>
        </Card>
        <Card className="bg-[#23232b] border border-gray-700 text-white hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center text-lg font-bold">
              <MapPin className="mr-2 h-6 w-6 text-orange-500" />
              Track Shipment
            </CardTitle>
            <CardDescription className="text-gray-400">
              Real-time tracking of your active deliveries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full border-gray-600 text-gray-300" asChild>
              <Link to="/tracking">Track Now</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="bg-[#23232b] border border-gray-700 text-white hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center text-lg font-bold">
              <Bell className="mr-2 h-6 w-6 text-yellow-400" />
              Notifications
            </CardTitle>
            <CardDescription className="text-gray-400">
              Stay updated with delivery alerts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full border-gray-600 text-gray-300"
              onClick={handleMarkNotificationRead}
            >
              <AlertCircle className="mr-2 h-5 w-5" />
              Mark All Read (3)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}