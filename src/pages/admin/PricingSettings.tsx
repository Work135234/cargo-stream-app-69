import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Truck, Train, Settings, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PricingSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    basePriceTruck: 25.00,
    basePriceTrain: 15.00,
    pricePerMile: 1.50,
    pricePerKg: 0.75,
    expressMultiplier: 1.5,
    bulkDiscount: 0.15,
    fuelSurcharge: 0.10,
    insuranceRate: 0.05
  });

  const saveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Pricing configuration has been updated successfully",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pricing Settings</h1>
          <p className="text-muted-foreground">
            Configure delivery pricing and rates
          </p>
        </div>
        <Button onClick={saveSettings}>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="base-rates" className="space-y-6">
        <TabsList>
          <TabsTrigger value="base-rates">Base Rates</TabsTrigger>
          <TabsTrigger value="modifiers">Modifiers</TabsTrigger>
          <TabsTrigger value="special-rates">Special Rates</TabsTrigger>
        </TabsList>

        <TabsContent value="base-rates" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Truck Delivery
                </CardTitle>
                <CardDescription>Base pricing for truck transportation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="basePriceTruck">Base Price ($)</Label>
                  <Input
                    id="basePriceTruck"
                    type="number"
                    value={settings.basePriceTruck}
                    onChange={(e) => setSettings({...settings, basePriceTruck: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pricePerMile">Price per Mile ($)</Label>
                  <Input
                    id="pricePerMile"
                    type="number"
                    step="0.01"
                    value={settings.pricePerMile}
                    onChange={(e) => setSettings({...settings, pricePerMile: parseFloat(e.target.value)})}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Train className="h-5 w-5" />
                  Train Freight
                </CardTitle>
                <CardDescription>Base pricing for rail transportation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="basePriceTrain">Base Price ($)</Label>
                  <Input
                    id="basePriceTrain"
                    type="number"
                    value={settings.basePriceTrain}
                    onChange={(e) => setSettings({...settings, basePriceTrain: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pricePerKg">Price per KG ($)</Label>
                  <Input
                    id="pricePerKg"
                    type="number"
                    step="0.01"
                    value={settings.pricePerKg}
                    onChange={(e) => setSettings({...settings, pricePerKg: parseFloat(e.target.value)})}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="modifiers" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Service Modifiers</CardTitle>
                <CardDescription>Multipliers for different service types</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="expressMultiplier">Express Delivery Multiplier</Label>
                  <Input
                    id="expressMultiplier"
                    type="number"
                    step="0.1"
                    value={settings.expressMultiplier}
                    onChange={(e) => setSettings({...settings, expressMultiplier: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bulkDiscount">Bulk Discount (%)</Label>
                  <Input
                    id="bulkDiscount"
                    type="number"
                    step="0.01"
                    value={settings.bulkDiscount * 100}
                    onChange={(e) => setSettings({...settings, bulkDiscount: parseFloat(e.target.value) / 100})}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Charges</CardTitle>
                <CardDescription>Extra fees and surcharges</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fuelSurcharge">Fuel Surcharge (%)</Label>
                  <Input
                    id="fuelSurcharge"
                    type="number"
                    step="0.01"
                    value={settings.fuelSurcharge * 100}
                    onChange={(e) => setSettings({...settings, fuelSurcharge: parseFloat(e.target.value) / 100})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insuranceRate">Insurance Rate (%)</Label>
                  <Input
                    id="insuranceRate"
                    type="number"
                    step="0.01"
                    value={settings.insuranceRate * 100}
                    onChange={(e) => setSettings({...settings, insuranceRate: parseFloat(e.target.value) / 100})}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="special-rates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Special Pricing Rules</CardTitle>
              <CardDescription>Configure special rates and promotions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Weekend Delivery</h4>
                  <p className="text-sm text-muted-foreground">Additional charge for weekend deliveries</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Same Day Delivery</h4>
                  <p className="text-sm text-muted-foreground">Premium pricing for same-day service</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Corporate Discounts</h4>
                  <p className="text-sm text-muted-foreground">Automatic discounts for corporate accounts</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}