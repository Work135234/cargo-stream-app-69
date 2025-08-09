import { useState, useEffect } from 'react';
import { Package, Clock, Truck, CheckCircle, MapPin, Calendar, DollarSign, Eye, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  dispatcher?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  scheduledDate?: string;
  estimatedDelivery?: string;
  notes?: string;
}

const CustomerDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const { user, token } = useAuth();
  const { showToast } = useNotifications();

  const fetchCustomerBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:5000/api/customer/bookings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        setBookings(result.bookings || []);
      } else {
        setError(result.message || 'Failed to fetch bookings');
      }
    } catch (err) {
      setError('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerBookings();
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
        return <Package className="h-4 w-4" />;
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

  const getOngoingBookings = () => {
    return bookings.filter(booking =>
      ['Pending', 'Scheduled', 'In Transit'].includes(booking.status)
    );
  };

  const getCompletedBookings = () => {
    return bookings.filter(booking =>
      ['Delivered', 'Cancelled'].includes(booking.status)
    );
  };

  const ongoingBookings = getOngoingBookings();
  const completedBookings = getCompletedBookings();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="mr-2 h-5 w-5" />
            Welcome back, {user?.name}!
          </CardTitle>
          <CardDescription>
            Track your deliveries and manage your bookings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{ongoingBookings.length}</div>
              <div className="text-sm text-gray-600">Active Deliveries</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{completedBookings.length}</div>
              <div className="text-sm text-gray-600">Completed Deliveries</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{bookings.length}</div>
              <div className="text-sm text-gray-600">Total Bookings</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Ongoing Deliveries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Truck className="mr-2 h-5 w-5" />
            Ongoing Deliveries
          </CardTitle>
          <CardDescription>
            Track your active deliveries and their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : ongoingBookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Truck className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No ongoing deliveries. Create a new booking to get started!</p>
              <Button className="mt-4" onClick={() => window.location.href = '/dashboard/create-booking'}>
                <Plus className="mr-2 h-4 w-4" />
                Create Booking
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {ongoingBookings.map((booking) => (
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
                            <Calendar className="h-3 w-3" />
                            <span>Created: {formatDate(booking.createdAt)}</span>
                          </div>
                          {booking.scheduledDate && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>Scheduled: {formatDate(booking.scheduledDate)}</span>
                            </div>
                          )}
                          {booking.dispatcher && (
                            <div className="flex items-center gap-1">
                              <Truck className="h-3 w-3" />
                              <span>Assigned: {booking.dispatcher.name}</span>
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
                            setShowBookingDetails(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                          Details
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

      {/* Booking History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="mr-2 h-5 w-5" />
            Booking History
          </CardTitle>
          <CardDescription>
            View your completed and cancelled bookings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {completedBookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No completed bookings yet.</p>
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
                          <p><strong>Fare:</strong> ${booking.fare?.toFixed(2) || 'N/A'}</p>
                          <p><strong>Completed:</strong> {formatDate(booking.createdAt)}</p>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowBookingDetails(true);
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

      {/* Booking Details Modal */}
      {selectedBooking && showBookingDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Booking Details</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setShowBookingDetails(false)}>
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent>
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

                {selectedBooking.notes && (
                  <div>
                    <h3 className="font-semibold">Notes</h3>
                    <div className="mt-2 text-sm p-2 bg-blue-50 rounded">
                      {selectedBooking.notes}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
