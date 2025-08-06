import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Truck, Shield, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth, UserRole } from "@/contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (role: UserRole) => {
    setLoading(true);
    
    // Simulate API call - in real app, this would authenticate with backend
    setTimeout(() => {
      // Mock user data based on role
      const userData = {
        id: `${role}-001`,
        name: role === 'admin' ? 'Sarah Johnson' : role === 'dispatcher' ? 'Mike Rodriguez' : 'John Smith',
        email: `${role}@cargostream.com`,
        role: role,
        avatar: undefined
      };

      login(userData);
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${userData.name}!`,
      });
      
      // Navigate based on role
      switch (role) {
        case 'customer':
          navigate('/dashboard');
          break;
        case 'admin':
          navigate('/admin');
          break;
        case 'dispatcher':
          navigate('/dispatcher');
          break;
      }
      setLoading(false);
    }, 1000);
  };

  const LoginForm = ({ role }: { role: UserRole }) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleLogin(role);
      }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor={`${role}-email`}>Email or Phone</Label>
        <Input
          id={`${role}-email`}
          type="text"
          placeholder="Enter your email or phone number"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${role}-password`}>Password</Label>
        <Input
          id={`${role}-password`}
          type="password"
          placeholder="Enter your password"
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </Button>
      <div className="text-center">
        <Link to="/forgot-password" className="text-sm text-muted-foreground hover:text-primary">
          Forgot your password?
        </Link>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Welcome */}
        <div className="text-center space-y-2">
          <div className="mx-auto bg-primary p-3 rounded-full w-fit">
            <Truck className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Welcome to CargoStream</h1>
          <p className="text-muted-foreground">Sign in to access your delivery platform</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Choose your role to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="customer" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="customer" className="text-xs">
                  <Users className="h-4 w-4 mr-1" />
                  Customer
                </TabsTrigger>
                <TabsTrigger value="admin" className="text-xs">
                  <Shield className="h-4 w-4 mr-1" />
                  Admin
                </TabsTrigger>
                <TabsTrigger value="dispatcher" className="text-xs">
                  <Truck className="h-4 w-4 mr-1" />
                  Dispatcher
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="customer" className="mt-6">
                <LoginForm role="customer" />
              </TabsContent>
              
              <TabsContent value="admin" className="mt-6">
                <LoginForm role="admin" />
              </TabsContent>
              
              <TabsContent value="dispatcher" className="mt-6">
                <LoginForm role="dispatcher" />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-primary hover:underline">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}