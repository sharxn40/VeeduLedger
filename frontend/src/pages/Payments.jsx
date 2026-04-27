import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { useNotification } from '../context/NotificationContext';
import { usePayments } from '../hooks/usePayments';
import { useTenants } from '../hooks/useTenants';
import { paymentService } from '../services/paymentService';
import { 
  IndianRupee, 
  Calendar, 
  Filter, 
  CheckCircle2, 
  Loader2, 
  PlusCircle, 
  Home,
  Building2,
  ChevronDown,
  Search,
  Trash2,
  AlertTriangle,
  History
} from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';
import StatusBadge from '../components/ui/StatusBadge';

const Payments = () => {
  const { currentUser } = useAuth();
  const { settings } = useSettings();
  const { notify, confirm } = useNotification();
  const currentMonthStr = useMemo(() => new Date().toISOString().slice(0, 7), []);
  
  const [monthFilter, setMonthFilter] = useState(currentMonthStr);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isApplyingFees, setIsApplyingFees] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const { payments, loading, refresh } = usePayments(currentUser.uid, monthFilter, statusFilter);
  const { tenants } = useTenants(currentUser.uid);

  const filteredPayments = useMemo(() => {
    if (!searchTerm) return payments;
    return payments.filter(p => 
      p.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.buildingName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [payments, searchTerm]);

  const handleGenerate = async () => {
    if (tenants.length === 0) {
      notify('error', "Please onboard tenants first before generating payments.");
      return;
    }
    setIsGenerating(true);
    try {
      const count = await paymentService.generateMonthly(currentUser.uid, tenants);
      if (count > 0) {
        notify('success', `Successfully generated ${count} payment records.`);
        refresh();
      } else {
        notify('info', "All payments for this month have already been generated.");
      }
    } catch (err) {
      notify('error', "Failed to generate payments.");
    } finally { setIsGenerating(false); }
  };

  const handleApplyLateFees = async () => {
    if (!monthFilter) {
      notify('error', "Please select a specific month to apply late fees.");
      return;
    }
    confirm(
      "Apply Late Fees",
      `Are you sure you want to apply a ${settings.currencySymbol}${settings.lateFeeAmount} late fee to all pending payments for ${monthFilter}?`,
      async () => {
        setIsApplyingFees(true);
        try {
          const count = await paymentService.applyLateFees(currentUser.uid, monthFilter, settings.lateFeeAmount);
          if (count > 0) {
            notify('success', `Applied late fees to ${count} records.`);
            refresh();
          } else {
            notify('info', "No eligible pending payments found for this month.");
          }
        } catch (err) {
          notify('error', "Failed to apply late fees.");
        } finally { setIsApplyingFees(false); }
      }
    );
  };

  const handleMarkAsPaid = async (id) => {
    setActionLoading(id);
    try {
      await paymentService.markAsPaid(id);
      notify('success', "Payment received successfully.");
      refresh();
    } catch (err) { notify('error', "Failed to update status."); }
    finally { setActionLoading(null); }
  };

  const handleDelete = async (id) => {
    confirm(
      "Delete Record",
      "Are you sure you want to delete this payment record? This action cannot be undone.",
      async () => {
        setActionLoading(id);
        try {
          await paymentService.delete(id);
          notify('success', "Payment record deleted.");
          refresh();
        } catch (err) { notify('error', "Failed to delete record."); }
        finally { setActionLoading(null); }
      }
    );
  };

  if (loading && payments.length === 0) {
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
          <h1 className="text-3xl font-bold text-gray-900">Collections</h1>
          <p className="text-gray-500 mt-1">Automated rent tracking and payment history.</p>
        </div>
        
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <button 
            onClick={handleApplyLateFees}
            disabled={isApplyingFees || payments.length === 0}
            className="flex-1 md:flex-none px-6 py-3.5 bg-amber-50 text-amber-600 hover:bg-amber-100 disabled:opacity-50 rounded-xl font-bold flex items-center justify-center gap-2 transition-all border border-amber-100"
          >
            {isApplyingFees ? <Loader2 className="animate-spin" size={18} /> : <AlertTriangle size={18} />}
            Apply Late Fees
          </button>

          <button 
            onClick={handleGenerate}
            disabled={isGenerating || tenants.length === 0}
            className="flex-1 md:flex-none px-8 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
            {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <PlusCircle size={20} />}
            Generate {new Date().toLocaleString('default', { month: 'long' })}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input 
            type="text"
            placeholder="Search by tenant or property..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium"
          />
        </div>

        <div className="relative group">
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <select 
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="w-full pl-12 pr-10 py-3.5 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all appearance-none font-bold text-gray-700"
          >
            <option value="">All Months</option>
            {[...Array(6)].map((_, i) => {
              const date = new Date();
              date.setMonth(date.getMonth() - i);
              const val = date.toISOString().slice(0, 7);
              return <option key={val} value={val}>{date.toLocaleString('default', { month: 'long', year: 'numeric' })}</option>;
            })}
          </select>
          <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        <div className="relative group">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-12 pr-10 py-3.5 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all appearance-none font-bold text-gray-700"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
          </select>
          <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {filteredPayments.length === 0 ? (
        <EmptyState 
          title={searchTerm ? "No Match Found" : "No Records"}
          description={searchTerm ? `No results for "${searchTerm}".` : "Generate monthly rent records to start tracking collections."}
          icon={searchTerm ? Search : History}
          actionText={searchTerm ? "Clear Search" : "Generate Now"}
          onAction={() => searchTerm ? setSearchTerm('') : handleGenerate()}
        />
      ) : (
        <div className="space-y-4">
          {/* Mobile Card Layout */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredPayments.map((p) => (
              <div key={p.id} className="card p-5 space-y-4 border-none shadow-lg shadow-gray-100/50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-black text-gray-900 leading-tight">{p.tenantName}</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                      {p.buildingName} • Unit {p.unitNumbers?.join(', ')}
                    </p>
                  </div>
                  <StatusBadge status={p.status} labels={{ paid: 'Received', pending: 'Awaiting' }} colors={{ paid: 'emerald', pending: 'amber' }} />
                </div>

                <div className="flex justify-between items-end py-4 border-y border-gray-50">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Period</p>
                    <p className="text-sm font-bold text-gray-700">
                      {new Date(p.month + "-01").toLocaleString('default', { month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Amount Due</p>
                    <p className="text-xl font-black text-gray-900">{settings.currencySymbol}{p.amount.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {p.status === 'pending' ? (
                    <button 
                      onClick={() => handleMarkAsPaid(p.id)}
                      disabled={actionLoading === p.id}
                      className="flex-1 bg-blue-600 text-white font-black text-xs uppercase tracking-widest py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/10 active:scale-95"
                    >
                      {actionLoading === p.id ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                      Mark Paid
                    </button>
                  ) : (
                    <div className="flex-1 bg-emerald-50 text-emerald-600 font-black text-xs uppercase tracking-widest py-3.5 rounded-xl flex items-center justify-center gap-2 border border-emerald-100">
                      <CheckCircle2 size={16} />
                      Collected
                    </div>
                  )}
                  <button 
                    onClick={() => handleDelete(p.id)}
                    disabled={actionLoading === p.id}
                    className="px-4 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                  >
                    {actionLoading === p.id ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
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
                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Tenant Details</th>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Period</th>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Total Amount</th>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-blue-50/20 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="font-bold text-gray-900 text-base">{p.tenantName}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{p.buildingName}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                          <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{p.unitNumbers?.join(', ')}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-sm font-bold text-gray-700">
                          {new Date(p.month + "-01").toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-xl font-black text-gray-900 tracking-tight">{settings.currencySymbol}{p.amount.toLocaleString()}</span>
                          {p.lateFee > 0 && (
                            <span className="text-[10px] font-bold text-amber-600 flex items-center gap-1 mt-0.5">
                              <AlertTriangle size={10} />
                              Includes {settings.currencySymbol}{p.lateFee} Late Fee
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <StatusBadge status={p.status} labels={{ paid: 'Received', pending: 'Awaiting' }} colors={{ paid: 'emerald', pending: 'amber' }} />
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-3 ml-auto">
                          {p.status === 'pending' ? (
                            <button 
                              onClick={() => handleMarkAsPaid(p.id)}
                              disabled={actionLoading === p.id}
                              className="px-5 py-2.5 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400 rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/10 active:scale-95 flex items-center gap-2"
                            >
                              {actionLoading === p.id ? <Loader2 className="animate-spin" size={14} /> : <CheckCircle2 size={14} />}
                              Mark Received
                            </button>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 text-emerald-600 font-bold text-xs bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                              <CheckCircle2 size={14} />
                              Collected
                            </div>
                          )}
                          
                          <button 
                            onClick={() => handleDelete(p.id)}
                            disabled={actionLoading === p.id}
                            className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            title="Delete Record"
                          >
                            {actionLoading === p.id ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
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

export default Payments;
