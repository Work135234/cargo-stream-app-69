// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { Package, Loader2, CheckCircle, MapPin, Boxes, User, Calendar, Info, Calculator } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { useAuth } from '../../contexts/AuthContext';
// import { useNotifications } from '../../contexts/NotificationContext';

// interface BookingFormData {
//   pickupAddress: string;
//   deliveryAddress: string;
//   weight: number;
//   modeOfTransport: string;
//   productType: string;
//   dimensions: string;
//   pickupDate: string;
//   specialInstructions?: string;
//   contactName: string;
//   contactPhone: string;
// }

// const productTypes = [
//   { label: 'General Goods', value: 'general' },
//   { label: 'Perishable', value: 'perishable' },
//   { label: 'Fragile', value: 'fragile' },
//   { label: 'Bulk', value: 'bulk' },
//   { label: 'Other', value: 'other' },
// ];

// const BookingForm: React.FC = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [fare, setFare] = useState<number | null>(null);
//   const [summary, setSummary] = useState<any>({});
//   const { token } = useAuth();
//   const { showToast } = useNotifications();

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     reset,
//     formState: { errors },
//   } = useForm<BookingFormData>();

//   // Watch fields for summary
//   const watchAll = watch();

//   const onSubmit = async (data: BookingFormData) => {
//     setIsLoading(true);
//     setError('');
//     setSuccess('');
//     try {
//       const response = await fetch('http://localhost:5000/api/bookings', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify(data),
//       });
//       const result = await response.json();
//       if (!response.ok) {
//         throw new Error(result.message || 'Failed to create booking');
//       }
//       if (result.success) {
//         setSuccess('Booking created successfully!');
//         showToast('Booking Confirmed', 'Your booking has been created and is being processed.');
//         reset();
//         setFare(null);
//         setSummary({});
//       } else {
//         setError(result.message || 'Failed to create booking');
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'An error occurred');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Actual fare calculation using API
//   const handleCalculateFare = async () => {
//     if (watchAll.pickupAddress && watchAll.deliveryAddress && watchAll.weight && watchAll.modeOfTransport) {
//       try {
//         const requestData = {
//           origin: watchAll.pickupAddress,
//           destination: watchAll.deliveryAddress,
//           weight: watchAll.weight,
//           modeOfTransport: watchAll.modeOfTransport
//         };

//         const response = await fetch('http://localhost:5000/api/fare/calculate', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//           body: JSON.stringify(requestData),
//         });

//         const result = await response.json();

//         if (result.success) {
//           setFare(result.fare);
//           setSummary({
//             transport: watchAll.modeOfTransport,
//             product: watchAll.productType,
//             weight: watchAll.weight,
//             pickup: watchAll.pickupDate,
//             distance: result.distance,
//             breakdown: result.breakdown
//           });
//         } else {
//           console.error('Fare calculation failed:', result.message);
//           // Fallback to placeholder calculation
//           setFare(100 + (watchAll.weight || 0) * 2 + (watchAll.modeOfTransport === 'train' ? 20 : 40));
//         }
//       } catch (error) {
//         console.error('Fare calculation error:', error);
//         // Fallback to placeholder calculation
//         setFare(100 + (watchAll.weight || 0) * 2 + (watchAll.modeOfTransport === 'train' ? 20 : 40));
//       }
//     }
//   };

