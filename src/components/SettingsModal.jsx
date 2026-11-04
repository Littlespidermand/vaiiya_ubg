import React, { useState, useEffect, useRef } from 'react';
import {
  Settings,
  Sun,
  Palette,
  Volume2,
  VolumeX,
  Cpu,
  Monitor,
  Activity,
  Upload,
  RotateCcw,
  Search,
  Check,
  HardDrive,
  Gamepad2,
  Eye,
  Sliders,
  Image as ImageIcon,
  Zap,
  Radio,
  X
} from 'lucide-react';

export const SettingsModal = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetSettings,
}) => {
  const [activeTab, setActiveTab] = useState('background');
  const [searchQuery, setSearchQuery] = useState('');
  const [fps, setFps] = useState(60);
  const [frameTime, setFrameTime] = useState(16.6);
  const [gpuName, setGpuName] = useState('Detecting GPU...');
  const [audioFeedbackPlaying, setAudioFeedbackPlaying] = useState(false);
  const fileInputRef = useRef(null);

  // Live FPS and frame-time calculator
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId;

    const tick = (now) => {
      frameCount++;
      const delta = now - lastTime;
      if (delta >= 800) {
        const currentFps = Math.round((frameCount * 1000) / delta);
        setFps(currentFps);
        setFrameTime((1000 / Math.max(currentFps, 1)).toFixed(1));
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Detect WebGL GPU information
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          const unmasked = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          setGpuName(unmasked || gl.getParameter(gl.RENDERER) || 'DirectX/OpenGL Hardware Acceleration');
        } else {
          setGpuName(gl.getParameter(gl.RENDERER) || 'Generic Accelerated Graphics');
        }
      } else {
        setGpuName('Software Rasterizer (Canvas 2D)');
      }
    } catch (e) {
      setGpuName('Standard Display Adapter');
    }
  }, []);

  // Handle Settings search query
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    const q = query.toLowerCase();
    if (q.includes('back') || q.includes('wall') || q.includes('image') || q.includes('photo')) {
      setActiveTab('background');
    } else if (q.includes('fps') || q.includes('gpu') || q.includes('stat') || q.includes('ram') || q.includes('cpu')) {
      setActiveTab('hardware');
    } else if (q.includes('bright') || q.includes('satur') || q.includes('visual') || q.includes('graph')) {
      setActiveTab('visuals');
    } else if (q.includes('aud') || q.includes('sound') || q.includes('vol')) {
      setActiveTab('audio');
    } else if (q.includes('game') || q.includes('play') || q.includes('ctrl')) {
      setActiveTab('gameplay');
    }
  };

  // Play audio test tone via Web Audio API
  const playTestTone = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const vol = settings.isMuted ? 0 : settings.volume / 100;
      gain.gain.setValueAtTime(vol * 0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880.00, ctx.currentTime + 0.15); // A5

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.6);
      setAudioFeedbackPlaying(true);
      setTimeout(() => setAudioFeedbackPlaying(false), 600);
    } catch (e) {
      console.warn('Audio test failed', e);
    }
  };

  // Handle custom wallpaper upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WebP, etc.).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (typeof dataUrl === 'string') {
        onUpdateSettings({
          wallpaper: 'custom',
          customWallpaperUrl: dataUrl,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 select-none animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-[#090D15]/95 border-2 border-white/80 shadow-[0_0_60px_rgba(0,0,0,0.9)] rounded-xl overflow-hidden flex flex-col max-h-[90vh] text-white font-sans"
        onClick={e => e.stopPropagation()}
      >
        {/* Settings Window Header */}
        <div className="bg-[#10141F] border-b border-white/15 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                SONAR CONTROL PANEL // SETTINGS
              </h2>
              <p className="text-[10px] font-mono text-zinc-400">
                Visuals · Performance · Audio · Hardware Telemetry
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onResetSettings}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-mono text-zinc-300 hover:text-white transition-colors cursor-pointer"
              title="Reset all settings to default"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Defaults</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer"
              title="Close Settings"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global Settings Search Bar */}
        <div className="bg-black/30 border-b border-white/10 px-5 py-2.5">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => handleSearchChange(e.target.value)}
              placeholder="Search settings (e.g. background, brightness, fps, gpu, audio)..."
              className="w-full bg-white/5 border border-white/15 focus:border-cyan-400 rounded-lg pl-9 pr-8 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Settings Body with Navigation Tabs */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          {/* Navigation Tabs Sidebar */}
          <div className="w-full md:w-56 bg-black/40 border-r border-white/10 p-2 sm:p-3 flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible shrink-0">
            <button
              onClick={() => setActiveTab('background')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left whitespace-nowrap cursor-pointer ${
                activeTab === 'background'
                  ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                  : 'text-zinc-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <ImageIcon className="w-4 h-4 shrink-0" />
              <span>Background & Theme</span>
            </button>

            <button
              onClick={() => setActiveTab('visuals')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left whitespace-nowrap cursor-pointer ${
                activeTab === 'visuals'
                  ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                  : 'text-zinc-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Sliders className="w-4 h-4 shrink-0" />
              <span>Visuals & Display</span>
            </button>

            <button
              onClick={() => setActiveTab('hardware')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left whitespace-nowrap cursor-pointer ${
                activeTab === 'hardware'
                  ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                  : 'text-zinc-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Activity className="w-4 h-4 shrink-0" />
              <span>FPS & Hardware Stats</span>
            </button>

            <button
              onClick={() => setActiveTab('audio')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left whitespace-nowrap cursor-pointer ${
                activeTab === 'audio'
                  ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                  : 'text-zinc-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Volume2 className="w-4 h-4 shrink-0" />
              <span>Audio Controls</span>
            </button>

            <button
              onClick={() => setActiveTab('gameplay')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left whitespace-nowrap cursor-pointer ${
                activeTab === 'gameplay'
                  ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                  : 'text-zinc-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Gamepad2 className="w-4 h-4 shrink-0" />
              <span>Gameplay & Input</span>
            </button>
          </div>

          {/* Active Tab Content Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* =========================================================================
                TAB 1: BACKGROUND & THEME CHANGER
               ========================================================================= */}
            {activeTab === 'background' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    DESKTOP BACKGROUND CHANGER
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Select a built-in calming wallpaper or upload your own custom photo.
                  </p>
                </div>

                {/* Custom Image Upload Section */}
                <div className="p-4 bg-white/5 border border-white/15 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white uppercase block">
                        Upload Custom Background
                      </span>
                      <span className="text-[11px] text-zinc-400">
                        Select an image from your device (JPG, PNG, WebP)
                      </span>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Choose Image</span>
                    </button>
                  </div>

                  {/* If custom wallpaper is currently active */}
                  {settings.wallpaper === 'custom' && settings.customWallpaperUrl && (
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={settings.customWallpaperUrl}
                          alt="Custom Wallpaper Preview"
                          className="w-16 h-10 object-cover rounded border border-cyan-400"
                        />
                        <span className="text-xs text-cyan-300 font-medium">
                          Active: Custom User Upload
                        </span>
                      </div>
                      <button
                        onClick={() => onUpdateSettings({ wallpaper: 'vista', customWallpaperUrl: null })}
                        className="text-xs text-rose-400 hover:underline cursor-pointer"
                      >
                        Remove Custom Background
                      </button>
                    </div>
                  )}
                </div>

                {/* Preset Wallpapers Grid */}
                <div className="space-y-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
                    PRESET CALMING WALLPAPERS
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {/* 1. Windows Vista Aurora */}
                    <button
                      onClick={() => onUpdateSettings({ wallpaper: 'vista' })}
                      className={`group relative p-2 rounded-xl border text-left transition-all cursor-pointer ${
                        settings.wallpaper === 'vista'
                          ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                          : 'border-white/10 hover:border-white/30 bg-black/40'
                      }`}
                    >
                      <div className="h-20 w-full rounded-lg bg-[radial-gradient(ellipse_at_top,#0891b2,#0f172a)] relative overflow-hidden mb-2 border border-white/10">
                        <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/40 via-cyan-400/30 to-blue-600/50" />
                        {settings.wallpaper === 'vista' && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-cyan-500 text-black rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-bold block text-white">Windows Vista</span>
                      <span className="text-[10px] text-zinc-400">Calming Aurora Glass</span>
                    </button>

                    {/* 2. Windows 98 Teal */}
                    <button
                      onClick={() => onUpdateSettings({ wallpaper: 'win98' })}
                      className={`group relative p-2 rounded-xl border text-left transition-all cursor-pointer ${
                        settings.wallpaper === 'win98'
                          ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                          : 'border-white/10 hover:border-white/30 bg-black/40'
                      }`}
                    >
                      <div className="h-20 w-full rounded-lg bg-[#008080] relative overflow-hidden mb-2 border border-white/10 flex items-center justify-center">
                        {settings.wallpaper === 'win98' && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-cyan-500 text-black rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-bold block text-white">Windows 98</span>
                      <span className="text-[10px] text-zinc-400">Classic Nostalgic Teal</span>
                    </button>

                    {/* 3. Windows XP Bliss */}
                    <button
                      onClick={() => onUpdateSettings({ wallpaper: 'xp' })}
                      className={`group relative p-2 rounded-xl border text-left transition-all cursor-pointer ${
                        settings.wallpaper === 'xp'
                          ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                          : 'border-white/10 hover:border-white/30 bg-black/40'
                      }`}
                    >
                      <div className="h-20 w-full rounded-lg bg-gradient-to-b from-sky-400 via-sky-300 to-emerald-600 relative overflow-hidden mb-2 border border-white/10">
                        {settings.wallpaper === 'xp' && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-cyan-500 text-black rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-bold block text-white">Windows XP</span>
                      <span className="text-[10px] text-zinc-400">Tranquil Hill & Sky</span>
                    </button>

                    {/* 4. Windows 10 Hero Dark */}
                    <button
                      onClick={() => onUpdateSettings({ wallpaper: 'win10' })}
                      className={`group relative p-2 rounded-xl border text-left transition-all cursor-pointer ${
                        settings.wallpaper === 'win10'
                          ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                          : 'border-white/10 hover:border-white/30 bg-black/40'
                      }`}
                    >
                      <div className="h-20 w-full rounded-lg bg-gradient-to-br from-blue-950 via-slate-900 to-black relative overflow-hidden mb-2 border border-white/10">
                        <div className="absolute right-2 bottom-2 w-8 h-8 border border-sky-400/30 rotate-12" />
                        {settings.wallpaper === 'win10' && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-cyan-500 text-black rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-bold block text-white">Windows 10</span>
                      <span className="text-[10px] text-zinc-400">Hero Dark Light</span>
                    </button>

                    {/* 5. VAIIYA Carbon */}
                    <button
                      onClick={() => onUpdateSettings({ wallpaper: 'vaiiya' })}
                      className={`group relative p-2 rounded-xl border text-left transition-all cursor-pointer ${
                        settings.wallpaper === 'vaiiya'
                          ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                          : 'border-white/10 hover:border-white/30 bg-black/40'
                      }`}
                    >
                      <div className="h-20 w-full rounded-lg bg-[#08090C] relative overflow-hidden mb-2 border border-white/10 flex items-center justify-center font-mono font-black text-zinc-700 text-xs tracking-widest">
                        VAIIYA
                        {settings.wallpaper === 'vaiiya' && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-cyan-500 text-black rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-bold block text-white">VAIIYA High-Contrast</span>
                      <span className="text-[10px] text-zinc-400">Carbon & White</span>
                    </button>

                    {/* 6. Deep Space Nebula */}
                    <button
                      onClick={() => onUpdateSettings({ wallpaper: 'nebula' })}
                      className={`group relative p-2 rounded-xl border text-left transition-all cursor-pointer ${
                        settings.wallpaper === 'nebula'
                          ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                          : 'border-white/10 hover:border-white/30 bg-black/40'
                      }`}
                    >
                      <div className="h-20 w-full rounded-lg bg-gradient-to-tr from-purple-950 via-indigo-950 to-black relative overflow-hidden mb-2 border border-white/10">
                        <div className="absolute inset-0 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:12px_12px] opacity-30" />
                        {settings.wallpaper === 'nebula' && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-cyan-500 text-black rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-bold block text-white">Midnight Nebula</span>
                      <span className="text-[10px] text-zinc-400">Deep Cosmic Violet</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================================
                TAB 2: VISUALS, BRIGHTNESS & SATURATION
               ========================================================================= */}
            {activeTab === 'visuals' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                    <Sliders className="w-4 h-4" />
                    DISPLAY & VISUAL CALIBRATION
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Fine-tune brightness, color saturation, and graphic fidelity.
                  </p>
                </div>

                {/* Brightness Slider */}
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase flex items-center gap-2">
                      <Sun className="w-4 h-4 text-amber-300" /> Brightness Level
                    </span>
                    <span className="text-xs font-mono font-bold text-cyan-300">
                      {settings.brightness}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={settings.brightness}
                    onChange={e => onUpdateSettings({ brightness: Number(e.target.value) })}
                    className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-white/20 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                    <span>50% (Dim)</span>
                    <span>100% (Normal)</span>
                    <span>150% (Vivid)</span>
                  </div>
                </div>

                {/* Saturation Slider */}
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase flex items-center gap-2">
                      <Palette className="w-4 h-4 text-emerald-300" /> Color Saturation
                    </span>
                    <span className="text-xs font-mono font-bold text-cyan-300">
                      {settings.saturation}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={settings.saturation}
                    onChange={e => onUpdateSettings({ saturation: Number(e.target.value) })}
                    className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-white/20 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                    <span>0% (Monochrome)</span>
                    <span>100% (Balanced)</span>
                    <span>200% (Hyper-Saturated)</span>
                  </div>
                </div>

                {/* Visual Graphics Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {/* CRT Scanline Retro Filter */}
                  <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold block text-white">CRT Scanline Filter</span>
                      <span className="text-[10px] text-zinc-400">Simulate retro CRT arcade monitor lines</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.crtEffect || false}
                        onChange={e => onUpdateSettings({ crtEffect: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
                    </label>
                  </div>

                  {/* Chromebook Optimization Mode */}
                  <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold block text-white">Low-Power Performance</span>
                      <span className="text-[10px] text-zinc-400">Disable blurs to save Chromebook battery</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.lowPowerMode || false}
                        onChange={e => onUpdateSettings({ lowPowerMode: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================================
                TAB 3: HARDWARE STATS, FPS & GPU TELEMETRY
               ========================================================================= */}
            {activeTab === 'hardware' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    HARDWARE TELEMETRY, GPU & FPS
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Live device statistics, rendering engine status, and benchmark figures.
                  </p>
                </div>

                {/* Big Live FPS Indicator & Pin Toggle */}
                <div className="p-4 bg-gradient-to-r from-cyan-950/40 via-black to-black border border-cyan-400/40 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex flex-col items-center justify-center font-mono">
                      <span className="text-xl font-black text-cyan-300 leading-none">
                        {fps}
                      </span>
                      <span className="text-[9px] text-cyan-400 uppercase font-bold mt-1">
                        FPS
                      </span>
                    </div>

                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>REAL-TIME FRAME RATE</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      </div>
                      <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                        Frametime: <span className="text-cyan-300">{frameTime} ms</span> · Target: 60 FPS
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onUpdateSettings({ showFpsOverlay: !settings.showFpsOverlay })}
                    className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      settings.showFpsOverlay
                        ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30'
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{settings.showFpsOverlay ? 'HUD Overlay Pinned' : 'Pin FPS HUD on Desktop'}</span>
                  </button>
                </div>

                {/* GPU Information Box */}
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block">
                    DETECTED GRAPHICS PROCESSING UNIT (GPU)
                  </span>
                  <div className="text-sm font-mono font-bold text-white break-words">
                    {gpuName}
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    WebGL hardware rendering pipeline active. Suitable for unblocked WebGL/Canvas games.
                  </div>
                </div>

                {/* System Specs Diagnostic Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
                  {/* Screen Resolution */}
                  <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                    <span className="text-[10px] text-zinc-400 block uppercase">Display Geometry</span>
                    <span className="text-white font-bold text-sm">
                      {typeof window !== 'undefined' ? `${window.screen.width} × ${window.screen.height}` : '1920 × 1080'}
                    </span>
                    <span className="text-[10px] text-zinc-500 block mt-0.5">
                      Viewport: {typeof window !== 'undefined' ? `${window.innerWidth} × ${window.innerHeight}` : '—'}
                    </span>
                  </div>

                  {/* CPU Logical Units */}
                  <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                    <span className="text-[10px] text-zinc-400 block uppercase">CPU Hardware Units</span>
                    <span className="text-white font-bold text-sm">
                      {typeof navigator !== 'undefined' ? `${navigator.hardwareConcurrency || 4} Threads` : '4 Threads'}
                    </span>
                    <span className="text-[10px] text-emerald-400 block mt-0.5">
                      Multi-threading Active
                    </span>
                  </div>

                  {/* RAM Memory Estimate */}
                  <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                    <span className="text-[10px] text-zinc-400 block uppercase">System Memory</span>
                    <span className="text-amber-300 font-bold text-sm">
                      {typeof navigator !== 'undefined' && 'deviceMemory' in navigator
                        ? `${navigator.deviceMemory} GB Detected`
                        : '≥ 4.0 GB'}
                    </span>
                    <span className="text-[10px] text-zinc-500 block mt-0.5">
                      Chromebook safe
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================================
                TAB 4: AUDIO CONTROLS
               ========================================================================= */}
            {activeTab === 'audio' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                    <Volume2 className="w-4 h-4" />
                    AUDIO & SOUND DISCIPLINE
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Control global system sound levels and audio feedback.
                  </p>
                </div>

                {/* Master Volume */}
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase flex items-center gap-2">
                      {settings.isMuted ? (
                        <VolumeX className="w-4 h-4 text-rose-400" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-cyan-300" />
                      )}
                      Master Volume Level
                    </span>
                    <span className="text-xs font-mono font-bold text-cyan-300">
                      {settings.isMuted ? 'MUTED' : `${settings.volume}%`}
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    disabled={settings.isMuted}
                    value={settings.volume}
                    onChange={e => onUpdateSettings({ volume: Number(e.target.value) })}
                    className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-white/20 rounded-lg disabled:opacity-30"
                  />

                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.isMuted}
                        onChange={e => onUpdateSettings({ isMuted: e.target.checked })}
                        className="accent-cyan-400 w-4 h-4 rounded"
                      />
                      <span>Mute all audio & synthesized sound effects</span>
                    </label>

                    <button
                      onClick={playTestTone}
                      disabled={settings.isMuted}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                        audioFeedbackPlaying
                          ? 'bg-emerald-500 text-black scale-95'
                          : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                      }`}
                    >
                      {audioFeedbackPlaying ? 'Playing ♪' : 'Test Tone ♪'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================================
                TAB 5: GAMEPLAY & SHORTCUTS
               ========================================================================= */}
            {activeTab === 'gameplay' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                    <Gamepad2 className="w-4 h-4" />
                    GAMEPLAY CONFIGURATION
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Unblocked gaming window behaviors, keybindings, and display modes.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold block text-white">Full-Screen Focus Mode</span>
                      <span className="text-[10px] text-zinc-400">Maximize game windows automatically on launch</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.autoMaximize || false}
                        onChange={e => onUpdateSettings({ autoMaximize: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
                    </label>
                  </div>

                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2">
                    <span className="text-xs font-bold uppercase text-white block">
                      Universal Game Keyboard Shortcuts
                    </span>
                    <div className="space-y-1.5 font-mono text-xs">
                      <div className="flex items-center justify-between py-1 border-b border-white/10">
                        <span className="text-zinc-400">Browser Fullscreen</span>
                        <span className="bg-white/10 px-2 py-0.5 rounded text-white font-bold">F11</span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-white/10">
                        <span className="text-zinc-400">Search Games Bar</span>
                        <span className="bg-white/10 px-2 py-0.5 rounded text-white font-bold">Top Bar / Ctrl+F</span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-white/10">
                        <span className="text-zinc-400">Reload Current Game Frame</span>
                        <span className="bg-white/10 px-2 py-0.5 rounded text-white font-bold">Window ↻ Button</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Settings Footer */}
        <div className="bg-[#10141F] border-t border-white/15 px-5 py-3 flex items-center justify-between">
          <span className="text-[10px] font-mono text-zinc-400">
            CHANGES AUTO-SAVED TO BROWSER STORAGE
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-lg transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
