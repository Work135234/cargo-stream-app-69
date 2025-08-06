import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  MapPin, 
  Clock, 
  Package, 
  Truck, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  Phone,
  User
} from "lucide-react";

export default function Tracking() {
  const [trackingId, setTrackingId] = useState("");
  
  // Mock data for tracking
  const trackingData = {
    id: "BK001",
    status: "In Transit",
    progress: 65,
    from: "New York, NY",
    to: "Boston, MA",
    estimatedDelivery: "2024-01-16 14:30",
    driver: "Mike Johnson",
    driverPhone: "+1 555-123-4567",
    vehicle: "Truck - License: ABC-123",
    timeline: [
      {
        title: "Order Placed",
        description: "Booking confirmed and payment processed",
        time: "2024-01-15 09:00",
        status: "completed"
      },
      {
        title: "Package Picked Up",
        description: "Driver collected package from pickup location",
        time: "2024-01-15 11:30",
        status: "completed"
      },
      {
        title: "In Transit",
        description: "Package is on the way to destination",
        time: "2024-01-15 12:15",
        status: "current"
      },
      {
        title: "Out for Delivery",
        description: "Package is out for final delivery",
        time: "2024-01-16 10:00",
        status: "pending"
      },
      {
        title: "Delivered",
        description: "Package delivered to recipient",
        time: "2024-01-16 14:30",
        status: "pending"
      }
    ]
  };

  const allBookings = [
    {
      id: "BK001",
      from: "New York, NY",
      to: "Boston, MA",
      status: "In Transit",
      date: "2024-01-15",
      progress: 65
    },
    {
      id: "BK002",
      from: "Chicago, IL", 
      to: "Detroit, MI",
      status: "Delivered",
      date: "2024-01-14",
      progress: 100
    },
    {
      id: "BK003",
      from: "Los Angeles, CA",
      to: "San Diego, CA", 
      status: "Pending",
      date: "2024-01-16",
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

  const getTimelineIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-success" />;
      case "current": return <Clock className="h-4 w-4 text-accent" />;
      default: return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Track Your Shipments</h1>
        <p className="text-muted-foreground">
          Monitor your deliveries in real-time
        </p>
      </div>

      <Tabs defaultValue="track" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="track">Track by ID</TabsTrigger>
          <TabsTrigger value="all">All Bookings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="track" className="space-y-6">
          {/* Tracking Search */}
          <Card>
            <CardHeader>
              <CardTitle>Track Your Package</CardTitle>
              <CardDescription>Enter your booking ID to track your shipment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter tracking ID (e.g., BK001)"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                />
                <Button>
                  <Search className="mr-2 h-4 w-4" />
                  Track
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tracking Results */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Current Status */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <Package className="mr-2 h-5 w-5" />
                        Booking #{trackingData.id}
                      </CardTitle>
                      <CardDescription>
                        {trackingData.from} → {trackingData.to}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(trackingData.status)}>
                      {trackingData.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{trackingData.progress}%</span>
                    </div>
                    <Progress value={trackingData.progress} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Estimated Delivery</p>
                        <p className="text-muted-foreground">{trackingData.estimatedDelivery}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Truck className="mr-2 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Vehicle</p>
                        <p className="text-muted-foreground">{trackingData.vehicle}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Timeline</CardTitle>
                  <CardDescription>Track your package journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trackingData.timeline.map((event, index) => (
                      <div key={index} className="flex space-x-4">
                        <div className="flex flex-col items-center">
                          {getTimelineIcon(event.status)}
                          {index < trackingData.timeline.length - 1 && (
                            <div className="w-px h-8 bg-border mt-2" />
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{event.title}</p>
                            <p className="text-sm text-muted-foreground">{event.time}</p>
                          </div>
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Driver Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Driver Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{trackingData.driver}</p>
                      <p className="text-sm text-muted-foreground">Delivery Driver</p>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <Phone className="mr-2 h-4 w-4" />
                    Call Driver
                  </Button>
                  
                  <div className="text-sm text-muted-foreground">
                    <p>Phone: {trackingData.driverPhone}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full">
                    Contact Support
                  </Button>
                  <Button variant="outline" className="w-full">
                    Report Issue
                  </Button>
                  <div className="text-xs text-muted-foreground">
                    Support available 24/7
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="all" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Bookings</CardTitle>
              <CardDescription>Complete list of your shipments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allBookings.map((booking) => (
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
                            <Progress value={booking.progress} className="h-1 w-48" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(booking.date).toLocaleDateString()}
                      </div>
                      <Button variant="outline" size="sm" className="mt-2">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}