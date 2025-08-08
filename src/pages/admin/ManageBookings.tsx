import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Package, Truck, Train, User, Edit, Trash2, UserCheck, Search, Filter } from "lucide-react";

export default function ManageBookings() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [assignedDriver, setAssignedDriver] = useState("");

  const bookings = [
    {
      id: "BK1247",
      customer: "John Smith",
      from: "New York, NY",
      to: "Boston, MA",
      status: "In Transit",
      amount: 150.00,
      driver: "Mike Johnson",
      mode: "truck",
      date: "2024-01-15"
    },
    {
      id: "BK1246",
      customer: "Sarah Wilson",
      from: "Chicago, IL",
      to: "Detroit, MI",
      status: "Pending",
      amount: 120.00,
      driver: "Unassigned",
      mode: "truck",
      date: "2024-01-14"
    },
    {
      id: "BK1245",
      customer: "Tech Corp",
      from: "Los Angeles, CA",
      to: "San Francisco, CA",
      status: "Delivered",
      amount: 200.00,
      driver: "Train Schedule A",
      mode: "train",
      date: "2024-01-13"
    }
  ];

  const drivers = [
    "Mike Johnson",
    "Sarah Davis",
    "Robert Brown",
    "Lisa Garcia",
    "Train Schedule A",
    "Train Schedule B"
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "bg-success";
      case "In Transit": return "bg-accent";
      case "Pending": return "bg-warning";
      default: return "bg-muted";
    }
  };

  const handleAssignDriver = (bookingId: string) => {
    if (assignedDriver) {
      toast({
        title: "Driver Assigned",
        description: `${assignedDriver} has been assigned to booking ${bookingId}`,
      });
      setSelectedBooking(null);
      setAssignedDriver("");
    }
  };

  const handleDeleteBooking = (bookingId: string) => {
    toast({
      title: "Booking Deleted",
      description: `Booking ${bookingId} has been deleted`,
      variant: "destructive"
    });
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || booking.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Bookings</h1>
        <p className="text-muted-foreground">
          View and manage all delivery bookings
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by booking ID or customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in transit">In Transit</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <Card>
        <CardHeader>
          <CardTitle>All Bookings ({filteredBookings.length})</CardTitle>
          <CardDescription>Manage delivery assignments and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
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
                        {booking.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{booking.customer}</p>
                    <p className="text-xs text-muted-foreground">{booking.from} → {booking.to}</p>
                  </div>
                </div>

                <div className="text-right space-y-2">
                  <p className="font-medium">${booking.amount.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">
                    Driver: {booking.driver}
                  </p>
                  <div className="flex gap-1">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedBooking(booking.id)}
                        >
                          <UserCheck className="h-3 w-3" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Assign Driver</DialogTitle>
                          <DialogDescription>
                            Assign a driver to booking #{booking.id}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="driver">Select Driver</Label>
                            <Select value={assignedDriver} onValueChange={setAssignedDriver}>
                              <SelectTrigger>
                                <SelectValue placeholder="Choose a driver" />
                              </SelectTrigger>
                              <SelectContent>
                                {drivers.map((driver) => (
                                  <SelectItem key={driver} value={driver}>
                                    {driver}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            onClick={() => handleAssignDriver(booking.id)}
                            disabled={!assignedDriver}
                          >
                            Assign Driver
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Button size="sm" variant="outline">
                      <Edit className="h-3 w-3" />
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteBooking(booking.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
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