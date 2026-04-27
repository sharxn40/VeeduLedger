import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBuildings } from '../hooks/useBuildings';
import { useBuildingLayout } from '../hooks/useBuildingLayout';
import { 
  Building2, 
  Loader2, 
  Info, 
  User, 
  Phone, 
  IndianRupee, 
  CheckCircle2, 
  Clock,
  ChevronDown,
  LayoutGrid,
  Search,
  ExternalLink
} from 'lucide-react';
import Modal from '../components/ui/Modal';

const BuildingLayout = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { buildings, loading: buildingsLoading } = useBuildings(currentUser.uid);
  const [selectedBuildingId, setSelectedBuildingId] = useState('');
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (buildings.length > 0 && !selectedBuildingId) {
      setSelectedBuildingId(buildings[0].id);
    }
  }, [buildings, selectedBuildingId]);

  const { layout, loading, error } = useBuildingLayout(selectedBuildingId, currentUser.uid);

  const filteredLayout = useMemo(() => {
    if (!searchTerm) return layout;
    return layout.map(floor => ({
      ...floor,
      units: floor.units.filter(u => 
        u.unitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.tenant?.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })).filter(floor => floor.units.length > 0);
  }, [layout, searchTerm]);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'paid': return {
        bg: 'bg-emerald-500',
        text: 'text-white',
        shadow: 'shadow-lg shadow-emerald-500/20',
        label: 'Occupied (Paid)',
        badge: 'bg-emerald-50'
      };
      case 'pending': return {
        bg: 'bg-amber-500',
        text: 'text-white',
        shadow: 'shadow-lg shadow-amber-500/20',
        label: 'Occupied (Pending)',
        badge: 'bg-amber-50'
      };
      case 'vacant': return {
        bg: 'bg-red-500',
        text: 'text-white',
        shadow: 'shadow-lg shadow-red-500/20',
        label: 'Vacant',
        badge: 'bg-red-50'
      };
      default: return { bg: 'bg-gray-200', text: 'text-gray-500', label: 'Unknown' };
    }
  };

  if (buildingsLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Floor Plans</h1>
          <p className="text-gray-500 mt-1">Interactive building layout and occupancy map.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {/* Search */}
          <div className="relative group min-w-[200px]">
            <Search className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Unit or Tenant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium shadow-sm"
            />
          </div>

          {/* Building Selector */}
          <div className="relative group min-w-[200px]">
            <Building2 className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <select 
              value={selectedBuildingId}
              onChange={(e) => setSelectedBuildingId(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all appearance-none font-bold text-gray-700 shadow-sm"
            >
              {buildings.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={18} />
          </div>
        </div>
      </div>

      {/* Legend Card */}
      <div className="card p-6 bg-white border-none shadow-xl shadow-gray-100/50 flex flex-wrap gap-8 items-center">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-lg bg-emerald-500 shadow-md shadow-emerald-500/20"></div>
          <span className="text-sm font-bold text-gray-600">Rent Received</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-lg bg-amber-500 shadow-md shadow-amber-500/20"></div>
          <span className="text-sm font-bold text-gray-600">Payment Pending</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-lg bg-red-500 shadow-md shadow-red-500/20"></div>
          <span className="text-sm font-bold text-gray-600">Vacant Unit</span>
        </div>
        <div className="ml-auto hidden lg:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-300">
          <Info size={14} className="text-blue-400" />
          Click any square to view profile
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-blue-600" size={32} />
          <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Building Map...</p>
        </div>
      ) : filteredLayout.length === 0 ? (
        <EmptyState 
          title="No Match Found"
          description={searchTerm ? `No units or tenants matching "${searchTerm}"` : "This building doesn't have any units yet."}
          icon={LayoutGrid}
        />
      ) : (
        <div className="space-y-16">
          {[...filteredLayout].reverse().map((floor) => (
            <div key={floor.floorNumber} className="relative">
              <div className="flex items-center gap-4 mb-8">
                <div className="px-5 py-2 bg-gray-900 text-white rounded-2xl text-xs font-black uppercase tracking-[0.1em] shadow-xl">
                  Level {floor.floorNumber}
                </div>
                <div className="h-[2px] flex-1 bg-gradient-to-r from-gray-100 to-transparent"></div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
                {floor.units.map((unit) => {
                  const config = getStatusConfig(unit.status);
                  return (
                    <button
                      key={unit.id}
                      onClick={() => setSelectedUnit(unit)}
                      className={`group relative aspect-square flex flex-col items-center justify-center rounded-[2rem] transition-all hover:scale-105 hover:-translate-y-1 active:scale-95 ${config.bg} ${config.text} ${config.shadow}`}
                    >
                      <span className="text-3xl font-black tracking-tighter">{unit.unitNumber}</span>
                      {unit.tenant && (
                        <span className="text-[9px] font-bold uppercase tracking-widest opacity-60 mt-1 truncate max-w-[80%]">
                          {unit.tenant.name.split(' ')[0]}
                        </span>
                      )}
                      {/* Mini indicator */}
                      <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-white/30 backdrop-blur-sm"></div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Unit Detail Modal */}
      <Modal 
        isOpen={!!selectedUnit} 
        onClose={() => setSelectedUnit(null)}
        title={`Unit ${selectedUnit?.unitNumber} Profile`}
      >
        {selectedUnit && (
          <div className="space-y-8 py-4">
            {/* Header / Status */}
            <div className="flex items-center justify-between p-6 rounded-3xl bg-gray-50/50 border border-gray-100">
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Occupancy Status</p>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full animate-pulse ${getStatusConfig(selectedUnit.status).bg}`}></div>
                  <span className="font-black text-gray-900 uppercase text-xs tracking-wider">{getStatusConfig(selectedUnit.status).label}</span>
                </div>
              </div>
              <div className="text-right space-y-1">
                <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Floor Level</p>
                <p className="font-black text-xl text-gray-900">{selectedUnit.floorNumber}</p>
              </div>
            </div>

            {selectedUnit.tenant ? (
              <div className="space-y-6">
                {/* Tenant Card */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Tenant Overview</h4>
                    <button 
                      onClick={() => navigate(`/tenants/${selectedUnit.tenant.id}`)}
                      className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1"
                    >
                      View Full Profile
                      <ExternalLink size={10} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl">
                      <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                        {selectedUnit.tenant.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{selectedUnit.tenant.name}</p>
                        <p className="text-xs text-gray-400 font-medium">{selectedUnit.tenant.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-blue-50/50 rounded-[2rem] border border-blue-100/50">
                    <div className="flex items-center gap-2 text-blue-600 mb-2">
                      <IndianRupee size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Monthly Rent</span>
                    </div>
                    <p className="text-2xl font-black text-blue-700 tracking-tighter">₹{parseFloat(selectedUnit.tenant.rentAmount).toLocaleString()}</p>
                  </div>

                  <div className={`p-5 rounded-[2rem] border ${selectedUnit.status === 'paid' ? 'bg-emerald-50/50 border-emerald-100/50' : 'bg-amber-50/50 border-amber-100/50'}`}>
                    <div className={`flex items-center gap-2 mb-2 ${selectedUnit.status === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {selectedUnit.status === 'paid' ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                      <span className="text-[10px] font-black uppercase tracking-widest">April Payment</span>
                    </div>
                    <p className={`text-2xl font-black tracking-tighter ${selectedUnit.status === 'paid' ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {selectedUnit.status === 'paid' ? 'Received' : 'Pending'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 border-2 border-dashed border-gray-100 rounded-[2.5rem] text-center bg-gray-50/30">
                <LayoutGrid size={40} className="mx-auto text-gray-200 mb-4" />
                <p className="text-gray-400 font-black uppercase text-xs tracking-widest">Vacant Unit</p>
                <p className="text-gray-400 text-sm mt-2">Ready for a new tenant onboarding.</p>
                <button 
                  onClick={() => navigate('/tenants/add')}
                  className="mt-6 px-8 py-3 bg-white border border-gray-200 text-blue-600 text-xs font-bold rounded-xl hover:bg-blue-50 transition-all active:scale-95"
                >
                  Onboard Tenant
                </button>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => setSelectedUnit(null)}
                className="flex-1 bg-gray-900 text-white font-bold py-4 rounded-2xl active:scale-95 transition-all shadow-xl shadow-gray-900/10"
              >
                Close Details
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BuildingLayout;
