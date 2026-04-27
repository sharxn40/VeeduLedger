import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTenant } from '../hooks/useTenants';
import { useSettings } from '../context/SettingsContext';
import { calculateAdjustedRent } from '../utils/financialUtils';
import { 
  User, 
  Phone, 
  Building2, 
  Home, 
  Calendar, 
  TrendingUp, 
  ArrowLeft, 
  Loader2,
  Clock,
  History,
  IndianRupee
} from 'lucide-react';

const TenantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tenant, loading, error } = useTenant(id);
  const { settings } = useSettings();

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  if (error || !tenant) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <User size={40} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tenant Not Found</h2>
        <button 
          onClick={() => navigate('/tenants')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 mx-auto mt-4"
        >
          <ArrowLeft size={18} />
          Back to Directory
        </button>
      </div>
    );
  }

  // Use centralized logic for projections
  const getProjections = () => {
    const startDate = new Date(tenant.rentStartDate);
    const baseRent = parseFloat(tenant.rentAmount);
    const increment = parseFloat(tenant.rentIncrementPercentage || settings.defaultRentIncrementPercentage);
    
    const currentRent = calculateAdjustedRent(baseRent, tenant.rentStartDate, increment);
    
    // Calculate effective years passed
    let yearsPassed = new Date().getFullYear() - startDate.getFullYear();
    if (new Date().getMonth() < startDate.getMonth() || 
       (new Date().getMonth() === startDate.getMonth() && new Date().getDate() < startDate.getDate())) {
      yearsPassed--;
    }
    const effectiveYears = Math.max(0, yearsPassed);

    const projections = [];
    for (let i = 0; i <= 5; i++) {
      projections.push({
        year: startDate.getFullYear() + i,
        amount: Math.round(baseRent * Math.pow(1 + (increment / 100), i))
      });
    }

    return { currentRent, effectiveYears, projections };
  };

  const { currentRent, effectiveYears, projections } = getProjections();
  const currencySymbol = settings.currencySymbol || '₹';

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <button 
        onClick={() => navigate('/tenants')}
        className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mb-2 group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back to Directory
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile & Projection Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="card p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/30 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 relative">
              <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center text-white text-4xl font-bold shadow-xl shadow-blue-600/20 shrink-0">
                {tenant.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-center sm:text-left space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">{tenant.name}</h1>
                <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                  <div className="flex items-center gap-2 text-gray-500 font-medium">
                    <Phone size={16} className="text-blue-500" />
                    {tenant.phone}
                  </div>
                  <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold inline-flex items-center gap-1.5 border border-emerald-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Active Tenant
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 pt-8 border-t border-gray-100">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <p className="text-xs uppercase font-bold text-gray-400 tracking-widest mb-1">Building</p>
                    <p className="text-lg font-bold text-gray-800">{tenant.buildingName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                    <Home size={20} />
                  </div>
                  <div>
                    <p className="text-xs uppercase font-bold text-gray-400 tracking-widest mb-1">Unit(s)</p>
                    <p className="text-lg font-bold text-gray-800">
                      {tenant.unitNumbers?.join(', ')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                    <IndianRupee size={20} />
                  </div>
                  <div>
                    <p className="text-xs uppercase font-bold text-gray-400 tracking-widest mb-1">Base Rent</p>
                    <p className="text-xl font-bold text-gray-400 line-through opacity-50">{currencySymbol}{parseFloat(tenant.rentAmount).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <p className="text-xs uppercase font-bold text-emerald-600 tracking-widest mb-1">Current Adjusted Rent</p>
                    <p className="text-2xl font-black text-emerald-600">{currencySymbol}{currentRent.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Clock size={20} className="text-blue-600" />
              Rent Projection (Compounded)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                    <th className="pb-4">Timeline</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4 text-right">Monthly Rent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {projections.map((p, idx) => (
                    <tr key={p.year} className={`${idx === effectiveYears ? 'bg-blue-50/50' : ''}`}>
                      <td className="py-4 font-bold text-gray-700">Year {idx + 1} ({p.year})</td>
                      <td className="py-4">
                        {idx < effectiveYears ? (
                          <span className="text-[10px] font-bold text-gray-400">PASSED</span>
                        ) : idx === effectiveYears ? (
                          <span className="text-[10px] font-bold text-blue-600">CURRENT</span>
                        ) : (
                          <span className="text-[10px] font-bold text-gray-300">FUTURE</span>
                        )}
                      </td>
                      <td className="py-4 text-right font-black text-gray-900">
                        {currencySymbol}{p.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Info Section */}
        <div className="space-y-6">
          <div className="card p-6 bg-blue-600 text-white shadow-xl shadow-blue-600/20">
            <h3 className="font-bold mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
              <Calendar size={18} />
              Timeline Details
            </h3>
            <div className="space-y-6">
              <div>
                <p className="text-[10px] uppercase font-bold opacity-60 tracking-widest mb-1">Lease Started</p>
                <p className="text-lg font-bold">
                  {new Date(tenant.rentStartDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold opacity-60 tracking-widest mb-1">Next Increment Date</p>
                <p className="text-lg font-bold">
                  {new Date(new Date(tenant.rentStartDate).setFullYear(new Date(tenant.rentStartDate).getFullYear() + effectiveYears + 1)).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div className="pt-4 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold opacity-60">Increment Rate</span>
                  <span className="text-xl font-black">{tenant.rentIncrementPercentage || settings.defaultRentIncrementPercentage}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6 border-dashed border-2 bg-gray-50/50">
            <h3 className="flex items-center gap-2 text-gray-400 mb-6 font-bold uppercase text-xs tracking-widest">
              <History size={16} />
              Recent Activities
            </h3>
            <div className="relative pl-6 border-l border-gray-200">
              <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-blue-600"></div>
              <p className="text-xs font-bold text-gray-900">Tenant Onboarded</p>
              <p className="text-[10px] text-gray-500">Official Record Created</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantDetails;
