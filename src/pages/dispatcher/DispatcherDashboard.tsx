import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Package,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Truck,
  Route,
  FileText,
  Calendar
} from "lucide-react";

export default function DispatcherDashboard() {
  const { toast } = useToast();
  
  // Mock data for dispatcher
  const stats = {
    assignedDeliveries: 8,
    completedToday: 3,
    pendingPickups: 2,
    inTransit: 3
  };

  const assignedDeliveries = [
    {
      id: "DEL001",
      customerName: "Tech Corp",
      from: "New York, NY",
      to: "Boston, MA",
      status: "In Transit",
      priority: "High",
      estimatedTime: "2 hours",
      distance: "215 miles",
      notes: "Fragile items - handle with care"
    },
    {
      id: "DEL002",
      customerName: "John Smith",
      from: "Chicago, IL",
      to: "Detroit, MI",
      status: "Pending Pickup",
      priority: "Medium",
      estimatedTime: "4 hours",
      distance: "280 miles",
      notes: "Customer requested morning delivery"
    },
    {
      id: "DEL003",
      customerName: "Global Logistics",
      from: "Los Angeles, CA",
      to: "San Diego, CA",
      status: "Ready to Pickup",
      priority: "Low",
      estimatedTime: "3 hours",
      distance: "120 miles",
      notes: "Multiple packages"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Transit": return "accent";
      case "Pending Pickup": return "warning";
      case "Ready to Pickup": return "success";
      case "Completed": return "muted";
      default: return "secondary";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "destructive";
      case "Medium": return "accent";
      case "Low": return "success";
      default: return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "In Transit": return <Truck className="h-4 w-4" />;
      case "Pending Pickup": return <Clock className="h-4 w-4" />;
      case "Ready to Pickup": return <Package className="h-4 w-4" />;
      case "Completed": return <CheckCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const updateDeliveryStatus = (deliveryId: string, newStatus: string) => {
    toast({
      title: "Status Updated",
      description: `Delivery ${deliveryId} status changed to ${newStatus}`,
    });
  };

  const addNote = (deliveryId: string) => {
    toast({
      title: "Note Added",
      description: `Note added to delivery ${deliveryId}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dispatcher Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your assigned deliveries and update statuses
          </p>
        </div>
        <Button>
          <Route className="mr-2 h-4 w-4" />
          Optimize Routes
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Deliveries</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.assignedDeliveries}</div>
            <p className="text-xs text-muted-foreground">Active assignments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedToday}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">+2</span> from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Pickups</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingPickups}</div>
            <p className="text-xs text-muted-foreground">Awaiting collection</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inTransit}</div>
            <p className="text-xs text-muted-foreground">Currently delivering</p>
          </CardContent>
        </Card>
      </div>

      {/* Assigned Deliveries */}
      <Card>
        <CardHeader>
          <CardTitle>Your Assigned Deliveries</CardTitle>
          <CardDescription>Manage and update your delivery assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assignedDeliveries.map((delivery) => (
              <div
                key={delivery.id}
                className="p-4 border rounded-lg space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">#{delivery.id}</h3>
                      <Badge 
                        variant="secondary" 
                        className={`bg-${getStatusColor(delivery.status)}/10 text-${getStatusColor(delivery.status)}`}
                      >
                        {getStatusIcon(delivery.status)}
                        <span className="ml-1">{delivery.status}</span>
                      </Badge>
                      <Badge 
                        variant="outline"
                        className={`border-${getPriorityColor(delivery.priority)} text-${getPriorityColor(delivery.priority)}`}
                      >
                        {delivery.priority} Priority
                      </Badge>
                    </div>
                    <p className="font-medium">{delivery.customerName}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      {delivery.from} → {delivery.to}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                        Est. Time: {delivery.estimatedTime}
                      </div>
                      <div className="flex items-center">
                        <Route className="h-3 w-3 mr-1 text-muted-foreground" />
                        Distance: {delivery.distance}
                      </div>
                    </div>
                  </div>
                </div>

                {delivery.notes && (
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="flex items-start">
                      <FileText className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                      <p className="text-sm">{delivery.notes}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => updateDeliveryStatus(delivery.id, "In Transit")}
                  >
                    Update Status
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => addNote(delivery.id)}
                  >
                    <FileText className="mr-1 h-3 w-3" />
                    Add Note
                  </Button>
                  <Button size="sm" variant="outline">
                    <MapPin className="mr-1 h-3 w-3" />
                    View Route
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
              <Clock className="mr-2 h-5 w-5 text-accent" />
              Update Status
            </CardTitle>
            <CardDescription>
              Quickly update delivery status and location
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              Update Current Delivery
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-primary" />
              Add Notes
            </CardTitle>
            <CardDescription>
              Add delivery notes and customer feedback
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Add Note
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-success" />
              View Schedule
            </CardTitle>
            <CardDescription>
              Check today's delivery schedule
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Open Schedule
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}