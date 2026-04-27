import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { useNotification } from '../context/NotificationContext';
import { messagingService } from '../services/messagingService';
import { 
  Settings as SettingsIcon, 
  Save, 
  Loader2, 
  TrendingUp, 
  IndianRupee, 
  RefreshCcw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import FormInput from '../components/ui/FormInput';

const Settings = () => {
  const { currentUser } = useAuth();
  const { settings, updateSettings, loading: settingsLoading } = useSettings();
  const { notify } = useNotification();
  const [formData, setFormData] = useState({
    defaultRentIncrementPercentage: '',
    lateFeeAmount: '',
    currencySymbol: '',
    billingCycle: 'monthly'
  });
  
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        defaultRentIncrementPercentage: settings.defaultRentIncrementPercentage || 5,
        lateFeeAmount: settings.lateFeeAmount || 500,
        currencySymbol: settings.currencySymbol || '₹',
        billingCycle: settings.billingCycle || 'monthly'
      });
    }
  }, [settings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      await updateSettings({
        ...formData,
        defaultRentIncrementPercentage: parseFloat(formData.defaultRentIncrementPercentage),
        lateFeeAmount: parseFloat(formData.lateFeeAmount)
      });
      notify('success', 'Settings updated successfully!');
    } catch (err) {
      notify('error', 'Failed to update settings.');
    } finally {
      setSaveLoading(false);
    }
  };

  if (settingsLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-500 mt-1">Configure global preferences and business logic rules.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Settings Form */}
        <div className="md:col-span-2">
          <div className="card p-8 border-none shadow-xl shadow-gray-100/50">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Financial Logic */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
                  <TrendingUp size={18} className="text-blue-600" />
                  <h3 className="font-black uppercase text-xs tracking-widest text-gray-400">Financial Logic</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput 
                    label="Default Rent Increment (%)"
                    type="number"
                    icon={TrendingUp}
                    value={formData.defaultRentIncrementPercentage}
                    onChange={(e) => setFormData({ ...formData, defaultRentIncrementPercentage: e.target.value })}
                    required
                  />
                  <FormInput 
                    label="Late Fee Amount"
                    type="number"
                    icon={IndianRupee}
                    value={formData.lateFeeAmount}
                    onChange={(e) => setFormData({ ...formData, lateFeeAmount: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Localization & Display */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
                  <IndianRupee size={18} className="text-blue-600" />
                  <h3 className="font-black uppercase text-xs tracking-widest text-gray-400">Localization</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput 
                    label="Currency Symbol"
                    type="text"
                    icon={IndianRupee}
                    value={formData.currencySymbol}
                    onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value })}
                    required
                    placeholder="e.g. ₹, $, £"
                  />
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Billing Cycle</label>
                    <div className="relative">
                      <RefreshCcw className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <select 
                        value={formData.billingCycle}
                        onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })}
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none font-bold text-gray-700 appearance-none"
                      >
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="annually">Annually</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Buttons */}

              {/* Push Notifications */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
                  <SettingsIcon size={18} className="text-blue-600" />
                  <h3 className="font-black uppercase text-xs tracking-widest text-gray-400">Notifications</h3>
                </div>
                
                <div className="card p-6 bg-gray-50/50 border-none space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-bold text-gray-900">Push Notifications</p>
                      <p className="text-xs text-gray-500 font-medium">Receive alerts for rent due, bills, and tax reminders.</p>
                    </div>
                    <button 
                      type="button"
                      onClick={async () => {
                        const token = await messagingService.requestPermission(currentUser.uid);
                        if (token) {
                          notify('success', 'Notifications enabled!');
                        } else {
                          notify('error', 'Failed to enable notifications. Please check browser permissions.');
                        }
                      }}
                      className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50 transition-all shadow-sm"
                    >
                      Enable in Browser
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold text-amber-600 bg-amber-50 px-4 py-3 rounded-xl border border-amber-100">
                    <AlertCircle size={14} className="shrink-0" />
                    Note: Notifications must be allowed in your browser settings to receive alerts.
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={saveLoading}
                className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-gray-900/10 active:scale-95 disabled:opacity-50"
              >
                {saveLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                Save Changes
              </button>
            </form>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <div className="card p-8 bg-blue-600 text-white border-none shadow-xl shadow-blue-600/20 rounded-[2.5rem]">
            <h4 className="font-black text-xl mb-3 tracking-tight">Pro Tip</h4>
            <p className="text-white/90 text-sm leading-relaxed font-medium">
              These settings will be applied to all your future tenants and buildings. Changing the currency symbol will update the entire dashboard instantly.
            </p>
          </div>

          <div className="p-6 border border-gray-100 rounded-[2rem] bg-gray-50/50">
            <h4 className="font-bold text-gray-900 mb-4">Current Defaults</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Increment</span>
                <span className="font-black text-gray-900">{settings.defaultRentIncrementPercentage}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Currency</span>
                <span className="font-black text-gray-900">{settings.currencySymbol}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
