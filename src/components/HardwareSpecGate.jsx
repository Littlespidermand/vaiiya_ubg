import React, { useState, useEffect } from 'react';
import { AlertTriangle, Cpu, HardDrive, ShieldAlert, Thermometer, CheckCircle2, ArrowRight } from 'lucide-react';

export const HardwareSpecGate = ({ onProceed }) => {
  const [deviceMemory, setDeviceMemory] = useState(null);
  const [cpuCores, setCpuCores] = useState(null);
  const [isChromeOS, setIsChromeOS] = useState(false);
  const [rememberChoice, setRememberChoice] = useState(true);

  useEffect(() => {
    // Detect system properties
    if (typeof navigator !== 'undefined') {
      if ('deviceMemory' in navigator) {
        setDeviceMemory(navigator.deviceMemory);
      }
      if ('hardwareConcurrency' in navigator) {
        setCpuCores(navigator.hardwareConcurrency);
      }
      if (navigator.userAgent.includes('CrOS')) {
        setIsChromeOS(true);
      }
    }
  }, []);

  const handleConfirm = () => {
    if (rememberChoice) {
      localStorage.setItem('sonar_hardware_acknowledged', 'true');
    }
    onProceed();
  };

  const isLowRam = deviceMemory && deviceMemory < 4;

  return (
    <div className="fixed inset-0 z-50 bg-[#060709] text-white flex flex-col items-center justify-center p-4 sm:p-6 select-none font-sans overflow-y-auto">
      {/* Background Matrix Lines */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

      {/* Main Diagnostic Chassis */}
      <div className="relative w-full max-w-2xl bg-[#0B0D12] border-2 border-white shadow-[0_0_50px_rgba(255,255,255,0.08)] p-6 sm:p-8 flex flex-col gap-6">
        {/* Top VAIIYA Security Banner */}
        <div className="flex items-center justify-between border-b border-[#1F242F] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-white" />
            <span className="font-mono text-sm tracking-widest uppercase font-black text-white">
              VAIIYA OMNI-SECURITY // SPECIFICATION GATE
            </span>
          </div>
          <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
            PROTOCOL // THERMAL-04
          </span>
        </div>

        {/* Big Alert Notice */}
        <div className="bg-[#12151D] border-l-4 border-amber-400 p-4 flex items-start gap-4">
          <div className="p-2 bg-amber-400/10 text-amber-400 shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-mono font-bold tracking-wider text-amber-400 uppercase">
              HARDWARE SPECIFICATION & THERMAL SAFETY WARNING
            </h2>
            <p className="text-xs text-zinc-300 font-mono leading-relaxed">
              This terminal executes high-load unblocked 3D/2D simulation environments.
              Running these simulations on low-spec Chromebooks (under 4 GB RAM) may cause
              extreme CPU thermal throttling, system freeze, or severe device overheating.
            </p>
          </div>
        </div>

        {/* System Requirements Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          {/* Minimum RAM */}
          <div className="p-4 bg-[#0E1017] border border-[#1F242F] flex flex-col justify-between">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <HardDrive className="w-4 h-4 text-white" /> MINIMUM RAM
              </span>
              <span className="text-amber-400 font-bold">REQUIRED</span>
            </div>
            <div className="text-xl font-bold text-white tracking-tight">
              4.0 GB LPDDR4
            </div>
            <div className="text-[10px] text-zinc-500 mt-1">
              Devices with 2 GB RAM will experience severe thermal lag.
            </div>
          </div>

          {/* Recommended RAM */}
          <div className="p-4 bg-[#0E1017] border border-[#1F242F] flex flex-col justify-between">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <Cpu className="w-4 h-4 text-emerald-400" /> RECOMMENDED RAM
              </span>
              <span className="text-emerald-400 font-bold">OPTIMAL</span>
            </div>
            <div className="text-xl font-bold text-white tracking-tight">
              8.0 GB+ RAM
            </div>
            <div className="text-[10px] text-zinc-500 mt-1">
              Guarantees stable 60 FPS without Chromebook throttling.
            </div>
          </div>
        </div>

        {/* Live Detected System Probe */}
        <div className="p-4 bg-[#08090E] border border-[#1F242F] font-mono text-xs space-y-2">
          <div className="text-[10px] tracking-widest uppercase text-zinc-500 flex items-center justify-between">
            <span>LIVE SYSTEM TELEMETRY DETECTION</span>
            <span className="text-emerald-400 font-bold">SCAN COMPLETE</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
            <div className="p-2 bg-[#10131B] border border-[#1F242F]">
              <span className="text-zinc-500 block text-[10px]">DETECTED MEMORY:</span>
              <span className={`font-bold ${isLowRam ? 'text-rose-400' : 'text-white'}`}>
                {deviceMemory ? `${deviceMemory} GB Detected` : 'Standard (~4GB+)'}
              </span>
            </div>

            <div className="p-2 bg-[#10131B] border border-[#1F242F]">
              <span className="text-zinc-500 block text-[10px]">CPU CORES:</span>
              <span className="text-white font-bold">
                {cpuCores ? `${cpuCores} Logical Units` : 'Multi-Core Active'}
              </span>
            </div>

            <div className="p-2 bg-[#10131B] border border-[#1F242F] col-span-2 sm:col-span-1">
              <span className="text-zinc-500 block text-[10px]">TARGET PLATFORM:</span>
              <span className="text-white font-bold truncate block">
                {isChromeOS ? 'Chromebook (ChromeOS)' : 'Desktop / PC Workstation'}
              </span>
            </div>
          </div>
        </div>

        {/* Checkbox and Action */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2 border-t border-[#1F242F]">
          <label className="flex items-center gap-2 cursor-pointer font-mono text-xs text-zinc-400 hover:text-white">
            <input
              type="checkbox"
              checked={rememberChoice}
              onChange={e => setRememberChoice(e.target.checked)}
              className="accent-white rounded-none w-4 h-4"
            />
            <span>Acknowledge specs for this session</span>
          </label>

          <button
            onClick={handleConfirm}
            className="px-6 py-3 bg-white hover:bg-zinc-200 text-black font-mono font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg active:scale-98"
          >
            <span>BOOT SONAR DESKTOP</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="mt-4 text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
        VAIIYA SECURITY DIRECTIVE // THERMAL DEFENSE PROTOCOL
      </div>
    </div>
  );
};
