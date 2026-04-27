import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { 
  Building2, 
  ShieldCheck, 
  TrendingUp, 
  BarChart3, 
  ChevronRight, 
  ArrowRight,
  CheckCircle2,
  Zap,
  Droplets,
  Wrench,
  Users,
  PieChart,
  Layout,
  Smartphone,
  Globe,
  Star
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
    whileInView: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    },
    viewport: { once: true }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-600 origin-left z-[60]"
        style={{ scaleX }}
      />

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? 'bg-white/80 backdrop-blur-xl border-b border-gray-100 py-4 shadow-sm' : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <motion.div 
              whileHover={{ rotate: 6, scale: 1.1 }}
              className="w-11 h-11 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-600/30 transition-all duration-500"
            >
              V
            </motion.div>
            <span className="text-2xl font-black tracking-tighter text-gray-900">
              Veedu<span className="text-blue-600">Ledger</span>
            </span>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="hidden lg:flex items-center gap-10"
          >
            {['Features', 'Solutions', 'Pricing', 'Resources'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-all relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <Link to="/login" className="hidden sm:block text-sm font-black text-gray-600 hover:text-blue-600 transition-colors px-4 py-2">
              Sign In
            </Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/login" className="block bg-gray-900 hover:bg-blue-600 text-white px-8 py-3.5 rounded-2xl text-sm font-black transition-all shadow-2xl shadow-gray-900/10 hover:shadow-blue-600/20">
                Get Started Free
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 lg:pt-60 lg:pb-52 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-[-10%] left-[-20%] w-[60%] h-[60%] bg-blue-100/50 rounded-full blur-[160px]"
          />
          <motion.div 
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[60%] bg-indigo-100/50 rounded-full blur-[160px]"
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 bg-blue-50/80 backdrop-blur-md border border-blue-100 text-blue-700 px-5 py-2.5 rounded-full text-xs font-black mb-10"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            NEXT-GEN PROPERTY OPERATING SYSTEM
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="text-6xl lg:text-8xl font-black tracking-tight text-gray-900 mb-10 leading-[0.95]"
          >
            Manage Your <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-[length:200%_auto] animate-gradient">Property Empire.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xl lg:text-2xl text-gray-500 max-w-3xl mx-auto mb-14 leading-relaxed font-medium"
          >
            The all-in-one platform to track buildings, automate utilities, and scale your portfolio with absolute clarity and zero headaches.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex justify-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/login" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-[2rem] text-lg font-black transition-all shadow-2xl shadow-blue-600/30 flex items-center justify-center gap-3 group">
                Start Your Free Trial
                <ArrowRight className="group-hover:translate-x-1.5 transition-transform" size={24} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust Marks */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-24 bg-gray-50/50 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-black text-gray-500 uppercase tracking-[0.3em] mb-12">Trusted by 2,500+ Top Real Estate Firms</p>
          <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-500">
            {['Skyline', 'Prestige', 'Sobha', 'Lulu', 'Brigade'].map((name) => (
              <div key={name} className="text-2xl font-black text-gray-300 tracking-tighter cursor-default">{name}</div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section id="solutions" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
          >
            {[
              { label: 'Properties Managed', value: '12,400+', suffix: 'Assets' },
              { label: 'Happy Landlords', value: '2,850', suffix: 'Owners' },
              { label: 'Invoices Processed', value: '₹850Cr+', suffix: 'Annual' },
              { label: 'Uptime Reliability', value: '99.9%', suffix: 'SLA' },
            ].map((stat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative group"
              >
                <div className="text-5xl lg:text-6xl font-black text-gray-900 mb-2 tracking-tighter group-hover:text-blue-600 transition-colors duration-300">
                  {stat.value}
                </div>
                <div className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</div>
                <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">{stat.suffix}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-40 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            {...fadeInUp}
            className="flex flex-col lg:flex-row items-end justify-between gap-12 mb-24"
          >
            <div className="max-w-2xl">
              <h2 className="text-blue-600 font-black uppercase tracking-[0.3em] text-xs mb-6">Unrivaled Power</h2>
              <h3 className="text-5xl lg:text-6xl font-black text-gray-900 leading-[0.95] tracking-tight">
                Tools built for the <br className="hidden md:block" />
                modern property mogul.
              </h3>
            </div>
            <p className="text-xl text-gray-500 max-w-md font-medium leading-relaxed">
              Stop juggling legacy software. VeeduLedger brings high-performance engineering to your real estate portfolio.
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                title: 'Portfolio Intelligence',
                desc: 'Real-time analytics across your entire building empire with deep-dive unit metrics.',
                icon: PieChart,
                color: 'blue'
              },
              {
                title: 'Smart Utility Tracking',
                desc: 'Guided KSEB & KSmart integration for effortless bill and tax management.',
                icon: Zap,
                color: 'amber'
              },
              {
                title: 'Digital Lease Vault',
                desc: 'Securely store and track tenant agreements, KYC documents, and payment histories.',
                icon: ShieldCheck,
                color: 'indigo'
              },
              {
                title: 'Automated Billing',
                desc: 'One-click rent generation with automated PDF receipts and payment verification.',
                icon: FileText,
                color: 'emerald'
              },
              {
                title: 'Maintenance Engine',
                desc: 'Categorize expenses by type and track repair history for every single unit.',
                icon: Wrench,
                color: 'rose'
              },
              {
                title: 'Global Compliance',
                desc: 'Ready for Indian tax laws and property regulations out of the box.',
                icon: Globe,
                color: 'purple'
              }
            ].map((feature, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="group p-10 rounded-[2.5rem] bg-gray-50/50 border border-transparent hover:border-blue-100 hover:bg-white hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500"
              >
                <div className={`w-16 h-16 rounded-3xl bg-${feature.color}-50 flex items-center justify-center text-${feature.color}-600 mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm`}>
                  <feature.icon size={32} strokeWidth={2.5} />
                </div>
                <h4 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">{feature.title}</h4>
                <p className="text-gray-500 leading-relaxed font-medium">{feature.desc}</p>
                <div className="mt-8 flex items-center gap-2 text-blue-600 font-black text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Learn more <ArrowRight size={16} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="pricing" className="py-40 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-[4rem] bg-gray-900 p-12 lg:p-28 overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
          >
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-600/20 via-indigo-600/20 to-transparent -skew-x-12 translate-x-1/2"></div>
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div {...fadeInUp}>
                <h2 className="text-5xl lg:text-7xl font-black text-white mb-10 leading-[0.95] tracking-tight">
                  Ready to scale <br />
                  your empire?
                </h2>
                <p className="text-xl lg:text-2xl text-gray-400 mb-14 leading-relaxed font-medium">
                  Join the elite circle of property managers using VeeduLedger to drive maximum ROI.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/login" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-[2rem] text-xl font-black transition-all shadow-2xl shadow-blue-600/40 flex items-center justify-center gap-3 group">
                      Start Now Free
                      <ArrowRight className="group-hover:translate-x-1.5 transition-transform" size={24} />
                    </Link>
                  </motion.div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2.5 text-white/80 font-bold">
                      <CheckCircle2 size={24} className="text-blue-500" />
                      <span>No setup fees</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-white/80 font-bold">
                      <CheckCircle2 size={24} className="text-blue-500" />
                      <span>Cancel anytime</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/10 relative"
              >
                <div className="flex gap-1 mb-6">
                  {[1,2,3,4,5].map(i => <Star key={i} size={20} className="fill-blue-500 text-blue-500" />)}
                </div>
                <p className="text-2xl text-white font-medium italic mb-8 leading-relaxed">
                  "VeeduLedger transformed how we manage our 400+ units. The utility tracking alone saved us 20 hours a week."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center text-white font-black text-xl">R</div>
                  <div>
                    <p className="text-white font-black">Rajesh Kumar</p>
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">CEO, Skyline Living</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="resources" className="bg-white pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl">V</div>
                <span className="text-2xl font-black tracking-tighter">VeeduLedger</span>
              </div>
              <p className="text-gray-500 font-medium leading-relaxed">
                Empowering the next generation of property owners with state-of-the-art management technology.
              </p>
            </div>

            <div>
              <h5 className="font-black text-gray-900 mb-8 uppercase tracking-widest text-xs">Product</h5>
              <ul className="space-y-4">
                {['Dashboard', 'Pricing', 'API', 'Integrations'].map(item => (
                  <li key={item}><a href="#" className="text-gray-500 hover:text-blue-600 font-bold transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-black text-gray-900 mb-8 uppercase tracking-widest text-xs">Company</h5>
              <ul className="space-y-4">
                {['About Us', 'Careers', 'Privacy', 'Terms'].map(item => (
                  <li key={item}><a href="#" className="text-gray-500 hover:text-blue-600 font-bold transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-black text-gray-900 mb-8 uppercase tracking-widest text-xs">Contact</h5>
              <ul className="space-y-4">
                <li className="text-gray-500 font-bold">support@veeduledger.com</li>
                <li className="text-gray-500 font-bold">+91 9876 543 210</li>
                <li className="text-gray-500 font-bold">Kochi, Kerala, India</li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm font-bold text-gray-400">&copy; 2026 VeeduLedger Technologies Pvt Ltd. All rights reserved.</p>
            <div className="flex items-center gap-8 text-sm font-bold text-gray-400">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                System Operational
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Add lucide-react FileText if missing from imports
const FileText = ({ size, strokeWidth }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth={strokeWidth} 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

export default Landing;
