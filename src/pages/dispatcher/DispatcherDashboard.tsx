import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Package, 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Phone,
  Navigation,
  FileText,
  Calendar
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DispatcherDashboard() {
  const { toast } = useToast();
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null);
  
  // Mock data for dispatcher
  const dispatcherInfo = {
    name: "Mike Johnson",
    vehicle: "Truck - ABC-123",
    zone: "Northeast Region",
    shiftsCompleted: 247,
    rating: 4.8
  };

  const assignedDeliveries = [
    {
      id: "BK1247",
      customer: "John Smith",
      phone: "+1 555-123-4567",
      from: "123 Main St, New York, NY",
      to: "456 Oak Ave, Boston, MA",
      status: "Picked Up",
      priority: "Standard",
      estimatedTime: "3h 30m",
      notes: "Fragile items - handle with care",
      pickupTime: "2024-01-15 09:00",
      deliveryTime: "2024-01-15 14:30"
    },
    {
      id: "BK1248",
      customer: "Sarah Wilson", 
      phone: "+1 555-234-5678",
      from: "789 Pine St, New York, NY",
      to: "321 Elm St, Hartford, CT",
      status: "Ready for Pickup",
      priority: "Express",
      estimatedTime: "2h 45m",
      notes: "Business delivery - contact reception",
      pickupTime: "2024-01-15 11:00",
      deliveryTime: "2024-01-15 16:00"
    },
    {
      id: "BK1249",
      customer: "Tech Corp",
      phone: "+1 555-345-6789", 
      from: "654 Cedar Rd, New York, NY",
      to: "987 Maple Dr, Providence, RI",
      status: "Scheduled",
      priority: "Standard",
      estimatedTime: "4h 15m",
      notes: "Large shipment - multiple packages",
      pickupTime: "2024-01-15 13:00",
      deliveryTime: "2024-01-15 18:30"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "bg-success";
      case "Picked Up": return "bg-accent";
      case "Ready for Pickup": return "bg-warning";
      case "Scheduled": return "bg-muted-foreground";
      default: return "bg-muted";
    }
  };

  const getPriorityColor = (priority: string) => {
    return priority === "Express" ? "bg-destructive" : "bg-primary";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Delivered": return <CheckCircle className="h-4 w-4" />;
      case "Picked Up": return <Truck className="h-4 w-4" />;
      case "Ready for Pickup": return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const updateDeliveryStatus = (deliveryId: string, newStatus: string, notes?: string) => {
    toast({
      title: "Status Updated",
      description: `Delivery ${deliveryId} marked as ${newStatus}`,
    });
  };

  const StatusUpdateDialog = ({ delivery }: { delivery: any }) => {
    const [newStatus, setNewStatus] = useState(delivery.status);
    const [notes, setNotes] = useState("");

    return (
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Delivery Status</DialogTitle>
          <DialogDescription>
            Update the status for delivery #{delivery.id}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">New Status</Label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="Ready for Pickup">Ready for Pickup</SelectItem>
                <SelectItem value="Picked Up">Picked Up</SelectItem>
                <SelectItem value="In Transit">In Transit</SelectItem>
                <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Delivery Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about the delivery..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
          <Button 
            onClick={() => updateDeliveryStatus(delivery.id, newStatus, notes)}
            className="w-full"
          >
            Update Status
          </Button>
        </div>
      </DialogContent>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dispatcher Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {dispatcherInfo.name}
          </p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <Button variant="outline">
            <Navigation className="mr-2 h-4 w-4" />
            Open GPS
          </Button>
          <Button variant="outline">
            <Phone className="mr-2 h-4 w-4" />
            Call Support
          </Button>
        </div>
      </div>

      {/* Driver Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Deliveries</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignedDeliveries.length}</div>
            <p className="text-xs text-muted-foreground">Assigned to you</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vehicle</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{dispatcherInfo.vehicle}</div>
            <p className="text-xs text-muted-foreground">{dispatcherInfo.zone}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shifts</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dispatcherInfo.shiftsCompleted}</div>
            <p className="text-xs text-muted-foreground">Completed successfully</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dispatcherInfo.rating}/5</div>
            <p className="text-xs text-muted-foreground">Customer rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Assigned Deliveries */}
      <Card>
        <CardHeader>
          <CardTitle>Assigned Deliveries</CardTitle>
          <CardDescription>Manage your delivery schedule</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assignedDeliveries.map((delivery) => (
              <div
                key={delivery.id}
                className="border rounded-lg p-4 space-y-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Package className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">#{delivery.id}</p>
                        <Badge className={getStatusColor(delivery.status)}>
                          {getStatusIcon(delivery.status)}
                          <span className="ml-1">{delivery.status}</span>
                        </Badge>
                        <Badge className={getPriorityColor(delivery.priority)}>
                          {delivery.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{delivery.customer}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">ETA: {delivery.estimatedTime}</p>
                    <p className="text-xs text-muted-foreground">
                      Pickup: {delivery.pickupTime}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Pickup</p>
                        <p className="text-sm text-muted-foreground">{delivery.from}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-accent mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Delivery</p>
                        <p className="text-sm text-muted-foreground">{delivery.to}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{delivery.phone}</span>
                    </div>
                    {delivery.notes && (
                      <div className="flex items-start gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <p className="text-sm text-muted-foreground">{delivery.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        Update Status
                      </Button>
                    </DialogTrigger>
                    <StatusUpdateDialog delivery={delivery} />
                  </Dialog>
                  
                  <Button size="sm" variant="outline">
                    <Phone className="mr-1 h-3 w-3" />
                    Call Customer
                  </Button>
                  
                  <Button size="sm" variant="outline">
                    <Navigation className="mr-1 h-3 w-3" />
                    Navigate
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}