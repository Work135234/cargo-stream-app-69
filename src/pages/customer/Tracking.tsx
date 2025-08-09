import { useState, useEffect } from "react";
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

function Tracking() {
  const [trackingId, setTrackingId] = useState("");
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/customer/bookings', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const result = await response.json();
        if (result.success) {
          setBookings(result.bookings || []);
        } else {
          setError(result.message || 'Failed to fetch bookings');
        }
      } catch (err) {
        setError('Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [token]);

  const handleTrack = () => {
    const found = bookings.find(b => b._id === trackingId);
    setSelectedBooking(found || null);
  };

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
        <p className="text-muted-foreground">Monitor your deliveries in real-time</p>
      </div>
      <Tabs defaultValue="track" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="track">Track by ID</TabsTrigger>
          <TabsTrigger value="all">All Bookings</TabsTrigger>
        </TabsList>
        <TabsContent value="track" className="space-y-6">
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
                <Button onClick={handleTrack} disabled={loading}>
                  <Search className="mr-2 h-4 w-4" />
                  Track
                </Button>
              </div>
            </CardContent>
          </Card>
          {selectedBooking ? (
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          <Package className="mr-2 h-5 w-5" />
                          Booking #{selectedBooking._id}
                        </CardTitle>
                        <CardDescription>
                          {selectedBooking.pickupAddress} → {selectedBooking.deliveryAddress}
                        </CardDescription>
                      </div>
                      <Badge>{selectedBooking.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Fare</span>
                        <span>${selectedBooking.fare}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Distance</span>
                        <span>{selectedBooking.distance} km</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {/* Add more details/timeline if available */}
              </div>
              {/* Dispatcher Info */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Dispatcher Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedBooking.dispatcher ? (
                      <div>
                        <div className="font-medium">{selectedBooking.dispatcher.name}</div>
                        <div className="text-sm text-muted-foreground">{selectedBooking.dispatcher.email}</div>
                      </div>
                    ) : (
                      <div className="text-muted-foreground">No dispatcher assigned yet.</div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">No booking found for this ID.</div>
          )}
        </TabsContent>
        <TabsContent value="all" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Bookings</CardTitle>
              <CardDescription>Complete list of your shipments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Package className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">#{booking._id}</p>
                          <Badge>{booking.status}</Badge>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {booking.pickupAddress} → {booking.deliveryAddress}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </div>
                      <Button variant="outline" size="sm" className="mt-2" onClick={() => { setTrackingId(booking._id); handleTrack(); }}>
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
      {error && <div className="text-red-500 text-center">{error}</div>}
    </div>
  );
}

export default Tracking;