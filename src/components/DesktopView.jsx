import React, { useState, useEffect } from 'react';
import {
  Crosshair,
  Flame,
  Search,
  Grid,
  Compass,
  Cpu,
  Swords,
  Footprints,
  Bot,
  HardDrive,
  Maximize2,
  Minimize2,
  X,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  Clock,
  Layers,
  Terminal,
  Activity,
  SlidersHorizontal,
  Bike,
  Settings,
  User,
  ShieldCheck,
  Zap,
  CircleDot
} from 'lucide-react';
import { Sidebar } from './Sidebar';
import { SettingsModal } from './SettingsModal';
import { AccountModal } from './AccountModal';

export const DesktopView = ({
  games,
  onOpenSpecs,
}) => {
  const [activeApp, setActiveApp] = useState(null); // The currently open window
  const [isMaximized, setIsMaximized] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Real-time FPS & GPU telemetry
  const [liveFps, setLiveFps] = useState(60);
  const [gpuName, setGpuName] = useState('DirectX / WebGL GPU');

  // Settings State with LocalStorage Persistence
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('sonar_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      brightness: 100,
      saturation: 100,
      volume: 80,
      isMuted: false,
      showFpsOverlay: false,
      lowPowerMode: false,
      crtEffect: false,
      autoMaximize: false,
      wallpaper: 'vista', // 'vista' | 'win98' | 'xp' | 'win10' | 'vaiiya' | 'nebula' | 'custom'
      customWallpaperUrl: null,
    };
  });

  // User Profile State with LocalStorage Persistence
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('sonar_user_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });

  const handleUpdateSettings = (updates) => {
    setSettings(prev => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem('sonar_settings', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const handleResetSettings = () => {
    const defaults = {
      brightness: 100,
      saturation: 100,
      volume: 80,
      isMuted: false,
      showFpsOverlay: false,
      lowPowerMode: false,
      crtEffect: false,
      autoMaximize: false,
      wallpaper: 'vista',
      customWallpaperUrl: null,
    };
    setSettings(defaults);
    try {
      localStorage.setItem('sonar_settings', JSON.stringify(defaults));
    } catch (e) {}
  };

  const handleSaveProfile = (profile) => {
    setUserProfile(profile);
    try {
      localStorage.setItem('sonar_user_profile', JSON.stringify(profile));
    } catch (e) {}
  };

  const handleSignOut = () => {
    setUserProfile(null);
    try {
      localStorage.removeItem('sonar_user_profile');
    } catch (e) {}
  };

  // Categories list
  const categories = [
    { id: 'all', label: 'All Games' },
    { id: 'action', label: 'Action' },
    { id: 'arcade', label: 'Arcade' },
    { id: 'puzzle', label: 'Puzzle' },
    { id: 'classic', label: 'Classic' },
    { id: '2-player', label: '2-Player' },
    { id: 'tools', label: 'Tools' }
  ];

  // Live Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Live FPS Counter for Desktop Telemetry HUD
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId;

    const tick = (now) => {
      frameCount++;
      const delta = now - lastTime;
      if (delta >= 1000) {
        setLiveFps(Math.round((frameCount * 1000) / delta));
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  // GPU Name Extraction
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          const unmasked = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          if (unmasked) setGpuName(unmasked);
        }
      }
    } catch (e) {}
  }, []);

  const getAppIcon = (id) => {
    switch (id) {
      case 'confront':
        return <Crosshair className="w-7 h-7 text-rose-400 group-hover:text-white transition-colors" />;
      case 'happy-room':
        return <Flame className="w-7 h-7 text-amber-400 group-hover:text-amber-200 transition-colors" />;
      case 'happy-wheels':
        return <Bike className="w-7 h-7 text-amber-400 group-hover:text-amber-200 transition-colors" />;
      case 'gunblood':
        return <Crosshair className="w-7 h-7 text-red-500 group-hover:text-white transition-colors" />;
      case 'age-of-war':
        return <Swords className="w-7 h-7 text-amber-300 group-hover:text-amber-100 transition-colors" />;
      case 'bloons-td':
        return <CircleDot className="w-7 h-7 text-rose-400 group-hover:text-rose-200 transition-colors" />;
      case 'duck-ai':
        return <Bot className="w-7 h-7 text-orange-400 group-hover:text-orange-200 transition-colors" />;
      case 'game-2048':
        return <Grid className="w-7 h-7 text-indigo-300 group-hover:text-white transition-colors" />;
      case 'retro-snake':
        return <Compass className="w-7 h-7 text-emerald-400 group-hover:text-emerald-200 transition-colors" />;
      case 'galaxy-strike':
        return <Cpu className="w-7 h-7 text-purple-400 group-hover:text-purple-200 transition-colors" />;
      case 'neon-breakout':
        return <Layers className="w-7 h-7 text-cyan-400 group-hover:text-cyan-200 transition-colors" />;
      case 'retro-pong':
        return <Swords className="w-7 h-7 text-sky-400 group-hover:text-sky-200 transition-colors" />;
      case 'dino-runner':
        return <Footprints className="w-7 h-7 text-teal-400 group-hover:text-teal-200 transition-colors" />;
      default:
        return <Terminal className="w-7 h-7 text-white" />;
    }
  };

  const handleLaunchApp = (game) => {
    setActiveApp(game);
    setStartMenuOpen(false);
    setSidebarOpen(false);
    if (settings.autoMaximize) {
      setIsMaximized(true);
    }
  };

  const handleReloadFrame = () => {
    const frame = document.getElementById('gameFrame');
    if (frame) {
      const src = frame.src;
      frame.src = '';
      setTimeout(() => {
        frame.src = src;
      }, 50);
    }
  };

  // Filtered games based on search query and active category
  const filteredGames = games.filter(g => {
    const matchesSearch =
      g.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      g.category.toLowerCase().includes(searchFilter.toLowerCase()) ||
      g.shortDesc.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesCategory =
      activeCategory === 'all' || g.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div
      className="relative w-full h-screen overflow-hidden text-white flex flex-col select-none font-sans"
      style={{
        filter: `brightness(${settings.brightness}%) saturate(${settings.saturation}%)`,
      }}
    >
      {/* =========================================================================
          WALLPAPER CHANGER SYSTEM
          Supports Custom User Upload, Windows Vista, Win 98, Win XP, Win 10, VAIIYA, Nebula
         ========================================================================= */}
      {settings.wallpaper === 'custom' && settings.customWallpaperUrl ? (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img
            src={settings.customWallpaperUrl}
            alt="Custom Desktop Wallpaper"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/25" />
        </div>
      ) : settings.wallpaper === 'win98' ? (
        <div className="absolute inset-0 bg-[#008080] pointer-events-none" />
      ) : settings.wallpaper === 'xp' ? (
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-300 to-emerald-600 pointer-events-none overflow-hidden">
          <div className="absolute -bottom-24 left-0 right-0 h-2/3 bg-emerald-700/80 rounded-[50%] scale-125 blur-xs" />
        </div>
      ) : settings.wallpaper === 'win10' ? (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-900 to-black pointer-events-none overflow-hidden">
          <div className="absolute right-12 bottom-12 w-80 h-80 border border-sky-400/20 rotate-12 blur-xs" />
        </div>
      ) : settings.wallpaper === 'vaiiya' ? (
        <div className="absolute inset-0 bg-[#07080B] pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#181d27_1px,transparent_1px)] [background-size:28px_28px] opacity-40" />
        </div>
      ) : settings.wallpaper === 'nebula' ? (
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-950 via-indigo-950 to-black pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl" />
        </div>
      ) : (
        /* Default: Windows Vista Aurora Wallpaper */
        <div className="absolute inset-0 bg-[#040D1B] overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,#093359_0%,#04162e_40%,#020815_100%)]" />

          <svg
            className="absolute inset-0 w-full h-full opacity-65 mix-blend-screen"
            preserveAspectRatio="none"
            viewBox="0 0 1440 900"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="vistaAurora1" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0891b2" stopOpacity="0.8" />
                <stop offset="35%" stopColor="#0d9488" stopOpacity="0.75" />
                <stop offset="70%" stopColor="#10b981" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
              </linearGradient>

              <linearGradient id="vistaAurora2" x1="10%" y1="100%" x2="90%" y2="10%">
                <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.7" />
                <stop offset="45%" stopColor="#0284c7" stopOpacity="0.6" />
                <stop offset="75%" stopColor="#2dd4bf" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#a7f3d0" stopOpacity="0" />
              </linearGradient>

              <linearGradient id="vistaHighlight" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
                <stop offset="50%" stopColor="#e0f2fe" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
              </linearGradient>

              <filter id="auroraBlur" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="35" />
              </filter>
            </defs>

            <path
              d="M-100,900 C300,850 500,600 800,450 C1100,300 1350,180 1600,100 L1600,900 Z"
              fill="url(#vistaAurora2)"
              filter="url(#auroraBlur)"
            />

            <path
              d="M-50,900 C250,780 450,520 750,380 C1050,240 1280,140 1550,50 L1550,900 Z"
              fill="url(#vistaAurora1)"
              filter="url(#auroraBlur)"
            />

            <path
              d="M0,860 C350,750 600,510 900,380 C1200,250 1380,160 1500,80"
              fill="none"
              stroke="url(#vistaHighlight)"
              strokeWidth="8"
              filter="url(#auroraBlur)"
            />
          </svg>

          <div className="absolute -top-32 left-1/3 w-[600px] h-[350px] bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 right-1/4 w-[500px] h-[300px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>
      )}

      {/* CRT Scanline Retro Effect Overlay */}
      {settings.crtEffect && (
        <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-35" />
      )}

      {/* VAIIYA Subtle Watermark */}
      <div className="absolute right-10 bottom-16 pointer-events-none opacity-5 font-mono text-8xl font-black tracking-widest text-white">
        VAIIYA
      </div>

      {/* =========================================================================
          PINNED LIVE FPS & GPU TELEMETRY OVERLAY (CONFIGURED IN SETTINGS)
         ========================================================================= */}
      {settings.showFpsOverlay && (
        <div className="fixed top-14 right-4 z-40 bg-black/85 backdrop-blur-md border border-cyan-400/40 px-3.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-3 shadow-xl select-none animate-in fade-in">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-cyan-300 font-bold">{liveFps} FPS</span>
          </div>
          <span className="text-zinc-600">|</span>
          <div className="flex items-center gap-1 text-[11px] text-zinc-300 max-w-[150px] truncate">
            <Cpu className="w-3 h-3 text-cyan-400 shrink-0" />
            <span className="truncate">{gpuName.split('(')[0] || 'GPU Ready'}</span>
          </div>
        </div>
      )}

      {/* =========================================================================
          LEFT EDGE ARROW TOGGLE BUTTON FOR SIDEBAR
         ========================================================================= */}
      <button
        onClick={() => setSidebarOpen(s => !s)}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-30 group flex items-center bg-[#070E1A]/85 hover:bg-cyan-600/90 text-white border-y border-r border-cyan-400/30 hover:border-cyan-300 py-3 px-1.5 rounded-r-lg shadow-xl shadow-black/50 backdrop-blur-md transition-all duration-150 cursor-pointer"
        title="Toggle Categories & Games Sidebar"
        aria-label="Toggle Sidebar"
      >
        <ChevronRight className="w-4 h-4 text-cyan-300 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* =========================================================================
          SLIDE-OUT SIDEBAR COMPONENT
         ========================================================================= */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={catId => {
          setActiveCategory(catId);
        }}
        games={games}
        activeGame={activeApp}
        onSelectGame={handleLaunchApp}
        searchQuery={searchFilter}
        onSearchChange={setSearchFilter}
        onOpenSpecs={onOpenSpecs}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenAccount={() => setAccountOpen(true)}
        userProfile={userProfile}
      />

      {/* =========================================================================
          SETTINGS & CONTROL PANEL MODAL
         ========================================================================= */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onResetSettings={handleResetSettings}
      />

      {/* =========================================================================
          ACCOUNT & SIGN-IN MODAL
         ========================================================================= */}
      <AccountModal
        isOpen={accountOpen}
        onClose={() => setAccountOpen(false)}
        userProfile={userProfile}
        onSaveProfile={handleSaveProfile}
        onSignOut={handleSignOut}
      />

      {/* =========================================================================
          TOP DESKTOP HEADER & SEARCH BAR
         ========================================================================= */}
      <header className="relative z-20 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-white/10 bg-black/25 backdrop-blur-md">
        {/* Brand & Status Zone */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 bg-cyan-400 rounded-xs shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
            <span className="font-mono text-xs font-black tracking-widest uppercase text-white">
              SONAR // VISTA OS
            </span>
            <span className="text-white/30 text-xs hidden sm:inline">|</span>
            <span className="text-[11px] font-mono text-zinc-300 hidden sm:inline uppercase">
              VAIIYA WORKSTATION
            </span>
          </div>

          {/* Mobile Sidebar & Settings Trigger */}
          <div className="sm:hidden flex items-center gap-2">
            <button
              onClick={() => setSettingsOpen(true)}
              className="p-1.5 rounded bg-white/10 text-cyan-300 border border-white/15"
              title="Settings"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-1 px-2 py-1 rounded bg-white/10 text-xs text-cyan-300 border border-white/15 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Menu</span>
            </button>
          </div>
        </div>

        {/* TOP SEARCH BAR (Dedicated search input across the desktop) */}
        <div className="w-full sm:w-80 md:w-96 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cyan-300/80 pointer-events-none" />
          <input
            type="text"
            value={searchFilter}
            onChange={e => setSearchFilter(e.target.value)}
            placeholder="Search games... (Confront, Happy Room, Happy Wheels...)"
            className="w-full bg-white/10 hover:bg-white/15 focus:bg-[#070e1a]/90 border border-white/20 focus:border-cyan-400 rounded-full pl-9 pr-8 py-1.5 text-xs text-white placeholder:text-zinc-400 focus:outline-none transition-all shadow-inner backdrop-blur-md"
          />
          {searchFilter && (
            <button
              onClick={() => setSearchFilter('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-white/20 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Clear Search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick System Telemetry, Settings, & Account Pill */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Account Profile Pill */}
          <button
            onClick={() => setAccountOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 border border-white/20 text-xs text-zinc-200 hover:text-white transition-colors cursor-pointer"
            title="User Account & Sign In"
          >
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span className="truncate max-w-[100px]">
              {userProfile ? userProfile.username : 'Sign In'}
            </span>
          </button>

          {/* Settings Button */}
          <button
            onClick={() => setSettingsOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 hover:text-white text-xs font-mono font-medium transition-colors cursor-pointer"
            title="Open Control Panel, Graphics, Audio, FPS & Background Changer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Settings</span>
          </button>

          {/* Quick RAM Specs */}
          <button
            onClick={onOpenSpecs}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 hover:text-white text-[11px] font-mono font-medium transition-colors cursor-pointer"
            title="Inspect Hardware RAM & Thermal Specifications"
          >
            <HardDrive className="w-3 h-3 text-amber-400" />
            <span>4GB RAM</span>
          </button>
        </div>
      </header>

      {/* =========================================================================
          MAIN DESKTOP WORKSPACE
         ========================================================================= */}
      <main
        className="relative z-10 flex-1 p-6 sm:p-10 overflow-y-auto"
        onClick={() => {
          if (startMenuOpen) setStartMenuOpen(false);
        }}
      >
        {/* DESKTOP ICONS GRID (When no window is active or window minimized) */}
        {!activeApp && (
          <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
            {/* Search feedback indicator if user is searching */}
            {searchFilter && (
              <div className="flex items-center justify-between bg-black/40 border border-white/15 rounded-lg px-4 py-2 backdrop-blur-md">
                <div className="text-xs font-mono text-zinc-300">
                  Showing results for &ldquo;<span className="text-cyan-300 font-bold">{searchFilter}</span>&rdquo;
                  <span className="text-zinc-400 ml-2">({filteredGames.length} found)</span>
                </div>
                <button
                  onClick={() => setSearchFilter('')}
                  className="text-xs text-zinc-400 hover:text-white underline cursor-pointer"
                >
                  Clear search
                </button>
              </div>
            )}

            {/* HORIZONTAL DESKTOP ICON GRID ACROSS THE SCREEN
                Authentic desktop icons: Compact icon on top, label text strictly below */}
            <div className="flex flex-wrap gap-x-6 gap-y-7 items-start content-start">
              {/* All Registered Games */}
              {filteredGames.map(game => (
                <button
                  key={game.id}
                  onClick={() => handleLaunchApp(game)}
                  className="group flex flex-col items-center justify-start w-20 sm:w-22 p-2 rounded-xl hover:bg-white/15 focus:bg-white/20 transition-all duration-150 cursor-pointer focus:outline-none"
                  title={`${game.title} - ${game.shortDesc}`}
                >
                  {/* ICON GRAPHIC (ON TOP) */}
                  <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-b from-white/20 via-white/10 to-black/40 border border-white/30 group-hover:border-cyan-400/80 shadow-lg shadow-black/40 backdrop-blur-md flex items-center justify-center transition-all duration-150 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.35)]">
                    {getAppIcon(game.id)}
                    {game.isHot && (
                      <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-mono font-black text-[9px] px-1 py-0.2 rounded-full uppercase shadow">
                        HOT
                      </span>
                    )}
                  </div>

                  {/* TEXT LABEL (STRICTLY BELOW ICON) */}
                  <span className="mt-2 text-[11px] sm:text-xs font-medium text-white text-center leading-tight drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.95)] max-w-full truncate px-0.5 select-none tracking-tight">
                    {game.title}
                  </span>
                </button>
              ))}

              {/* SETTINGS DESKTOP ICON */}
              <button
                onClick={() => setSettingsOpen(true)}
                className="group flex flex-col items-center justify-start w-20 sm:w-22 p-2 rounded-xl hover:bg-white/15 focus:bg-white/20 transition-all duration-150 cursor-pointer focus:outline-none"
                title="Open Settings, Brightness, Saturation, Audio, FPS, GPU & Background Changer"
              >
                {/* ICON GRAPHIC (ON TOP) */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-cyan-400/30 via-cyan-500/10 to-black/40 border border-cyan-400/40 group-hover:border-cyan-300 shadow-lg shadow-black/40 backdrop-blur-md flex items-center justify-center transition-all duration-150 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.35)]">
                  <Settings className="w-7 h-7 text-cyan-300 group-hover:text-white group-hover:rotate-45 transition-all duration-200" />
                </div>

                {/* TEXT LABEL (STRICTLY BELOW ICON) */}
                <span className="mt-2 text-[11px] sm:text-xs font-medium text-cyan-200 text-center leading-tight drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.95)] max-w-full truncate px-0.5 select-none tracking-tight">
                  Settings
                </span>
              </button>

              {/* ACCOUNT / SIGN-IN DESKTOP ICON */}
              <button
                onClick={() => setAccountOpen(true)}
                className="group flex flex-col items-center justify-start w-20 sm:w-22 p-2 rounded-xl hover:bg-white/15 focus:bg-white/20 transition-all duration-150 cursor-pointer focus:outline-none"
                title="Player Profile & Account Sign-In"
              >
                {/* ICON GRAPHIC (ON TOP) */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-blue-400/30 via-indigo-500/10 to-black/40 border border-blue-400/40 group-hover:border-blue-300 shadow-lg shadow-black/40 backdrop-blur-md flex items-center justify-center transition-all duration-150 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(96,165,250,0.35)]">
                  <User className="w-7 h-7 text-blue-300 group-hover:text-white transition-colors" />
                </div>

                {/* TEXT LABEL (STRICTLY BELOW ICON) */}
                <span className="mt-2 text-[11px] sm:text-xs font-medium text-blue-200 text-center leading-tight drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.95)] max-w-full truncate px-0.5 select-none tracking-tight">
                  {userProfile ? userProfile.username : 'Sign In'}
                </span>
              </button>

              {/* Hardware RAM Specs Desktop Icon */}
              <button
                onClick={onOpenSpecs}
                className="group flex flex-col items-center justify-start w-20 sm:w-22 p-2 rounded-xl hover:bg-white/15 focus:bg-white/20 transition-all duration-150 cursor-pointer focus:outline-none"
                title="Chromebook Minimum RAM Specs & Thermal Warning"
              >
                {/* ICON GRAPHIC (ON TOP) */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-amber-400/30 via-amber-500/10 to-black/40 border border-amber-400/40 group-hover:border-amber-300 shadow-lg shadow-black/40 backdrop-blur-md flex items-center justify-center transition-all duration-150 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(251,191,36,0.35)]">
                  <HardDrive className="w-7 h-7 text-amber-300 group-hover:text-amber-200 transition-colors" />
                </div>

                {/* TEXT LABEL (STRICTLY BELOW ICON) */}
                <span className="mt-2 text-[11px] sm:text-xs font-medium text-amber-200 text-center leading-tight drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.95)] max-w-full truncate px-0.5 select-none tracking-tight">
                  RAM Specs
                </span>
              </button>

              {/* Sidebar Quick Open Desktop Icon */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="group flex flex-col items-center justify-start w-20 sm:w-22 p-2 rounded-xl hover:bg-white/15 focus:bg-white/20 transition-all duration-150 cursor-pointer focus:outline-none"
                title="Browse Categories & Full Catalog"
              >
                {/* ICON GRAPHIC (ON TOP) */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-cyan-400/30 via-cyan-500/10 to-black/40 border border-cyan-400/40 group-hover:border-cyan-300 shadow-lg shadow-black/40 backdrop-blur-md flex items-center justify-center transition-all duration-150 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.35)]">
                  <SlidersHorizontal className="w-7 h-7 text-cyan-300 group-hover:text-white transition-colors" />
                </div>

                {/* TEXT LABEL (STRICTLY BELOW ICON) */}
                <span className="mt-2 text-[11px] sm:text-xs font-medium text-cyan-200 text-center leading-tight drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.95)] max-w-full truncate px-0.5 select-none tracking-tight">
                  Directory
                </span>
              </button>
            </div>

            {/* Zero results fallback */}
            {filteredGames.length === 0 && (
              <div className="p-8 text-center bg-black/40 border border-white/15 rounded-xl backdrop-blur-md max-w-md mx-auto">
                <Search className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
                <h4 className="text-sm font-semibold text-white">No games found</h4>
                <p className="text-xs text-zinc-400 mt-1">
                  Try another search query or browse through all categories.
                </p>
                <button
                  onClick={() => setSearchFilter('')}
                  className="mt-4 px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold rounded-md transition-colors cursor-pointer"
                >
                  Reset Search
                </button>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            ACTIVE APPLICATION WINDOW (CONFRONT, HAPPY ROOM, HAPPY WHEELS, DUCK.AI, ETC.)
           ========================================================================= */}
        {activeApp && (
          <div
            className={`w-full mx-auto transition-all duration-200 flex flex-col bg-[#0B0D12] border-2 border-white/80 shadow-[0_0_60px_rgba(0,0,0,0.9)] rounded-lg overflow-hidden backdrop-blur-xl ${
              isMaximized ? 'h-full max-w-full' : 'max-w-5xl h-auto'
            }`}
          >
            {/* Window Title Bar */}
            <div className="bg-[#121620] border-b border-white/15 px-4 py-2.5 flex items-center justify-between gap-3 select-none">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
                <span className="font-mono text-xs font-black uppercase tracking-wider text-white">
                  {activeApp.title} // ACTIVE MODULE
                </span>
                <span className="hidden sm:inline text-[10px] font-mono text-zinc-400 uppercase">
                  CATEGORY: {activeApp.category}
                </span>
              </div>

              {/* Window Controls */}
              <div className="flex items-center gap-1.5 font-mono text-xs">
                <button
                  onClick={handleReloadFrame}
                  className="p-1.5 rounded bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  title="Reload Application Frame"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setIsMaximized(m => !m)}
                  className="p-1.5 rounded bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  title={isMaximized ? 'Restore Window Size' : 'Maximize Window'}
                >
                  {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => setActiveApp(null)}
                  className="p-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold transition-colors ml-1 cursor-pointer"
                  title="Close Window (Return to Desktop)"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Special In-Window Browser View for Duck.ai */}
            {activeApp.id === 'duck-ai' ? (
              <div className="flex-1 flex flex-col bg-black">
                {/* Browser Address Bar */}
                <div className="bg-[#141720] border-b border-[#1C2027] px-4 py-2 flex items-center justify-between gap-3 text-xs font-mono">
                  <div className="flex items-center gap-2 flex-1 max-w-xl bg-black border border-[#262B36] rounded px-3 py-1 text-zinc-300">
                    <span className="text-emerald-400">🔒</span>
                    <span className="text-zinc-400 text-[11px] truncate">https://duck.ai</span>
                  </div>

                  <a
                    href="https://duck.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-zinc-200 text-black font-bold uppercase text-[11px] rounded transition-colors whitespace-nowrap"
                    title="Open in new window if your browser blocks Duck.ai iframe"
                  >
                    <span>EXTERNAL TAB</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Embedded Frame */}
                <div className="relative w-full h-[520px] bg-black">
                  <iframe
                    className="game-iframe w-full h-full border-0 bg-black"
                    id="gameFrame"
                    src={activeApp.iframe}
                    style={{ background: 'black' }}
                    width="100%"
                    height="520"
                    allow="autoplay; fullscreen; clipboard-write; clipboard-read"
                  />
                </div>
              </div>
            ) : (
              /* Standard Game Embed (Confront, Happy Room, Happy Wheels, etc.) */
              <div className="flex-1 flex flex-col bg-black">
                <div className="relative w-full bg-black overflow-hidden border-b border-[#1C2027]">
                  <iframe
                    className="game-iframe"
                    id="gameFrame"
                    src={activeApp.iframe}
                    style={{ background: 'black' }}
                    width="100%"
                    height={activeApp.height || 480}
                    scrolling="no"
                    frameBorder="0"
                    data-wg-content="true"
                    spellCheck={false}
                    allow="autoplay; fullscreen; clipboard-read; clipboard-write; payment; accelerometer; gyroscope; gamepad"
                    allowFullScreen={true}
                  />
                </div>

                {/* Input specifications & Controls Bar below iframe */}
                <div className="p-4 bg-[#0E1015] grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-zinc-500 block mb-2">
                      INPUT COMMANDS
                    </span>
                    <div className="space-y-1">
                      {activeApp.controls?.map((c, i) => (
                        <div key={i} className="flex items-center justify-between py-0.5 border-b border-[#1C2027]">
                          <span className="bg-[#141720] px-1.5 py-0.5 text-zinc-300 border border-[#1C2027] rounded">
                            {c.key}
                          </span>
                          <span className="text-zinc-400 text-[11px] uppercase">{c.action}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-zinc-500 block mb-1">
                        APPLICATION BRIEF
                      </span>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        {activeApp.shortDesc}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-[10px] text-zinc-500 uppercase">
                      <span>VAIIYA // SONAR ARCHIVE</span>
                      <button
                        onClick={() => setActiveApp(null)}
                        className="text-cyan-400 hover:underline font-bold cursor-pointer"
                      >
                        CLOSE TO DESKTOP ✕
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* =========================================================================
          START MENU POPUP (CLICKING SONAR BUTTON)
         ========================================================================= */}
      {startMenuOpen && (
        <div
          onClick={e => e.stopPropagation()}
          className="absolute left-3 bottom-14 z-50 w-84 bg-[#0B0F17]/95 backdrop-blur-2xl border-2 border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-lg p-4 flex flex-col gap-3 font-mono text-xs select-none animate-in slide-in-from-bottom-2 duration-150"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-cyan-400" />
              SONAR // QUICK LAUNCH
            </span>
            <span className="text-[10px] text-cyan-400">VISTA AERO</span>
          </div>

          {/* User Profile Bar inside Start Menu */}
          <div
            onClick={() => {
              setAccountOpen(true);
              setStartMenuOpen(false);
            }}
            className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-md bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">
                  {userProfile ? userProfile.username : 'Sign In / Register'}
                </div>
                <div className="text-[10px] text-zinc-400 truncate">
                  {userProfile ? userProfile.email : 'Create Player Profile'}
                </div>
              </div>
            </div>
            <span className="text-[10px] text-cyan-400 font-bold">MANAGE</span>
          </div>

          {/* Quick search inside Start menu */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              placeholder="SEARCH APPS..."
              className="w-full bg-white/5 border border-white/15 focus:border-cyan-400 rounded pl-8 pr-2 py-1.5 text-[11px] text-white uppercase focus:outline-none"
            />
          </div>

          {/* Apps List in Start Menu */}
          <div className="max-h-52 overflow-y-auto space-y-1 pr-1">
            {filteredGames.map(g => (
              <button
                key={g.id}
                onClick={() => handleLaunchApp(g)}
                className="w-full text-left px-2.5 py-2 rounded bg-white/5 hover:bg-white hover:text-black border border-white/10 flex items-center justify-between transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2 truncate">
                  <div className="shrink-0">{getAppIcon(g.id)}</div>
                  <span className="font-bold uppercase tracking-wider truncate">
                    {g.title}
                  </span>
                </div>
                <span className="text-[10px] text-zinc-400 group-hover:text-black uppercase shrink-0">
                  {g.category}
                </span>
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-zinc-400">
            <button
              onClick={() => {
                setSettingsOpen(true);
                setStartMenuOpen(false);
              }}
              className="text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Settings className="w-3 h-3" />
              <span>SETTINGS & WALLPAPERS</span>
            </button>
            <button
              onClick={() => {
                onOpenSpecs();
                setStartMenuOpen(false);
              }}
              className="text-amber-400 hover:underline cursor-pointer"
            >
              RAM SPECS
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          WINDOWS VISTA / AERO STYLE BOTTOM TASKBAR
         ========================================================================= */}
      <footer className="relative z-20 bg-black/60 backdrop-blur-2xl border-t border-white/15 px-3 py-2 flex items-center justify-between gap-4 select-none">
        {/* Left: Start Button + Open App Shortcuts */}
        <div className="flex items-center gap-2">
          {/* Start Menu Button */}
          <button
            onClick={() => setStartMenuOpen(s => !s)}
            className={`px-3.5 py-1.5 text-xs font-mono font-bold tracking-widest uppercase transition-all rounded-md flex items-center gap-2 border cursor-pointer ${
              startMenuOpen
                ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]'
                : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
            }`}
          >
            <div className={`w-2.5 h-2.5 rounded-full ${startMenuOpen ? 'bg-black' : 'bg-cyan-400'}`} />
            <span>SONAR</span>
          </button>

          {/* Sidebar drawer toggle button in taskbar */}
          <button
            onClick={() => setSidebarOpen(s => !s)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-md bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white border border-white/15 cursor-pointer"
            title="Browse all categories & games"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-300" />
            <span className="hidden sm:inline">CATEGORIES</span>
          </button>

          {/* Settings shortcut button in taskbar */}
          <button
            onClick={() => setSettingsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-md bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white border border-white/15 cursor-pointer"
            title="Open Control Panel, Graphics, Audio, FPS & Background Changer"
          >
            <Settings className="w-3.5 h-3.5 text-cyan-300" />
            <span className="hidden sm:inline">SETTINGS</span>
          </button>

          {/* Active app taskbar tab */}
          {activeApp && (
            <div className="flex items-center gap-2 bg-white text-black font-mono text-xs font-bold px-3 py-1.5 rounded-md border border-white shadow-md">
              <span className="truncate max-w-[140px] sm:max-w-none">■ {activeApp.title.toUpperCase()}</span>
              <button
                onClick={() => setActiveApp(null)}
                className="hover:bg-black hover:text-white px-1 rounded text-[11px] ml-1 transition-colors cursor-pointer"
                title="Minimize / Return to Desktop"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Right: System Tray & Clock */}
        <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
          {/* User Profile Account Shortcut */}
          <button
            onClick={() => setAccountOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 border border-white/10 hover:border-cyan-400 text-zinc-300 hover:text-cyan-300 text-[11px] transition-colors cursor-pointer"
            title="User Profile & Sign In"
          >
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span>{userProfile ? userProfile.username : 'SIGN IN'}</span>
          </button>

          {/* Hardware Spec Shortcut */}
          <button
            onClick={onOpenSpecs}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 border border-white/10 hover:border-amber-400 text-zinc-300 hover:text-amber-300 text-[11px] transition-colors cursor-pointer"
            title="Inspect Chromebook Minimum RAM Specifications & Overheat Warnings"
          >
            <HardDrive className="w-3.5 h-3.5 text-amber-400" />
            <span>4GB RAM OK</span>
          </button>

          {/* Clock */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 border border-white/10 text-white font-bold text-[11px]">
            <Clock className="w-3 h-3 text-cyan-300" />
            <span>{currentTime || '12:00 PM'}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
