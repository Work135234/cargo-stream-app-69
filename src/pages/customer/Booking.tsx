import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, MapPin, Package, Truck, Train, Calculator } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export default function Booking() {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    pickupAddress: "",
    destinationAddress: "",
    transportMode: "",
    productType: "",
    weight: "",
    dimensions: "",
    specialInstructions: "",
    contactName: "",
    contactPhone: ""
  });
  const [estimatedFare, setEstimatedFare] = useState<number | null>(null);
  const [calculating, setCalculating] = useState(false);

  const calculateFare = async () => {
    if (!formData.weight || !formData.transportMode) {
      toast({
        title: "Missing Information",
        description: "Please fill in weight and transport mode to calculate fare.",
        variant: "destructive"
      });
      return;
    }

    setCalculating(true);

    try {
      const response = await fetch('/api/bookings/calculate-fare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          distance: 150, // This should be calculated based on pickup and destination
          weight: parseFloat(formData.weight),
          transportMode: formData.transportMode
        })
      });

      if (response.ok) {
        const data = await response.json();
        setEstimatedFare(data.fare);
      } else {
        toast({
          title: "Error",
          description: "Failed to calculate fare",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to calculate fare",
        variant: "destructive"
      });
    } finally {
      setCalculating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!estimatedFare) {
      toast({
        title: "Calculate Fare First",
        description: "Please calculate the estimated fare before booking.",
        variant: "destructive"
      });
      return;
    }

    try {
      const bookingData = {
        pickupAddress: formData.pickupAddress,
        deliveryAddress: formData.destinationAddress,
        transportMode: formData.transportMode,
        productType: formData.productType,
        weight: parseFloat(formData.weight),
        dimensions: formData.dimensions,
        pickupDate: date,
        specialInstructions: formData.specialInstructions,
        contactName: formData.contactName,
        contactPhone: formData.contactPhone,
        fare: estimatedFare
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        const booking = await response.json();
        toast({
          title: "Booking Created Successfully!",
          description: `Your booking has been created. Booking ID: ${booking._id}`,
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Error",
          description: "Failed to create booking",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create booking",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Booking</h1>
        <p className="text-muted-foreground">Fill in the details for your shipment</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Pickup & Destination */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Pickup & Destination
                </CardTitle>
                <CardDescription>Specify pickup and delivery locations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pickup">Pickup Address</Label>
                  <Input
                    id="pickup"
                    placeholder="Enter pickup address"
                    value={formData.pickupAddress}
                    onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination Address</Label>
                  <Input
                    id="destination"
                    placeholder="Enter destination address"
                    value={formData.destinationAddress}
                    onChange={(e) => setFormData({ ...formData, destinationAddress: e.target.value })}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Shipment Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  Shipment Details
                </CardTitle>
                <CardDescription>Describe your cargo and requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="transport">Transport Mode</Label>
                    <Select
                      value={formData.transportMode}
                      onValueChange={(value) => setFormData({ ...formData, transportMode: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select transport mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="truck">
                          <div className="flex items-center">
                            <Truck className="mr-2 h-4 w-4" />
                            Truck Delivery
                          </div>
                        </SelectItem>
                        <SelectItem value="train">
                          <div className="flex items-center">
                            <Train className="mr-2 h-4 w-4" />
                            Train Freight
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product">Product Type</Label>
                    <Select
                      value={formData.productType}
                      onValueChange={(value) => setFormData({ ...formData, productType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select product type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Cargo</SelectItem>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="food">Food & Beverages</SelectItem>
                        <SelectItem value="furniture">Furniture</SelectItem>
                        <SelectItem value="chemicals">Chemicals</SelectItem>
                        <SelectItem value="fragile">Fragile Items</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="Enter weight in kg"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dimensions">Dimensions (L×W×H cm)</Label>
                    <Input
                      id="dimensions"
                      placeholder="e.g., 100×50×30"
                      value={formData.dimensions}
                      onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Preferred Pickup Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Select pickup date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructions">Special Instructions (Optional)</Label>
                  <Textarea
                    id="instructions"
                    placeholder="Any special handling requirements or delivery instructions"
                    value={formData.specialInstructions}
                    onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Delivery contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Contact Name</Label>
                    <Input
                      id="contactName"
                      placeholder="Delivery contact person"
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      id="contactPhone"
                      type="tel"
                      placeholder="Phone number"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Fare Calculator & Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="mr-2 h-5 w-5" />
                  Fare Calculator
                </CardTitle>
                <CardDescription>Get instant pricing estimates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  type="button"
                  onClick={calculateFare}
                  className="w-full"
                  disabled={calculating}
                >
                  {calculating ? "Calculating..." : "Calculate Fare"}
                </Button>

                {estimatedFare && (
                  <div className="p-4 bg-primary/5 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Base Fare:</span>
                      <span>$50.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Distance (150km):</span>
                      <span>${(150 * (formData.transportMode === "truck" ? 2.5 : 1.8)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Weight ({formData.weight}kg):</span>
                      <span>${(parseFloat(formData.weight) * 0.15).toFixed(2)}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total:</span>
                      <span className="text-primary">${estimatedFare.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Transport:</span>
                  <span className="capitalize">{formData.transportMode || "Not selected"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Product:</span>
                  <span>{formData.productType || "Not selected"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Weight:</span>
                  <span>{formData.weight ? `${formData.weight}kg` : "Not specified"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pickup Date:</span>
                  <span>{date ? format(date, "PP") : "Not selected"}</span>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" size="lg">
              Confirm Booking
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}