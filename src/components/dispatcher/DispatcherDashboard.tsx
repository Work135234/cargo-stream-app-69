// import React, { useState, useEffect } from 'react';
// import { MapPin, Truck, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { useAuth } from '../../contexts/AuthContext';

// interface Delivery {
//   _id: string;
//   pickupAddress: string;
//   deliveryAddress: string;
//   distance: number;
//   weight: number;
//   modeOfTransport: string;
//   fare: number;
//   status: string;
//   customer: {
//     name: string;
//     email: string;
//   };
//   createdAt: string;
// }

// const DispatcherDashboard: React.FC = () => {
//   const [deliveries, setDeliveries] = useState<Delivery[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [statusFilter, setStatusFilter] = useState('');
//   const { token, user } = useAuth();

//   const fetchDeliveries = async () => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams({
//         ...(statusFilter && { status: statusFilter })
//       });

//       const response = await fetch(`http://localhost:5000/api/bookings/my?${params}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       const result = await response.json();

//       if (result.success) {
//         setDeliveries(result.bookings);
//       } else {
//         setError(result.message || 'Failed to fetch deliveries');
//       }
//     } catch (err) {
//       setError('Failed to fetch deliveries');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDeliveries();
//   }, [statusFilter]);

//   const updateDeliveryStatus = async (deliveryId: string, newStatus: string) => {
//     try {
//       const response = await fetch('http://localhost:5000/api/bookings/update-status', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           bookingId: deliveryId,
//           status: newStatus
//         }),
//       });

//       const result = await response.json();

