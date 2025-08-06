import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link, useNavigate } from "react-router-dom";
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

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Mock data
  const stats = {
    totalBookings: 24,
    activeDeliveries: 3,
    completedDeliveries: 21,
    totalSpent: 2450.80
  };

  const recentBookings = [
    {
      id: "BK001",
      from: "New York, NY",
      to: "Boston, MA",
      status: "In Transit",
      date: "2024-01-15",
      amount: 150.00,
      progress: 75
    },
    {
      id: "BK002",
      from: "Chicago, IL",
      to: "Detroit, MI",
      status: "Delivered",
      date: "2024-01-14",
      amount: 120.00,
      progress: 100
    },
    {
      id: "BK003",
      from: "Los Angeles, CA",
      to: "San Diego, CA",
      status: "Pending",
      date: "2024-01-16",
      amount: 89.50,
      progress: 0
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "bg-success";
      case "In Transit": return "bg-accent";
      case "Pending": return "bg-warning";
      default: return "bg-muted";
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
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, John!</h1>
          <p className="text-muted-foreground">
            Track your shipments and manage your bookings
          </p>
        </div>
        <Button asChild className="mt-4 sm:mt-0">
          <Link to="/booking">
            <Plus className="mr-2 h-4 w-4" />
            New Booking
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deliveries</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeDeliveries}</div>
            <p className="text-xs text-muted-foreground">Currently in transit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedDeliveries}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">98.5%</span> success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">This year</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>Your latest shipment activities</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm" asChild>
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
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Package className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">#{booking.id}</p>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {booking.from} → {booking.to}
                    </div>
                    {booking.status === "In Transit" && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                          <span>Progress</span>
                          <span>{booking.progress}%</span>
                        </div>
                        <Progress value={booking.progress} className="h-1" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <p className="font-medium">${booking.amount.toFixed(2)}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(booking.date).toLocaleDateString()}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewBooking(booking.id)}
                    className="w-full"
                  >
                    <Eye className="mr-2 h-3 w-3" />
                    Track
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="mr-2 h-5 w-5 text-primary" />
              Create Booking
            </CardTitle>
            <CardDescription>
              Schedule a new delivery with instant pricing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleCreateBooking} className="w-full">
              Get Started
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5 text-accent" />
              Track Shipment
            </CardTitle>
            <CardDescription>
              Real-time tracking of your active deliveries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/tracking">Track Now</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5 text-warning" />
              Notifications
            </CardTitle>
            <CardDescription>
              Stay updated with delivery alerts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleMarkNotificationRead}
            >
              <AlertCircle className="mr-2 h-4 w-4" />
              Mark All Read (3)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}