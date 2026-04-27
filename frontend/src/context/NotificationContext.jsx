import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  X, 
  AlertTriangle, 
  Loader2,
  Trash2,
  Bell
} from 'lucide-react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [confirmData, setConfirmData] = useState(null);

  const notify = useCallback((type, message) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const showConfirm = useCallback((title, message, onConfirm) => {
    setConfirmData({ title, message, onConfirm });
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notify, confirm: showConfirm }}>
      {children}
      
      {/* Toasts Container */}
      <div className="fixed top-8 right-8 z-[9999] flex flex-col gap-4 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map(toast => (
            <motion.div 
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, x: 20 }}
              className={`pointer-events-auto flex items-start gap-4 px-6 py-5 rounded-[2rem] shadow-2xl border backdrop-blur-md min-w-[340px] transition-all ${
                toast.type === 'success' ? 'bg-emerald-50/90 border-emerald-100 text-emerald-900 shadow-emerald-500/10' :
                toast.type === 'error' ? 'bg-red-50/90 border-red-100 text-red-900 shadow-red-500/10' :
                'bg-blue-50/90 border-blue-100 text-blue-900 shadow-blue-500/10'
              }`}
            >
              <div className={`mt-0.5 p-2 rounded-xl ${
                toast.type === 'success' ? 'bg-emerald-100/50 text-emerald-600' :
                toast.type === 'error' ? 'bg-red-100/50 text-red-600' :
                'bg-blue-100/50 text-blue-600'
              }`}>
                {toast.type === 'success' && <CheckCircle2 size={20} />}
                {toast.type === 'error' && <AlertCircle size={20} />}
                {toast.type === 'info' && <Bell size={20} />}
              </div>
              
              <div className="flex-1">
                <h4 className="font-black text-sm uppercase tracking-widest opacity-40 mb-1">
                  {toast.type === 'success' ? 'Success' : toast.type === 'error' ? 'Error' : 'Notification'}
                </h4>
                <p className="font-bold text-sm leading-relaxed">{toast.message}</p>
              </div>
              
              <button 
                onClick={() => removeToast(toast.id)} 
                className="mt-0.5 opacity-20 hover:opacity-100 transition-opacity p-1 hover:bg-black/5 rounded-lg"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Confirmation Modal - Premium Glassmorphism UI */}
      <AnimatePresence>
        {confirmData && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-md" 
              onClick={() => setConfirmData(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white/95 w-full max-w-md rounded-[3rem] p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border border-white"
            >
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-8 mx-auto shadow-2xl ${
                  confirmData.title.toLowerCase().includes('delete') || confirmData.title.toLowerCase().includes('remove')
                  ? 'bg-red-50 text-red-500 shadow-red-200'
                  : 'bg-blue-50 text-blue-500 shadow-blue-200'
                }`}
              >
                {confirmData.title.toLowerCase().includes('delete') || confirmData.title.toLowerCase().includes('remove')
                 ? <Trash2 size={36} /> 
                 : <AlertTriangle size={36} />}
              </motion.div>
              
              <div className="text-center space-y-3 mb-10">
                <h3 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">
                  {confirmData.title}
                </h3>
                <p className="text-gray-500 font-bold text-sm leading-relaxed px-2">
                  {confirmData.message}
                </p>
              </div>
              
              <div className="flex flex-col gap-3">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    confirmData.onConfirm();
                    setConfirmData(null);
                  }}
                  className={`w-full py-5 rounded-[2rem] font-black text-white transition-all shadow-xl ${
                    confirmData.title.toLowerCase().includes('delete') || confirmData.title.toLowerCase().includes('remove')
                    ? 'bg-red-600 hover:bg-red-700 shadow-red-600/20'
                    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
                  }`}
                >
                  Yes, Proceed
                </motion.button>
                <button 
                  onClick={() => setConfirmData(null)}
                  className="w-full py-4 text-gray-400 font-bold hover:text-gray-900 transition-colors"
                >
                  Cancel and Go Back
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
