import React from 'react';
import { 
  History, 
  ShieldCheck, 
  FileText,
  Clock,
  Trash2
} from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';

const PaymentHistory = ({ payments, currencySymbol, onVerify, verifyLoading, onDelete }) => {
  if (!payments || payments.length === 0) return null;

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
          <History size={20} />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Payment History</h2>
      </div>

      <div className="space-y-4">
        {/* Mobile History Card Layout */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {payments.map((p) => (
            <div key={p.id} className="card p-5 space-y-4 border-none shadow-lg shadow-gray-100/50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-black text-gray-900 leading-tight">{p.buildingName}</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{p.type}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <StatusBadge status="paid" labels={{ paid: 'Paid' }} colors={{ paid: 'emerald' }} />
                  <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                    p.verificationStatus === 'verified' 
                    ? 'bg-blue-50 text-blue-600 border-blue-100' 
                    : 'bg-amber-50 text-amber-600 border-amber-100'
                  }`}>
                    {p.verificationStatus === 'verified' ? <ShieldCheck size={10} /> : <Clock size={10} />}
                    {p.verificationStatus === 'verified' ? 'Verified' : 'Pending'}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-end py-4 border-y border-gray-50">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Payment Date</p>
                  <p className="text-sm font-bold text-gray-700">
                    {p.paymentDate ? new Date(p.paymentDate.toDate()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'N/A'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Amount Paid</p>
                  <p className="text-xl font-black text-gray-900">{currencySymbol}{p.amount.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex gap-2">
                {p.receiptUrl ? (
                  <a 
                    href={p.receiptUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 font-black text-xs uppercase tracking-widest py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <FileText size={16} />
                    View Receipt
                  </a>
                ) : (
                  <div className="flex-1 bg-gray-50 text-gray-400 font-black text-xs uppercase tracking-widest py-3.5 rounded-xl flex items-center justify-center gap-2 border border-gray-100 cursor-not-allowed">
                    No Receipt
                  </div>
                )}
                {p.verificationStatus !== 'verified' && (
                  <button 
                    onClick={() => onVerify(p.id)}
                    disabled={verifyLoading === p.id}
                    className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-black text-xs uppercase tracking-widest py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all"
                  >
                    {verifyLoading === p.id ? <Loader2 className="animate-spin" size={16} /> : <ShieldCheck size={16} />}
                    Verify
                  </button>
                )}
                <button 
                  onClick={() => onDelete(p.id)}
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
                  <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Building</th>
                  <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                  <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Payment Date</th>
                  <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Reference ID</th>
                  <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-blue-50/20 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="font-bold text-gray-900">{p.buildingName}</div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{p.type}</div>
                    </td>
                    <td className="px-8 py-6 font-black text-gray-900">{currencySymbol}{p.amount.toLocaleString()}</td>
                    <td className="px-8 py-6 text-sm font-medium text-gray-600">
                      {p.paymentDate ? new Date(p.paymentDate.toDate()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-2">
                        <StatusBadge status="paid" labels={{ paid: 'Paid' }} colors={{ paid: 'emerald' }} />
                        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                          p.verificationStatus === 'verified' 
                          ? 'bg-blue-50 text-blue-600 border-blue-100' 
                          : 'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                          {p.verificationStatus === 'verified' ? <ShieldCheck size={12} /> : <Clock size={12} />}
                          {p.verificationStatus === 'verified' ? 'Verified' : 'Pending'}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono text-gray-600">
                        {p.paymentReferenceId || 'N/A'}
                      </code>
                      {p.verificationStatus !== 'verified' && (
                        <button 
                          onClick={() => onVerify(p.id)}
                          disabled={verifyLoading === p.id}
                          className="ml-3 text-[10px] font-black text-blue-600 hover:underline uppercase tracking-widest"
                        >
                          {verifyLoading === p.id ? '...' : 'Verify'}
                        </button>
                      )}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {p.receiptUrl ? (
                          <a 
                            href={p.receiptUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 hover:border-blue-200 text-blue-600 font-bold text-xs rounded-xl transition-all shadow-sm group-hover:scale-105"
                          >
                            <FileText size={14} />
                            View
                          </a>
                        ) : (
                          <span className="text-gray-400 text-xs italic">No Receipt</span>
                        )}
                        
                        <button 
                          onClick={() => onDelete(p.id)}
                          disabled={verifyLoading === p.id}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          title="Delete Record"
                        >
                          {verifyLoading === p.id ? <Loader2 className="animate-spin" size={14} /> : <Trash2 size={14} />}
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
    </div>
  );
};

export default PaymentHistory;
