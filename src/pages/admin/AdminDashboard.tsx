import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import {
  Package,
  Truck,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  Train
} from "lucide-react";

export default function AdminDashboard() {
  // Mock data for admin dashboard
  const stats = {
    totalBookings: 1247,
    activeDeliveries: 89,
    totalUsers: 456,
    totalRevenue: 125480.50,
    monthlyGrowth: 12.5,
    completionRate: 96.8,
    averageDeliveryTime: 2.3
  };

  const transportStats = {
    truck: { count: 756, percentage: 60.6 },
    train: { count: 491, percentage: 39.4 }
  };

  const recentBookings = [
    {
      id: "BK1247",
      customer: "John Smith",
      from: "New York, NY",
      to: "Boston, MA",
      status: "In Transit",
      amount: 150.00,
      driver: "Mike Johnson",
      mode: "truck"
    },
    {
      id: "BK1246",
      customer: "Sarah Wilson",
      from: "Chicago, IL",
      to: "Detroit, MI",
      status: "Pending",
      amount: 120.00,
      driver: "Unassigned",
      mode: "truck"
    },
    {
      id: "BK1245",
      customer: "Tech Corp",
      from: "Los Angeles, CA",
      to: "San Francisco, CA",
      status: "Delivered",
      amount: 200.00,
      driver: "Train Schedule A",
      mode: "train"
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Delivered": return <CheckCircle className="h-4 w-4" />;
      case "In Transit": return <Clock className="h-4 w-4" />;
      case "Pending": return <AlertTriangle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your delivery platform operations
          </p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <Button variant="outline">Export Report</Button>
          <Button>Manage Settings</Button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{stats.monthlyGrowth}%
              </span>
              from last month
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
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Transport Mode Distribution</CardTitle>
            <CardDescription>Breakdown by delivery method</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Truck className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-sm font-medium">Truck Delivery</span>
                </div>
                <span className="text-sm text-muted-foreground">{transportStats.truck.percentage}%</span>
              </div>
              <Progress value={transportStats.truck.percentage} className="h-2" />
              <p className="text-xs text-muted-foreground">{transportStats.truck.count} deliveries</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Train className="h-4 w-4 mr-2 text-accent" />
                  <span className="text-sm font-medium">Train Freight</span>
                </div>
                <span className="text-sm text-muted-foreground">{transportStats.train.percentage}%</span>
              </div>
              <Progress value={transportStats.train.percentage} className="h-2" />
              <p className="text-xs text-muted-foreground">{transportStats.train.count} deliveries</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Key operational indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Completion Rate</span>
                <span className="text-sm text-muted-foreground">{stats.completionRate}%</span>
              </div>
              <Progress value={stats.completionRate} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Avg. Delivery Time</span>
                <span className="text-sm text-muted-foreground">{stats.averageDeliveryTime} days</span>
              </div>
              <div className="text-xs text-muted-foreground">
                <span className="text-success">-0.2 days</span> vs last month
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Administrative tools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" variant="outline" asChild>
              <Link to="/admin/users">
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Link>
            </Button>
            <Button className="w-full" variant="outline" asChild>
              <Link to="/admin/bookings">
                <Package className="mr-2 h-4 w-4" />
                View All Bookings
              </Link>
            </Button>
            <Button className="w-full" variant="outline">
              <DollarSign className="mr-2 h-4 w-4" />
              Pricing Configuration
            </Button>
            <Button className="w-full" variant="outline" asChild>
              <Link to="/admin/reports">
                <TrendingUp className="mr-2 h-4 w-4" />
                Generate Reports
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>Latest delivery requests and assignments</CardDescription>
            </div>
            <Button variant="outline" asChild>
              <Link to="/admin/bookings">View All Bookings</Link>
            </Button>
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
                    {booking.mode === "truck" ?
                      <Truck className="h-4 w-4 text-primary" /> :
                      <Train className="h-4 w-4 text-primary" />
                    }
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">#{booking.id}</p>
                      <Badge className={getStatusColor(booking.status)}>
                        {getStatusIcon(booking.status)}
                        <span className="ml-1">{booking.status}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{booking.customer}</p>
                    <p className="text-xs text-muted-foreground">{booking.from} → {booking.to}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">${booking.amount.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">
                    Driver: {booking.driver}
                  </p>
                  <div className="flex gap-1 mt-1">
                    <Button size="sm" variant="outline">Edit</Button>
                    <Button size="sm" variant="outline">Assign</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}