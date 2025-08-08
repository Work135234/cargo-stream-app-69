import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { Truck } from 'lucide-react';

const AuthContainer: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login } = useAuth();

  const handleAuthSuccess = (token: string, user: any) => {
    login(token, user);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#18181b] py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center mb-8">
        <div className="bg-blue-600 rounded-full p-4 mb-4">
          <Truck className="text-white w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2 text-center">Welcome to CargoStream</h1>
        <p className="text-gray-300 text-center">Sign in to access your delivery platform</p>
      </div>
      <div className="w-full max-w-md">
        {isLogin ? (
          <LoginForm
            onLoginSuccess={handleAuthSuccess}
            onSwitchToRegister={() => setIsLogin(false)}
          />
        ) : (
          <RegisterForm
            onRegisterSuccess={handleAuthSuccess}
            onSwitchToLogin={() => setIsLogin(true)}
          />
        )}
      </div>
    </div>
  );
};

export default AuthContainer;