//   return (
//     <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
//       {/* Main Form */}
//       <div className="lg:col-span-2 space-y-8">
//         {/* Pickup & Destination */}
//         <Card className="bg-white text-gray-900 border border-gray-200 shadow-lg">
//           <CardHeader>
//             <CardTitle className="flex items-center text-2xl font-bold text-gray-900">
//               <MapPin className="mr-2 h-6 w-6" /> Pickup & Destination
//             </CardTitle>
//             <CardDescription className="text-gray-600">Specify pickup and delivery locations</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               <div>
//                 <Label htmlFor="pickupAddress" className="text-gray-700">Pickup Address</Label>
//                 <Input
//                   id="pickupAddress"
//                   placeholder="Enter pickup address"
//                   {...register('pickupAddress', { required: 'Pickup address is required' })}
//                   className={`${errors.pickupAddress ? 'border-red-500' : 'border-gray-300'} bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500`}
//                 />
//                 {errors.pickupAddress && <p className="text-sm text-red-600">{errors.pickupAddress.message}</p>}
//               </div>
//               <div>
//                 <Label htmlFor="deliveryAddress" className="text-gray-700">Destination Address</Label>
//                 <Input
//                   id="deliveryAddress"
//                   placeholder="Enter destination address"
//                   {...register('deliveryAddress', { required: 'Delivery address is required' })}
//                   className={`${errors.deliveryAddress ? 'border-red-500' : 'border-gray-300'} bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500`}
//                 />
//                 {errors.deliveryAddress && <p className="text-sm text-red-600">{errors.deliveryAddress.message}</p>}
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//         {/* Shipment Details */}
//         <Card className="bg-white text-gray-900 border border-gray-200 shadow-lg">
//           <CardHeader>
//             <CardTitle className="flex items-center text-2xl font-bold text-gray-900">
//               <Boxes className="mr-2 h-6 w-6" /> Shipment Details
//             </CardTitle>
//             <CardDescription className="text-gray-600">Describe your cargo and requirements</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <Label htmlFor="modeOfTransport" className="text-gray-700">Transport Mode</Label>
//                 <Select onValueChange={(value) => setValue('modeOfTransport', value)}>
//                   <SelectTrigger className="border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500">
//                     <SelectValue placeholder="Select transport mode" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="train">Train</SelectItem>
//                     <SelectItem value="truck">Truck</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 {errors.modeOfTransport && <p className="text-sm text-red-600">{errors.modeOfTransport.message}</p>}
//               </div>
//               <div>
//                 <Label htmlFor="productType" className="text-gray-700">Product Type</Label>
//                 <Select onValueChange={(value) => setValue('productType', value)}>
//                   <SelectTrigger className="border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500">
//                     <SelectValue placeholder="Select product type" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {productTypes.map((pt) => (
//                       <SelectItem key={pt.value} value={pt.value}>{pt.label}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 {errors.productType && <p className="text-sm text-red-600">{errors.productType.message}</p>}
//               </div>
//               <div>
//                 <Label htmlFor="weight" className="text-gray-700">Weight (kg)</Label>
//                 <Input
//                   id="weight"
//                   type="number"
//                   step="0.1"
//                   placeholder="Enter weight in kg"
//                   {...register('weight', { required: 'Weight is required', min: { value: 0.1, message: 'Weight must be at least 0.1 kg' } })}
//                   className={`${errors.weight ? 'border-red-500' : 'border-gray-300'} bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500`}
//                 />
//                 {errors.weight && <p className="text-sm text-red-600">{errors.weight.message}</p>}
//               </div>
//               <div>
//                 <Label htmlFor="dimensions" className="text-gray-700">Dimensions (L×W×H cm)</Label>
//                 <Input
//                   id="dimensions"
//                   placeholder="e.g., 100×50×30"
//                   {...register('dimensions')}
//                   className="border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="pickupDate" className="text-gray-700">Preferred Pickup Date</Label>
//                 <Input
//                   id="pickupDate"
//                   type="date"
//                   {...register('pickupDate')}
//                   className="border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500"
//                 />
//               </div>
//               <div className="md:col-span-2">
//                 <Label htmlFor="specialInstructions" className="text-gray-700">Special Instructions (Optional)</Label>
//                 <textarea
//                   id="specialInstructions"
//                   {...register('specialInstructions')}
//                   className="w-full rounded-md bg-white border border-gray-300 p-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
//                   placeholder="Any special handling requirements or delivery instructions"
//                   rows={2}
//                 />
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//         {/* Contact Information */}
//         <Card className="bg-white text-gray-900 border border-gray-200 shadow-lg">
//           <CardHeader>
//             <CardTitle className="flex items-center text-2xl font-bold text-gray-900">
//               <User className="mr-2 h-6 w-6" /> Contact Information
//             </CardTitle>
//             <CardDescription className="text-gray-600">Delivery contact details</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <Label htmlFor="contactName" className="text-gray-700">Contact Name</Label>
//                 <Input
//                   id="contactName"
//                   placeholder="Delivery contact person"
//                   {...register('contactName', { required: 'Contact name is required' })}
//                   className={`${errors.contactName ? 'border-red-500' : 'border-gray-300'} bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500`}
//                 />
//                 {errors.contactName && <p className="text-sm text-red-600">{errors.contactName.message}</p>}
//               </div>
//               <div>
//                 <Label htmlFor="contactPhone" className="text-gray-700">Contact Phone</Label>
//                 <Input
//                   id="contactPhone"
//                   placeholder="Phone number"
//                   {...register('contactPhone', { required: 'Contact phone is required' })}
//                   className={`${errors.contactPhone ? 'border-red-500' : 'border-gray-300'} bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500`}
//                 />
//                 {errors.contactPhone && <p className="text-sm text-red-600">{errors.contactPhone.message}</p>}
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//         {/* Submit Button */}
//         <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg py-3 mt-4" disabled={isLoading} onClick={handleSubmit(onSubmit)}>
//           {isLoading ? (
//             <>
//               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//               Confirming Booking...
//             </>
//           ) : (
//             'Confirm Booking'
//           )}
//         </Button>
//         {error && (
//           <Alert variant="destructive" className="mt-4">
//             <AlertDescription>{error}</AlertDescription>
//           </Alert>
//         )}
//         {success && (
//           <Alert className="mt-4">
//             <CheckCircle className="h-4 w-4" />
//             <AlertDescription>{success}</AlertDescription>
//           </Alert>
//         )}
//       </div>
//       {/* Sidebar: Fare Calculator & Summary */}
//       <div className="space-y-8">
//         <Card className="bg-white text-gray-900 border border-gray-200 shadow-lg">
//           <CardHeader>
//             <CardTitle className="flex items-center text-xl font-bold text-gray-900">
//               <Calculator className="mr-2 h-5 w-5" /> Fare Calculator
//             </CardTitle>
//             <CardDescription className="text-gray-600">Get instant pricing estimates</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold" onClick={handleCalculateFare}>
//               Calculate Fare
//             </Button>
//             {fare !== null && (
//               <div className="mt-4 text-lg font-bold text-green-600">Estimated Fare: ${fare.toFixed(2)}</div>
//             )}
//           </CardContent>
//         </Card>
//         <Card className="bg-white text-gray-900 border border-gray-200 shadow-lg">
//           <CardHeader>
//             <CardTitle className="flex items-center text-xl font-bold text-gray-900">Booking Summary</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-2 text-sm text-gray-700">
//               <div className="flex justify-between"><span>Transport:</span> <span>{watchAll.modeOfTransport || 'Not Selected'}</span></div>
//               <div className="flex justify-between"><span>Product:</span> <span>{watchAll.productType || 'Not selected'}</span></div>
//               <div className="flex justify-between"><span>Weight:</span> <span>{watchAll.weight ? `${watchAll.weight} kg` : 'Not specified'}</span></div>
//               <div className="flex justify-between"><span>Distance:</span> <span>{summary.distance ? `${summary.distance.toFixed(2)} km` : 'Calculate fare to see'}</span></div>
//               <div className="flex justify-between"><span>Pickup Date:</span> <span>{watchAll.pickupDate || 'Not selected'}</span></div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default BookingForm;
















