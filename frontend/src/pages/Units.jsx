import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { useNotification } from '../context/NotificationContext';
import { useBuildings } from '../hooks/useBuildings';
import { useUnits } from '../hooks/useUnits';
import { unitService } from '../services/unitService';
import { 
  Building2, 
  Plus, 
  Loader2, 
  Search, 
  Settings2, 
  Hash, 
  Layers, 
  IndianRupee, 
  ChevronDown,
  Zap
} from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import FormInput from '../components/ui/FormInput';

const Units = () => {
  const { currentUser } = useAuth();
  const { settings } = useSettings();
  const { notify } = useNotification();
  const location = useLocation();
  const navigate = useNavigate();
  
  const { buildings, loading: buildingsLoading } = useBuildings(currentUser.uid);
  const [selectedBuildingId, setSelectedBuildingId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { units, loading: unitsLoading, refresh: refreshUnits } = useUnits(selectedBuildingId, currentUser.uid);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  const currencySymbol = settings.currencySymbol || '₹';

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const bId = params.get('buildingId');
    
    if (bId) {
      setSelectedBuildingId(bId);
    } else if (buildings.length > 0) {
      setSelectedBuildingId(buildings[0].id);
    }
  }, [buildings, location.search]);

  // Local filter for search
  const filteredUnits = useMemo(() => {
    if (!searchTerm) return units;
    return units.filter(u => 
      u.unitNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [units, searchTerm]);

  const handleBuildingChange = (e) => {
    const bId = e.target.value;
    setSelectedBuildingId(bId);
    navigate(`/units?buildingId=${bId}`, { replace: true });
  };

  const handleManage = (unit) => {
    setEditingUnit({ ...unit });
    setIsModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      await unitService.update(editingUnit.id, {
        unitNumber: editingUnit.unitNumber,
        floorNumber: parseInt(editingUnit.floorNumber),
        rentAmount: parseFloat(editingUnit.rentAmount),
        status: editingUnit.status,
        consumerNumber: editingUnit.consumerNumber || '',
        connectionType: editingUnit.connectionType || 'domestic',
        provider: editingUnit.provider || 'KSEB'
      });
      notify('success', "Unit updated successfully.");
      refreshUnits();
      setIsModalOpen(false);
    } catch (err) {
      notify('error', "Failed to update unit.");
    } finally {
      setUpdateLoading(false);
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
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Units Management</h1>
          <p className="text-gray-500 mt-1">Manage individual rooms and apartments.</p>
        </div>
        <Link 
          to={selectedBuildingId ? `/units/add?buildingId=${selectedBuildingId}` : "/units/add"}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
        >
          <Plus size={20} />
          Add Unit
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative group">
          <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <select 
            value={selectedBuildingId}
            onChange={handleBuildingChange}
            className="w-full pl-12 pr-10 py-3.5 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all appearance-none font-bold text-gray-700"
          >
            {buildings.length === 0 && <option value="">No buildings available</option>}
            {buildings.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
        </div>
        
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search units..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-gray-700"
          />
        </div>
      </div>

      {unitsLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-blue-600" size={30} />
        </div>
      ) : filteredUnits.length === 0 ? (
        <EmptyState 
          title={searchTerm ? "No Match Found" : "No Units Registered"}
          description={searchTerm ? `No units matching "${searchTerm}"` : "This building doesn't have any units registered yet."}
          actionText={searchTerm ? "Clear Search" : "Add First Unit"}
          onAction={() => searchTerm ? setSearchTerm('') : navigate(selectedBuildingId ? `/units/add?buildingId=${selectedBuildingId}` : "/units/add")}
        />
      ) : (
        <div className="space-y-4">
          {/* Mobile Card Layout */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredUnits.map((unit) => (
              <div key={unit.id} className="card p-5 space-y-4 border-none shadow-lg shadow-gray-100/50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-black text-gray-900 leading-tight text-lg">Unit {unit.unitNumber}</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Floor {unit.floorNumber}</p>
                  </div>
                  <StatusBadge status={unit.status} />
                </div>

                <div className="flex justify-between items-end py-4 border-y border-gray-50">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Monthly Rent</p>
                    <p className="text-xl font-black text-gray-900">{currencySymbol}{unit.rentAmount?.toLocaleString()}</p>
                  </div>
                  {unit.consumerNumber && (
                    <div className="text-right">
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest border border-amber-100">
                        <Zap size={10} className="fill-amber-600" />
                        KSEB
                      </div>
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => handleManage(unit)}
                  className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 font-black text-xs uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
                >
                  <Settings2 size={16} />
                  Manage Unit
                </button>
              </div>
            ))}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden md:block card overflow-hidden border-none shadow-xl shadow-gray-100/50">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Unit Details</th>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Floor</th>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Monthly Rent</th>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredUnits.map((unit) => (
                    <tr key={unit.id} className="hover:bg-blue-50/20 transition-colors group">
                      <td className="px-8 py-6 font-bold text-gray-900 text-base">Unit {unit.unitNumber}</td>
                      <td className="px-8 py-6 font-medium text-gray-600">{unit.floorNumber}</td>
                      <td className="px-8 py-6 text-gray-900 font-black text-lg">{currencySymbol}{unit.rentAmount?.toLocaleString()}</td>
                      <td className="px-8 py-6">
                        <StatusBadge status={unit.status} />
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button 
                          onClick={() => handleManage(unit)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 hover:border-blue-200 text-blue-600 font-bold text-xs rounded-xl transition-all shadow-sm"
                        >
                          <Settings2 size={14} />
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Manage Unit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Manage Unit">
        {editingUnit && (
          <form onSubmit={handleUpdate} className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-6">
              <FormInput 
                label="Unit Number"
                value={editingUnit.unitNumber}
                onChange={(e) => setEditingUnit({...editingUnit, unitNumber: e.target.value})}
                icon={Hash}
                required
              />
              <FormInput 
                label="Floor Number"
                type="number"
                value={editingUnit.floorNumber}
                onChange={(e) => setEditingUnit({...editingUnit, floorNumber: e.target.value})}
                icon={Layers}
                required
              />
            </div>

            <FormInput 
              label="Rent Amount"
              type="number"
              value={editingUnit.rentAmount}
              onChange={(e) => setEditingUnit({...editingUnit, rentAmount: e.target.value})}
              icon={IndianRupee}
              required
            />

            <div className="card bg-amber-50/30 border-amber-100 p-6 space-y-6">
              <div className="flex items-center gap-2 text-amber-700">
                <Zap size={20} />
                <h3 className="font-black text-xs uppercase tracking-widest">KSEB Electricity Details</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput 
                  label="Consumer Number"
                  value={editingUnit.consumerNumber || ''}
                  onChange={(e) => setEditingUnit({...editingUnit, consumerNumber: e.target.value})}
                  icon={Hash}
                  placeholder="13-digit number"
                />
                
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Connection Type</label>
                  <select 
                    value={editingUnit.connectionType || 'domestic'}
                    onChange={(e) => setEditingUnit({...editingUnit, connectionType: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all appearance-none font-bold text-gray-700"
                  >
                    <option value="domestic">Domestic</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Current Status</label>
              <div className="flex gap-4">
                {['vacant', 'occupied'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setEditingUnit({...editingUnit, status: s})}
                    className={`flex-1 py-4 rounded-2xl border-2 font-black uppercase text-[10px] tracking-widest transition-all ${
                      editingUnit.status === s 
                        ? 'border-blue-600 bg-blue-50 text-blue-600' 
                        : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-100'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 flex gap-4">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-4 rounded-2xl transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={updateLoading}
                className="flex-[2] bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20"
              >
                {updateLoading ? <Loader2 className="animate-spin" size={20} /> : null}
                Save Changes
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Units;
