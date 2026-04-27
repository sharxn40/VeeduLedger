import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { useBuildings } from '../hooks/useBuildings';
import { unitService } from '../services/unitService';
import { tenantService } from '../services/tenantService';
import { 
  User, 
  Phone, 
  Building2, 
  Home, 
  IndianRupee, 
  Calendar, 
  TrendingUp, 
  ArrowLeft, 
  Loader2,
  CheckCircle2,
  Circle
} from 'lucide-react';
import FormInput from '../components/ui/FormInput';

const AddTenant = () => {
  const { currentUser } = useAuth();
  const { settings } = useSettings();
  const { buildings, loading: buildingsLoading } = useBuildings(currentUser.uid);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    buildingId: '',
    unitIds: [], // Now an array
    rentAmount: '',
    rentStartDate: '',
    rentIncrementPercentage: settings?.defaultRentIncrementPercentage?.toString() || '5'
  });

  const [availableUnits, setAvailableUnits] = useState([]);
  const [unitsLoading, setUnitsLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    if (buildings.length > 0 && !formData.buildingId) {
      setFormData(prev => ({ ...prev, buildingId: buildings[0].id }));
    }
  }, [buildings]);

  useEffect(() => {
    const fetchAvailableUnits = async () => {
      if (!formData.buildingId) return;
      setUnitsLoading(true);
      try {
        const units = await unitService.getAvailable(formData.buildingId, currentUser.uid);
        const sortedUnits = units.sort((a, b) => {
          if (a.floorNumber !== b.floorNumber) return a.floorNumber - b.floorNumber;
          return a.unitNumber.localeCompare(b.unitNumber, undefined, { numeric: true });
        });
        setAvailableUnits(sortedUnits);
        // Reset selections when building changes
        setFormData(prev => ({ ...prev, unitIds: [] }));
      } catch (err) {
        console.error(err);
      } finally {
        setUnitsLoading(false);
      }
    };
    fetchAvailableUnits();
  }, [formData.buildingId, currentUser.uid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleUnitSelection = (unitId) => {
    setFormData(prev => {
      const isSelected = prev.unitIds.includes(unitId);
      const newUnitIds = isSelected 
        ? prev.unitIds.filter(id => id !== unitId)
        : [...prev.unitIds, unitId];
      
      // Automatically calculate combined rent if units are selected
      let newRent = prev.rentAmount;
      if (!isSelected) {
        const unit = availableUnits.find(u => u.id === unitId);
        newRent = (parseFloat(prev.rentAmount || 0) + unit.rentAmount).toString();
      } else {
        const unit = availableUnits.find(u => u.id === unitId);
        newRent = (parseFloat(prev.rentAmount || 0) - unit.rentAmount).toString();
      }

      return { ...prev, unitIds: newUnitIds, rentAmount: newRent };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.unitIds.length === 0) {
      setError('Please select at least one unit.');
      return;
    }
    setSubmitLoading(true);
    setError('');

    try {
      const selectedBuilding = buildings.find(b => b.id === formData.buildingId);
      const selectedUnits = availableUnits.filter(u => formData.unitIds.includes(u.id));
      const unitNumbers = selectedUnits.map(u => u.unitNumber);
      
      await tenantService.add({
        ...formData,
        buildingName: selectedBuilding?.name || 'Unknown',
        unitNumbers, // Array of numbers
        ownerId: currentUser.uid
      });
      navigate('/tenants');
    } catch (err) {
      setError('Failed to onboard tenant. Please try again.');
    } finally {
      setSubmitLoading(false);
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
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 px-4 md:px-0">
      <button 
        onClick={() => navigate('/tenants')}
        className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mb-6 group mt-4 md:mt-0"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold text-sm">Back to Tenants</span>
      </button>

      <div className="card p-6 md:p-8 shadow-xl shadow-gray-100/50 border-none">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20 shrink-0">
            <User size={24} />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight leading-tight">Onboard Tenant</h1>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Multi-Unit Management</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput 
              label="Tenant Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              icon={User}
              placeholder="e.g. Rahul Sharma"
              required
            />

            <FormInput 
              label="Contact Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              icon={Phone}
              placeholder="e.g. +91 9876543210"
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1 mb-2 block">Property</label>
            <div className="relative group">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              <select 
                name="buildingId"
                value={formData.buildingId}
                onChange={handleChange}
                className="w-full pl-12 pr-10 py-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-100 outline-none transition-all appearance-none font-bold text-gray-700"
                required
              >
                {buildings.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1 mb-3 flex justify-between items-center">
              Select Units
              <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100 uppercase">
                {formData.unitIds.length} Selected
              </span>
            </label>
            
            {unitsLoading ? (
              <div className="flex justify-center py-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                <Loader2 className="animate-spin text-blue-600" size={24} />
              </div>
            ) : availableUnits.length === 0 ? (
              <div className="p-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 text-center text-xs font-bold text-gray-400">
                No vacant units available.
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto p-1 custom-scrollbar">
                {availableUnits.map(u => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => toggleUnitSelection(u.id)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                      formData.unitIds.includes(u.id)
                        ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-md shadow-blue-600/5'
                        : 'border-gray-50 bg-gray-50 text-gray-600 hover:border-gray-200'
                    }`}
                  >
                    {formData.unitIds.includes(u.id) 
                      ? <CheckCircle2 size={18} className="shrink-0" /> 
                      : <Circle size={18} className="shrink-0 text-gray-300" />}
                    <div>
                      <p className="text-sm font-black tracking-tight">Unit {u.unitNumber}</p>
                      <p className="text-[10px] uppercase font-black opacity-50">Floor {u.floorNumber}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput 
              label="Total Monthly Rent"
              name="rentAmount"
              type="number"
              value={formData.rentAmount}
              onChange={handleChange}
              icon={IndianRupee}
              required
            />

            <FormInput 
              label="Lease Start Date"
              name="rentStartDate"
              type="date"
              value={formData.rentStartDate}
              onChange={handleChange}
              icon={Calendar}
              required
            />
          </div>

          <FormInput 
            label="Yearly Rent Increment (%)"
            name="rentIncrementPercentage"
            type="number"
            value={formData.rentIncrementPercentage}
            onChange={handleChange}
            icon={TrendingUp}
            placeholder="e.g. 5"
            required
          />

          <div className="pt-4 space-y-4">
            <button 
              type="submit"
              disabled={submitLoading || formData.unitIds.length === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20 active:scale-95"
            >
              {submitLoading ? <Loader2 className="animate-spin" size={24} /> : null}
              {submitLoading ? 'Onboarding...' : 'Onboard Tenant'}
            </button>
            <button 
              type="button"
              onClick={() => navigate('/tenants')}
              className="w-full bg-gray-50 text-gray-400 font-black uppercase tracking-widest text-xs py-4 rounded-2xl hover:bg-gray-100 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTenant;
