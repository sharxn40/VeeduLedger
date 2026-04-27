import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { buildingService } from '../services/buildingService';
import { 
  Building2, 
  MapPin, 
  Layers, 
  ArrowLeft, 
  Loader2,
  Zap,
  Hash 
} from 'lucide-react';
import FormInput from '../components/ui/FormInput';

const AddBuilding = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    totalFloors: '',
    district: '',
    localBodyType: 'municipality',
    localBodyName: '',
    wardYear: '2020',
    wardDetails: '',
    doorNumber: '',
    subNumber: ''
  });
  const [loading, setLoading] = useState(false);
  
  const { currentUser } = useAuth();
  const { notify } = useNotification();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await buildingService.add({
        ...formData,
        ownerId: currentUser.uid
      });
      notify('success', "Building added successfully.");
      navigate('/buildings');
    } catch (err) {
      notify('error', "Failed to add building.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 px-4 md:px-0">
      <button 
        onClick={() => navigate('/buildings')}
        className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mb-6 group mt-4 md:mt-0"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold text-sm">Back to Buildings</span>
      </button>

      <div className="card p-6 md:p-8 shadow-xl shadow-gray-100/50 border-none">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20 shrink-0">
            <Building2 size={24} />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight leading-tight">Add Property</h1>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Property Registration</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput 
              label="Building Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              icon={Building2}
              placeholder="e.g. Skyline Apartments"
              required
            />

            <FormInput 
              label="Total Floors"
              name="totalFloors"
              type="number"
              value={formData.totalFloors}
              onChange={handleChange}
              icon={Layers}
              placeholder="e.g. 5"
              required
            />
          </div>

          <FormInput 
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            icon={MapPin}
            placeholder="Full property address"
            required
          />

          <div className="card bg-blue-50/30 border-blue-100 p-5 md:p-6 space-y-6">
            <div className="flex items-center gap-2 text-blue-700">
              <Zap size={20} className="fill-blue-600" />
              <h3 className="font-black text-[10px] md:text-xs uppercase tracking-widest">KSmart Property Details</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">District</label>
                <select 
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full px-4 py-4 md:py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-gray-700 appearance-none"
                  required
                >
                  <option value="">Select District</option>
                  {['Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha', 'Kottayam', 'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad', 'Malappuram', 'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Local Body Type</label>
                <select 
                  name="localBodyType"
                  value={formData.localBodyType}
                  onChange={handleChange}
                  className="w-full px-4 py-4 md:py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-gray-700 appearance-none"
                  required
                >
                  <option value="corporation">Corporation</option>
                  <option value="municipality">Municipality</option>
                  <option value="panchayath">Grama Panchayath</option>
                </select>
              </div>

              <FormInput 
                label="Local Body Name"
                name="localBodyName"
                value={formData.localBodyName}
                onChange={handleChange}
                icon={Building2}
                placeholder="e.g. Kochi Corporation"
                required
              />

              <FormInput 
                label="Door Number"
                name="doorNumber"
                value={formData.doorNumber}
                onChange={handleChange}
                icon={Hash}
                placeholder="e.g. 12/450"
                required
              />

              <FormInput 
                label="Ward Details"
                name="wardDetails"
                value={formData.wardDetails}
                onChange={handleChange}
                icon={MapPin}
                placeholder="e.g. Ward 15"
                required
              />

              <FormInput 
                label="Sub Number"
                name="subNumber"
                value={formData.subNumber}
                onChange={handleChange}
                icon={Hash}
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="pt-4 space-y-4">
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-black disabled:bg-gray-400 text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-gray-900/10 active:scale-95"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : null}
              {loading ? 'Saving...' : 'Register Building'}
            </button>
            <button 
              type="button"
              onClick={() => navigate('/buildings')}
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

export default AddBuilding;
