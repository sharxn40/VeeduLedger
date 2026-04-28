import React from 'react';
import { motion } from 'framer-motion';

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center p-6 text-gray-900 overflow-hidden">
      
      {/* Morphing Background Gradients */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-400/20 rounded-full blur-[80px] md:blur-[120px] pointer-events-none"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.5, 1],
          rotate: [0, -90, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 translate-x-[-20%] translate-y-[-20%] w-[300px] h-[300px] bg-emerald-400/10 rounded-full blur-[80px] pointer-events-none"
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center z-10 text-center"
      >
        <div className="relative mb-8">
          {/* Glowing ring behind logo */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="absolute inset-0 bg-blue-500 rounded-3xl blur-xl opacity-20"
          ></motion.div>
          
          <motion.div 
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center text-white font-black text-5xl shadow-2xl shadow-blue-600/30"
          >
            V
          </motion.div>
        </div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-gray-900"
        >
          Veedu<span className="text-blue-600">Ledger</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-gray-500 font-medium tracking-wide text-sm md:text-base max-w-[250px] md:max-w-xs"
        >
          Track your property. Manage with clarity.
        </motion.p>
      </motion.div>

      {/* Loading Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-16 flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-100 shadow-sm"
      >
        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </motion.div>
    </div>
  );
};

export default SplashScreen;
