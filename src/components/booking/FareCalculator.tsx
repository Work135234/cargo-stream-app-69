import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Calculator, Loader2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '../../contexts/AuthContext';

interface FareCalculatorData {
  pickupAddress: string;
  deliveryAddress: string;
  weight: number;
  modeOfTransport: string;
}

interface FareResult {
  fare: number;
  distance: number;
  breakdown: {
    baseFare: number;
    distanceCost: number;
    weightCost: number;
    totalDistance: number;
  };
}

const FareCalculator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fareResult, setFareResult] = useState<FareResult | null>(null);
  const { token } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FareCalculatorData>();

  const onSubmit = async (data: FareCalculatorData) => {
    setIsLoading(true);
    setError('');
    setFareResult(null);

    try {
      // Map the field names to match backend expectations
      const requestData = {
        origin: data.pickupAddress,
        destination: data.deliveryAddress,
        weight: data.weight,
        modeOfTransport: data.modeOfTransport
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

      if (!response.ok) {
        throw new Error(result.message || 'Failed to calculate fare');
      }

      if (result.success) {
        setFareResult(result);
      } else {
        setError(result.message || 'Failed to calculate fare');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="mr-2 h-5 w-5" />
            Fare Calculator
          </CardTitle>
          <CardDescription>
            Calculate delivery fare based on distance, weight, and transport mode
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pickupAddress">Pickup Address</Label>
                <Input
                  id="pickupAddress"
                  placeholder="Enter pickup address"
                  {...register('pickupAddress', {
                    required: 'Pickup address is required',
                  })}
                  className={errors.pickupAddress ? 'border-red-500' : ''}
                />
                {errors.pickupAddress && (
                  <p className="text-sm text-red-500">{errors.pickupAddress.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliveryAddress">Delivery Address</Label>
                <Input
                  id="deliveryAddress"
                  placeholder="Enter delivery address"
                  {...register('deliveryAddress', {
                    required: 'Delivery address is required',
                  })}
                  className={errors.deliveryAddress ? 'border-red-500' : ''}
                />
                {errors.deliveryAddress && (
                  <p className="text-sm text-red-500">{errors.deliveryAddress.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="Enter weight in kg"
                  {...register('weight', {
                    required: 'Weight is required',
                    min: { value: 0.1, message: 'Weight must be at least 0.1 kg' },
                  })}
                  className={errors.weight ? 'border-red-500' : ''}
                />
                {errors.weight && (
                  <p className="text-sm text-red-500">{errors.weight.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="modeOfTransport">Transport Mode</Label>
                <Select onValueChange={(value) => setValue('modeOfTransport', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transport mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="train">Train</SelectItem>
                    <SelectItem value="truck">Truck</SelectItem>
                  </SelectContent>
                </Select>
                {errors.modeOfTransport && (
                  <p className="text-sm text-red-500">{errors.modeOfTransport.message}</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate Fare
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {fareResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Fare Calculation Result
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Total Fare</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${fareResult.fare.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Distance</p>
                  <p className="text-lg font-semibold">
                    {fareResult.distance.toFixed(2)} km
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Fare Breakdown</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Base Fare:</span>
                    <span>${fareResult.breakdown.baseFare.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Distance Cost:</span>
                    <span>${fareResult.breakdown.distanceCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Weight Cost:</span>
                    <span>${fareResult.breakdown.weightCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-semibold">
                    <span>Total:</span>
                    <span>${fareResult.fare.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FareCalculator;
