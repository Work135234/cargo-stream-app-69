// import React, { useState, useEffect } from 'react';
// import { Package, Filter, Search, Eye, Loader2, Calendar, User, Truck, CheckCircle } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { useAuth } from '../../contexts/AuthContext';
// import { useNotifications } from '../../contexts/NotificationContext';

// interface Booking {
//   _id: string;
//   pickupAddress: string;
//   deliveryAddress: string;
//   distance: number;
//   weight: number;
//   modeOfTransport: string;
//   fare: number;
//   status: string;
//   customer: {
//     _id: string;
//     name: string;
//     email: string;
//   };
//   dispatcher?: {
//     _id: string;
//     name: string;
//     email: string;
//   };
//   createdAt: string;
// }

// interface Dispatcher {
//   _id: string;
//   name: string;
//   email: string;
// }

// interface Pagination {
//   currentPage: number;
//   totalPages: number;
//   totalBookings: number;
//   hasNext: boolean;
//   hasPrev: boolean;
// }

// const BookingManagement: React.FC = () => {
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [dispatchers, setDispatchers] = useState<Dispatcher[]>([]);
//   const [pagination, setPagination] = useState<Pagination | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
//   const [showAssignModal, setShowAssignModal] = useState(false);
//   const [selectedDispatcher, setSelectedDispatcher] = useState('');
//   const [assigning, setAssigning] = useState(false);
//   const [filters, setFilters] = useState({
//     status: '',
//     startDate: '',
//     endDate: '',
//     customerId: ''
//   });
//   const [currentPage, setCurrentPage] = useState(1);
//   const { token } = useAuth();
//   const { showToast } = useNotifications();

//   const fetchBookings = async () => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams({
//         page: currentPage.toString(),
//         limit: '10',
//         ...(filters.status && filters.status !== 'all' && { status: filters.status }),
//         ...(filters.startDate && { startDate: filters.startDate }),
//         ...(filters.endDate && { endDate: filters.endDate }),
//         ...(filters.customerId && { customerId: filters.customerId })
//       });

//       const response = await fetch(`http://localhost:5000/api/admin/bookings?${params}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       const result = await response.json();

//       if (result.success) {
//         setBookings(result.bookings);
//         setPagination(result.pagination);
//       } else {
//         setError(result.message || 'Failed to fetch bookings');
//       }
//     } catch (err) {
//       setError('Failed to fetch bookings');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchDispatchers = async () => {
//     try {
//       const response = await fetch('http://localhost:5000/api/admin/users?role=Dispatcher', {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       const result = await response.json();

//       if (result.success) {
//         setDispatchers(result.users);
//       }
//     } catch (err) {
//       console.error('Failed to fetch dispatchers:', err);
//     }
//   };

//   useEffect(() => {
//     fetchBookings();
//     fetchDispatchers();
//   }, [currentPage, filters]);

//   const getStatusBadge = (status: string) => {
//     const colors = {
//       'Pending': 'bg-yellow-100 text-yellow-800',
//       'Scheduled': 'bg-blue-100 text-blue-800',
//       'In Transit': 'bg-orange-100 text-orange-800',
//       'Delivered': 'bg-green-100 text-green-800'
//     };
//     return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
//   };

//   const handleFilterChange = (key: string, value: string) => {
//     setFilters(prev => ({ ...prev, [key]: value }));
//     setCurrentPage(1);
//   };

//   const clearFilters = () => {
//     setFilters({
//       status: '',
//       startDate: '',
//       endDate: '',
//       customerId: ''
//     });
//     setCurrentPage(1);
//   };

//   const handleAssignDispatcher = async () => {
//     if (!selectedBooking || !selectedDispatcher) return;

//     setAssigning(true);
//     try {
//       const response = await fetch('http://localhost:5000/api/bookings/assign-dispatcher', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           bookingId: selectedBooking._id,
//           dispatcherId: selectedDispatcher,
//         }),
//       });

//       const result = await response.json();

