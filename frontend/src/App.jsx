import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { NotificationProvider } from './context/NotificationContext';
import { AnimatePresence, motion } from 'framer-motion';
import AppRoutes from './routes/AppRoutes';
import SplashScreen from './components/ui/SplashScreen';
import useSwipeNavigation from './hooks/useSwipeNavigation';

const AppContent = () => {
  const { loading: authLoading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  // Enable universal left-to-right swipe to go back
  useSwipeNavigation();

  useEffect(() => {
    // Keep splash screen visible for at least 2 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const isLoading = authLoading || showSplash;

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="splash"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <SplashScreen />
        </motion.div>
      ) : (
        <motion.div
          key="app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AppRoutes />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SettingsProvider>
          <NotificationProvider>
            <div className="antialiased text-slate-900 bg-gray-50 min-h-screen">
              <AppContent />
            </div>
          </NotificationProvider>
        </SettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
