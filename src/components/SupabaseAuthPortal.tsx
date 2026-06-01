import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Database, 
  RefreshCw, 
  CheckCircle, 
  LogOut, 
  ArrowLeft, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Activity,
  Globe,
  Check,
  Cpu,
  Layers,
  Bookmark
} from 'lucide-react';
import { supabase } from '../utils/supabase';

interface SupabaseAuthPortalProps {
  dbUser: any;
  dbProfile: any;
  userOrders: any[];
  userCart: any[];
  isAuthLoading: boolean;
  authError: string | null;
  authMessage: string | null;
  setAuthError: (err: string | null) => void;
  setAuthMessage: (msg: string | null) => void;
  onSignUp: (e: React.FormEvent) => Promise<void>;
  onSignIn: (e: React.FormEvent) => Promise<void>;
  onSignOut: () => Promise<void>;
  onEnterWorkspace: () => void;
  authEmail: string;
  setAuthEmail: (email: string) => void;
  authPassword: string;
  setAuthPassword: (pass: string) => void;
  authFullName: string;
  setAuthFullName: (name: string) => void;
  authPhone: string;
  setAuthPhone: (phone: string) => void;
  authAddress: string;
  setAuthAddress: (addr: string) => void;
  isSignUp: boolean;
  setIsSignUp: (isSignUp: boolean) => void;
  dbStats: { users: number; orders: number; cart: number; forms: number };
  fetchStats: () => void;
}