//       if (result.success) {
//         setShowAssignModal(false);
//         setSelectedDispatcher('');
//         fetchBookings(); // Refresh the list
//         setError('');
//         showToast('Dispatcher Assigned', 'The dispatcher has been successfully assigned to the booking.');
//       } else {
//         setError(result.message || 'Failed to assign dispatcher');
//       }
//     } catch (err) {
//       setError('Failed to assign dispatcher');
//     } finally {
//       setAssigning(false);
//     }
//   };

//   const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
//     try {
//       const response = await fetch('http://localhost:5000/api/bookings/update-status', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           bookingId,
//           status: newStatus,
//         }),
//       });

//       const result = await response.json();

//       if (result.success) {
//         fetchBookings(); // Refresh the list
//         setError('');
//       } else {
//         setError(result.message || 'Failed to update status');
//       }
//     } catch (err) {
//       setError('Failed to update status');
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center">
//             <Package className="mr-2 h-5 w-5" />
//             Booking Management
//           </CardTitle>
//           <CardDescription>
//             View and manage all delivery bookings
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {error && (
//             <Alert variant="destructive" className="mb-4">
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           )}

//           {/* Filters */}
//           <Card className="mb-6">
//             <CardHeader>
//               <CardTitle className="flex items-center text-lg">
//                 <Filter className="mr-2 h-4 w-4" />
//                 Filters
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium">Status</label>
//                   <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="All Status" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="all">All Status</SelectItem>
//                       <SelectItem value="Pending">Pending</SelectItem>
//                       <SelectItem value="Scheduled">Scheduled</SelectItem>
//                       <SelectItem value="In Transit">In Transit</SelectItem>
//                       <SelectItem value="Delivered">Delivered</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-sm font-medium">Start Date</label>
//                   <Input
//                     type="date"
//                     value={filters.startDate}
//                     onChange={(e) => handleFilterChange('startDate', e.target.value)}
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-sm font-medium">End Date</label>
//                   <Input
//                     type="date"
//                     value={filters.endDate}
//                     onChange={(e) => handleFilterChange('endDate', e.target.value)}
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-sm font-medium">Customer ID</label>
//                   <Input
//                     placeholder="Customer ID"
//                     value={filters.customerId}
//                     onChange={(e) => handleFilterChange('customerId', e.target.value)}
//                   />
//                 </div>
//               </div>

