
// // Header.tsx
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Truck, User, LogOut } from "lucide-react";
// import NotificationBell from "./NotificationBell";
// import { useAuth } from "@/contexts/AuthContext";  // <-- real context

// export const Header = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { user, logout } = useAuth();

//   // derive role once
//   const role = user?.role?.toLowerCase();

//   const handleLogout = () => {
//     logout();        // clears token + context
//     navigate("/login");
//   };

//   const getRoleColor = (r?: string) => {
//     switch (r) {
//       case "admin": return "bg-destructive";
//       case "dispatcher": return "bg-accent";
//       default: return "bg-primary";
//     }
//   };

//   return (
//     <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
//       <div className="container mx-auto px-4">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo */}
//           <Link to="/" className="flex items-center space-x-2">
//             <div className="bg-primary p-2 rounded-lg">
//               <Truck className="h-6 w-6 text-primary-foreground" />
//             </div>
//             <div>
//               <h1 className="text-xl font-bold text-foreground">CargoStream</h1>
//               <p className="text-xs text-muted-foreground">Delivery Platform</p>
//             </div>
//           </Link>

//           {/* Navigation */}
//           <nav className="hidden md:flex items-center space-x-6">
//             {role && (
//               <>
//                 {role === "customer" && (
//                   <>
//                     <Link to="/dashboard">Dashboard</Link>
//                     <Link to="/booking">New Booking</Link>
//                     <Link to="/tracking">Track Orders</Link>
//                   </>
//                 )}
//                 {role === "admin" && (
//                   <>
//                     <Link to="/dashboard">Dashboard</Link>
//                     <Link to="/admin/bookings">Bookings</Link>
//                     <Link to="/admin/users">Users</Link>
//                     <Link to="/admin/reports">Reports</Link>
//                   </>
//                 )}
//                 {role === "dispatcher" && (
//                   <>
//                     <Link to="/dashboard">Dashboard</Link>
//                     <Link to="/dispatcher/deliveries">My Deliveries</Link>
//                   </>
//                 )}
//               </>
//             )}
//           </nav>

//           {/* Right side */}
//           <div className="flex items-center space-x-4">
//             {user ? (
//               <>
//                 <NotificationBell />
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="ghost" className="h-8 w-8 rounded-full">
//                       <Avatar>
//                         <AvatarImage src="/placeholder-avatar.jpg" alt={user.name} />
//                         <AvatarFallback>{user.name?.[0]?.toUpperCase()}</AvatarFallback>
//                       </Avatar>
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent className="w-56" align="end" forceMount>
//                     <div className="flex items-center gap-2 p-2">
//                       <div className="flex flex-col">
//                         <p className="font-medium">{user.name}</p>
//                         <Badge className={`text-xs ${getRoleColor(role)}`}>
//                           {role?.charAt(0).toUpperCase() + role?.slice(1)}
//                         </Badge>
//                       </div>
//                     </div>
//                     <DropdownMenuItem onClick={handleLogout}>
//                       <LogOut className="mr-2 h-4 w-4" />
//                       Log out
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </>
//             ) : (
//               <div className="flex items-center space-x-2">
//                 <Button variant="ghost" asChild>
//                   <Link to="/login">Login</Link>
//                 </Button>
//                 <Button asChild>
//                   <Link to="/register">Register</Link>
//                 </Button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };












// Header.tsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Truck, User, LogOut } from "lucide-react";
import NotificationBell from "./NotificationBell";
import { useAuth } from "@/contexts/AuthContext";  // <-- real context

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // derive role once, safely handle undefined
  const role = typeof user?.role === 'string' ? user.role.toLowerCase() : undefined;

  const handleLogout = () => {
    logout();        // clears token + context
    navigate("/login");
  };

  const getRoleColor = (r?: string) => {
    switch (r) {
      case "admin": return "bg-destructive";
      case "dispatcher": return "bg-accent";
      default: return "bg-primary";
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
            {role && (
              <>
                {role === "customer" && (
                  <>
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/dashboard/create-booking">New Booking</Link>
                    <Link to="/tracking">Track Orders</Link>
                  </>
                )}
                {role === "admin" && (
                  <>
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/admin/bookings">Bookings</Link>
                    <Link to="/admin/users">Users</Link>
                    <Link to="/admin/reports">Reports</Link>
                  </>
                )}
                {role === "dispatcher" && (
                  <>
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/dispatcher/deliveries">My Deliveries</Link>
                  </>
                )}
              </>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <NotificationBell />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 rounded-full">
                      <Avatar>
                        <AvatarImage src="/placeholder-avatar.jpg" alt={user.name} />
                        <AvatarFallback>{user.name?.[0]?.toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center gap-2 p-2">
                      <div className="flex flex-col">
                        <p className="font-medium">{user.name}</p>
                        <Badge className={`text-xs ${getRoleColor(role)}`}>
                          {role?.charAt(0).toUpperCase() + role?.slice(1)}
                        </Badge>
                      </div>
                    </div>
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