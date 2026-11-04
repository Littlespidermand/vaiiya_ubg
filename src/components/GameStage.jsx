import React, { useRef } from 'react';
import { Maximize2, RotateCcw, Heart, Expand, Cpu, Terminal, Key, Layers } from 'lucide-react';

export const GameStage = ({
  game,
  allGames,
  onSelectGame,
  isTheaterMode,
  onToggleTheater,
  isFavorite,
  onToggleFavorite,
  onReload,
  onFullscreen,
}) => {
  const containerRef = useRef(null);

  return (
    <div className={`w-full transition-all duration-300 flex flex-col items-center ${isTheaterMode ? 'max-w-6xl' : 'max-w-4xl'}`}>
      {/* Quick Multi-Selection Module Bar */}
      <div className="w-full bg-[#080A0E] border border-[#1C2027] p-2 mb-2 flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-1.5 shrink-0 px-2 text-[10px] font-mono tracking-widest uppercase text-zinc-500">
          <Layers className="w-3.5 h-3.5 text-white" />
          <span>QUICK SELECT:</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          {allGames.map((g) => {
            const isCurrent = g.id === game.id;
            return (
              <button
                key={g.id}
                onClick={() => onSelectGame(g)}
                className={`px-3 py-1 text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-all border ${
                  isCurrent
                    ? 'bg-white text-black font-extrabold border-white shadow-xs'
                    : 'bg-[#10131A] text-zinc-400 hover:text-white border-[#1C2027] hover:border-zinc-700'
                }`}
              >
                {g.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Player Header with VAIIYA Styling */}
      <div className="w-full bg-[#0E1015] border border-[#1C2027] p-4 flex flex-wrap items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-white" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-500">
                ACTIVE PROTOCOL // {game.category.toUpperCase()}
              </span>
              {game.isHot && (
                <span className="text-[10px] font-mono uppercase bg-white text-black font-extrabold px-1.5 py-0.2">
                  FEATURED
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
              {game.title}
            </h1>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleFavorite}
            className={`px-3 py-1.5 border text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
              isFavorite
                ? 'bg-rose-500 text-white border-rose-500 font-bold'
                : 'bg-[#141720] border-[#1C2027] text-zinc-400 hover:text-white hover:border-zinc-700'
            }`}
            title="Mark as Favorite"
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-white' : ''}`} />
            <span className="hidden sm:inline">{isFavorite ? 'SAVED' : 'FAV'}</span>
          </button>

          <button
            onClick={onToggleTheater}
            className={`px-3 py-1.5 border text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
              isTheaterMode
                ? 'bg-white text-black border-white font-bold'
                : 'bg-[#141720] border-[#1C2027] text-zinc-400 hover:text-white hover:border-zinc-700'
            }`}
            title="Toggle Theater Mode"
          >
            <Expand className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">THEATER</span>
          </button>

          <button
            onClick={onReload}
            className="px-3 py-1.5 bg-[#141720] border border-[#1C2027] hover:border-zinc-700 text-zinc-400 hover:text-white transition-colors text-xs font-mono uppercase tracking-wider flex items-center gap-1.5"
            title="Reload Active Frame"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">RELOAD</span>
          </button>

          <button
            onClick={onFullscreen}
            className="px-3.5 py-1.5 bg-white text-black font-bold border border-white hover:bg-zinc-200 transition-colors text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
            title="Expand Fullscreen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">FULLSCREEN</span>
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div
        id="game-container"
        ref={containerRef}
        className="w-full relative border-2 border-white bg-black shadow-2xl overflow-hidden"
      >
        <iframe
          className="game-iframe"
          id="gameFrame"
          src={game.iframe}
          style={{ background: 'black' }}
          width="100%"
          height="480"
          scrolling="no"
          frameBorder="0"
          allow="autoplay; fullscreen"
        />
      </div>

      {/* VAIIYA Technical Controls & Telemetry Data Strips */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
        {/* Key Controls Matrix */}
        <div className="bg-[#0E1015] border border-[#1C2027] p-4">
          <div className="text-[10px] font-mono tracking-widest uppercase text-zinc-500 mb-3 flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-white" />
            <span>03. INPUT SPECIFICATIONS</span>
          </div>
          <div className="space-y-1.5">
            {game.controls?.map((ctrl, i) => (
              <div key={i} className="flex items-center justify-between text-xs font-mono py-1 border-b border-[#1C2027]/70 last:border-0">
                <span className="bg-[#141720] px-2 py-0.5 text-zinc-300 border border-[#1C2027]">
                  {ctrl.key}
                </span>
                <span className="text-zinc-400 uppercase text-[11px]">{ctrl.action}</span>
              </div>
            ))}
          </div>
        </div>

        {/* VAIIYA Corporate Telemetry */}
        <div className="bg-[#0E1015] border border-[#1C2027] p-4 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono tracking-widest uppercase text-zinc-500 mb-2 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-white" />
              <span>04. SECTOR REPORT</span>
            </div>
            <p className="text-xs text-zinc-400 font-mono leading-relaxed">
              {game.shortDesc}
            </p>
          </div>

          <div className="pt-3 border-t border-[#1C2027] mt-3 flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            <span>SPONSOR // VAIIYA</span>
            <span className="text-white font-bold flex items-center gap-1">
              <Cpu className="w-3 h-3 text-emerald-400" /> ACTIVE HOST: UNBLOCKED 76
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
