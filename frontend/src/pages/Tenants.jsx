import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTenants } from '../hooks/useTenants';
import { tenantService } from '../services/tenantService';
import { UserPlus, Loader2, Phone, Building2, Home, IndianRupee, Eye, Trash2 } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';

const Tenants = () => {
  const { currentUser } = useAuth();
  const { tenants, loading, refresh } = useTenants(currentUser.uid);

  const handleDelete = async (id, unitIds) => {
    if (window.confirm('Are you sure you want to remove this tenant? All associated units will be marked as vacant.')) {
      try {
        await tenantService.delete(id, unitIds);
        refresh();
      } catch (err) {
        alert('Failed to remove tenant. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tenants Directory</h1>
          <p className="text-gray-500 mt-1">Manage active leases and tenant information.</p>
        </div>
        <Link 
          to="/tenants/add"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
        >
          <UserPlus size={20} />
          Onboard Tenant
        </Link>
      </div>

      {tenants.length === 0 ? (
        <EmptyState 
          title="No Tenants Found"
          description="You haven't added any tenants yet. Start by onboarding your first tenant."
          icon={UserPlus}
          actionText="Onboard Tenant Now"
          actionLink="/tenants/add"
        />
      ) : (
        <div className="space-y-4">
          {/* Mobile Card Layout */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {tenants.map((tenant) => (
              <div key={tenant.id} className="card p-5 space-y-4 border-none shadow-lg shadow-gray-100/50">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-xl">
                      {tenant.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 leading-tight">{tenant.name}</h3>
                      <p className="text-xs text-gray-500 font-medium flex items-center gap-1 mt-0.5">
                        <Phone size={12} className="text-gray-400" />
                        {tenant.phone}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                    Active
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Property</p>
                    <p className="text-sm font-bold text-gray-700 truncate">{tenant.buildingName}</p>
                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-tight mt-0.5">
                      Unit {tenant.unitNumbers?.[0]}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Monthly Rent</p>
                    <p className="text-sm font-black text-gray-900">₹{parseFloat(tenant.rentAmount).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link 
                    to={`/tenants/${tenant.id}`}
                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 font-black text-xs uppercase tracking-widest py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all"
                  >
                    <Eye size={16} />
                    View Details
                  </Link>
                  <button 
                    onClick={() => handleDelete(tenant.id, tenant.unitIds)}
                    className="px-4 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden md:block card overflow-hidden border-none shadow-xl shadow-gray-100/50">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Tenant Name</th>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Contact</th>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Property & Unit</th>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Monthly Rent</th>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {tenants.map((tenant) => (
                    <tr key={tenant.id} className="hover:bg-blue-50/20 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="font-bold text-gray-900">{tenant.name}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-sm text-gray-600 flex items-center gap-2">
                          <Phone size={14} className="text-gray-400" />
                          {tenant.phone}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-sm font-semibold text-gray-700">{tenant.buildingName}</div>
                        <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <Home size={12} />
                          {tenant.unitNumbers?.length > 1 ? `Units ${tenant.unitNumbers.join(', ')}` : `Unit ${tenant.unitNumbers?.[0]}`}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-gray-900 font-bold">₹{parseFloat(tenant.rentAmount).toLocaleString()}</div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold inline-flex items-center gap-1.5 border border-emerald-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Active
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <Link 
                            to={`/tenants/${tenant.id}`}
                            className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </Link>
                          <button 
                            onClick={() => handleDelete(tenant.id, tenant.unitIds)}
                            className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            title="Remove Tenant"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tenants;
