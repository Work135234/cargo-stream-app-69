import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Package, MapPin, Clock, CheckCircle, Truck, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function UpdateStatus() {
  const { toast } = useToast();
  const [selectedDelivery, setSelectedDelivery] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [notes, setNotes] = useState("");

  const activeDeliveries = [
    {
      id: "DEL001",
      customer: "Tech Corp",
      from: "New York, NY",
      to: "Boston, MA",
      currentStatus: "In Transit",
      priority: "High"
    },
    {
      id: "DEL002", 
      customer: "John Smith",
      from: "Chicago, IL",
      to: "Detroit, MI",
      currentStatus: "Pending Pickup",
      priority: "Medium"
    },
    {
      id: "DEL003",
      customer: "Global Logistics",
      from: "Los Angeles, CA", 
      to: "San Diego, CA",
      currentStatus: "Ready to Pickup",
      priority: "Low"
    }
  ];

  const statusOptions = [
    "Scheduled",
    "Ready for Pickup",
    "Picked Up",
    "In Transit",
    "Out for Delivery",
    "Delivered",
    "Exception - Delayed",
    "Exception - Customer Not Available"
  ];

  const updateStatus = () => {
    if (!selectedDelivery || !newStatus) {
      toast({
        title: "Missing Information",
        description: "Please select a delivery and status",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Status Updated",
      description: `Delivery ${selectedDelivery} updated to ${newStatus}`,
    });
    
    setSelectedDelivery("");
    setNewStatus("");
    setNotes("");
  };

  const selectedDeliveryData = activeDeliveries.find(d => d.id === selectedDelivery);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "In Transit": return <Truck className="h-4 w-4" />;
      case "Pending Pickup": return <Clock className="h-4 w-4" />;
      case "Ready to Pickup": return <Package className="h-4 w-4" />;
      case "Delivered": return <CheckCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Update Delivery Status</h1>
        <p className="text-muted-foreground">
          Update the status of your assigned deliveries
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Select Delivery</CardTitle>
            <CardDescription>Choose a delivery to update</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeDeliveries.map((delivery) => (
              <div
                key={delivery.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedDelivery === delivery.id 
                    ? 'border-primary bg-primary/5' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => setSelectedDelivery(delivery.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">#{delivery.id}</h4>
                      <Badge variant="outline">
                        {getStatusIcon(delivery.currentStatus)}
                        <span className="ml-1">{delivery.currentStatus}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{delivery.customer}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      {delivery.from} → {delivery.to}
                    </div>
                  </div>
                  <Badge variant={delivery.priority === 'High' ? 'destructive' : 'secondary'}>
                    {delivery.priority}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Update Status</CardTitle>
            <CardDescription>Change the delivery status and add notes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedDeliveryData && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <h4 className="font-medium">{selectedDeliveryData.customer}</h4>
                <p className="text-sm text-muted-foreground">
                  Current Status: {selectedDeliveryData.currentStatus}
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="status">New Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Status Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any relevant notes about the status update..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>

            <Button 
              onClick={updateStatus}
              className="w-full"
              disabled={!selectedDelivery || !newStatus}
            >
              Update Status
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}