import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { useNotification } from '../context/NotificationContext';
import { useFinancialData } from '../hooks/useFinancialData';
import { useBuildings } from '../hooks/useBuildings';
import { taxService } from '../services/taxService';
import { 
  Receipt, 
  PlusCircle, 
  Loader2, 
  Filter, 
  Building2, 
  CheckCircle2,
  Clock,
  Landmark,
  ChevronDown,
  Search,
  ExternalLink,
  UploadCloud,
  FileText,
  AlertTriangle,
  Info,
  Trash2
} from 'lucide-react';
import Modal from '../components/ui/Modal';
import FormInput from '../components/ui/FormInput';
import StatusBadge from '../components/ui/StatusBadge';
import EmptyState from '../components/ui/EmptyState';
import ReceiptUploadModal from '../components/ui/ReceiptUploadModal';
import PaymentHistory from '../components/tax/PaymentHistory';

const TAX_TYPES = [
  { id: 'property tax', name: 'Property Tax', icon: Landmark, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { id: 'other', name: 'Other Dues', icon: Receipt, color: 'text-gray-600', bg: 'bg-gray-100' },
];

const KSMART_QUICK_PAY_URL = "https://ksmart.lsgkerala.gov.in/ui/property-tax/quick-pay-tax/citizen";

const Taxes = () => {
  const { currentUser } = useAuth();
  const { settings } = useSettings();
  const { notify, confirm } = useNotification();
  
  const [filters, setFilters] = useState({ buildingId: '', status: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedTax, setSelectedTax] = useState(null);
  
  const [formLoading, setFormLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  
  const [formData, setFormData] = useState({ buildingId: '', type: 'property tax' });

  const { data: taxes, loading, refresh } = useFinancialData(taxService, currentUser.uid, filters);
  const { buildings } = useBuildings(currentUser.uid);

  const currencySymbol = settings.currencySymbol || '₹';

  const activeTaxes = useMemo(() => taxes.filter(t => t.status === 'pending'), [taxes]);
  const paymentHistory = useMemo(() => taxes.filter(t => t.status === 'paid'), [taxes]);

  const filteredActiveTaxes = useMemo(() => {
    if (!searchTerm) return activeTaxes;
    return activeTaxes.filter(t => 
      t.buildingName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.type?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [activeTaxes, searchTerm]);

  const handlePayExternal = (tax) => {
    confirm(
      "Pay via KSmart",
      "We will redirect you to the official KSmart Quick Pay portal. Once payment is done, please return here to upload your receipt.",
      () => {
        window.open(KSMART_QUICK_PAY_URL, '_blank');
        setSelectedTax(tax);
        setIsUploadModalOpen(true);
      }
    );
  };

  const handleAddTax = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const b = buildings.find(b => b.id === formData.buildingId);
      await taxService.add({ 
        ...formData, 
        buildingName: b?.name, 
        ownerId: currentUser.uid,
        amount: 0 
      });
      notify('success', "Payment task created.");
      setIsAddModalOpen(false);
      setFormData({ buildingId: '', type: 'property tax' });
      refresh();
    } catch (err) {
      notify('error', "Failed to create task.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleReceiptUpload = async ({ file, referenceId, amount }) => {
    setUploadLoading(true);
    try {
      const receiptUrl = await taxService.uploadReceipt(file, currentUser.uid);
      await taxService.markAsPaid(selectedTax.id, referenceId, receiptUrl, amount);
      notify('success', "Tax payment recorded.");
      setIsUploadModalOpen(false);
      setSelectedTax(null);
      refresh();
    } catch (err) {
      notify('error', "Failed to record payment.");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleVerify = async (id) => {
    setActionLoading(id);
    try {
      await taxService.verify(id);
      notify('success', "Payment verified.");
      refresh();
    } catch (err) {
      notify('error', "Verification failed.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    confirm(
      "Delete Task",
      "Are you sure you want to remove this tax payment task? This action cannot be undone.",
      async () => {
        setActionLoading(id);
        try {
          await taxService.delete(id);
          notify('success', "Tax task removed.");
          refresh();
        } catch (err) {
          notify('error', "Failed to delete task.");
        } finally {
          setActionLoading(null);
        }
      }
    );
  };

  if (loading && taxes.length === 0) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Tax Management</h1>
          <p className="text-gray-500 mt-1">Track and record property tax payments.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
        >
          <PlusCircle size={20} />
          Create Payment Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Search by building..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-gray-700"
          />
        </div>

        <div className="relative group">
          <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <select 
            value={filters.buildingId}
            onChange={(e) => setFilters({ ...filters, buildingId: e.target.value })}
            className="w-full pl-12 pr-10 py-3.5 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none appearance-none font-bold text-gray-700"
          >
            <option value="">All Buildings</option>
            {buildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
            <AlertTriangle size={20} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Pending Payments</h2>
        </div>

        {filteredActiveTaxes.length === 0 ? (
          <div className="card p-12 text-center border-dashed border-2 bg-gray-50/50">
            <p className="text-gray-400 font-bold">No pending payment tasks.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredActiveTaxes.map((tax) => {
              const type = TAX_TYPES.find(t => t.id === tax.type);
              return (
                <div key={tax.id} className="card p-8 group hover:border-blue-200 transition-all flex flex-col justify-between h-full relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-32 h-32 ${type?.bg || 'bg-gray-100'} rounded-full -mr-16 -mt-16 opacity-50 blur-2xl`}></div>
                  
                  <div className="relative">
                    <div className="flex justify-between items-start mb-6">
                      <div className={`p-4 rounded-2xl ${type?.bg || 'bg-gray-50'} ${type?.color || 'text-gray-600'}`}>
                        {type ? <type.icon size={28} /> : <Receipt size={28} />}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <StatusBadge status="pending" labels={{ pending: 'Pending' }} colors={{ pending: 'amber' }} />
                        <button 
                          onClick={() => handleDelete(tax.id)}
                          disabled={actionLoading === tax.id}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          title="Delete Task"
                        >
                          {actionLoading === tax.id ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                        </button>
                      </div>
                    </div>

                    <h3 className="text-xl font-black text-gray-900 tracking-tight">{type?.name || tax.type}</h3>
                    <p className="text-sm font-bold text-gray-400 mt-1 flex items-center gap-1.5 uppercase tracking-widest">
                      <Building2 size={12} />
                      {tax.buildingName}
                    </p>
                  </div>

                  <div className="mt-10 space-y-3 relative">
                    <button 
                      onClick={() => handlePayExternal(tax)}
                      className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-95 shadow-xl shadow-gray-900/10"
                    >
                      <ExternalLink size={18} />
                      Pay via KSmart
                    </button>
                    <button 
                      onClick={() => { setSelectedTax(tax); setIsUploadModalOpen(true); }}
                      className="w-full py-4 bg-white border-2 border-gray-100 text-gray-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all active:scale-95"
                    >
                      <UploadCloud size={18} />
                      Upload Receipt
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <hr className="border-gray-100" />

      <PaymentHistory 
        payments={paymentHistory} 
        currencySymbol={currencySymbol}
        onVerify={handleVerify}
        verifyLoading={actionLoading}
        onDelete={handleDelete}
      />

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Create Payment Task">
        <form onSubmit={handleAddTax} className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Building</label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <select required value={formData.buildingId} onChange={(e) => setFormData({ ...formData, buildingId: e.target.value })} className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none font-bold text-gray-700 appearance-none">
                <option value="">Select Building</option>
                {buildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Tax Type</label>
            <div className="grid grid-cols-2 gap-4">
              {TAX_TYPES.map((type) => (
                <button key={type.id} type="button" onClick={() => setFormData({ ...formData, type: type.id })} className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${formData.type === type.id ? 'border-indigo-500 bg-indigo-50 text-indigo-600 shadow-lg shadow-indigo-500/10' : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200'}`}>
                  <type.icon size={28} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{type.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all">Cancel</button>
            <button type="submit" disabled={formLoading} className="flex-[2] py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 disabled:bg-blue-400 flex items-center justify-center gap-2">
              {formLoading ? <Loader2 className="animate-spin" size={20} /> : <PlusCircle size={20} />} Create Task
            </button>
          </div>
        </form>
      </Modal>

      <ReceiptUploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => { setIsUploadModalOpen(false); setSelectedTax(null); }}
        onUpload={handleReceiptUpload}
        loading={uploadLoading}
        currencySymbol={currencySymbol}
      />
    </div>
  );
};

export default Taxes;
