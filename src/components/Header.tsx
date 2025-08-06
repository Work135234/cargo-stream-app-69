import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Truck, User, Settings, LogOut, Bell } from "lucide-react";

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<'customer' | 'admin' | 'dispatcher' | null>('customer'); // Mock state

  const handleLogout = () => {
    setUserRole(null);
    navigate('/login');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-destructive';
      case 'dispatcher': return 'bg-accent';
      default: return 'bg-primary';
    }
  };

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary p-2 rounded-lg">
              <Truck className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">CargoStream</h1>
              <p className="text-xs text-muted-foreground">Delivery Platform</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {userRole && (
              <>
                {userRole === 'customer' && (
                  <>
                    <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                      Dashboard
                    </Link>
                    <Link to="/booking" className="text-sm font-medium hover:text-primary transition-colors">
                      New Booking
                    </Link>
                    <Link to="/tracking" className="text-sm font-medium hover:text-primary transition-colors">
                      Track Orders
                    </Link>
                  </>
                )}
                {userRole === 'admin' && (
                  <>
                    <Link to="/admin" className="text-sm font-medium hover:text-primary transition-colors">
                      Dashboard
                    </Link>
                    <Link to="/admin/bookings" className="text-sm font-medium hover:text-primary transition-colors">
                      Bookings
                    </Link>
                    <Link to="/admin/users" className="text-sm font-medium hover:text-primary transition-colors">
                      Users
                    </Link>
                    <Link to="/admin/reports" className="text-sm font-medium hover:text-primary transition-colors">
                      Reports
                    </Link>
                  </>
                )}
                {userRole === 'dispatcher' && (
                  <>
                    <Link to="/dispatcher" className="text-sm font-medium hover:text-primary transition-colors">
                      Dashboard
                    </Link>
                    <Link to="/dispatcher/deliveries" className="text-sm font-medium hover:text-primary transition-colors">
                      My Deliveries
                    </Link>
                  </>
                )}
              </>
            )}
          </nav>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {userRole ? (
              <>
                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 text-xs bg-accent">
                    3
                  </Badge>
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">John Doe</p>
                        <div className="flex items-center gap-2">
                          <Badge className={`text-xs ${getRoleColor(userRole)}`}>
                            {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};