import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Package, Loader2, CheckCircle, MapPin, Boxes, User, Calendar, Info, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';

interface BookingFormData {
  pickupAddress: string;
  deliveryAddress: string;
  weight: number;
  modeOfTransport: string;
  productType: string;
  dimensions: string;
  pickupDate: string;
  specialInstructions?: string;
  contactName: string;
  contactPhone: string;
}

const productTypes = [
  { label: 'General Goods', value: 'general' },
  { label: 'Perishable', value: 'perishable' },
  { label: 'Fragile', value: 'fragile' },
  { label: 'Bulk', value: 'bulk' },
  { label: 'Other', value: 'other' },
];

const BookingForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fare, setFare] = useState<number | null>(null);
  const [summary, setSummary] = useState<any>({});
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { token } = useAuth();
  const { showToast } = useNotifications();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<BookingFormData>();

  // Watch fields for summary
  const watchAll = watch();

  const onSubmit = async (data: BookingFormData) => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      // Ensure fare and distance are present; if distance missing, compute via API now
      let ensuredFare = fare;
      let ensuredDistance = summary?.distance;
      if (ensuredFare === null || ensuredDistance == null) {
        if (!watchAll.pickupAddress || !watchAll.deliveryAddress || !watchAll.weight || !watchAll.modeOfTransport) {
          setError('Please fill pickup, destination, weight and transport mode, then calculate fare.');
          showToast('Booking Error', 'Please fill pickup, destination, weight and transport mode, then calculate fare.', 'destructive');
          setIsLoading(false);
          return;
        }
        const calcResp = await fetch('http://localhost:5000/api/fare/calculate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            origin: watchAll.pickupAddress,
            destination: watchAll.deliveryAddress,
            weight: watchAll.weight,
            modeOfTransport: watchAll.modeOfTransport,
          }),
        });
        const calcResult = await calcResp.json();
        if (!calcResp.ok || !calcResult.success) {
          setError(calcResult.message || 'Failed to calculate fare');
          showToast('Booking Error', calcResult.message || 'Failed to calculate fare', 'destructive');
          setIsLoading(false);
          return;
        }
        ensuredFare = calcResult.fare;
        ensuredDistance = calcResult.distance;
        setFare(ensuredFare);
        setSummary({
          transport: watchAll.modeOfTransport,
          product: watchAll.productType,
          weight: watchAll.weight,
          pickup: watchAll.pickupDate,
          distance: ensuredDistance,
          breakdown: calcResult.breakdown,
        });
      }

      const payload = {
        ...data,
        fare: ensuredFare,
        distance: ensuredDistance,
      };

      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        setError(result.message || 'Failed to create booking');
        showToast('Booking Error', result.message || 'Failed to create booking', 'destructive');
        setIsLoading(false);
        return;
      }
      setSuccess('Booking created successfully!');
      showToast('Booking Confirmed', 'Your booking has been created and is being processed.', 'destructive');
      reset();
      setFare(null);
      setSummary({});
      setIsConfirmOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      showToast('Booking Error', err instanceof Error ? err.message : 'An error occurred', 'destructive');
    } finally {
      setIsLoading(false);
    }
  };

  // Actual fare calculation using API
  const handleCalculateFare = async () => {
    if (watchAll.pickupAddress && watchAll.deliveryAddress && watchAll.weight && watchAll.modeOfTransport) {
      try {
        const requestData = {
          origin: watchAll.pickupAddress,
          destination: watchAll.deliveryAddress,
          weight: watchAll.weight,
          modeOfTransport: watchAll.modeOfTransport
        };

        const response = await fetch('http://localhost:5000/api/fare/calculate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(requestData),
        });

        const result = await response.json();

        if (result.success) {
          setFare(result.fare);
          setSummary({
            transport: watchAll.modeOfTransport,
            product: watchAll.productType,
            weight: watchAll.weight,
            pickup: watchAll.pickupDate,
            distance: result.distance,
            breakdown: result.breakdown
          });
        } else {
          console.error('Fare calculation failed:', result.message);
          // Fallback to placeholder calculation
          const fallbackFare = 100 + (watchAll.weight || 0) * 2 + (watchAll.modeOfTransport === 'train' ? 20 : 40);
          setFare(fallbackFare);
          setSummary({
            transport: watchAll.modeOfTransport,
            product: watchAll.productType,
            weight: watchAll.weight,
            pickup: watchAll.pickupDate,
            // Unknown distance in fallback
            distance: undefined,
            breakdown: undefined,
          });
        }
      } catch (error) {
        console.error('Fare calculation error:', error);
        // Fallback to placeholder calculation
        const fallbackFare = 100 + (watchAll.weight || 0) * 2 + (watchAll.modeOfTransport === 'train' ? 20 : 40);
        setFare(fallbackFare);
        setSummary({
          transport: watchAll.modeOfTransport,
          product: watchAll.productType,
          weight: watchAll.weight,
          pickup: watchAll.pickupDate,
          distance: undefined,
          breakdown: undefined,
        });
      }
    }
  };

  const handleOpenConfirm = () => {
    setError('');
    if (fare === null) {
      setError('Please calculate fare before confirming your booking.');
      return;
    }
    setIsConfirmOpen(true);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Form */}
      <div className="lg:col-span-2 space-y-8">
        {/* Pickup & Destination */}
        <Card className="bg-white text-gray-900 border border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl font-bold text-gray-900">
              <MapPin className="mr-2 h-6 w-6" /> Pickup & Destination
            </CardTitle>
            <CardDescription className="text-gray-600">Specify pickup and delivery locations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="pickupAddress" className="text-gray-700">Pickup Address</Label>
                <Input
                  id="pickupAddress"
                  placeholder="Enter pickup address"
                  {...register('pickupAddress', { required: 'Pickup address is required' })}
                  className={`${errors.pickupAddress ? 'border-red-500' : 'border-gray-300'} bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500`}
                />
                {errors.pickupAddress && <p className="text-sm text-red-600">{errors.pickupAddress.message}</p>}
              </div>
              <div>
                <Label htmlFor="deliveryAddress" className="text-gray-700">Destination Address</Label>
                <Input
                  id="deliveryAddress"
                  placeholder="Enter destination address"
                  {...register('deliveryAddress', { required: 'Delivery address is required' })}
                  className={`${errors.deliveryAddress ? 'border-red-500' : 'border-gray-300'} bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500`}
                />
                {errors.deliveryAddress && <p className="text-sm text-red-600">{errors.deliveryAddress.message}</p>}
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Shipment Details */}
        <Card className="bg-white text-gray-900 border border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl font-bold text-gray-900">
              <Boxes className="mr-2 h-6 w-6" /> Shipment Details
            </CardTitle>
            <CardDescription className="text-gray-600">Describe your cargo and requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="modeOfTransport" className="text-gray-700">Transport Mode</Label>
                <Select onValueChange={(value) => setValue('modeOfTransport', value)}>
                  <SelectTrigger className="border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select transport mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="train">Train</SelectItem>
                    <SelectItem value="truck">Truck</SelectItem>
                  </SelectContent>
                </Select>
                {errors.modeOfTransport && <p className="text-sm text-red-600">{errors.modeOfTransport.message}</p>}
              </div>
              <div>
                <Label htmlFor="productType" className="text-gray-700">Product Type</Label>
                <Select onValueChange={(value) => setValue('productType', value)}>
                  <SelectTrigger className="border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select product type" />
                  </SelectTrigger>
                  <SelectContent>
                    {productTypes.map((pt) => (
                      <SelectItem key={pt.value} value={pt.value}>{pt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.productType && <p className="text-sm text-red-600">{errors.productType.message}</p>}
              </div>
              <div>
                <Label htmlFor="weight" className="text-gray-700">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="Enter weight in kg"
                  {...register('weight', { required: 'Weight is required', min: { value: 0.1, message: 'Weight must be at least 0.1 kg' } })}
                  className={`${errors.weight ? 'border-red-500' : 'border-gray-300'} bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500`}
                />
                {errors.weight && <p className="text-sm text-red-600">{errors.weight.message}</p>}
              </div>
              <div>
                <Label htmlFor="dimensions" className="text-gray-700">Dimensions (L×W×H cm)</Label>
                <Input
                  id="dimensions"
                  placeholder="e.g., 100×50×30"
                  {...register('dimensions')}
                  className="border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="pickupDate" className="text-gray-700">Preferred Pickup Date</Label>
                <Input
                  id="pickupDate"
                  type="date"
                  {...register('pickupDate')}
                  className="border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="specialInstructions" className="text-gray-700">Special Instructions (Optional)</Label>
                <textarea
                  id="specialInstructions"
                  {...register('specialInstructions')}
                  className="w-full rounded-md bg-white border border-gray-300 p-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Any special handling requirements or delivery instructions"
                  rows={2}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Contact Information */}
        <Card className="bg-white text-gray-900 border border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl font-bold text-gray-900">
              <User className="mr-2 h-6 w-6" /> Contact Information
            </CardTitle>
            <CardDescription className="text-gray-600">Delivery contact details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactName" className="text-gray-700">Contact Name</Label>
                <Input
                  id="contactName"
                  placeholder="Delivery contact person"
                  {...register('contactName', { required: 'Contact name is required' })}
                  className={`${errors.contactName ? 'border-red-500' : 'border-gray-300'} bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500`}
                />
                {errors.contactName && <p className="text-sm text-red-600">{errors.contactName.message}</p>}
              </div>
              <div>
                <Label htmlFor="contactPhone" className="text-gray-700">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  placeholder="Phone number"
                  {...register('contactPhone', { required: 'Contact phone is required' })}
                  className={`${errors.contactPhone ? 'border-red-500' : 'border-gray-300'} bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500`}
                />
                {errors.contactPhone && <p className="text-sm text-red-600">{errors.contactPhone.message}</p>}
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Submit Button */}
        <Button type="button" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg py-3 mt-4" disabled={isLoading} onClick={handleOpenConfirm}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Placing...
            </>
          ) : (
            'Place Booking'
          )}
        </Button>
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="mt-4">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
      </div>
      {/* Sidebar: Fare Calculator & Summary */}
      <div className="space-y-8">
        <Card className="bg-white text-gray-900 border border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-bold text-gray-900">
              <Calculator className="mr-2 h-5 w-5" /> Fare Calculator
            </CardTitle>
            <CardDescription className="text-gray-600">Get instant pricing estimates</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold" onClick={handleCalculateFare}>
              Calculate Fare
            </Button>
            {fare !== null && (
              <div className="mt-4 space-y-2">
                <div className="text-lg font-bold text-green-600">Estimated Fare: ${fare.toFixed(2)}</div>
                <div className="text-sm text-gray-700 space-y-1">
                  <div className="flex justify-between"><span>Distance:</span> <span>{summary?.distance != null ? `${summary.distance.toFixed(2)} km` : '—'}</span></div>
                  {summary?.breakdown && (
                    <>
                      <div className="flex justify-between"><span>Base Fare:</span> <span>${summary.breakdown.baseFare.toFixed(2)}</span></div>
                      <div className="flex justify-between"><span>Distance Cost:</span> <span>${summary.breakdown.distanceCost.toFixed(2)}</span></div>
                      <div className="flex justify-between"><span>Weight Cost:</span> <span>${summary.breakdown.weightCost.toFixed(2)}</span></div>
                    </>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="bg-white text-gray-900 border border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-bold text-gray-900">Booking Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between"><span>Transport:</span> <span>{watchAll.modeOfTransport || 'Not Selected'}</span></div>
              <div className="flex justify-between"><span>Product:</span> <span>{watchAll.productType || 'Not selected'}</span></div>
              <div className="flex justify-between"><span>Weight:</span> <span>{watchAll.weight ? `${watchAll.weight} kg` : 'Not specified'}</span></div>
              <div className="flex justify-between"><span>Distance:</span> <span>{summary.distance ? `${summary.distance.toFixed(2)} km` : 'Calculate fare to see'}</span></div>
              <div className="flex justify-between"><span>Pickup Date:</span> <span>{watchAll.pickupDate || 'Not selected'}</span></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Booking</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex justify-between"><span>Pickup:</span><span>{watchAll.pickupAddress}</span></div>
            <div className="flex justify-between"><span>Destination:</span><span>{watchAll.deliveryAddress}</span></div>
            <div className="flex justify-between"><span>Transport:</span><span className="capitalize">{watchAll.modeOfTransport}</span></div>
            <div className="flex justify-between"><span>Product:</span><span>{watchAll.productType}</span></div>
            <div className="flex justify-between"><span>Weight:</span><span>{watchAll.weight} kg</span></div>
            <div className="flex justify-between"><span>Pickup Date:</span><span>{watchAll.pickupDate || '—'}</span></div>
            <div className="flex justify-between"><span>Contact:</span><span>{watchAll.contactName} ({watchAll.contactPhone})</span></div>
            <div className="flex justify-between"><span>Distance:</span><span>{summary?.distance != null ? `${summary.distance.toFixed(2)} km` : 'To be calculated'}</span></div>
            <div className="flex justify-between font-semibold"><span>Fare:</span><span>${fare?.toFixed(2)}</span></div>
            {summary?.breakdown && (
              <div className="border-t pt-2 space-y-1">
                <div className="flex justify-between"><span>Base Fare</span><span>${summary.breakdown.baseFare.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Distance Cost</span><span>${summary.breakdown.distanceCost.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Weight Cost</span><span>${summary.breakdown.weightCost.toFixed(2)}</span></div>
              </div>
            )}
          </div>
          <DialogFooter>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Button variant="outline" type="button" onClick={() => setIsConfirmOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Confirming Booking...
                  </>
                ) : 'Confirm Booking'}
              </Button>
            </form>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingForm;