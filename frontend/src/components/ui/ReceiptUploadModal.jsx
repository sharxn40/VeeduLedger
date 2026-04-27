import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Hash, 
  CheckCircle2, 
  Loader2, 
  FileText,
  AlertCircle,
  IndianRupee
} from 'lucide-react';
import Modal from './Modal';
import FormInput from './FormInput';

const ReceiptUploadModal = ({ isOpen, onClose, onUpload, loading, currencySymbol, title, description }) => {
  const [referenceId, setReferenceId] = useState('');
  const [amount, setAmount] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file || !referenceId || !amount) return;
    onUpload({ file, referenceId, amount });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title || "Complete Payment Details"}>
      <form onSubmit={handleSubmit} className="space-y-6 py-4">
        <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex gap-3 mb-2">
          <AlertCircle className="text-blue-600 shrink-0" size={20} />
          <p className="text-xs text-blue-700 leading-relaxed">
            {description || "Please enter the exact amount you paid and upload the receipt for verification."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput 
            label={`Exact Amount Paid (${currencySymbol})`}
            placeholder="0.00"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            icon={IndianRupee}
            required
          />
          <FormInput 
            label="Transaction Reference ID"
            placeholder="Enter KSmart ID"
            value={referenceId}
            onChange={(e) => setReferenceId(e.target.value)}
            icon={Hash}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Upload Receipt (PDF/Image)</label>
          <div className="relative group">
            <input 
              type="file" 
              accept=".pdf,image/*"
              onChange={handleFileChange}
              className="hidden" 
              id="receipt-upload"
              required
            />
            <label 
              htmlFor="receipt-upload"
              className="flex flex-col items-center justify-center w-full min-h-[160px] border-2 border-dashed border-gray-100 rounded-[2rem] bg-gray-50/50 cursor-pointer group-hover:border-blue-200 group-hover:bg-blue-50/30 transition-all p-6"
            >
              {preview ? (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-sm">
                  <img src={preview} alt="Receipt Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Upload className="text-white" size={32} />
                  </div>
                </div>
              ) : file ? (
                <div className="flex flex-col items-center gap-3 text-emerald-600">
                  <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center">
                    <FileText size={32} />
                  </div>
                  <span className="font-bold text-sm truncate max-w-[250px]">{file.name}</span>
                  <span className="text-[10px] uppercase font-black tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Ready to Upload</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 text-gray-400 group-hover:text-blue-500">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center transition-transform group-hover:scale-110">
                    <Upload size={32} />
                  </div>
                  <p className="font-bold text-sm">Click to Browse File</p>
                  <p className="text-[10px] uppercase font-black tracking-widest opacity-60">PDF, JPG, or PNG max 5MB</p>
                </div>
              )}
            </label>
          </div>
        </div>

        <div className="pt-6 flex gap-4">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all active:scale-95"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={loading || !file || !referenceId || !amount}
            className="flex-[2] py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 disabled:bg-blue-400 transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20 active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
            {loading ? 'Processing...' : 'Verify & Record Payment'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ReceiptUploadModal;
