import { NavLink, useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Package, 
  Search, 
  Bell, 
  Users, 
  FileText, 
  Settings,
  Truck,
  ClipboardList,
  MessageSquare,
  LogOut
} from "lucide-react";

const navigationConfig = {
  customer: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "New Booking", url: "/booking", icon: Package },
    { title: "Track Orders", url: "/tracking", icon: Search },
    { title: "Notifications", url: "/notifications", icon: Bell },
  ],
  admin: [
    { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
    { title: "Manage Bookings", url: "/admin/bookings", icon: Package },
    { title: "Manage Users", url: "/admin/users", icon: Users },
    { title: "Pricing Settings", url: "/admin/pricing", icon: Settings },
    { title: "Reports", url: "/admin/reports", icon: FileText },
  ],
  dispatcher: [
    { title: "Assigned Deliveries", url: "/dispatcher", icon: Truck },
    { title: "Update Status", url: "/dispatcher/status", icon: ClipboardList },
    { title: "Notes", url: "/dispatcher/notes", icon: MessageSquare },
  ]
};

const getRoleColor = (role: UserRole) => {
  switch (role) {
    case 'admin': return 'destructive';
    case 'dispatcher': return 'accent';
    default: return 'primary';
  }
};

const getRoleDisplayName = (role: UserRole) => {
  switch (role) {
    case 'admin': return 'Admin';
    case 'dispatcher': return 'Dispatcher';
    default: return 'Customer';
  }
};

export function RoleBasedSidebar() {
  const { user, logout } = useAuth();
  const { state } = useSidebar();
  const navigate = useNavigate();

  if (!user) return null;

  const navigationItems = navigationConfig[user.role] || [];
  const isCollapsed = state === "collapsed";

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Sidebar className={isCollapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarHeader className="p-4">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>
                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <Badge 
                variant="secondary" 
                className={`text-xs bg-${getRoleColor(user.role)}/10 text-${getRoleColor(user.role)}`}
              >
                {getRoleDisplayName(user.role)}
              </Badge>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="flex justify-center">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-xs">
                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{!isCollapsed ? 'Navigation' : ''}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive 
                            ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' 
                            : 'hover:bg-sidebar-accent/50'
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className="w-full justify-start"
          size={isCollapsed ? "icon" : "default"}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span className="ml-2">Logout</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}