// import React, { useState, useEffect } from 'react';
// import { Settings, Plus, Edit, Trash2, Loader2, Save, X } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { useAuth } from '../../contexts/AuthContext';

// interface PricingRule {
//   _id: string;
//   modeOfTransport: string;
//   baseFare: number;
//   perKmRate: number;
//   perKgRate: number;
//   isActive: boolean;
// }

// const PricingRules: React.FC = () => {
//   const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [editingRule, setEditingRule] = useState<PricingRule | null>(null);
//   const [showForm, setShowForm] = useState(false);
//   const { token } = useAuth();

//   const [formData, setFormData] = useState({
//     modeOfTransport: '',
//     baseFare: '',
//     perKmRate: '',
//     perKgRate: '',
//     isActive: true
//   });

//   const fetchPricingRules = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch('http://localhost:5000/api/admin/pricing-rules', {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       const result = await response.json();

//       if (result.success) {
//         setPricingRules(result.pricingRules);
//       } else {
//         setError(result.message || 'Failed to fetch pricing rules');
//       }
//     } catch (err) {
//       setError('Failed to fetch pricing rules');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPricingRules();
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const url = editingRule
//         ? `http://localhost:5000/api/admin/pricing-rules/${editingRule._id}`
//         : 'http://localhost:5000/api/admin/pricing-rules';

//       const method = editingRule ? 'PUT' : 'POST';

//       const response = await fetch(url, {
//         method,
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           ...formData,
//           baseFare: parseFloat(formData.baseFare),
//           perKmRate: parseFloat(formData.perKmRate),
//           perKgRate: parseFloat(formData.perKgRate),
//         }),
//       });

//       const result = await response.json();

//       if (result.success) {
//         setSuccess(editingRule ? 'Pricing rule updated successfully!' : 'Pricing rule created successfully!');
//         fetchPricingRules();
//         resetForm();
//       } else {
//         setError(result.message || 'Failed to save pricing rule');
//       }
//     } catch (err) {
//       setError('Failed to save pricing rule');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (rule: PricingRule) => {
//     setEditingRule(rule);
//     setFormData({
//       modeOfTransport: rule.modeOfTransport,
//       baseFare: rule.baseFare.toString(),
//       perKmRate: rule.perKmRate.toString(),
//       perKgRate: rule.perKgRate.toString(),
//       isActive: rule.isActive
//     });
//     setShowForm(true);
//   };

//   const handleDelete = async (ruleId: string) => {
//     if (!confirm('Are you sure you want to delete this pricing rule?')) return;

//     try {
//       const response = await fetch(`http://localhost:5000/api/admin/pricing-rules/${ruleId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       const result = await response.json();

//       if (result.success) {
//         setSuccess('Pricing rule deleted successfully!');
//         fetchPricingRules();
//       } else {
//         setError(result.message || 'Failed to delete pricing rule');
//       }
//     } catch (err) {
//       setError('Failed to delete pricing rule');
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       modeOfTransport: '',
//       baseFare: '',
//       perKmRate: '',
//       perKgRate: '',
//       isActive: true
//     });
//     setEditingRule(null);
//     setShowForm(false);
//   };

//   const getStatusBadge = (isActive: boolean) => {
//     return isActive
//       ? 'bg-green-100 text-green-800'
//       : 'bg-gray-100 text-gray-800';
//   };

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <div>
//               <CardTitle className="flex items-center">
//                 <Settings className="mr-2 h-5 w-5" />
//                 Pricing Rules
//               </CardTitle>
//               <CardDescription>
//                 Manage fare calculation rules for different transport modes
//               </CardDescription>
//             </div>
//             <Button onClick={() => setShowForm(true)}>
//               <Plus className="mr-2 h-4 w-4" />
//               Add Rule
//             </Button>
//           </div>
//         </CardHeader>
//         <CardContent>
//           {error && (
//             <Alert variant="destructive" className="mb-4">
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           )}

//           {success && (
//             <Alert className="mb-4">
//               <AlertDescription>{success}</AlertDescription>
//             </Alert>
//           )}

