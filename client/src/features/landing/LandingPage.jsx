import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  FileText, 
  UserCheck, 
  FileSpreadsheet, 
  Banknote,
  Landmark,
  CheckCircle2,
  CalendarDays,
  Gift,
  PieChart,
  BrainCircuit,
  ShieldCheck,
  Calculator
} from 'lucide-react';

import CubeCluster3D from '../../components/CubeCluster3D';

const NodeItem = ({ icon: Icon, title, subtitle, tag, tagColor, delay }) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay }}
    className="flex items-center p-4 bg-white rounded-2xl border border-zinc-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all z-10 relative w-full sm:w-[320px]"
  >
    <div className="w-12 h-12 rounded-xl bg-zinc-50 flex items-center justify-center border border-zinc-100 mr-4 shrink-0">
      <Icon size={24} className="text-zinc-600" />
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-[15px] font-bold text-zinc-900 truncate">{title}</h4>
      <p className="text-[13px] text-zinc-500 truncate">{subtitle}</p>
    </div>
    {tag && (
      <div className={`ml-3 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${tagColor}`}>
        {tag}
      </div>
    )}
  </motion.div>
);

const RightNodeItem = ({ icon: Icon, title, subtitle, tag, tagColor, delay }) => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay }}
    className="flex items-center p-4 bg-white rounded-2xl border border-zinc-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all z-10 relative w-full sm:w-[320px]"
  >
    <div className="w-12 h-12 rounded-xl bg-zinc-50 flex items-center justify-center border border-zinc-100 mr-4 shrink-0">
      <Icon size={24} className="text-zinc-600" />
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-[15px] font-bold text-zinc-900 truncate">{title}</h4>
      <p className="text-[13px] text-zinc-500 truncate">{subtitle}</p>
    </div>
    {tag && (
      <div className={`ml-3 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${tagColor}`}>
        {tag}
      </div>
    )}
  </motion.div>
);

const AnimatedLine = ({ path, delay }) => {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ overflow: 'visible' }}>
      <motion.path
        d={path}
        fill="none"
        stroke="#E4E4E7"
        strokeWidth="2"
        strokeDasharray="6 6"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay, ease: "easeInOut" }}
      />
      <motion.circle
        r="4"
        fill="#4F46E5"
        initial={{ offsetDistance: "0%", opacity: 0 }}
        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: "linear",
          delay: delay + 0.5
        }}
        style={{ offsetPath: `path('${path}')` }}
      />
    </svg>
  );
};

