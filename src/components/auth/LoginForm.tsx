import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Loader2, User, Shield, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormProps {
  onLoginSuccess: (token: string, user: any) => void;
  onSwitchToRegister: () => void;
}

const roles = [
  { label: 'Customer', value: 'Customer', icon: <User className="mr-2 h-4 w-4" /> },
  { label: 'Admin', value: 'Admin', icon: <Shield className="mr-2 h-4 w-4" /> },
  { label: 'Dispatcher', value: 'Dispatcher', icon: <Truck className="mr-2 h-4 w-4" /> },
];

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onSwitchToRegister }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState('Customer');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, role: selectedRole }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }

      if (result.success) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        onLoginSuccess(result.token, result.user);
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="w-full max-w-md mx-auto bg-white text-gray-900 border border-gray-200 shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-gray-900">Sign In</CardTitle>
          <CardDescription className="text-center text-gray-600">
            Choose your role to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center mb-6">
            <div className="flex w-full rounded-lg overflow-hidden bg-gray-100 border border-gray-300">
              {roles.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  className={`flex-1 flex items-center justify-center py-2 px-4 text-sm font-medium transition-colors focus:outline-none ${selectedRole === role.value ? 'bg-blue-600 text-white' : 'bg-transparent text-gray-700 hover:bg-gray-200'}`}
                  onClick={() => setSelectedRole(role.value)}
                >
                  {role.icon}
                  {role.label}
                </button>
              ))}
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">Email or Phone</Label>
              <Input
                id="email"
                type="text"
                placeholder="Enter your email or phone number"
                {...register('email', {
                  required: 'Email or phone is required',
                })}
                className={`${errors.email ? 'border-red-500' : 'border-gray-300'} bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500`}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  className={`${errors.password ? 'border-red-500' : 'border-gray-300'} bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
            <div className="text-center mt-2">
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800 text-sm"
              // onClick={handleForgotPassword} // Optionally add this handler
              >
                Forgot your password?
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-center mt-4">
        <span className="text-gray-600">Don't have an account? </span>
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Sign up here
        </button>
      </div>
    </>
  );
};

export default LoginForm;
