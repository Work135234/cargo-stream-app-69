import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Plus, Clock, AlertTriangle, CheckCircle, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Notes() {
  const { toast } = useToast();
  const [newNote, setNewNote] = useState("");
  const [selectedDelivery, setSelectedDelivery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const deliveryNotes = [
    {
      id: "1",
      deliveryId: "DEL001",
      customer: "Tech Corp",
      note: "Customer requested delivery at loading dock. Building has security - need to check in at front desk first.",
      timestamp: "2024-01-15 10:30",
      type: "delivery_instruction",
      author: "Mike Rodriguez"
    },
    {
      id: "2", 
      deliveryId: "DEL002",
      customer: "John Smith",
      note: "Package delivered successfully. Customer was very satisfied with the service.",
      timestamp: "2024-01-15 14:45",
      type: "delivery_complete",
      author: "Mike Rodriguez"
    },
    {
      id: "3",
      deliveryId: "DEL001",
      customer: "Tech Corp", 
      note: "Traffic delay on I-95. ETA pushed back by 30 minutes. Customer notified.",
      timestamp: "2024-01-15 12:15",
      type: "delay_alert",
      author: "Mike Rodriguez"
    },
    {
      id: "4",
      deliveryId: "DEL003",
      customer: "Global Logistics",
      note: "Multiple packages confirmed loaded. All items properly secured for transport.",
      timestamp: "2024-01-15 09:00",
      type: "pickup_complete",
      author: "Mike Rodriguez"
    }
  ];

  const activeDeliveries = [
    { id: "DEL001", customer: "Tech Corp" },
    { id: "DEL002", customer: "John Smith" }, 
    { id: "DEL003", customer: "Global Logistics" },
    { id: "DEL004", customer: "Metro Solutions" }
  ];

  const addNote = () => {
    if (!newNote.trim() || !selectedDelivery) {
      toast({
        title: "Missing Information",
        description: "Please select a delivery and enter a note",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Note Added",
      description: `Note added to delivery ${selectedDelivery}`,
    });
    
    setNewNote("");
    setSelectedDelivery("");
  };

  const getNoteTypeIcon = (type: string) => {
    switch (type) {
      case "delivery_complete": return <CheckCircle className="h-4 w-4 text-success" />;
      case "delay_alert": return <AlertTriangle className="h-4 w-4 text-warning" />;
      default: return <FileText className="h-4 w-4 text-primary" />;
    }
  };

  const getNoteTypeBadge = (type: string) => {
    switch (type) {
      case "delivery_complete": return "Complete";
      case "delay_alert": return "Delay";
      case "pickup_complete": return "Pickup";
      default: return "Instruction";
    }
  };

  const filteredNotes = deliveryNotes.filter(note =>
    note.deliveryId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.note.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Delivery Notes</h1>
        <p className="text-muted-foreground">
          Add and manage notes for your deliveries
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Note
            </CardTitle>
            <CardDescription>Create a note for a delivery</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="delivery">Select Delivery</Label>
              <Select value={selectedDelivery} onValueChange={setSelectedDelivery}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a delivery" />
                </SelectTrigger>
                <SelectContent>
                  {activeDeliveries.map((delivery) => (
                    <SelectItem key={delivery.id} value={delivery.id}>
                      {delivery.id} - {delivery.customer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Note</Label>
              <Textarea
                id="note"
                placeholder="Enter your note here..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={4}
              />
            </div>

            <Button onClick={addNote} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Note
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Notes
            </CardTitle>
            <CardDescription>Your latest delivery notes and updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredNotes.map((note) => (
                <div key={note.id} className="p-3 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">#{note.deliveryId}</h4>
                      <Badge variant="outline" className="text-xs">
                        {getNoteTypeIcon(note.type)}
                        <span className="ml-1">{getNoteTypeBadge(note.type)}</span>
                      </Badge>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {note.timestamp}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{note.customer}</p>
                  <p className="text-sm">{note.note}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}