//           {/* Add/Edit Form */}
//           {showForm && (
//             <Card className="mb-6">
//               <CardHeader>
//                 <CardTitle className="flex items-center justify-between">
//                   {editingRule ? 'Edit Pricing Rule' : 'Add New Pricing Rule'}
//                   <Button variant="outline" size="sm" onClick={resetForm}>
//                     <X className="h-4 w-4" />
//                   </Button>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="modeOfTransport">Transport Mode</Label>
//                       <Select
//                         value={formData.modeOfTransport}
//                         onValueChange={(value) => setFormData({ ...formData, modeOfTransport: value })}
//                       >
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select transport mode" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="train">Train</SelectItem>
//                           <SelectItem value="truck">Truck</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="baseFare">Base Fare ($)</Label>
//                       <Input
//                         id="baseFare"
//                         type="number"
//                         step="0.01"
//                         value={formData.baseFare}
//                         onChange={(e) => setFormData({ ...formData, baseFare: e.target.value })}
//                         required
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="perKmRate">Per KM Rate ($)</Label>
//                       <Input
//                         id="perKmRate"
//                         type="number"
//                         step="0.01"
//                         value={formData.perKmRate}
//                         onChange={(e) => setFormData({ ...formData, perKmRate: e.target.value })}
//                         required
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="perKgRate">Per KG Rate ($)</Label>
//                       <Input
//                         id="perKgRate"
//                         type="number"
//                         step="0.01"
//                         value={formData.perKgRate}
//                         onChange={(e) => setFormData({ ...formData, perKgRate: e.target.value })}
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div className="flex items-center space-x-2">
//                     <input
//                       type="checkbox"
//                       id="isActive"
//                       checked={formData.isActive}
//                       onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
//                     />
//                     <Label htmlFor="isActive">Active</Label>
//                   </div>

//                   <div className="flex gap-2">
//                     <Button type="submit" disabled={loading}>
//                       {loading ? (
//                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       ) : (
//                         <Save className="mr-2 h-4 w-4" />
//                       )}
//                       {editingRule ? 'Update Rule' : 'Create Rule'}
//                     </Button>
//                     <Button type="button" variant="outline" onClick={resetForm}>
//                       Cancel
//                     </Button>
//                   </div>
//                 </form>
//               </CardContent>
//             </Card>
//           )}

