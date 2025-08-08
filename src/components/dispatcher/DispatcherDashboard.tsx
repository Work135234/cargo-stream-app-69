import React, { useState, useEffect } from 'react';
import { MapPin, Truck, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '../../contexts/AuthContext';

interface Delivery {
  _id: string;
  pickupAddress: string;
  deliveryAddress: string;
  distance: number;
  weight: number;
  modeOfTransport: string;
  fare: number;
  status: string;
  customer: {
    name: string;
    email: string;
  };
  createdAt: string;
}

const DispatcherDashboard: React.FC = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { token, user } = useAuth();

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        ...(statusFilter && { status: statusFilter })
      });

      const response = await fetch(`http://localhost:5000/api/bookings/my?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        setDeliveries(result.bookings);
      } else {
        setError(result.message || 'Failed to fetch deliveries');
      }
    } catch (err) {
      setError('Failed to fetch deliveries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, [statusFilter]);

  const updateDeliveryStatus = async (deliveryId: string, newStatus: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/bookings/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookingId: deliveryId,
          status: newStatus
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess('Delivery status updated successfully!');
        fetchDeliveries();
      } else {
        setError(result.message || 'Failed to update delivery status');
      }
    } catch (err) {
      setError('Failed to update delivery status');
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Scheduled': 'bg-blue-100 text-blue-800',
      'In Transit': 'bg-orange-100 text-orange-800',
      'Delivered': 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock className="h-4 w-4" />;
      case 'Scheduled':
        return <Truck className="h-4 w-4" />;
      case 'In Transit':
        return <AlertCircle className="h-4 w-4" />;
      case 'Delivered':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getNextStatus = (currentStatus: string) => {
    const statusFlow = {
      'Pending': 'Scheduled',
      'Scheduled': 'In Transit',
      'In Transit': 'Delivered'
    };
    return statusFlow[currentStatus as keyof typeof statusFlow];
  };

  const statusCounts = deliveries.reduce((acc, delivery) => {
    acc[delivery.status] = (acc[delivery.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="mr-2 h-5 w-5" />
            Dispatcher Dashboard
          </CardTitle>
          <CardDescription>
            Manage your assigned deliveries and update their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* Status Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {Object.entries(statusCounts).map(([status, count]) => (
              <Card key={status}>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    {getStatusIcon(status)}
                    <div className="ml-3">
                      <p className="text-sm text-gray-600 capitalize">{status}</p>
                      <p className="text-2xl font-bold">{count}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="In Transit">In Transit</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Deliveries List */}
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {deliveries.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">No deliveries found</p>
                  </CardContent>
                </Card>
              ) : (
                deliveries.map((delivery) => (
                  <Card key={delivery._id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">Delivery #{delivery._id.slice(-6)}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(delivery.status)}`}>
                              {delivery.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Pickup: {delivery.pickupAddress}</p>
                              <p className="text-gray-600">Delivery: {delivery.deliveryAddress}</p>
                              <p className="text-gray-600">Distance: {delivery.distance.toFixed(2)} km</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Weight: {delivery.weight} kg</p>
                              <p className="text-gray-600">Transport: {delivery.modeOfTransport}</p>
                              <p className="text-gray-600">Fare: ${delivery.fare.toFixed(2)}</p>
                            </div>
                          </div>

                          <div className="mt-2 text-xs text-gray-500">
                            <p>Customer: {delivery.customer.name} ({delivery.customer.email})</p>
                            <p>Created: {new Date(delivery.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          {getNextStatus(delivery.status) && (
                            <Button
                              size="sm"
                              onClick={() => updateDeliveryStatus(delivery._id, getNextStatus(delivery.status)!)}
                            >
                              Update to {getNextStatus(delivery.status)}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DispatcherDashboard;