//               <div className="flex gap-2 mt-4">
//                 <Button onClick={clearFilters} variant="outline">
//                   Clear Filters
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Bookings List */}
//           {loading ? (
//             <div className="flex justify-center py-8">
//               <Loader2 className="h-8 w-8 animate-spin" />
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {bookings.map((booking) => (
//                 <Card key={booking._id}>
//                   <CardContent className="p-4">
//                     <div className="flex items-center justify-between">
//                       <div className="flex-1">
//                         <div className="flex items-center gap-3 mb-2">
//                           <h3 className="font-semibold">Booking #{booking._id.slice(-6)}</h3>
//                           <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(booking.status)}`}>
//                             {booking.status}
//                           </span>
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                           <div>
//                             <p className="text-gray-600">Pickup: {booking.pickupAddress}</p>
//                             <p className="text-gray-600">Delivery: {booking.deliveryAddress}</p>
//                             <p className="text-gray-600">Distance: {booking.distance.toFixed(2)} km</p>
//                           </div>
//                           <div>
//                             <p className="text-gray-600">Weight: {booking.weight} kg</p>
//                             <p className="text-gray-600">Transport: {booking.modeOfTransport}</p>
//                             <p className="text-gray-600">Fare: ${booking.fare.toFixed(2)}</p>
//                           </div>
//                         </div>

//                         <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
//                           <div className="flex items-center gap-1">
//                             <User className="h-3 w-3" />
//                             <span>{booking.customer.name}</span>
//                           </div>
//                           <div className="flex items-center gap-1">
//                             <Calendar className="h-3 w-3" />
//                             <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
//                           </div>
//                           {booking.dispatcher && (
//                             <div className="flex items-center gap-1">
//                               <Truck className="h-3 w-3" />
//                               <span>Assigned: {booking.dispatcher.name}</span>
//                             </div>
//                           )}
//                         </div>
//                       </div>

//                       <div className="flex gap-2">
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={() => setSelectedBooking(booking)}
//                         >
//                           <Eye className="h-4 w-4" />
//                         </Button>
//                         {!booking.dispatcher && (
//                           <Button
//                             size="sm"
//                             variant="outline"
//                             onClick={() => {
//                               setSelectedBooking(booking);
//                               setShowAssignModal(true);
//                             }}
//                           >
//                             <Truck className="h-4 w-4" />
//                           </Button>
//                         )}
//                         {booking.status !== 'Delivered' && (
//                           <Select onValueChange={(value) => handleUpdateStatus(booking._id, value)}>
//                             <SelectTrigger className="w-32">
//                               <SelectValue placeholder="Status" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectItem value="Pending">Pending</SelectItem>
//                               <SelectItem value="Scheduled">Scheduled</SelectItem>
//                               <SelectItem value="In Transit">In Transit</SelectItem>
//                               <SelectItem value="Delivered">Delivered</SelectItem>
//                             </SelectContent>
//                           </Select>
//                         )}
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}

//               {/* Pagination */}
//               {pagination && (
//                 <div className="flex items-center justify-between">
//                   <p className="text-sm text-gray-600">
//                     Showing {((pagination.currentPage - 1) * 10) + 1} to {Math.min(pagination.currentPage * 10, pagination.totalBookings)} of {pagination.totalBookings} bookings
//                   </p>
//                   <div className="flex gap-2">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       disabled={!pagination.hasPrev}
//                       onClick={() => setCurrentPage(pagination.currentPage - 1)}
//                     >
//                       Previous
//                     </Button>
//                     <span className="px-3 py-2 text-sm">
//                       Page {pagination.currentPage} of {pagination.totalPages}
//                     </span>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       disabled={!pagination.hasNext}
//                       onClick={() => setCurrentPage(pagination.currentPage + 1)}
//                     >
//                       Next
//                     </Button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Booking Details Modal */}
//       {selectedBooking && !showAssignModal && (
//         <Card className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <Card className="max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
//             <CardHeader>
//               <div className="flex items-center justify-between">
//                 <CardTitle>Booking Details</CardTitle>
//                 <Button variant="outline" size="sm" onClick={() => setSelectedBooking(null)}>
//                   Close
//                 </Button>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 <div>
//                   <h3 className="font-semibold">Booking Information</h3>
//                   <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
//                     <div>
//                       <p><strong>ID:</strong> {selectedBooking._id}</p>
//                       <p><strong>Status:</strong> {selectedBooking.status}</p>
//                       <p><strong>Transport:</strong> {selectedBooking.modeOfTransport}</p>
//                       <p><strong>Fare:</strong> ${selectedBooking.fare.toFixed(2)}</p>
//                     </div>
//                     <div>
//                       <p><strong>Distance:</strong> {selectedBooking.distance.toFixed(2)} km</p>
//                       <p><strong>Weight:</strong> {selectedBooking.weight} kg</p>
//                       <p><strong>Created:</strong> {new Date(selectedBooking.createdAt).toLocaleString()}</p>
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <h3 className="font-semibold">Addresses</h3>
//                   <div className="mt-2 text-sm">
//                     <p><strong>Pickup:</strong> {selectedBooking.pickupAddress}</p>
//                     <p><strong>Delivery:</strong> {selectedBooking.deliveryAddress}</p>
//                   </div>
//                 </div>

//                 <div>
//                   <h3 className="font-semibold">Customer Information</h3>
//                   <div className="mt-2 text-sm">
//                     <p><strong>Name:</strong> {selectedBooking.customer.name}</p>
//                     <p><strong>Email:</strong> {selectedBooking.customer.email}</p>
//                   </div>
//                 </div>

//                 {selectedBooking.dispatcher && (
//                   <div>
//                     <h3 className="font-semibold">Dispatcher Information</h3>
//                     <div className="mt-2 text-sm">
//                       <p><strong>Name:</strong> {selectedBooking.dispatcher.name}</p>
//                       <p><strong>Email:</strong> {selectedBooking.dispatcher.email}</p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </Card>
//       )}

//       {/* Assign Dispatcher Modal */}
//       {showAssignModal && selectedBooking && (
//         <Card className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <Card className="max-w-md w-full mx-4">
//             <CardHeader>
//               <div className="flex items-center justify-between">
//                 <CardTitle>Assign Dispatcher</CardTitle>
//                 <Button variant="outline" size="sm" onClick={() => setShowAssignModal(false)}>
//                   Close
//                 </Button>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 <div>
//                   <p className="text-sm text-gray-600 mb-2">
//                     Assign a dispatcher to booking #{selectedBooking._id.slice(-6)}
//                   </p>
//                   <Select value={selectedDispatcher} onValueChange={setSelectedDispatcher}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select dispatcher" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {dispatchers.map((dispatcher) => (
//                         <SelectItem key={dispatcher._id} value={dispatcher._id}>
//                           {dispatcher.name} ({dispatcher.email})
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div className="flex gap-2">
//                   <Button
//                     onClick={handleAssignDispatcher}
//                     disabled={!selectedDispatcher || assigning}
//                     className="flex-1"
//                   >
//                     {assigning ? (
//                       <>
//                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                         Assigning...
//                       </>
//                     ) : (
//                       'Assign Dispatcher'
//                     )}
//                   </Button>
//                   <Button
//                     variant="outline"
//                     onClick={() => setShowAssignModal(false)}
//                     disabled={assigning}
//                   >
//                     Cancel
//                   </Button>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </Card>
//       )}
//     </div>
//   );
// };

// export default BookingManagement;










import { useState, useEffect } from 'react';
import { Package, Filter, Search, Eye, Loader2, Calendar, User, Truck, CheckCircle, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  dispatcher?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  scheduledDate?: string;
  estimatedDelivery?: string;
}

interface Dispatcher {
  _id: string;
  name: string;
  email: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalBookings: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const BookingManagement: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [dispatchers, setDispatchers] = useState<Dispatcher[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedDispatcher, setSelectedDispatcher] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [scheduling, setScheduling] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    scheduledDate: '',
    estimatedDelivery: ''
  });
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: '',
    customerId: '',
    modeOfTransport: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const { token } = useAuth();
  const { showToast } = useNotifications();

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(filters.status && filters.status !== 'all' && { status: filters.status }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
        ...(filters.customerId && { customerId: filters.customerId }),
        ...(filters.modeOfTransport && filters.modeOfTransport !== 'all' && { modeOfTransport: filters.modeOfTransport })
      });

      const response = await fetch(`http://localhost:5000/api/admin/bookings?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        setBookings(result.bookings || []);
        setPagination(result.pagination);
      } else {
        setError(result.message || 'Failed to fetch bookings');
      }
    } catch (err) {
      setError('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const fetchDispatchers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/users?role=Dispatcher', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        setDispatchers(result.users || []);
      }
    } catch (err) {
      console.error('Failed to fetch dispatchers:', err);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchDispatchers();
  }, [currentPage, filters]);

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

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      startDate: '',
      endDate: '',
      customerId: '',
      modeOfTransport: ''
    });
    setCurrentPage(1);
  };

  const handleAssignDispatcher = async () => {
    if (!selectedBooking || !selectedDispatcher) return;

    setAssigning(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/bookings/assign-dispatcher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookingId: selectedBooking._id,
          dispatcherId: selectedDispatcher,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setShowAssignModal(false);
        setSelectedDispatcher('');
        setSuccess('Dispatcher assigned successfully!');
        fetchBookings();
        showToast('Success', 'Dispatcher has been successfully assigned to the booking.');
      } else {
        setError(result.message || 'Failed to assign dispatcher');
      }
    } catch (err) {
      setError('Failed to assign dispatcher');
    } finally {
      setAssigning(false);
    }
  };

  const handleScheduleBooking = async () => {
    if (!selectedBooking || !scheduleData.scheduledDate || !scheduleData.estimatedDelivery) return;

    setScheduling(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/bookings/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookingId: selectedBooking._id,
          scheduledDate: scheduleData.scheduledDate,
          estimatedDelivery: scheduleData.estimatedDelivery,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setShowScheduleModal(false);
        setScheduleData({ scheduledDate: '', estimatedDelivery: '' });
        setSuccess('Booking scheduled successfully!');
        fetchBookings();
        showToast('Success', 'Booking has been scheduled successfully.');
      } else {
        setError(result.message || 'Failed to schedule booking');
      }
    } catch (err) {
      setError('Failed to schedule booking');
    } finally {
      setScheduling(false);
    }
  };

  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/bookings/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookingId,
          status: newStatus,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess('Status updated successfully!');
        fetchBookings();
      } else {
        setError(result.message || 'Failed to update status');
      }
    } catch (err) {
      setError('Failed to update status');
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="mr-2 h-5 w-5" />
            Booking Management
          </CardTitle>
          <CardDescription>
            View and manage all delivery bookings
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

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Scheduled">Scheduled</SelectItem>
                      <SelectItem value="In Transit">In Transit</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Transport Mode</label>
                  <Select value={filters.modeOfTransport} onValueChange={(value) => handleFilterChange('modeOfTransport', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Modes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Modes</SelectItem>
                      <SelectItem value="truck">Truck</SelectItem>
                      <SelectItem value="train">Train</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <Input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <Input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Customer ID</label>
                  <Input
                    placeholder="Customer ID"
                    value={filters.customerId}
                    onChange={(e) => handleFilterChange('customerId', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Bookings List */}
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No bookings found matching your criteria.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <Card key={booking._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">Booking #{booking._id.slice(-6)}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(booking.status)}`}>
                            {booking.status}
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
                            <User className="h-3 w-3" />
                            <span>{booking.customer?.name || 'Unknown Customer'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(booking.createdAt)}</span>
                          </div>
                          {booking.dispatcher && (
                            <div className="flex items-center gap-1">
                              <Truck className="h-3 w-3" />
                              <span>Assigned: {booking.dispatcher.name}</span>
                            </div>
                          )}
                          {booking.scheduledDate && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>Scheduled: {formatDate(booking.scheduledDate)}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedBooking(booking)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        {!booking.dispatcher && booking.status === 'Pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowAssignModal(true);
                            }}
                          >
                            <Truck className="h-4 w-4" />
                          </Button>
                        )}

                        {booking.status === 'Pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowScheduleModal(true);
                            }}
                          >
                            <Clock className="h-4 w-4" />
                          </Button>
                        )}

                        {booking.status !== 'Delivered' && booking.status !== 'Cancelled' && (
                          <Select onValueChange={(value) => handleUpdateStatus(booking._id, value)}>
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="Scheduled">Scheduled</SelectItem>
                              <SelectItem value="In Transit">In Transit</SelectItem>
                              <SelectItem value="Delivered">Delivered</SelectItem>
                              <SelectItem value="Cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Pagination */}
              {pagination && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Showing {((pagination.currentPage - 1) * 10) + 1} to {Math.min(pagination.currentPage * 10, pagination.totalBookings)} of {pagination.totalBookings} bookings
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!pagination.hasPrev}
                      onClick={() => setCurrentPage(pagination.currentPage - 1)}
                    >
                      Previous
                    </Button>
                    <span className="px-3 py-2 text-sm">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!pagination.hasNext}
                      onClick={() => setCurrentPage(pagination.currentPage + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Booking Details Modal */}
      {selectedBooking && !showAssignModal && !showScheduleModal && (
        <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
              <DialogDescription>
                Complete information for booking #{selectedBooking._id.slice(-6)}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Booking Information</h3>
                <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                  <div>
                    <p><strong>ID:</strong> {selectedBooking._id}</p>
                    <p><strong>Status:</strong> {selectedBooking.status}</p>
                    <p><strong>Transport:</strong> {selectedBooking.modeOfTransport}</p>
                    <p><strong>Fare:</strong> ${selectedBooking.fare?.toFixed(2) || 'N/A'}</p>
                  </div>
                  <div>
                    <p><strong>Distance:</strong> {selectedBooking.distance?.toFixed(2) || 'N/A'} km</p>
                    <p><strong>Weight:</strong> {selectedBooking.weight || 'N/A'} kg</p>
                    <p><strong>Created:</strong> {formatDate(selectedBooking.createdAt)}</p>
                    <p><strong>Scheduled:</strong> {formatDate(selectedBooking.scheduledDate || '')}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold">Addresses</h3>
                <div className="mt-2 text-sm">
                  <p><strong>Pickup:</strong> {selectedBooking.pickupAddress}</p>
                  <p><strong>Delivery:</strong> {selectedBooking.deliveryAddress}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold">Customer Information</h3>
                <div className="mt-2 text-sm">
                  <p><strong>Name:</strong> {selectedBooking.customer?.name || 'Unknown'}</p>
                  <p><strong>Email:</strong> {selectedBooking.customer?.email || 'N/A'}</p>
                </div>
              </div>

              {selectedBooking.dispatcher && (
                <div>
                  <h3 className="font-semibold">Dispatcher Information</h3>
                  <div className="mt-2 text-sm">
                    <p><strong>Name:</strong> {selectedBooking.dispatcher.name}</p>
                    <p><strong>Email:</strong> {selectedBooking.dispatcher.email}</p>
                  </div>
                </div>
              )}

              {selectedBooking.estimatedDelivery && (
                <div>
                  <h3 className="font-semibold">Delivery Information</h3>
                  <div className="mt-2 text-sm">
                    <p><strong>Estimated Delivery:</strong> {formatDate(selectedBooking.estimatedDelivery)}</p>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Assign Dispatcher Modal */}
      <Dialog open={showAssignModal} onOpenChange={setShowAssignModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Dispatcher</DialogTitle>
            <DialogDescription>
              Assign a dispatcher to booking #{selectedBooking?._id.slice(-6)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Select Dispatcher</label>
              <Select value={selectedDispatcher} onValueChange={setSelectedDispatcher}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a dispatcher" />
                </SelectTrigger>
                <SelectContent>
                  {dispatchers.map((dispatcher) => (
                    <SelectItem key={dispatcher._id} value={dispatcher._id}>
                      {dispatcher.name} ({dispatcher.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleAssignDispatcher}
                disabled={!selectedDispatcher || assigning}
                className="flex-1"
              >
                {assigning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Assigning...
                  </>
                ) : (
                  'Assign Dispatcher'
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAssignModal(false)}
                disabled={assigning}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Schedule Booking Modal */}
      <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Booking</DialogTitle>
            <DialogDescription>
              Schedule pickup and delivery for booking #{selectedBooking?._id.slice(-6)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Scheduled Pickup Date</label>
              <Input
                type="datetime-local"
                value={scheduleData.scheduledDate}
                onChange={(e) => setScheduleData({ ...scheduleData, scheduledDate: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Estimated Delivery Date</label>
              <Input
                type="datetime-local"
                value={scheduleData.estimatedDelivery}
                onChange={(e) => setScheduleData({ ...scheduleData, estimatedDelivery: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleScheduleBooking}
                disabled={!scheduleData.scheduledDate || !scheduleData.estimatedDelivery || scheduling}
                className="flex-1"
              >
                {scheduling ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scheduling...
                  </>
                ) : (
                  'Schedule Booking'
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowScheduleModal(false)}
                disabled={scheduling}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingManagement;