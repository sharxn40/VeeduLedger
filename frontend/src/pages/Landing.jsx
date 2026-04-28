import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { 
  Building2, 
  Users, 
  CreditCard,
  FileText,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  LayoutGrid
} from 'lucide-react';

const Landing = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const staggerItem = {
    initial: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-blue-900 selection:text-white overflow-x-hidden">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-600 origin-left z-[60]"
        style={{ scaleX }}
      />

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? 'bg-gray-950/80 backdrop-blur-xl border-b border-gray-800 py-4 shadow-lg shadow-black/50' : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-600/30">
              V
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">
              Veedu<span className="text-blue-500">Ledger</span>
            </span>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <Link to="/login" className="hidden sm:block text-sm font-bold text-gray-400 hover:text-white transition-colors px-4 py-2">
              Sign In
            </Link>
            <Link to="/signup" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95">
              Get Started
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 w-[800px] h-[800px] bg-blue-900/20 rounded-full blur-[120px] opacity-70 translate-x-1/3 -translate-y-1/4 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1 text-center lg:text-left z-10"
            >
              <div className="inline-flex items-center gap-2 bg-blue-900/30 text-blue-400 px-4 py-2 rounded-full text-xs font-black mb-8 uppercase tracking-widest border border-blue-500/20">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                Property Management OS
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6 leading-[1.05]">
                Track your property.<br />
                <span className="text-blue-500">Manage with clarity.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-400 mb-10 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
                The modern operating system to manage tenants, automate rent tracking, and stay on top of bills—all from one beautiful dashboard.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link to="/signup" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl text-lg font-bold transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 group active:scale-95">
                  Get Started Now
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </Link>
                <Link to="/login" className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white border border-gray-800 px-8 py-4 rounded-2xl text-lg font-bold transition-all flex items-center justify-center active:scale-95">
                  Sign In
                </Link>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1 relative w-full"
            >
              {/* CSS Abstract Dashboard */}
              <div className="relative w-full aspect-square md:aspect-[4/3] rounded-[2.5rem] bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 shadow-2xl shadow-black overflow-hidden flex items-center justify-center">
                <div className="absolute inset-x-4 inset-y-8 md:inset-x-8 md:inset-y-12 bg-gray-950/60 backdrop-blur-xl rounded-3xl shadow-sm border border-gray-800 flex flex-col p-6 gap-6">
                  {/* Header */}
                  <div className="flex justify-between items-center">
                    <div className="w-32 h-6 bg-gray-800 rounded-full"></div>
                    <div className="w-10 h-10 bg-blue-900/50 rounded-full"></div>
                  </div>
                  {/* Stats Row */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className={`h-24 bg-gradient-to-br from-gray-900 to-gray-900/50 rounded-2xl border border-gray-800 p-4 flex flex-col justify-between shadow-sm ${i === 3 ? 'hidden md:flex' : ''}`}>
                        <div className="w-8 h-8 bg-blue-900/30 rounded-xl"></div>
                        <div className="w-16 h-3 bg-gray-700 rounded-full"></div>
                      </div>
                    ))}
                  </div>
                  {/* Chart Area */}
                  <div className="flex-1 bg-gradient-to-t from-blue-900/20 to-transparent rounded-2xl border border-gray-800 relative overflow-hidden flex items-end">
                    <svg className="w-full h-24 text-blue-500 translate-y-2" preserveAspectRatio="none" viewBox="0 0 100 100">
                      <path d="M0,100 C20,80 40,90 60,40 C80,10 90,20 100,0 L100,100 Z" fill="currentColor" opacity="0.1"/>
                      <path d="M0,100 C20,80 40,90 60,40 C80,10 90,20 100,0" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-900 relative border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">Everything you need to scale</h2>
            <p className="text-lg text-gray-400 font-medium max-w-2xl mx-auto">
              Powerful tools designed specifically for landlords and property managers to eliminate manual work.
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                title: 'Tenant Management',
                desc: 'Keep track of tenant details, KYC, and lease agreements securely in one place.',
                icon: Users,
                color: 'bg-blue-500/10 text-blue-400'
              },
              {
                title: 'Rent Tracking',
                desc: 'Automate rent collection logs and see exactly who has paid and who is pending.',
                icon: CreditCard,
                color: 'bg-emerald-500/10 text-emerald-400'
              },
              {
                title: 'Bill & Tax Tracking',
                desc: 'Never miss a KSEB or property tax payment. Get notified before due dates.',
                icon: FileText,
                color: 'bg-amber-500/10 text-amber-400'
              },
              {
                title: 'Building Layout',
                desc: 'Visually manage your property units. Instantly spot vacant vs occupied rooms.',
                icon: LayoutGrid,
                color: 'bg-purple-500/10 text-purple-400'
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                variants={staggerItem}
                className="bg-gray-950 p-8 rounded-[2rem] shadow-sm border border-gray-800 hover:shadow-xl hover:shadow-black/50 transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-black text-white mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-gray-400 font-medium leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Screenshots Section (Abstract Phones) */}
      <section className="py-32 bg-gray-950 overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-blue-900/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeInUp} className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">Built for mobile control</h2>
            <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto">
              Manage your properties on the go. Our mobile-first design means you have absolute power in your pocket.
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-16 md:gap-24">
            
            {/* Phone 1: Tenants */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute -inset-4 bg-gradient-to-b from-blue-500/10 to-transparent rounded-[3.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
              <div className="w-[300px] h-[600px] bg-gray-900 rounded-[3rem] shadow-2xl border-[8px] border-gray-800 overflow-hidden relative flex flex-col z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-3xl z-20"></div>
                <div className="pt-14 pb-8 px-6 bg-blue-600 text-white">
                  <div className="w-20 h-4 bg-blue-400/50 rounded-full mb-6"></div>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Users size={24} className="text-white" />
                    </div>
                    <div className="space-y-2">
                      <div className="w-24 h-4 bg-white/90 rounded-full"></div>
                      <div className="w-16 h-3 bg-blue-300 rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 bg-gray-950 p-6 space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-800 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                        <div className="w-5 h-5 rounded-full bg-gray-700"></div>
                      </div>
                      <div className="space-y-2 flex-1">
                        <div className="w-3/4 h-3 bg-gray-700 rounded-full"></div>
                        <div className="w-1/2 h-2 bg-gray-800 rounded-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-10 text-center">
                <h3 className="text-2xl font-black text-white mb-2">Tenant Profiles</h3>
                <p className="text-gray-400 font-medium">Complete history at your fingertips.</p>
              </div>
            </motion.div>
            
            {/* Phone 2: Billing */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative group"
            >
              <div className="absolute -inset-4 bg-gradient-to-b from-emerald-500/10 to-transparent rounded-[3.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
              <div className="w-[300px] h-[600px] bg-gray-900 rounded-[3rem] shadow-2xl border-[8px] border-gray-800 overflow-hidden relative flex flex-col z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-3xl z-20"></div>
                <div className="pt-14 pb-8 px-6 bg-emerald-500 text-white">
                  <div className="flex justify-between items-center mb-8">
                    <div className="w-24 h-4 bg-emerald-400/50 rounded-full"></div>
                    <div className="w-8 h-8 rounded-full bg-white/20"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="w-16 h-3 bg-emerald-200 rounded-full"></div>
                    <div className="w-32 h-8 bg-white/90 rounded-full"></div>
                  </div>
                </div>
                <div className="flex-1 bg-gray-950 p-6 space-y-4">
                  {[1, 2].map(i => (
                    <div key={i} className="bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-800 space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="w-20 h-3 bg-gray-700 rounded-full"></div>
                        <div className="w-12 h-4 bg-rose-900/50 rounded-full"></div>
                      </div>
                      <div className="w-full h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                        <div className="w-16 h-3 bg-emerald-500/50 rounded-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-10 text-center">
                <h3 className="text-2xl font-black text-white mb-2">Smart Billing</h3>
                <p className="text-gray-400 font-medium">Track every rupee with precision.</p>
              </div>
            </motion.div>
            
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-32 bg-gray-900 text-white relative overflow-hidden border-t border-gray-800">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-900/20 to-transparent opacity-50"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            <motion.div {...fadeInUp}>
              <div className="w-16 h-16 rounded-3xl bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto md:mx-0 mb-8">
                <Clock size={32} />
              </div>
              <h3 className="text-2xl font-black mb-4">Save 20+ Hours</h3>
              <p className="text-gray-400 font-medium leading-relaxed">
                Automate your most tedious tasks. Stop chasing spreadsheets and let our system handle the math.
              </p>
            </motion.div>
            
            <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto md:mx-0 mb-8">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-2xl font-black mb-4">Zero Missed Dues</h3>
              <p className="text-gray-400 font-medium leading-relaxed">
                Get push notifications for pending rent, electricity bills, and tax deadlines before they incur penalties.
              </p>
            </motion.div>
            
            <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
              <div className="w-16 h-16 rounded-3xl bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto md:mx-0 mb-8">
                <Building2 size={32} />
              </div>
              <h3 className="text-2xl font-black mb-4">Absolute Clarity</h3>
              <p className="text-gray-400 font-medium leading-relaxed">
                Know exactly how your portfolio is performing at any moment with real-time financial dashboards.
              </p>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-24 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-10 tracking-tight">Ready to upgrade your management?</h2>
            <Link to="/signup" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-2xl text-lg font-bold transition-all shadow-xl shadow-blue-600/30 active:scale-95">
              Start Managing Free
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-sm">V</div>
            <span className="text-xl font-black tracking-tighter text-white">VeeduLedger</span>
          </div>
          
          <div className="flex items-center gap-8">
            <Link to="/login" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Login</Link>
            <Link to="/signup" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Sign Up</Link>
            <a href="#" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Support</a>
          </div>

          <p className="text-sm font-bold text-gray-600 text-center md:text-right">
            &copy; 2026 VeeduLedger. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
