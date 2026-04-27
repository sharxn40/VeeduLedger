import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 pointer-events-none">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-md pointer-events-auto"
          />
          
          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white w-full h-full md:h-auto md:max-w-lg md:rounded-[2.5rem] shadow-2xl overflow-hidden relative flex flex-col pointer-events-auto"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-8 py-6 border-b border-gray-50 bg-white sticky top-0 z-10">
              <div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight leading-tight">{title}</h3>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Action Required</p>
              </div>
              <button 
                onClick={onClose}
                className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all text-gray-400 active:scale-90"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
              {children}
            </div>

            {/* Mobile Footer Spacing */}
            <div className="h-20 md:hidden bg-white shrink-0 border-t border-gray-50 flex items-center justify-center">
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">VeeduLedger Secure Modal</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
