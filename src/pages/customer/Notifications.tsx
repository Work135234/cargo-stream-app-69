import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Package, Truck, CheckCircle, Clock, Trash2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Notifications() {
  const { toast } = useToast();

  const notifications = [
    {
      id: "1",
      type: "delivery_update",
      title: "Package Delivered",
      message: "Your package #BK001 has been delivered to Boston, MA",
      time: "2 hours ago",
      read: false,
      icon: CheckCircle,
      color: "text-success"
    },
    {
      id: "2", 
      type: "pickup",
      title: "Package Picked Up",
      message: "Your package #BK002 has been picked up from Chicago, IL",
      time: "4 hours ago",
      read: false,
      icon: Truck,
      color: "text-accent"
    },
    {
      id: "3",
      type: "booking_confirmed",
      title: "Booking Confirmed",
      message: "Your booking #BK003 has been confirmed and scheduled",
      time: "1 day ago",
      read: true,
      icon: Package,
      color: "text-primary"
    },
    {
      id: "4",
      type: "delay",
      title: "Delivery Delayed",
      message: "Package #BK004 delivery delayed due to weather conditions",
      time: "2 days ago",
      read: true,
      icon: Clock,
      color: "text-warning"
    }
  ];

  const markAsRead = (id: string) => {
    toast({
      title: "Notification Read",
      description: "Notification marked as read",
    });
  };

  const markAllAsRead = () => {
    toast({
      title: "All Notifications Read",
      description: "All notifications have been marked as read",
    });
  };

  const deleteNotification = (id: string) => {
    toast({
      title: "Notification Deleted",
      description: "Notification has been removed",
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with your delivery activities
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">{unreadCount} unread</Badge>
          <Button variant="outline" onClick={markAllAsRead}>
            <Check className="mr-2 h-4 w-4" />
            Mark All Read
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Recent Notifications
          </CardTitle>
          <CardDescription>Your latest delivery updates and alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification) => {
              const IconComponent = notification.icon;
              return (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 p-4 rounded-lg border ${
                    !notification.read ? 'bg-muted/30 border-primary/20' : 'bg-background'
                  }`}
                >
                  <div className={`p-2 rounded-full bg-muted ${notification.color}`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{notification.title}</h4>
                      {!notification.read && (
                        <Badge variant="secondary" className="text-xs">New</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                  <div className="flex gap-1">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}