const LandingPage = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      
      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-6 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <Landmark size={20} className="text-white" />
          </div>
          <span className="font-bold text-2xl text-slate-900 tracking-tight">Smart Loans</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all">
            Dashboard Sign In
          </Link>
        </div>
      </nav>

      {/* Main Container */}
      <main className="relative w-full max-w-[1200px] mx-auto px-4 xl:px-0 pt-12 pb-24 min-h-[800px]">
        
        {/* Hero Heading */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 xl:mb-12 mt-4"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
            The intelligent platform for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">modern lending.</span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            A complete end-to-end loan management infrastructure that empowers you to originate, service, and collect loans with unprecedented efficiency and speed.
          </p>
        </motion.div>

        {/* DESKTOP VIEW (Fixed coordinate system for perfect SVG alignment) */}
        <div className="hidden xl:block relative w-[1200px] h-[700px] mx-auto">
          
          {/* SVG Connections */}
          {mounted && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 1200 700">
              {/* Left to Center paths */}
              <AnimatedLine path="M 320 110 C 380 110, 370 350, 430 350" delay={0.2} />
              <AnimatedLine path="M 320 220 C 380 220, 370 350, 430 350" delay={0.4} />
              <AnimatedLine path="M 320 330 C 380 330, 370 350, 430 350" delay={0.6} />
              <AnimatedLine path="M 320 440 C 380 440, 370 350, 430 350" delay={0.8} />
              <AnimatedLine path="M 320 550 C 380 550, 370 350, 430 350" delay={1.0} />

              {/* Center to Right paths */}
              <AnimatedLine path="M 770 350 C 830 350, 820 165, 880 165" delay={1.2} />
              <AnimatedLine path="M 770 350 C 830 350, 820 275, 880 275" delay={1.4} />
              <AnimatedLine path="M 770 350 C 830 350, 820 385, 880 385" delay={1.6} />
              <AnimatedLine path="M 770 350 C 830 350, 820 495, 880 495" delay={1.8} />
            </svg>
          )}

          {/* LEFT COLUMN: Inputs (Fixed Coordinates) */}
          <div className="absolute top-[30px] left-0 text-xs font-bold text-zinc-400 tracking-widest uppercase">
            Data Sources & Inputs
          </div>
          <div className="absolute top-[70px] left-0"><NodeItem icon={Users} title="Borrower Profiles" subtitle="KYC & Demographics" tag="KYC" tagColor="bg-blue-50 text-blue-600" delay={0.1} /></div>
          <div className="absolute top-[180px] left-0"><NodeItem icon={FileText} title="Supporting Documents" subtitle="NIC, Bank Statements" tag="DOCS" tagColor="bg-emerald-50 text-emerald-600" delay={0.2} /></div>
          <div className="absolute top-[290px] left-0"><NodeItem icon={UserCheck} title="Guarantor Details" subtitle="Verification & Job Data" tag="GUAR" tagColor="bg-purple-50 text-purple-600" delay={0.3} /></div>
          <div className="absolute top-[400px] left-0"><NodeItem icon={FileSpreadsheet} title="Loan Applications" subtitle="Requested Amount, Term" tag="APP" tagColor="bg-orange-50 text-orange-600" delay={0.4} /></div>
          <div className="absolute top-[510px] left-0"><NodeItem icon={Banknote} title="Payment Collections" subtitle="Field Officer Cash/Transfers" tag="PAY" tagColor="bg-pink-50 text-pink-600" delay={0.5} /></div>

          {/* CENTER COLUMN: The Core Platform (Fixed Coordinates) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute top-[120px] left-[430px] z-20 w-[340px]"
          >
            <div className="absolute -top-6 left-0 right-0 flex justify-center">
               <div className="px-4 py-1.5 bg-indigo-50 border border-indigo-100 rounded-lg text-xs font-bold text-indigo-600 flex items-center gap-2 shadow-sm">
                 <BrainCircuit size={14} /> PROCESSING ENGINE
               </div>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border border-zinc-200 shadow-[0_20px_60px_rgb(0,0,0,0.05)] flex flex-col items-center min-h-[460px]">
              {/* Center Logo */}
              <div className="relative w-28 h-28 mb-6 mt-4">
                <div className="absolute inset-0 border-2 border-indigo-100 rounded-full animate-ping opacity-20" style={{ animationDuration: '3s' }} />
                <div className="absolute inset-2 border-2 border-indigo-200 rounded-full animate-spin-slow" style={{ animationDuration: '10s' }} />
                <div className="absolute inset-4 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-full shadow-xl shadow-indigo-600/30 flex items-center justify-center text-white">
                  <Landmark size={40} />
                </div>
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-1">Smart Loans</h2>
              <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-8 text-center">
                Automated Loan Management
              </p>
              {/* Inner Agents/Modules */}
              <div className="w-full space-y-3 mt-auto">
                <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-3 flex items-center justify-between group hover:border-indigo-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={16} className="text-indigo-500" />
                    <span className="text-sm font-semibold text-zinc-700">Application Engine</span>
                  </div>
                  <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">active</span>
                </div>
                <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-3 flex items-center justify-between group hover:border-indigo-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <Calculator size={16} className="text-indigo-500" />
                    <span className="text-sm font-semibold text-zinc-700">Capital Manager</span>
                  </div>
                  <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">active</span>
                </div>
                <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-3 flex items-center justify-between group hover:border-indigo-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <Gift size={16} className="text-indigo-500" />
                    <span className="text-sm font-semibold text-zinc-700">Bonus Calculator</span>
                  </div>
                  <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">active</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Outputs (Fixed Coordinates) */}
          <div className="absolute top-[85px] left-[880px] text-xs font-bold text-zinc-400 tracking-widest uppercase">
            System Outputs & Results
          </div>
          <div className="absolute top-[125px] left-[880px]"><RightNodeItem icon={CheckCircle2} title="Approved Loans" subtitle="Active Portfolio & Funds" tag="DISB" tagColor="bg-blue-50 text-blue-600" delay={0.6} /></div>
          <div className="absolute top-[235px] left-[880px]"><RightNodeItem icon={CalendarDays} title="Repayment Schedules" subtitle="Automated Installments" tag="SCH" tagColor="bg-amber-50 text-amber-600" delay={0.7} /></div>
          <div className="absolute top-[345px] left-[880px]"><RightNodeItem icon={Gift} title="Staff Salary & Bonuses" subtitle="Performance-based Rewards" tag="PAY" tagColor="bg-green-50 text-green-600" delay={0.8} /></div>
          <div className="absolute top-[455px] left-[880px]"><RightNodeItem icon={PieChart} title="Financial Analytics" subtitle="Capital, P&L, Overdue" tag="REP" tagColor="bg-purple-50 text-purple-600" delay={0.9} /></div>

        </div>

        {/* MOBILE/TABLET VIEW (Responsive Flex Column) */}
        <div className="xl:hidden flex flex-col items-center justify-center w-full gap-12 relative">
          
          {/* MOBILE LEFT COLUMN: Inputs */}
          <div className="flex flex-col gap-5 w-full max-w-[320px] relative z-10">
            <div className="text-xs font-bold text-zinc-400 tracking-widest uppercase mb-2 text-center">
              Data Sources & Inputs
            </div>
            <NodeItem icon={Users} title="Borrower Profiles" subtitle="KYC & Demographics" tag="KYC" tagColor="bg-blue-50 text-blue-600" delay={0.1} />
            <NodeItem icon={FileText} title="Supporting Documents" subtitle="NIC, Bank Statements" tag="DOCS" tagColor="bg-emerald-50 text-emerald-600" delay={0.2} />
            <NodeItem icon={UserCheck} title="Guarantor Details" subtitle="Verification & Job Data" tag="GUAR" tagColor="bg-purple-50 text-purple-600" delay={0.3} />
            <NodeItem icon={FileSpreadsheet} title="Loan Applications" subtitle="Requested Amount, Term" tag="APP" tagColor="bg-orange-50 text-orange-600" delay={0.4} />
            <NodeItem icon={Banknote} title="Payment Collections" subtitle="Field Officer Cash/Transfers" tag="PAY" tagColor="bg-pink-50 text-pink-600" delay={0.5} />
          </div>

          {/* MOBILE CENTER COLUMN: The Core Platform */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-20 w-full max-w-[320px] mt-8 mb-8"
          >
            <div className="absolute -top-6 left-0 right-0 flex justify-center">
               <div className="px-4 py-1.5 bg-indigo-50 border border-indigo-100 rounded-lg text-xs font-bold text-indigo-600 flex items-center gap-2 shadow-sm">
                 <BrainCircuit size={14} /> PROCESSING ENGINE
               </div>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border border-zinc-200 shadow-[0_20px_60px_rgb(0,0,0,0.05)] flex flex-col items-center">
              <div className="relative w-28 h-28 mb-6 mt-4">
                <div className="absolute inset-0 border-2 border-indigo-100 rounded-full animate-ping opacity-20" style={{ animationDuration: '3s' }} />
                <div className="absolute inset-2 border-2 border-indigo-200 rounded-full animate-spin-slow" style={{ animationDuration: '10s' }} />
                <div className="absolute inset-4 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-full shadow-xl shadow-indigo-600/30 flex items-center justify-center text-white">
                  <Landmark size={40} />
                </div>
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-1">Smart Loans</h2>
              <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-8 text-center">
                Automated Loan Management
              </p>
              <div className="w-full space-y-3">
                <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={16} className="text-indigo-500" />
                    <span className="text-sm font-semibold text-zinc-700">Application Engine</span>
                  </div>
                  <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">active</span>
                </div>
                <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calculator size={16} className="text-indigo-500" />
                    <span className="text-sm font-semibold text-zinc-700">Capital Manager</span>
                  </div>
                  <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">active</span>
                </div>
                <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Gift size={16} className="text-indigo-500" />
                    <span className="text-sm font-semibold text-zinc-700">Bonus Calculator</span>
                  </div>
                  <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">active</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* MOBILE RIGHT COLUMN: Outputs */}
          <div className="flex flex-col gap-5 w-full max-w-[320px] relative z-10">
            <div className="text-xs font-bold text-zinc-400 tracking-widest uppercase mb-2 text-center">
              System Outputs & Results
            </div>
            <RightNodeItem icon={CheckCircle2} title="Approved Loans" subtitle="Active Portfolio & Funds" tag="DISB" tagColor="bg-blue-50 text-blue-600" delay={0.6} />
            <RightNodeItem icon={CalendarDays} title="Repayment Schedules" subtitle="Automated Installments" tag="SCH" tagColor="bg-amber-50 text-amber-600" delay={0.7} />
            <RightNodeItem icon={Gift} title="Staff Salary & Bonuses" subtitle="Performance-based Rewards" tag="PAY" tagColor="bg-green-50 text-green-600" delay={0.8} />
            <RightNodeItem icon={PieChart} title="Financial Analytics" subtitle="Capital, P&L, Overdue" tag="REP" tagColor="bg-purple-50 text-purple-600" delay={0.9} />
          </div>

        </div>
      </main>

      {/* Feature Grid Section (Platform Features) */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 mb-16 border-t border-zinc-200/50">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            A Complete Financial Operating System
          </h2>
          <p className="text-zinc-500">
            Everything you need to run Smart Loans Lanka efficiently, from digital originations to automated staff bonuses.
          </p>
        </div>

        <div className="relative w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 items-center">
            
            {/* Left Column Cards */}
            <div className="flex flex-col gap-8 items-center lg:items-end z-10">
              {/* Card 1 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                className="w-full max-w-sm bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
              >
                <div className="mb-4"><FileSpreadsheet size={24} className="text-indigo-500" /></div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Digital Originations</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">Complete digital loan applications with built-in guarantor verification and document management flows.</p>
                <Link to="#" className="inline-flex items-center text-sm font-semibold text-indigo-500 hover:text-indigo-600 group">
                  Learn More <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </motion.div>

              {/* Card 3 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
                className="w-full max-w-sm bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
              >
                <div className="mb-4"><CalendarDays size={24} className="text-indigo-500" /></div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Automated Collections</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">Generate installment schedules instantly and track daily payments with manager-level verification flows.</p>
                <Link to="#" className="inline-flex items-center text-sm font-semibold text-indigo-500 hover:text-indigo-600 group">
                  Learn More <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </motion.div>
            </div>

            {/* Central 3D / Glowing Placeholder */}
            <div className="flex justify-center items-center py-12 lg:py-0 relative z-0 h-[400px]">
              <CubeCluster3D />
            </div>

            {/* Right Column Cards */}
            <div className="flex flex-col gap-8 items-center lg:items-start z-10">
              {/* Card 2 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                className="w-full max-w-sm bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
              >
                <div className="mb-4"><PieChart size={24} className="text-indigo-500" /></div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Capital & Ledgers</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">Real-time tracking of starting capital, disbursements, profit/loss, and operational business expenses.</p>
                <Link to="#" className="inline-flex items-center text-sm font-semibold text-indigo-500 hover:text-indigo-600 group">
                  Learn More <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </motion.div>

              {/* Card 4 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
                className="w-full max-w-sm bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
              >
                <div className="mb-4"><Gift size={24} className="text-indigo-500" /></div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Performance Bonuses</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">Automatically calculate staff salaries and monthly bonuses based on verified applications and on-time collections.</p>
                <Link to="#" className="inline-flex items-center text-sm font-semibold text-indigo-500 hover:text-indigo-600 group">
                  Learn More <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