//       if (result.success) {
//         setSuccess('Delivery status updated successfully!');
//         fetchDeliveries();
//       } else {
//         setError(result.message || 'Failed to update delivery status');
//       }
//     } catch (err) {
//       setError('Failed to update delivery status');
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     const colors = {
//       'Pending': 'bg-yellow-100 text-yellow-800',
//       'Scheduled': 'bg-blue-100 text-blue-800',
//       'In Transit': 'bg-orange-100 text-orange-800',
//       'Delivered': 'bg-green-100 text-green-800'
//     };
//     return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'Pending':
//         return <Clock className="h-4 w-4" />;
//       case 'Scheduled':
//         return <Truck className="h-4 w-4" />;
//       case 'In Transit':
//         return <AlertCircle className="h-4 w-4" />;
//       case 'Delivered':
//         return <CheckCircle className="h-4 w-4" />;
//       default:
//         return <Clock className="h-4 w-4" />;
//     }
//   };

//   const getNextStatus = (currentStatus: string) => {
//     const statusFlow = {
//       'Pending': 'Scheduled',
//       'Scheduled': 'In Transit',
//       'In Transit': 'Delivered'
//     };
//     return statusFlow[currentStatus as keyof typeof statusFlow];
//   };

//   const statusCounts = deliveries.reduce((acc, delivery) => {
//     acc[delivery.status] = (acc[delivery.status] || 0) + 1;
//     return acc;
//   }, {} as Record<string, number>);

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center">
//             <MapPin className="mr-2 h-5 w-5" />
//             Dispatcher Dashboard
//           </CardTitle>
//           <CardDescription>
//             Manage your assigned deliveries and update their status
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {error && (
//             <Alert variant="destructive" className="mb-4">
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           )}

//           {success && (
//             <Alert className="mb-4">
//               <AlertDescription>{success}</AlertDescription>
//             </Alert>
//           )}

//           {/* Status Overview */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//             {Object.entries(statusCounts).map(([status, count]) => (
//               <Card key={status}>
//                 <CardContent className="p-4">
//                   <div className="flex items-center">
//                     {getStatusIcon(status)}
//                     <div className="ml-3">
//                       <p className="text-sm text-gray-600 capitalize">{status}</p>
//                       <p className="text-2xl font-bold">{count}</p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>

//           {/* Filters */}
//           <div className="flex gap-4 mb-6">
//             <Select value={statusFilter} onValueChange={setStatusFilter}>
//               <SelectTrigger className="w-48">
//                 <SelectValue placeholder="Filter by status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Status</SelectItem>
//                 <SelectItem value="Pending">Pending</SelectItem>
//                 <SelectItem value="Scheduled">Scheduled</SelectItem>
//                 <SelectItem value="In Transit">In Transit</SelectItem>
//                 <SelectItem value="Delivered">Delivered</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Deliveries List */}
//           {loading ? (
//             <div className="flex justify-center py-8">
//               <Loader2 className="h-8 w-8 animate-spin" />
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {deliveries.length === 0 ? (
//                 <Card>
//                   <CardContent className="p-8 text-center">
//                     <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
//                     <p className="text-gray-600">No deliveries found</p>
//                   </CardContent>
//                 </Card>
//               ) : (
//                 deliveries.map((delivery) => (
//                   <Card key={delivery._id}>
//                     <CardContent className="p-4">
//                       <div className="flex items-center justify-between">
//                         <div className="flex-1">
//                           <div className="flex items-center gap-3 mb-2">
//                             <h3 className="font-semibold">Delivery #{delivery._id.slice(-6)}</h3>
//                             <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(delivery.status)}`}>
//                               {delivery.status}
//                             </span>
//                           </div>

//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                             <div>
//                               <p className="text-gray-600">Pickup: {delivery.pickupAddress}</p>
//                               <p className="text-gray-600">Delivery: {delivery.deliveryAddress}</p>
//                               <p className="text-gray-600">Distance: {delivery.distance.toFixed(2)} km</p>
//                             </div>
//                             <div>
//                               <p className="text-gray-600">Weight: {delivery.weight} kg</p>
//                               <p className="text-gray-600">Transport: {delivery.modeOfTransport}</p>
//                               <p className="text-gray-600">Fare: ${delivery.fare.toFixed(2)}</p>
//                             </div>
//                           </div>

//                           <div className="mt-2 text-xs text-gray-500">
//                             <p>Customer: {delivery.customer.name} ({delivery.customer.email})</p>
//                             <p>Created: {new Date(delivery.createdAt).toLocaleDateString()}</p>
//                           </div>
//                         </div>

//                         <div className="flex flex-col gap-2">
//                           {getNextStatus(delivery.status) && (
//                             <Button
//                               size="sm"
//                               onClick={() => updateDeliveryStatus(delivery._id, getNextStatus(delivery.status)!)}
//                             >
//                               Update to {getNextStatus(delivery.status)}
//                             </Button>
//                           )}
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))
//               )}
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default DispatcherDashboard;






















import { useState, useEffect } from 'react';
import { Truck, Clock, CheckCircle, MapPin, Calendar, Eye, Edit, Loader2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';

interface Booking {
  _id: string;
  pickupAddress: string;
  deliveryAddress: string;
  distance: number;
  weight: number;
  modeOfTransport: string;
  fare: number;
  status: string;
  customer: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  scheduledDate?: string;
  estimatedDelivery?: string;
  notes?: string;
}

const DispatcherDashboard: React.FC = () => {
  const [assignedBookings, setAssignedBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [updateData, setUpdateData] = useState({
    status: '',
    notes: ''
  });
  const { user, token } = useAuth();
  const { showToast } = useNotifications();

  const fetchAssignedBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:5000/api/dispatcher/assigned-bookings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        setAssignedBookings(result.bookings || []);
      } else {
        setError(result.message || 'Failed to fetch assigned bookings');
      }
    } catch (err) {
      setError('Failed to fetch assigned bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedBookings();
  }, []);

  const getStatusBadge = (status: string) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Scheduled': 'bg-blue-100 text-blue-800 border-blue-200',
      'In Transit': 'bg-orange-100 text-orange-800 border-orange-200',
      'Delivered': 'bg-green-100 text-green-800 border-green-200',
      'Cancelled': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock className="h-4 w-4" />;
      case 'Scheduled':
        return <Calendar className="h-4 w-4" />;
      case 'In Transit':
        return <Truck className="h-4 w-4" />;
      case 'Delivered':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Truck className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleUpdateBooking = async () => {
    if (!selectedBooking || !updateData.status) return;

    setUpdating(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:5000/api/dispatcher/update-booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookingId: selectedBooking._id,
          status: updateData.status,
          notes: updateData.notes,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setShowUpdateModal(false);
        setUpdateData({ status: '', notes: '' });
        setSuccess('Booking updated successfully!');
        fetchAssignedBookings();
        showToast('Success', 'Booking status and notes updated successfully.');
      } else {
        setError(result.message || 'Failed to update booking');
      }
    } catch (err) {
      setError('Failed to update booking');
    } finally {
      setUpdating(false);
    }
  };

  const getActiveBookings = () => {
    return assignedBookings.filter(booking =>
      ['Pending', 'Scheduled', 'In Transit'].includes(booking.status)
    );
  };

  const getCompletedBookings = () => {
    return assignedBookings.filter(booking =>
      ['Delivered', 'Cancelled'].includes(booking.status)
    );
  };

  const activeBookings = getActiveBookings();
  const completedBookings = getCompletedBookings();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Truck className="mr-2 h-5 w-5" />
            Welcome, {user?.name}!
          </CardTitle>
          <CardDescription>
            Manage your assigned deliveries and update booking status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{activeBookings.length}</div>
              <div className="text-sm text-gray-600">Active Deliveries</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{completedBookings.length}</div>
              <div className="text-sm text-gray-600">Completed Deliveries</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{assignedBookings.length}</div>
              <div className="text-sm text-gray-600">Total Assigned</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Active Deliveries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Truck className="mr-2 h-5 w-5" />
            Active Deliveries
          </CardTitle>
          <CardDescription>
            Update status and add notes for your assigned deliveries
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : activeBookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Truck className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No active deliveries assigned to you.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeBookings.map((booking) => (
                <Card key={booking._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">Booking #{booking._id.slice(-6)}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            <span className="ml-1">{booking.status}</span>
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600"><strong>Pickup:</strong> {booking.pickupAddress}</p>
                            <p className="text-gray-600"><strong>Delivery:</strong> {booking.deliveryAddress}</p>
                            <p className="text-gray-600"><strong>Distance:</strong> {booking.distance?.toFixed(2) || 'N/A'} km</p>
                          </div>
                          <div>
                            <p className="text-gray-600"><strong>Weight:</strong> {booking.weight || 'N/A'} kg</p>
                            <p className="text-gray-600"><strong>Transport:</strong> {booking.modeOfTransport}</p>
                            <p className="text-gray-600"><strong>Fare:</strong> ${booking.fare?.toFixed(2) || 'N/A'}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>Customer: {booking.customer?.name || 'Unknown'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Created: {formatDate(booking.createdAt)}</span>
                          </div>
                          {booking.scheduledDate && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>Scheduled: {formatDate(booking.scheduledDate)}</span>
                            </div>
                          )}
                        </div>

                        {booking.notes && (
                          <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                            <strong>Notes:</strong> {booking.notes}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowDetailsModal(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setUpdateData({ status: booking.status, notes: booking.notes || '' });
                            setShowUpdateModal(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                          Update
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completed Deliveries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="mr-2 h-5 w-5" />
            Completed Deliveries
          </CardTitle>
          <CardDescription>
            View your completed and cancelled deliveries
          </CardDescription>
        </CardHeader>
        <CardContent>
          {completedBookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No completed deliveries yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {completedBookings.slice(0, 5).map((booking) => (
                <Card key={booking._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">Booking #{booking._id.slice(-6)}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            <span className="ml-1">{booking.status}</span>
                          </span>
                        </div>

                        <div className="text-sm text-gray-600">
                          <p><strong>From:</strong> {booking.pickupAddress}</p>
                          <p><strong>To:</strong> {booking.deliveryAddress}</p>
                          <p><strong>Customer:</strong> {booking.customer?.name || 'Unknown'}</p>
                          <p><strong>Completed:</strong> {formatDate(booking.createdAt)}</p>
                        </div>

                        {booking.notes && (
                          <div className="mt-2 p-2 bg-green-50 rounded text-xs">
                            <strong>Final Notes:</strong> {booking.notes}
                          </div>
                        )}
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowDetailsModal(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Update Booking Modal */}
      <Dialog open={showUpdateModal} onOpenChange={setShowUpdateModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Booking Status</DialogTitle>
            <DialogDescription>
              Update status and add notes for booking #{selectedBooking?._id.slice(-6)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select value={updateData.status} onValueChange={(value) => setUpdateData({ ...updateData, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="In Transit">In Transit</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Notes (Optional)</label>
              <Textarea
                placeholder="Add notes about the delivery..."
                value={updateData.notes}
                onChange={(e) => setUpdateData({ ...updateData, notes: e.target.value })}
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleUpdateBooking}
                disabled={!updateData.status || updating}
                className="flex-1"
              >
                {updating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Booking'
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowUpdateModal(false)}
                disabled={updating}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Booking Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              Complete information for booking #{selectedBooking?._id.slice(-6)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Booking Information</h3>
              <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                <div>
                  <p><strong>ID:</strong> {selectedBooking?._id}</p>
                  <p><strong>Status:</strong> {selectedBooking?.status}</p>
                  <p><strong>Transport:</strong> {selectedBooking?.modeOfTransport}</p>
                  <p><strong>Fare:</strong> ${selectedBooking?.fare?.toFixed(2) || 'N/A'}</p>
                </div>
                <div>
                  <p><strong>Distance:</strong> {selectedBooking?.distance?.toFixed(2) || 'N/A'} km</p>
                  <p><strong>Weight:</strong> {selectedBooking?.weight || 'N/A'} kg</p>
                  <p><strong>Created:</strong> {formatDate(selectedBooking?.createdAt || '')}</p>
                  <p><strong>Scheduled:</strong> {formatDate(selectedBooking?.scheduledDate || '')}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold">Addresses</h3>
              <div className="mt-2 text-sm">
                <p><strong>Pickup:</strong> {selectedBooking?.pickupAddress}</p>
                <p><strong>Delivery:</strong> {selectedBooking?.deliveryAddress}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold">Customer Information</h3>
              <div className="mt-2 text-sm">
                <p><strong>Name:</strong> {selectedBooking?.customer?.name || 'Unknown'}</p>
                <p><strong>Email:</strong> {selectedBooking?.customer?.email || 'N/A'}</p>
              </div>
            </div>

            {selectedBooking?.estimatedDelivery && (
              <div>
                <h3 className="font-semibold">Delivery Information</h3>
                <div className="mt-2 text-sm">
                  <p><strong>Estimated Delivery:</strong> {formatDate(selectedBooking.estimatedDelivery)}</p>
                </div>
              </div>
            )}

            {selectedBooking?.notes && (
              <div>
                <h3 className="font-semibold">Notes</h3>
                <div className="mt-2 text-sm p-2 bg-blue-50 rounded">
                  {selectedBooking.notes}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DispatcherDashboard;