//           {/* Pricing Rules List */}
//           {loading ? (
//             <div className="flex justify-center py-8">
//               <Loader2 className="h-8 w-8 animate-spin" />
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {pricingRules.map((rule) => (
//                 <Card key={rule._id}>
//                   <CardContent className="p-4">
//                     <div className="flex items-center justify-between">
//                       <div className="flex-1">
//                         <div className="flex items-center gap-3">
//                           <div>
//                             <h3 className="font-semibold capitalize">{rule.modeOfTransport}</h3>
//                             <div className="text-sm text-gray-600 space-y-1">
//                               <p>Base Fare: ${rule.baseFare}</p>
//                               <p>Per KM: ${rule.perKmRate}</p>
//                               <p>Per KG: ${rule.perKgRate}</p>
//                             </div>
//                           </div>
//                           <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(rule.isActive)}`}>
//                             {rule.isActive ? 'Active' : 'Inactive'}
//                           </span>
//                         </div>
//                       </div>
//                       <div className="flex gap-2">
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={() => handleEdit(rule)}
//                         >
//                           <Edit className="h-4 w-4" />
//                         </Button>
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={() => handleDelete(rule._id)}
//                           className="text-red-600 hover:text-red-700"
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default PricingRules;


import React, { useState, useEffect } from 'react';
import { Settings, Plus, Edit, Trash2, Loader2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '../../contexts/AuthContext';

interface PricingRule {
  _id: string;
  modeOfTransport: string;
  baseFare: number;
  perKmRate: number;
  perKgRate: number;
  isActive: boolean;
}

const PricingRules: React.FC = () => {
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingRule, setEditingRule] = useState<PricingRule | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [choiceModal, setChoiceModal] = useState<PricingRule[] | null>(null);
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    modeOfTransport: '',
    baseFare: '',
    perKmRate: '',
    perKgRate: '',
    isActive: true,
  });

  const fetchPricingRules = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/admin/pricing-rules', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (result.success) setPricingRules(result.pricingRules);
      else setError(result.message || 'Failed to fetch pricing rules');
    } catch {
      setError('Failed to fetch pricing rules');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPricingRules();
  }, []);

  const resetForm = () => {
    setFormData({ modeOfTransport: '', baseFare: '', perKmRate: '', perKgRate: '', isActive: true });
    setEditingRule(null);
    setShowForm(false);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Parse numbers
    const baseFare = parseFloat(formData.baseFare);
    const perKmRate = parseFloat(formData.perKmRate);
    const perKgRate = parseFloat(formData.perKgRate);

    // Basic validation
    if (
      !formData.modeOfTransport ||
      isNaN(baseFare) ||
      isNaN(perKmRate) ||
      isNaN(perKgRate)
    ) {
      setError('Please provide valid numeric values for all fields.');
      setLoading(false);
      return;
    }

    const payload = {
      modeOfTransport: formData.modeOfTransport,
      baseFare,
      perKmRate,
      perKgRate,
      isActive: formData.isActive,
    };

    try {
      const url = editingRule
        ? `http://localhost:5000/api/admin/pricing-rules/${editingRule._id}`
        : 'http://localhost:5000/api/admin/pricing-rules';
      const method = editingRule ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to save pricing rule');
      }

      setSuccess(editingRule ? 'Pricing rule updated!' : 'Pricing rule created!');
      fetchPricingRules();
      resetForm();
    } catch (err: any) {
      setError(err.message || 'Failed to save pricing rule');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (rule: PricingRule) => {
    setEditingRule(rule);
    setFormData({
      modeOfTransport: rule.modeOfTransport,
      baseFare: rule.baseFare.toString(),
      perKmRate: rule.perKmRate.toString(),
      perKgRate: rule.perKgRate.toString(),
      isActive: rule.isActive,
    });
    setShowForm(true);
  };

  const handleDelete = async (ruleId: string) => {
    if (!confirm('Delete this rule?')) return;
    await fetch(`http://localhost:5000/api/admin/pricing-rules/${ruleId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchPricingRules();
  };

  const handleToggle = async (rule: PricingRule) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/pricing-rules/${rule._id}/toggle`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.type === 'MANUAL_CHOICE_REQUIRED') {
        setChoiceModal(data.rules);
      } else if (data.success) {
        setSuccess('Rule toggled!');
        fetchPricingRules();
      } else {
        setError(data.message);
      }
    } catch {
      setError('Failed to toggle rule');
    }
  };

  const confirmChoice = async (id: string) => {
    await fetch(`http://localhost:5000/api/admin/pricing-rules/${id}/toggle`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ force: true }),
    });
    setChoiceModal(null);
    fetchPricingRules();
  };

  const getStatusBadge = (isActive: boolean) =>
    isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                Pricing Rules
              </CardTitle>
              <CardDescription>
                Manage fare calculation rules for different transport modes
              </CardDescription>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Rule
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {error && <Alert variant="destructive">{error}</Alert>}
          {success && <Alert>{success}</Alert>}

          {showForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {editingRule ? 'Edit Pricing Rule' : 'Add New Pricing Rule'}
                  <Button variant="outline" size="sm" onClick={resetForm}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select value={formData.modeOfTransport} onValueChange={(v) => setFormData({ ...formData, modeOfTransport: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select transport mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="train">Train</SelectItem>
                        <SelectItem value="truck">Truck</SelectItem>
                      </SelectContent>
                    </Select>

                    <Input placeholder="Base Fare" type="number" step="0.01" value={formData.baseFare} onChange={(e) => setFormData({ ...formData, baseFare: e.target.value })} required />
                    <Input placeholder="Per KM Rate" type="number" step="0.01" value={formData.perKmRate} onChange={(e) => setFormData({ ...formData, perKmRate: e.target.value })} required />
                    <Input placeholder="Per KG Rate" type="number" step="0.01" value={formData.perKgRate} onChange={(e) => setFormData({ ...formData, perKgRate: e.target.value })} required />
                  </div>

                  <label className="flex items-center space-x-2">
                    <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
                    <span>Active</span>
                  </label>

                  <div className="flex gap-2">
                    <Button type="submit" disabled={loading}>
                      {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
                      {editingRule ? 'Update Rule' : 'Create Rule'}
                    </Button>
                    <Button variant="outline" onClick={resetForm}>Cancel</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {pricingRules.map((rule) => (
                  <Card key={rule._id}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold capitalize">{rule.modeOfTransport}</h3>
                        <p className="text-sm text-gray-600">
                          Base ${rule.baseFare} · Per KM ${rule.perKmRate} · Per KG ${rule.perKgRate}
                        </p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(rule.isActive)}`}>
                          {rule.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleToggle(rule)}>
                          {rule.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(rule)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(rule._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {choiceModal && (
                <Card className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <Card className="max-w-md w-full mx-4">
                    <CardHeader>
                      <CardTitle>Choose the active rule for {choiceModal[0]?.modeOfTransport}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {choiceModal.map((r) => (
                        <Button
                          key={r._id}
                          variant="outline"
                          className="w-full"
                          onClick={() => confirmChoice(r._id)}
                        >
                          {r.modeOfTransport} – Base ${r.baseFare}
                        </Button>
                      ))}
                      <Button variant="ghost" className="w-full" onClick={() => setChoiceModal(null)}>
                        Cancel
                      </Button>
                    </CardContent>
                  </Card>
                </Card>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingRules;