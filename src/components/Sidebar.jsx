import React from 'react';
import {
  Shield,
  Crosshair,
  Grid,
  Cpu,
  Swords,
  Compass,
  Search,
  Bot,
  Flame,
  Footprints,
  Layers,
  HardDrive,
  X,
  ChevronLeft,
  Play,
  Bike,
  Settings,
  User,
  ShieldCheck,
  CircleDot
} from 'lucide-react';

export const Sidebar = ({
  isOpen,
  onClose,
  categories,
  activeCategory,
  onSelectCategory,
  games,
  activeGame,
  onSelectGame,
  searchQuery,
  onSearchChange,
  onOpenSpecs,
  onOpenSettings,
  onOpenAccount,
  userProfile,
}) => {
  const getCategoryIcon = (id) => {
    switch (id) {
      case 'action': return <Crosshair className="w-3.5 h-3.5" />;
      case 'arcade': return <Flame className="w-3.5 h-3.5" />;
      case 'puzzle': return <Grid className="w-3.5 h-3.5" />;
      case 'classic': return <Compass className="w-3.5 h-3.5" />;
      case '2-player': return <Swords className="w-3.5 h-3.5" />;
      case 'tools': return <Bot className="w-3.5 h-3.5" />;
      default: return <Shield className="w-3.5 h-3.5" />;
    }
  };

  const getGameIcon = (id) => {
    switch (id) {
      case 'confront': return <Crosshair className="w-4 h-4 text-rose-400" />;
      case 'happy-room': return <Flame className="w-4 h-4 text-amber-400" />;
      case 'happy-wheels': return <Bike className="w-4 h-4 text-amber-400" />;
      case 'gunblood': return <Crosshair className="w-4 h-4 text-red-400" />;
      case 'age-of-war': return <Swords className="w-4 h-4 text-amber-300" />;
      case 'bloons-td': return <CircleDot className="w-4 h-4 text-rose-400" />;
      case 'duck-ai': return <Bot className="w-4 h-4 text-orange-400" />;
      case 'game-2048': return <Grid className="w-4 h-4 text-indigo-400" />;
      case 'retro-snake': return <Compass className="w-4 h-4 text-emerald-400" />;
      case 'galaxy-strike': return <Cpu className="w-4 h-4 text-purple-400" />;
      case 'neon-breakout': return <Layers className="w-4 h-4 text-cyan-400" />;
      case 'retro-pong': return <Swords className="w-4 h-4 text-sky-400" />;
      case 'dino-runner': return <Footprints className="w-4 h-4 text-teal-400" />;
      default: return <Play className="w-4 h-4 text-white" />;
    }
  };

  return (
    <>
      {/* Backdrop overlay when sidebar is open */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      {/* Slide-out Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-80 max-w-[85vw] bg-[#070B12]/95 backdrop-blur-2xl border-r border-white/20 shadow-2xl flex flex-col transition-transform duration-200 ease-out select-none text-white ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header with Close Arrow */}
        <div className="p-4 border-b border-white/10 bg-white/[0.03] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            <div>
              <div className="text-xs font-mono font-bold tracking-widest uppercase text-white">
                SONAR DIRECTORY
              </div>
              <div className="text-[10px] font-mono text-cyan-400/80 uppercase">
                VAIIYA SUITE // SYSTEM MENU
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-white/15 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Collapse Sidebar"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* User Account Strip if signed in / sign in action */}
        <div className="px-3 py-2.5 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
          <button
            onClick={() => {
              if (onOpenAccount) onOpenAccount();
              onClose();
            }}
            className="flex items-center gap-2 text-left group cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors block truncate">
                {userProfile ? userProfile.username : 'Sign In / Account'}
              </span>
              <span className="text-[10px] text-zinc-400 block truncate">
                {userProfile ? userProfile.email : 'Add email & profile'}
              </span>
            </div>
          </button>

          <button
            onClick={() => {
              if (onOpenSettings) onOpenSettings();
              onClose();
            }}
            className="p-1.5 rounded-md bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title="Open Control Panel & Settings"
          >
            <Settings className="w-4 h-4 text-cyan-300" />
          </button>
        </div>

        {/* Search input within sidebar */}
        <div className="p-3 border-b border-white/10 bg-black/20">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Search catalog..."
              className="w-full bg-white/5 border border-white/15 focus:border-cyan-400 rounded-md pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* TOP SECTION: CATEGORIES */}
        <div className="p-3 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center justify-between text-[10px] font-mono tracking-widest uppercase text-zinc-400 mb-2 px-1">
            <span>01. CATEGORIES</span>
            <span className="text-zinc-500">[{categories.length}]</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {categories.map(cat => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-md transition-all text-left font-medium cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                      : 'bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <span className={isActive ? 'text-black' : 'text-zinc-400'}>
                    {getCategoryIcon(cat.id)}
                  </span>
                  <span className="truncate">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* BOTTOM SECTION: INDIVIDUAL GAMES LIST */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="px-4 py-2 bg-white/[0.02] border-b border-white/10 flex items-center justify-between text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
            <span>02. INDIVIDUAL GAMES</span>
            <span className="text-cyan-400 font-bold">[{games.length} AVAILABLE]</span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {games.map((g, index) => {
              const isSelected = activeGame?.id === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => {
                    onSelectGame(g);
                    onClose();
                  }}
                  className={`w-full text-left p-2.5 rounded-lg transition-all flex items-center justify-between group cursor-pointer border ${
                    isSelected
                      ? 'bg-white text-black border-white shadow-lg font-bold'
                      : 'bg-white/5 hover:bg-white/15 text-zinc-200 hover:text-white border-white/10 hover:border-white/25'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 border ${
                      isSelected ? 'bg-black/10 border-black/20' : 'bg-black/40 border-white/15'
                    }`}>
                      {getGameIcon(g.id)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate">
                        {g.title}
                      </div>
                      <div className={`text-[10px] uppercase tracking-wider truncate ${
                        isSelected ? 'text-zinc-700' : 'text-zinc-400'
                      }`}>
                        {g.category} {g.isHot && '· Hot'}
                      </div>
                    </div>
                  </div>

                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded text-xs shrink-0 ${
                    isSelected
                      ? 'bg-black text-white font-bold'
                      : 'bg-white/10 text-zinc-300 group-hover:bg-cyan-500 group-hover:text-black font-semibold'
                  }`}>
                    LAUNCH
                  </span>
                </button>
              );
            })}

            {/* Hardware RAM Specs Diagnostic Tool in Catalog */}
            <button
              onClick={() => {
                onOpenSpecs();
                onClose();
              }}
              className="w-full text-left p-2.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-200 transition-all flex items-center justify-between cursor-pointer group mt-2"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-md bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
                  <HardDrive className="w-4 h-4 text-amber-400" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-amber-300">
                    RAM Diagnostic Gate
                  </div>
                  <div className="text-[10px] text-amber-400/80 uppercase">
                    4GB REQ · Overheat Warning
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500 text-black font-bold">
                SPECS
              </span>
            </button>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-white/10 bg-black/40 text-[10px] font-mono text-zinc-400 flex items-center justify-between">
          <span>VAIIYA PROTOCOL 76</span>
          <span className="text-cyan-400 font-bold">ONLINE</span>
        </div>
      </aside>
    </>
  );
};
