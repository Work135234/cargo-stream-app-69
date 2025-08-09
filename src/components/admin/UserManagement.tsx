// import React, { useState, useEffect } from 'react';
// import { Users, Edit, Trash2, Search, Plus, Loader2 } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { useAuth } from '../../contexts/AuthContext';

// interface User {
//   _id: string;
//   name: string;
//   email: string;
//   role: string;
//   createdAt: string;
// }

// interface Pagination {
//   currentPage: number;
//   totalPages: number;
//   totalUsers: number;
//   hasNext: boolean;
//   hasPrev: boolean;
// }

// const UserManagement: React.FC = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [pagination, setPagination] = useState<Pagination | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [search, setSearch] = useState('');
//   const [roleFilter, setRoleFilter] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const { token } = useAuth();

//   const fetchUsers = async () => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams({
//         page: currentPage.toString(),
//         limit: '10',
//         ...(search && { search }),
//         ...(roleFilter && roleFilter !== 'all' && { role: roleFilter })
//       });

//       const response = await fetch(`http://localhost:5000/api/admin/users?${params}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       const result = await response.json();

//       if (result.success) {
//         setUsers(result.users);
//         setPagination(result.pagination);
//       } else {
//         setError(result.message || 'Failed to fetch users');
//       }
//     } catch (err) {
//       setError('Failed to fetch users');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, [currentPage, search, roleFilter]);

//   const handleDeleteUser = async (userId: string) => {
//     if (!confirm('Are you sure you want to delete this user?')) return;

//     try {
//       const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       const result = await response.json();

//       if (result.success) {
//         fetchUsers();
//       } else {
//         setError(result.message || 'Failed to delete user');
//       }
//     } catch (err) {
//       setError('Failed to delete user');
//     }
//   };

//   const getStatusBadge = (role: string) => {
//     const colors = {
//       Admin: 'bg-red-100 text-red-800',
//       Customer: 'bg-blue-100 text-blue-800',
//       Dispatcher: 'bg-green-100 text-green-800'
//     };
//     return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
//   };

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center">
//             <Users className="mr-2 h-5 w-5" />
//             User Management
//           </CardTitle>
//           <CardDescription>
//             Manage users, their roles, and permissions
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {error && (
//             <Alert variant="destructive" className="mb-4">
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           )}

//           {/* Filters */}
//           <div className="flex flex-col md:flex-row gap-4 mb-6">
//             <div className="flex-1">
//               <Input
//                 placeholder="Search users..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="max-w-sm"
//               />
//             </div>
//             <Select value={roleFilter} onValueChange={setRoleFilter}>
//               <SelectTrigger className="w-full md:w-48">
//                 <SelectValue placeholder="Filter by role" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Roles</SelectItem>
//                 <SelectItem value="Admin">Admin</SelectItem>
//                 <SelectItem value="Customer">Customer</SelectItem>
//                 <SelectItem value="Dispatcher">Dispatcher</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Users Table */}
//           {loading ? (
//             <div className="flex justify-center py-8">
//               <Loader2 className="h-8 w-8 animate-spin" />
//             </div>
//           ) : (
//             <div className="space-y-4">
//               <div className="grid gap-4">
//                 {users.map((user) => (
//                   <Card key={user._id}>
//                     <CardContent className="p-4">
//                       <div className="flex items-center justify-between">
//                         <div className="flex-1">
//                           <div className="flex items-center gap-3">
//                             <div>
//                               <h3 className="font-semibold">{user.name}</h3>
//                               <p className="text-sm text-gray-600">{user.email}</p>
//                             </div>
//                             <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(user.role)}`}>
//                               {user.role}
//                             </span>
//                           </div>
//                           <p className="text-xs text-gray-500 mt-1">
//                             Joined: {new Date(user.createdAt).toLocaleDateString()}
//                           </p>
//                         </div>
//                         <div className="flex gap-2">
//                           <Button size="sm" variant="outline">
//                             <Edit className="h-4 w-4" />
//                           </Button>
//                           <Button
//                             size="sm"
//                             variant="outline"
//                             onClick={() => handleDeleteUser(user._id)}
//                             className="text-red-600 hover:text-red-700"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>

//               {/* Pagination */}
//               {pagination && (
//                 <div className="flex items-center justify-between">
//                   <p className="text-sm text-gray-600">
//                     Showing {((pagination.currentPage - 1) * 10) + 1} to {Math.min(pagination.currentPage * 10, pagination.totalUsers)} of {pagination.totalUsers} users
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
//     </div>
//   );
// };

// export default UserManagement;












import React, { useState, useEffect } from 'react';
import { Users, Edit, Trash2, Search, Plus, Loader2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '../../contexts/AuthContext';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    role: ''
  });
  const { token } = useAuth();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(search && { search }),
        ...(roleFilter && roleFilter !== 'all' && { role: roleFilter })
      });

      const response = await fetch(`http://localhost:5000/api/admin/users?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        setUsers(result.users);
        setPagination(result.pagination);
      } else {
        setError(result.message || 'Failed to fetch users');
      }
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, search, roleFilter]);

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      role: user.role
    });
    setShowEditForm(true);
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${editingUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editFormData),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess('User updated successfully!');
        setShowEditForm(false);
        setEditingUser(null);
        fetchUsers();
      } else {
        setError(result.message || 'Failed to update user');
      }
    } catch (err) {
      setError('Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        setSuccess('User deleted successfully!');
        fetchUsers();
      } else {
        setError(result.message || 'Failed to delete user');
      }
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  const getStatusBadge = (role: string) => {
    const colors = {
      Admin: 'bg-red-100 text-red-800',
      Customer: 'bg-blue-100 text-blue-800',
      Dispatcher: 'bg-green-100 text-green-800'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
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
            <Users className="mr-2 h-5 w-5" />
            User Management
          </CardTitle>
          <CardDescription>
            Manage users, their roles, and permissions
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

          {/* Edit User Form */}
          {showEditForm && editingUser && (
            <Card className="mb-6 border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Edit User: {editingUser.name}
                  <Button variant="outline" size="sm" onClick={() => setShowEditForm(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <Input
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      placeholder="User name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      value={editFormData.email}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      placeholder="User email"
                      type="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Role</label>
                    <Select value={editFormData.role} onValueChange={(value) => setEditFormData({ ...editFormData, role: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Customer">Customer</SelectItem>
                        <SelectItem value="Dispatcher">Dispatcher</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={handleUpdateUser} disabled={loading}>
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Update User
                  </Button>
                  <Button variant="outline" onClick={() => setShowEditForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Customer">Customer</SelectItem>
                <SelectItem value="Dispatcher">Dispatcher</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users Table */}
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4">
                {users.map((user) => (
                  <Card key={user._id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div>
                              <h3 className="font-semibold">{user.name}</h3>
                              <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(user.role)}`}>
                              {user.role}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Joined: {formatDate(user.createdAt)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditUser(user)}
                            disabled={showEditForm}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteUser(user._id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {pagination && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Showing {((pagination.currentPage - 1) * 10) + 1} to {Math.min(pagination.currentPage * 10, pagination.totalUsers)} of {pagination.totalUsers} users
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
    </div>
  );
};

export default UserManagement;