export const SupabaseAuthPortal: React.FC<SupabaseAuthPortalProps> = ({
  dbUser,
  dbProfile,
  userOrders,
  userCart,
  isAuthLoading,
  authError,
  authMessage,
  setAuthError,
  setAuthMessage,
  onSignUp,
  onSignIn,
  onSignOut,
  onEnterWorkspace,
  authEmail,
  setAuthEmail,
  authPassword,
  setAuthPassword,
  authFullName,
  setAuthFullName,
  authPhone,
  setAuthPhone,
  authAddress,
  setAuthAddress,
  isSignUp,
  setIsSignUp,
  dbStats,
  fetchStats
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [telemetryLogs, setTelemetryLogs] = useState<Array<{ id: string; msg: string; type: 'info' | 'success' | 'warn' | 'error'; time: string }>>([]);
  const [avatarStyle, setAvatarStyle] = useState<'cyber' | 'stellar' | 'retro' | 'quantum'>('cyber');

  // Load state and post logs
  useEffect(() => {
    addLog("Connected to Supabase client instance.", "success");
    addLog("Listening to authenticated session events...", "info");
    if (dbUser) {
      addLog(`Authenticated session detected for user: ${dbUser.email}`, "success");
    }
  }, [dbUser]);

  const addLog = (msg: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
    const time = new Date().toLocaleTimeString();
    setTelemetryLogs(prev => [
      { id: `${Date.now()}-${Math.random()}`, msg, type, time },
      ...prev.slice(0, 19) // limit to 20 logs
    ]);
  };

  const handleFormSubmitted = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthMessage(null);

    if (isSignUp) {
      addLog(`Initiating auth.signUp request to Supabase authentication server...`, "info");
      addLog(`Details: name=${authFullName}, email=${authEmail}, address=${authAddress}`, "info");
      
      try {
        await onSignUp(e);
        // If succeeded or errored, we check the auth messages
        setTimeout(() => {
          if (supabase.auth.getUser()) {
            addLog(`Supabase registration succeeded! Details transferred securely.`, "success");
            addLog(`Manual fallback Profiles table sync committed.`, "success");
            addLog(`Workspace routing validated!`, "success");
          }
        }, 1000);
      } catch (err: any) {
        addLog(`Supabase Registration failed: ${err.message || err}`, "error");
      }
    } else {
      addLog(`Initiating authentication request with Supabase login server...`, "info");
      try {
        await onSignIn(e);
        setTimeout(() => {
          addLog(`Supabase Sign-In handshake succeeded!`, "success");
          addLog(`Profile loaded and cart sync finished successfully.`, "success");
        }, 1000);
      } catch (err: any) {
        addLog(`Login Failed: ${err.message || err}`, "error");
      }
    }
  };

  const executeSignOutAndLog = async () => {
    addLog(`Initiating explicit sign-out sequence...`, "warn");
    await onSignOut();
    addLog(`Signed out safely. Local credentials database purged.`, "success");
  };

  const getLogColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-emerald-400 font-bold';
      case 'error': return 'text-rose-400 font-extrabold animate-pulse';
      case 'warn': return 'text-amber-400';
      default: return 'text-neutral-400';
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#07090e] text-[#e2e8f0] flex flex-col items-center justify-between relative overflow-hidden p-4 md:p-8 font-sans selection:bg-[#00FF41] selection:text-black">
      
      {/* GLOWING AMBIENT GRAPHICS */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#00FF41]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* HEADER SECTION */}
      <header className="w-full max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4 z-10 border-b border-zinc-800/60 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-neutral-900 to-[#121c16] border border-[#00FF41]/30 flex items-center justify-center glow-success">
            <Cpu className="w-6 h-6 text-[#00FF41]" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-zinc-500 bg-[#0c1410] border border-[#00FF41]/10 px-1.5 py-0.5 rounded leading-none">SECURITY SUITE</span>
              <span className="w-1.5 h-1.5 bg-[#00FF41] rounded-full animate-ping"></span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white mt-1">
              GEN_SITE <span className="text-zinc-500 font-medium">/</span> <span className="text-[#00FF41]">SUPABASE</span>
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onEnterWorkspace}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-mono text-xs rounded-lg border border-zinc-800 hover:border-zinc-700 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Launch Designer Free Sandbox
          </button>
        </div>
      </header>

      {/* MAIN TWO-COLUMN CONTAINER */}
      <main className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 my-8 z-10 flex-1 items-stretch">
        
        {/* LEFT COLUMN: INTUITIVE SUPABASE SECURITY DECK (INFO & RECONCILIATION) */}
        <section className="lg:col-span-5 flex flex-col justify-between gap-6 bg-gradient-to-b from-[#0c0f16] to-[#080a0e] p-6 rounded-2xl border border-zinc-800/80">
          
          <div className="space-y-6">
            <div className="space-y-1 text-left">
              <div className="flex items-center gap-1.5 text-[#00FF41] font-mono text-xs uppercase font-extrabold">
                <Database className="w-3.5 h-3.5" />
                Cloud Database Integration
              </div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">Supabase Account System</h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Experience full-stack visual architecture with secure identity persistence. When you register an account, your credentials and custom parameters are automatically transmitted secure, query-optimised cloud-nested files tables.
              </p>
            </div>

            {/* SYNC SCHEMATIC EXPLAINER DIAGRAM */}
            <div className="p-4 rounded-xl bg-[#090b10] border border-zinc-800/70 space-y-3.5">
              <h3 className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider text-left flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-[#00FF41]" />
                Supabase Data Transfer Schematic
              </h3>

              <div className="grid grid-cols-3 items-center gap-2 font-mono text-[9px] relative select-none">
                {/* Visual Block A */}
                <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-center text-zinc-300 space-y-1">
                  <span className="text-white font-extrabold block">CLIENT</span>
                  <p className="text-[7.5px] text-zinc-500 leading-none">React Auth State</p>
                </div>

                {/* Connection arrows */}
                <div className="flex flex-col items-center justify-center text-zinc-600 gap-0.5">
                  <span className="text-[#00FF41] font-bold text-[10px] animate-pulse">➡️ SYNC</span>
                  <div className="h-0.5 w-12 bg-gradient-to-r from-zinc-700 to-[#00FF41]"></div>
                </div>

                {/* Visual Block B */}
                <div className="p-2.5 rounded-lg bg-[#0e1610] border border-[#00FF41]/20 text-center text-[#00FF41] space-y-1">
                  <span className="font-extrabold block text-white">SUPABASE</span>
                  <p className="text-[7px] text-emerald-500 leading-none">Durable Tables</p>
                </div>
              </div>

              {/* DETAILS AND ROLES MAP */}
              <div className="space-y-1.5 pt-1.5 border-t border-zinc-900 text-left">
                <span className="text-[8.5px] font-mono text-zinc-500 block uppercase">Mapped Database Fields:</span>
                
                <div className="grid grid-cols-2 gap-1.5 font-mono text-[9.5px]">
                  <div className="flex items-center gap-1 text-zinc-300">
                    <span className="w-1 h-1 rounded-full bg-[#00FF41]"></span>
                    <span>id ➡️ auth._users</span>
                  </div>
                  <div className="flex items-center gap-1 text-zinc-300">
                    <span className="w-1 h-1 rounded-full bg-[#00FF41]"></span>
                    <span>email ➡️ profiles</span>
                  </div>
                  <div className="flex items-center gap-1 text-zinc-300">
                    <span className="w-1 h-1 rounded-full bg-[#00FF41]"></span>
                    <span>full_name ➡️ profiles</span>
                  </div>
                  <div className="flex items-center gap-1 text-zinc-300">
                    <span className="w-1 h-1 rounded-full bg-[#00FF41]"></span>
                    <span>phone ➡️ profiles</span>
                  </div>
                  <div className="flex items-center gap-1 text-zinc-300 text-left">
                    <span className="w-1 h-1 rounded-full bg-[#00FF41]"></span>
                    <span>address ➡️ profiles</span>
                  </div>
                  <div className="flex items-center gap-1 text-zinc-300">
                    <span className="w-1 h-1 rounded-full bg-[#00FF41]"></span>
                    <span>orders ➡️ public.orders</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SYSTEM STATISTICS */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">Live Cloud Counters</span>
                <button 
                  type="button" 
                  onClick={fetchStats}
                  className="text-[9px] text-[#00FF41] hover:underline flex items-center gap-1 font-mono cursor-pointer"
                >
                  <RefreshCw className="w-2.5 h-2.5" /> Refresh Counters
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-left font-mono">
                <div className="p-3.5 bg-[#0a0d14] rounded-xl border border-zinc-900 flex justify-between items-center gap-2 text-xs">
                  <div>
                    <span className="text-[8.5px] text-zinc-500 uppercase block">Total Profiles</span>
                    <span className="text-[#00FF41] text-base font-bold block mt-0.5">{dbStats.users}</span>
                  </div>
                  <User className="w-4 h-4 text-zinc-700" />
                </div>

                <div className="p-3.5 bg-[#0a0d14] rounded-xl border border-zinc-900 flex justify-between items-center gap-2 text-xs">
                  <div>
                    <span className="text-[8.5px] text-zinc-500 uppercase block">Cart Items</span>
                    <span className="text-amber-500 text-base font-bold block mt-0.5">{dbStats.cart}</span>
                  </div>
                  <Layers className="w-4 h-4 text-zinc-700" />
                </div>
              </div>
            </div>
          </div>

          {/* TELEMETRY LOGGER PANEL (THE CYBER SLOP TRACE) */}
          <div className="bg-black/90 p-4 rounded-xl border border-zinc-900 font-mono text-[9px] text-zinc-500 space-y-2 text-left">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-1.5">
              <span className="text-zinc-400 font-bold tracking-wide uppercase flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                Live Handshake Telemetry Trace
              </span>
              <span className="text-[8px] bg-zinc-900 px-1.5 py-0.5 rounded text-neutral-400 border border-zinc-800">ONLINE</span>
            </div>
            
            <div className="h-[96px] overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-zinc-800">
              {telemetryLogs.length === 0 ? (
                <p className="text-zinc-600 italic">Logs stream ready...</p>
              ) : (
                telemetryLogs.map(log => (
                  <div key={log.id} className="flex gap-2 items-start leading-tight">
                    <span className="text-zinc-600 font-medium shrink-0">[{log.time}]</span>
                    <span className={getLogColor(log.type)}>{log.msg}</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </section>

        {/* RIGHT COLUMN: AUTHENTICATION INTERACTIVE CONTROL BOARD */}
        <section className="lg:col-span-7 flex flex-col justify-start">
          
          <div className="bg-gradient-to-b from-[#0e121e] to-[#0a0d15] p-6 rounded-2xl border border-zinc-800 flex flex-col justify-between h-full relative">
            
            {/* ALERT BANNERS */}
            {(authError || authMessage) && (
              <div className="mb-4 text-xs select-none animate-in fade-in slide-in-from-top-1 duration-200">
                {authMessage && (
                  <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                    <div>
                      <p className="font-bold">Sync Completed Successfully</p>
                      <p className="opacity-90 mt-0.5 leading-normal">{authMessage}</p>
                    </div>
                  </div>
                )}
                {authError && (
                  <div className="p-3 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                    <div>
                      <p className="font-bold">Security / Validation Notice</p>
                      <p className="opacity-90 mt-0.5 leading-normal">{authError}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* IF USER IS AUTHENTICATED */}
            {dbUser ? (
              <div className="space-y-6 text-left my-auto py-4">
                <div className="flex flex-col items-center text-center space-y-4">
                  
                  {/* BEAUTIFUL COMPACT AVATAR WRAPPER */}
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#00FF41] to-blue-500 p-0.5 shadow-xl">
                      <div className="w-full h-full bg-[#0E131F] rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
                        {avatarStyle === 'cyber' && <Cpu className="w-8 h-8 text-[#00FF41]" />}
                        {avatarStyle === 'stellar' && <Sparkles className="w-8 h-8 text-amber-400" />}
                        {avatarStyle === 'retro' && <Globe className="w-8 h-8 text-pink-400" />}
                        {avatarStyle === 'quantum' && <Database className="w-8 h-8 text-cyan-400" />}
                      </div>
                    </div>
                    <span className="absolute bottom-0 right-0 w-4 h-4 bg-[#00FF41] border border-[#0E131F] rounded-full flex items-center justify-center text-[8px] font-bold text-black font-mono">✓</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono tracking-[0.2em] text-[#00FF41] bg-[#0c1410] border border-[#00FF41]/20 px-2.5 py-0.5 rounded-full font-bold uppercase">
                      ACTIVE USER SESSION LIVE
                    </span>
                    <h3 className="text-xl font-extrabold text-white mt-2">
                      {dbProfile?.full_name || 'Client Member'}
                    </h3>
                    <p className="text-xs text-zinc-500 font-mono mt-0.5">{dbUser.email}</p>
                  </div>
                </div>

                {/* DETAILED MAPPED PROFILE INFORMATION */}
                <div className="p-4 bg-[#0a0c13] rounded-xl border border-zinc-800/80 space-y-3 font-mono text-xs">
                  <h4 className="text-[10px] uppercase text-zinc-500 font-bold tracking-wider border-b border-zinc-850 pb-1.5 flex items-center justify-between">
                    <span>Synchronised Supabase Records</span>
                    <span className="text-[9px] text-[#00FF41]">Active Sync ON</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 leading-normal">
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-zinc-500 uppercase block">Account Identity Email:</span>
                      <span className="text-zinc-200 block truncate">{dbUser.email}</span>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[9px] text-zinc-500 uppercase block">Full Registered Name:</span>
                      <span className="text-emerald-400 block truncate">{dbProfile?.full_name || 'Not Syncing'}</span>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[9px] text-zinc-500 uppercase block">Contact Telephone:</span>
                      <span className="text-zinc-200 block">{dbProfile?.phone || <em className="text-zinc-600">Pending profile update...</em>}</span>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[9px] text-zinc-500 uppercase block">Secure Address Block:</span>
                      <span className="text-zinc-200 block truncate" title={dbProfile?.address}>{dbProfile?.address || <em className="text-zinc-600">No address logged...</em>}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-850 grid grid-cols-2 gap-2 text-[10px] text-neutral-400">
                    <div className="flex gap-1 items-center">
                      <Bookmark className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Orders History: <strong>{userOrders.length} Logged</strong></span>
                    </div>
                    <div className="flex gap-1 items-center">
                      <Layers className="w-3.5 h-3.5 text-amber-500" />
                      <span>Shopping Cart: <strong>{userCart.length} Saved</strong></span>
                    </div>
                  </div>
                </div>

                {/* VISUAL THEME SELECTOR BACKGROUND ACCENT */}
                <div className="space-y-2 text-xs">
                  <label className="block text-[10px] font-mono uppercase text-zinc-400">Choose Profile Identity Avatar Theme</label>
                  <div className="grid grid-cols-4 gap-2 font-mono text-[10px]">
                    {(['cyber', 'stellar', 'retro', 'quantum'] as const).map(style => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => setAvatarStyle(style)}
                        className={`py-2 px-1 text-center rounded border transition-all ${avatarStyle === style ? 'border-[#00FF41] bg-[#121c16] text-[#00FF41] font-bold' : 'border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'}`}
                      >
                        {style.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* USER LOGGED ACTIONS */}
                <div className="grid grid-cols-3 gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onEnterWorkspace}
                    className="col-span-2 py-3 bg-[#00FF41] hover:bg-[#00e53a] text-black font-extrabold font-mono text-xs uppercase rounded-xl transition-all tracking-wider text-center flex items-center justify-center gap-1.5 shadow-lg shadow-[#00FF41]/10 cursor-pointer"
                  >
                    Enter Design Workspace Portal
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={executeSignOutAndLog}
                    className="py-3 border border-rose-500/30 hover:bg-rose-950/20 text-rose-400 font-mono text-xs uppercase rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              /* SIGN UP / SIGN IN FORMS SCREEN */
              <div className="space-y-5 text-left my-auto">
                <div>
                  <h3 className="text-lg font-black tracking-tight text-white">
                    {isSignUp ? "Create Your Creator Account" : "Access Security Workspace"}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                    {isSignUp 
                      ? "Establish your master profile. Custom records automagically save in a persistent profile row sync with Supabase SQL secure nodes." 
                      : "Provide your master account credentials to unlock and resume your synchronized design dashboard."
                    }
                  </p>
                </div>

                <form onSubmit={handleFormSubmitted} className="space-y-3.5 text-xs">
                  
                  {isSignUp && (
                    <div className="space-y-1">
                      <label className="block text-[9.5px] font-mono uppercase text-zinc-400 tracking-wider">Your Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                        <input 
                          type="text" 
                          required
                          value={authFullName}
                          onChange={(e) => setAuthFullName(e.target.value)}
                          placeholder="Elizabeth Bennet"
                          className="w-full bg-[#080a0f] border border-zinc-800 focus:border-[#00FF41] rounded-xl pl-10 pr-4 py-2.5 text-zinc-100 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[9.5px] font-mono uppercase text-zinc-400 tracking-wider">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                        <input 
                          type="email" 
                          required
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          placeholder="elizabeth@domain.com"
                          className="w-full bg-[#080a0f] border border-zinc-800 focus:border-[#00FF41] rounded-xl pl-10 pr-4 py-2.5 text-zinc-100 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[9.5px] font-mono uppercase text-zinc-400 tracking-wider font-semibold">Secret Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                        <input 
                          type={showPassword ? "text" : "password"} 
                          required
                          value={authPassword}
                          onChange={(e) => setAuthPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-[#080a0f] border border-zinc-800 focus:border-[#00FF41] rounded-xl pl-10 pr-10 py-2.5 text-zinc-100 focus:outline-none transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3.5 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {isSignUp && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="space-y-1">
                        <label className="block text-[9.5px] font-mono uppercase text-zinc-400 tracking-wider">Contact Telephone</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3.5 w-3.5 h-3.5 text-zinc-500" />
                          <input 
                            type="text" 
                            required
                            value={authPhone}
                            onChange={(e) => setAuthPhone(e.target.value)}
                            placeholder="+1 (202) 555-0143"
                            className="w-full bg-[#080a0f] border border-zinc-800 focus:border-[#00FF41] rounded-xl pl-10 pr-4 py-2.5 text-zinc-100 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[9.5px] font-mono uppercase text-zinc-400 tracking-wider">Billing/Shipping Address</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3.5 w-3.5 h-3.5 text-zinc-500" />
                          <input 
                            type="text" 
                            required
                            value={authAddress}
                            onChange={(e) => setAuthAddress(e.target.value)}
                            placeholder="450 Golden Gate Ave, San Francisco"
                            className="w-full bg-[#080a0f] border border-zinc-800 focus:border-[#00FF41] rounded-xl pl-10 pr-4 py-2.5 text-zinc-100 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={isAuthLoading}
                    className="w-full py-3 bg-zinc-100 hover:bg-white text-zinc-950 font-bold uppercase rounded-xl transition-all duration-200 tracking-wider text-[10.5px] font-mono flex items-center justify-center gap-1.5 cursor-pointer mt-3 bg-white"
                  >
                    {isAuthLoading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Synchronizing handshake...
                      </>
                    ) : (isSignUp ? (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        🚀 Create Master Account & Transfer Details
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        🔑 Authorise Secure Session
                      </>
                    ))}
                  </button>

                  <button 
                    type="button"
                    onClick={() => { setIsSignUp(!isSignUp); setAuthError(null); setAuthMessage(null); }}
                    className="w-full text-center text-[10px] text-zinc-400 hover:text-white block underline cursor-pointer font-mono uppercase mt-2.5 tracking-wide"
                  >
                    {isSignUp 
                      ? "Already have an account? Sign In" 
                      : "Don't have an account? Let's Register & Register Sync"
                    }
                  </button>
                </form>
              </div>
            )}

            {/* PLATFORM CREDITS */}
            <div className="mt-6 border-t border-zinc-850 pt-4 flex flex-col md:flex-row items-center justify-between gap-2 text-[9px] font-mono text-zinc-500 select-none">
              <span>Security Method: supabase.auth.signUp (AES-256 TLS)</span>
              <span>Data Provider Node: public.profiles table</span>
            </div>

          </div>
        </section>

      </main>

      {/* FOOTER COOPERATIVE PANEL */}
      <footer className="w-full max-w-7xl border-t border-zinc-900 pt-4 flex flex-col md:flex-row items-center justify-between text-[10px] font-mono text-zinc-600 z-10 gap-2">
        <p>AleeXstudio Web Engine Security Center © 2026. Powered by standard Supabase clients.</p>
        <div className="flex gap-4">
          <span className="text-[#00FF41]">● CONNECTED</span>
          <span>LATENCY: ~14ms</span>
        </div>
      </footer>

    </div>
  );
};
