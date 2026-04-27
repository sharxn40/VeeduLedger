import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useFinancialData } from '../hooks/useFinancialData';
import { useBuildings } from '../hooks/useBuildings';
import { unitService } from '../services/unitService';
import { billService } from '../services/billService';
import { 
  FileText, 
  PlusCircle, 
  Loader2, 
  Filter, 
  Building2, 
  Home, 
  IndianRupee, 
  Calendar,
  CheckCircle2,
  Clock,
  Zap,
  Droplets,
  Wrench,
  ChevronDown,
  Search,
  Trash2,
  Copy,
  ExternalLink,
  UploadCloud
} from 'lucide-react';
import Modal from '../components/ui/Modal';
import FormInput from '../components/ui/FormInput';
import StatusBadge from '../components/ui/StatusBadge';
import EmptyState from '../components/ui/EmptyState';
import ReceiptUploadModal from '../components/ui/ReceiptUploadModal';

const BILL_TYPES = [
  { id: 'electricity', name: 'Electricity', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
  { id: 'water', name: 'Water', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'maintenance', name: 'Maintenance', icon: Wrench, color: 'text-purple-500', bg: 'bg-purple-50' },
];

const Bills = () => {
  const { currentUser } = useAuth();
  const { notify, confirm } = useNotification();
  
  // Filters & Search State
  const [filters, setFilters] = useState({ buildingId: '', unitId: '', status: '' });
  const [searchTerm, setSearchTerm] = useState('');

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedBill, setSelectedBill] = useState(null);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({ buildingId: '', unitId: '', type: 'electricity', amount: 0, dueDate: '' });
  
  const { data: bills, loading, refresh } = useFinancialData(billService, currentUser.uid, filters);
  const { buildings } = useBuildings(currentUser.uid);
  
  const pendingBills = useMemo(() => bills.filter(b => b.status === 'pending'), [bills]);
  const historyBills = useMemo(() => bills.filter(b => b.status === 'paid'), [bills]);

  const [availableUnits, setAvailableUnits] = useState([]);
  const [filterUnits, setFilterUnits] = useState([]);

  // Local Search Filter
  const filteredPendingBills = useMemo(() => {
    if (!searchTerm) return pendingBills;
    return pendingBills.filter(b => 
      b.unitNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.buildingName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.type?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [pendingBills, searchTerm]);

  useEffect(() => {
    const loadUnits = async () => {
      if (formData.buildingId) {
        const units = await unitService.getByBuilding(formData.buildingId, currentUser.uid);
        setAvailableUnits(units);
      } else {
        setAvailableUnits([]);
      }
    };
    loadUnits();
  }, [formData.buildingId]);

  useEffect(() => {
    const loadFilterUnits = async () => {
      if (filters.buildingId) {
        const units = await unitService.getByBuilding(filters.buildingId, currentUser.uid);
        setFilterUnits(units);
      } else {
        setFilterUnits([]);
      }
    };
    loadFilterUnits();
  }, [filters.buildingId]);
  const handleAddBill = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const b = buildings.find(b => b.id === formData.buildingId);
      const u = availableUnits.find(u => u.id === formData.unitId);
      await billService.add({ 
        ...formData, 
        buildingName: b?.name, 
        unitNumber: u?.unitNumber, 
        ownerId: currentUser.uid, 
        amount: parseFloat(formData.amount) || 0,
        consumerNumber: u?.consumerNumber || 'Not Set',
        connectionType: u?.connectionType || 'domestic',
        provider: u?.provider || 'KSEB'
      });
      notify('success', "Bill record created.");
      setIsModalOpen(false);
      setFormData({ buildingId: '', unitId: '', type: 'electricity', amount: 0, dueDate: '' });
      refresh();
    } catch (err) {
      notify('error', "Failed to add bill.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleCheckAndPay = (bill) => {
    setSelectedBill(bill);
    setIsPayModalOpen(true);
  };

  const handleReceiptUpload = async ({ file, referenceId, amount }) => {
    setActionLoading(selectedBill.id);
    try {
      const receiptUrl = await billService.uploadReceipt(file, currentUser.uid);
      await billService.markAsPaid(selectedBill.id, referenceId, receiptUrl, amount);
      notify('success', "Bill payment recorded.");
      setIsUploadModalOpen(false);
      setSelectedBill(null);
      refresh();
    } catch (err) {
      notify('error', "Failed to record payment.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkPaid = async (id) => {
    setActionLoading(id);
    try {
      await billService.markAsPaid(id);
      refresh();
    } catch (err) {
      notify('error', "Failed to update status.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    confirm(
      "Delete Bill",
      "Are you sure you want to delete this bill record? This action cannot be undone.",
      async () => {
        setActionLoading(id);
        try {
          await billService.delete(id);
          notify('success', "Bill record deleted.");
          refresh();
        } catch (err) {
          notify('error', "Failed to delete record.");
        } finally {
          setActionLoading(null);
        }
      }
    );
  };

  if (loading && bills.length === 0) {
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
          <h1 className="text-3xl font-bold text-gray-900">Unit Bills</h1>
          <p className="text-gray-500 mt-1">Track and manage utility expenses for individual units.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
        >
          <PlusCircle size={20} />
          Record Bill
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Search bills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-gray-700 shadow-sm"
          />
        </div>

        <div className="relative group">
          <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <select 
            value={filters.buildingId}
            onChange={(e) => setFilters({ ...filters, buildingId: e.target.value, unitId: '' })}
            className="w-full pl-12 pr-10 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none appearance-none font-bold text-gray-700 shadow-sm"
          >
            <option value="">All Buildings</option>
            {buildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
        </div>

        <div className="relative group">
          <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <select 
            value={filters.unitId}
            onChange={(e) => setFilters({ ...filters, unitId: e.target.value })}
            className="w-full pl-12 pr-10 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none appearance-none font-bold text-gray-700 shadow-sm disabled:opacity-50"
            disabled={!filters.buildingId}
          >
            <option value="">All Units</option>
            {filterUnits.map(u => <option key={u.id} value={u.id}>Unit {u.unitNumber}</option>)}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
        </div>

        <div className="relative group">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <select 
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="w-full pl-12 pr-10 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none appearance-none font-bold text-gray-700 shadow-sm"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
        </div>
      </div>

      {filteredPendingBills.length === 0 ? (
        <EmptyState 
          title={searchTerm ? "No Match Found" : "No Pending Bills"}
          description={searchTerm ? `No records matching "${searchTerm}"` : "Great! All utility bills are settled."}
          icon={CheckCircle2}
          actionText={searchTerm ? "Clear Search" : "Record New Bill"}
          onAction={() => searchTerm ? setSearchTerm('') : setIsModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPendingBills.map((bill) => {
            const type = BILL_TYPES.find(t => t.id === bill.type);
            return (
              <div key={bill.id} className="card p-8 group hover:border-blue-200 transition-all flex flex-col justify-between h-full relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 ${type?.bg || 'bg-gray-100'} rounded-full -mr-16 -mt-16 opacity-50 blur-2xl`}></div>
                
                <div className="relative">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-4 rounded-2xl ${type?.bg || 'bg-gray-50'} ${type?.color || 'text-gray-600'}`}>
                      {type ? <type.icon size={28} /> : <FileText size={28} />}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <StatusBadge status="pending" labels={{ pending: 'Pending' }} colors={{ pending: 'amber' }} />
                      <button 
                        onClick={() => handleDelete(bill.id)}
                        disabled={actionLoading === bill.id}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        title="Delete Bill"
                      >
                        {actionLoading === bill.id ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                      </button>
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-gray-900 tracking-tight">Unit {bill.unitNumber}</h3>
                  <p className="text-sm font-bold text-gray-400 mt-1 flex items-center gap-1.5 uppercase tracking-widest">
                    <Building2 size={12} />
                    {bill.buildingName}
                  </p>

                  <div className="mt-8 pt-6 border-t border-gray-50 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Provider</span>
                      <span className="text-xs font-black text-gray-900 uppercase tracking-widest">{bill.provider || 'KSEB'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Consumer #</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-blue-600">{bill.consumerNumber || 'Not Set'}</span>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(bill.consumerNumber);
                            notify('success', 'Consumer number copied!');
                          }}
                          className="p-1 hover:bg-blue-50 text-blue-400 rounded transition-colors"
                        >
                          <Copy size={12} />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Due Date</span>
                      <span className="text-xs font-bold text-gray-700">
                        {bill.dueDate ? new Date(bill.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-10 space-y-3 relative">
                  <button 
                    onClick={() => handleCheckAndPay(bill)}
                    className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-95 shadow-xl shadow-gray-900/10"
                  >
                    <ExternalLink size={18} />
                    Check & Pay
                  </button>
                  <button 
                    onClick={() => { setSelectedBill(bill); setIsUploadModalOpen(true); }}
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

      <hr className="border-gray-100 my-12" />

      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
            <CheckCircle2 size={20} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Payment History</h2>
        </div>

        {historyBills.length === 0 ? (
          <div className="card p-12 text-center border-dashed border-2 bg-gray-50/50">
            <p className="text-gray-400 font-bold">No payment history yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Mobile History Card Layout */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {historyBills.map((bill) => (
                <div key={bill.id} className="card p-5 space-y-4 border-none shadow-lg shadow-gray-100/50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-black text-gray-900 leading-tight">Unit {bill.unitNumber}</h3>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{bill.buildingName}</p>
                    </div>
                    <span className="text-xs font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">
                      {bill.provider || 'KSEB'}
                    </span>
                  </div>

                  <div className="flex justify-between items-end py-4 border-y border-gray-50">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Paid Date</p>
                      <p className="text-sm font-bold text-gray-700">
                        {bill.paymentDate ? new Date(bill.paymentDate.toDate()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'N/A'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Amount Paid</p>
                      <p className="text-xl font-black text-gray-900">₹{bill.amount?.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {bill.receiptUrl ? (
                      <a 
                        href={bill.receiptUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 font-black text-xs uppercase tracking-widest py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all"
                      >
                        <FileText size={16} />
                        View Receipt
                      </a>
                    ) : (
                      <div className="flex-1 bg-gray-50 text-gray-400 font-black text-xs uppercase tracking-widest py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed">
                        <FileText size={16} />
                        No Receipt
                      </div>
                    )}
                    <button 
                      onClick={() => handleDelete(bill.id)}
                      className="px-4 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop History Table Layout */}
            <div className="hidden md:block card overflow-hidden border-none shadow-xl shadow-gray-100/50">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Unit</th>
                      <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Provider</th>
                      <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                      <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Paid Date</th>
                      <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Reference ID</th>
                      <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {historyBills.map((bill) => (
                      <tr key={bill.id} className="hover:bg-blue-50/20 transition-colors group">
                        <td className="px-8 py-6">
                          <div className="font-bold text-gray-900">Unit {bill.unitNumber}</div>
                          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{bill.buildingName}</div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-xs font-black text-gray-700 uppercase tracking-widest">{bill.provider || 'KSEB'}</span>
                        </td>
                        <td className="px-8 py-6 font-black text-gray-900">₹{bill.amount?.toLocaleString()}</td>
                        <td className="px-8 py-6 text-sm font-medium text-gray-600">
                          {bill.paymentDate ? new Date(bill.paymentDate.toDate()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'N/A'}
                        </td>
                        <td className="px-8 py-6">
                          <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono text-gray-600">
                            {bill.paymentReferenceId || 'N/A'}
                          </code>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-3">
                            {bill.receiptUrl ? (
                              <a 
                                href={bill.receiptUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                              >
                                <FileText size={18} />
                              </a>
                            ) : (
                              <span className="text-gray-300"><FileText size={18} /></span>
                            )}
                            <button 
                              onClick={() => handleDelete(bill.id)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
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

      <ReceiptUploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => { setIsUploadModalOpen(false); setSelectedBill(null); }}
        onUpload={handleReceiptUpload}
        loading={actionLoading === selectedBill?.id}
        currencySymbol="₹"
        title="Complete Electricity Payment"
        description="Since electricity amounts are variable, please enter the exact amount you paid on the KSEB portal and upload the receipt."
      />

      <Modal isOpen={isPayModalOpen} onClose={() => setIsPayModalOpen(false)} title="Pay Electricity Bill (KSEB)">
        {selectedBill && (
          <div className="space-y-8 py-4">
            <div className="bg-amber-50 border border-amber-100 p-6 rounded-[2rem] space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Consumer Number</span>
                <div className="flex items-center gap-3">
                  <code className="text-lg font-black text-amber-900">{selectedBill.consumerNumber}</code>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(selectedBill.consumerNumber);
                      notify('success', 'Copied to clipboard!');
                    }}
                    className="p-2 bg-white text-amber-600 rounded-xl shadow-sm hover:scale-105 transition-all"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
              <p className="text-[10px] font-bold text-amber-700/70 leading-relaxed">
                Use this consumer number to search your bill on the KSEB portal or apps like Google Pay.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Follow these steps:</h4>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-black text-xs shadow-sm">1</div>
                  <p className="text-sm font-bold text-gray-700">Open KSEB portal or Google Pay</p>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-black text-xs shadow-sm">2</div>
                  <p className="text-sm font-bold text-gray-700">Enter consumer number & view bill</p>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-black text-xs shadow-sm">3</div>
                  <p className="text-sm font-bold text-gray-700">Complete payment and return here</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                  window.open("https://wss.kseb.in/selfservices/", "_blank");
                  setIsPayModalOpen(false);
                  setIsUploadModalOpen(true);
                }}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all shadow-xl shadow-gray-900/10 active:scale-95"
              >
                <ExternalLink size={18} />
                Open KSEB Website
              </button>
              <button 
                onClick={() => setIsPayModalOpen(false)}
                className="w-full py-4 text-gray-400 font-bold hover:text-gray-900 transition-colors"
              >
                Done, I'll pay later
              </button>
            </div>
            
            <p className="text-center text-[10px] font-bold text-gray-400 italic">
              Note: Bill amount is shown on KSEB portal
            </p>
          </div>
        )}
      </Modal>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record Unit Bill">
        <form onSubmit={handleAddBill} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Property</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <select required value={formData.buildingId} onChange={(e) => setFormData({ ...formData, buildingId: e.target.value, unitId: '' })} className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none font-bold text-gray-700 appearance-none">
                  <option value="">Select Building</option>
                  {buildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Specific Unit</label>
              <div className="relative">
                <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <select required disabled={!formData.buildingId} value={formData.unitId} onChange={(e) => setFormData({ ...formData, unitId: e.target.value })} className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none font-bold text-gray-700 appearance-none disabled:opacity-50">
                  <option value="">Select Unit</option>
                  {availableUnits.map(u => <option key={u.id} value={u.id}>Unit {u.unitNumber}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Expense Type</label>
            <div className="grid grid-cols-3 gap-3">
              {BILL_TYPES.map((type) => (
                <button key={type.id} type="button" onClick={() => setFormData({ ...formData, type: type.id })} className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${formData.type === type.id ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200'}`}>
                  <type.icon size={24} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{type.name}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput label="Due Date" type="date" icon={Calendar} value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} required />
          </div>
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-8 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all">Cancel</button>
            <button type="submit" disabled={formLoading} className="flex-1 px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 disabled:bg-blue-400 flex items-center justify-center gap-2">
              {formLoading ? <Loader2 className="animate-spin" size={20} /> : <PlusCircle size={20} />} Create Task
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Bills;
