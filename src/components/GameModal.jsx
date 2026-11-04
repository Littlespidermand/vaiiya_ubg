import React, { useState, useEffect } from 'react';
import { X, Maximize2, Minimize2, Heart, Keyboard, Info, ArrowLeft } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export const GameModal = ({
  game,
  onClose,
  onSelectGame,
  allGames,
  favorites,
  onToggleFavorite,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isFav = favorites.includes(game.id);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const relatedGames = allGames.filter(g => g.id !== game.id).slice(0, 4);

  return (
    <div className="fixed inset-0 z-40 bg-slate-950/95 backdrop-blur-md overflow-y-auto flex flex-col">
      {/* Top action header */}
      <div className="sticky top-0 z-50 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Arcade
          </button>
          <div className="hidden sm:block">
            <h2 className="text-base font-bold text-white tracking-tight leading-tight">{game.title}</h2>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="capitalize">{game.category}</span>
              <span aria-hidden="true">·</span>
              <span>100% Unblocked</span>
              <span aria-hidden="true">·</span>
              <span>Iframe Sandbox</span>
            </div>
          </div>
        </div>

        {/* Toolbar actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleFavorite(game.id)}
            className={`p-2 rounded-lg border transition-colors ${
              isFav
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-500'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title={isFav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-400 border border-slate-700 transition-colors"
            title="Close Game (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Game Screen with Iframe Container */}
      <div className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 flex flex-col items-center justify-start">
        {/* Active Game Iframe */}
        <div className="w-full flex justify-center py-2">
          <div className="w-full max-w-2xl bg-slate-900 border-2 border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <iframe
              src={game.iframe}
              title={game.title}
              className="w-full h-[520px] sm:h-[560px] border-0 bg-slate-950 block"
              allow="autoplay; fullscreen"
            />
          </div>
        </div>

        {/* Instructions & Controls Split */}
        <div className="w-full max-w-3xl mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          {/* Instructions */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-sky-400" /> How to Play
            </h3>
            <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
              {game.instructions.map((inst, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-sky-400 font-mono font-bold">·</span>
                  <span>{inst}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Controls */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <Keyboard className="w-4 h-4 text-amber-400" /> Key Controls
            </h3>
            <div className="space-y-2">
              {game.controls.map((ctrl, i) => (
                <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-slate-800/50 last:border-0">
                  <span className="font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                    {ctrl.key}
                  </span>
                  <span className="text-slate-200 font-medium">{ctrl.action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Jump Related Games */}
        <div className="w-full max-w-3xl mt-8 pt-6 border-t border-slate-800/80 pb-12">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-4">
            More Popular Unblocked Games
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {relatedGames.map(rel => (
              <button
                key={rel.id}
                onClick={() => onSelectGame(rel)}
                className="p-3 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-left transition-all hover:scale-[1.02] group"
              >
                <span className="text-xs font-semibold text-white group-hover:text-amber-400 block truncate">
                  {rel.title}
                </span>
                <span className="text-[11px] text-slate-500 capitalize block truncate mt-0.5">
                  {rel.category}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
