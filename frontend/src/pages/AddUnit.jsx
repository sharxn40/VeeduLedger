import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBuildings } from '../hooks/useBuildings';
import { unitService } from '../services/unitService';
import { Building2, Hash, Layers, IndianRupee, ArrowLeft, Loader2, Zap, ChevronDown } from 'lucide-react';
import FormInput from '../components/ui/FormInput';

const AddUnit = () => {
  const { currentUser } = useAuth();
  const { buildings, loading: buildingsLoading } = useBuildings(currentUser.uid);
  
  const [formData, setFormData] = useState({
    buildingId: '',
    unitNumber: '',
    floorNumber: '',
    rentAmount: '',
    consumerNumber: '',
    connectionType: 'domestic',
    provider: 'KSEB'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const bId = params.get('buildingId');
    if (bId) {
      setFormData(prev => ({ ...prev, buildingId: bId }));
    } else if (buildings.length > 0) {
      setFormData(prev => ({ ...prev, buildingId: buildings[0].id }));
    }
  }, [buildings, location.search]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await unitService.add({
        ...formData,
        ownerId: currentUser.uid
      });
      navigate(`/units?buildingId=${formData.buildingId}`);
    } catch (err) {
      setError('Failed to add unit. Please try again.');
    } finally {
      setLoading(false);
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
        onClick={() => navigate('/units')}
        className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mb-6 group mt-4 md:mt-0"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold text-sm">Back to Units</span>
      </button>

      <div className="card p-6 md:p-8 shadow-xl shadow-gray-100/50 border-none">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20 shrink-0">
            <Home size={24} />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight leading-tight">Add New Unit</h1>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Property Inventory</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
            {error}
          </div>
        )}

        {buildings.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
            <p className="text-gray-500 font-bold mb-4">You need to add a building first.</p>
            <button 
              onClick={() => navigate('/buildings/add')}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
            >
              Add a Building
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1 mb-2 block">Select Building</label>
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

              <FormInput 
                label="Monthly Rent"
                name="rentAmount"
                type="number"
                value={formData.rentAmount}
                onChange={handleChange}
                icon={IndianRupee}
                placeholder="e.g. 15000"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput 
                label="Unit Number"
                name="unitNumber"
                value={formData.unitNumber}
                onChange={handleChange}
                icon={Hash}
                placeholder="e.g. 101 or A-1"
                required
              />

              <FormInput 
                label="Floor Number"
                name="floorNumber"
                type="number"
                value={formData.floorNumber}
                onChange={handleChange}
                icon={Layers}
                placeholder="e.g. 1"
                required
              />
            </div>

            <div className="card bg-amber-50/30 border-amber-100 p-5 md:p-6 space-y-6">
              <div className="flex items-center gap-2 text-amber-700">
                <Zap size={20} className="fill-amber-600" />
                <h3 className="font-black text-[10px] md:text-xs uppercase tracking-widest">KSEB Electricity Details</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput 
                  label="Consumer Number"
                  name="consumerNumber"
                  value={formData.consumerNumber}
                  onChange={handleChange}
                  icon={Hash}
                  placeholder="13-digit number"
                />
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Connection Type</label>
                  <select 
                    name="connectionType"
                    value={formData.connectionType}
                    onChange={handleChange}
                    className="w-full px-4 py-4 md:py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all appearance-none font-bold text-gray-700"
                  >
                    <option value="domestic">Domestic</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-4">
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20 active:scale-95"
              >
                {loading ? <Loader2 className="animate-spin" size={24} /> : null}
                {loading ? 'Registering Unit...' : 'Register Unit'}
              </button>
              <button 
                type="button"
                onClick={() => navigate('/units')}
                className="w-full bg-gray-50 text-gray-400 font-black uppercase tracking-widest text-xs py-4 rounded-2xl hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddUnit;
