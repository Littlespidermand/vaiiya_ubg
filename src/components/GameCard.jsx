import React from 'react';
import { Heart, Play, Gamepad2 } from 'lucide-react';

export const GameCard = ({
  game,
  isFavorite,
  onToggleFavorite,
  onPlay,
}) => {
  return (
    <div
      onClick={() => onPlay(game)}
      className="group relative bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between"
    >
      <div>
        {/* Card Thumbnail / Preview Banner */}
        <div className="relative aspect-[16/10] w-full bg-slate-950 overflow-hidden flex items-center justify-center">
          {game.thumbnailImage ? (
            <img
              src={game.thumbnailImage}
              alt={game.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            // Styled Fallback Container
            <div
              className="w-full h-full flex flex-col items-center justify-center p-6 text-center"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${game.accentColor}25 0%, #090d16 80%)`,
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-2 shadow-inner"
                style={{ backgroundColor: `${game.accentColor}20`, color: game.accentColor }}
              >
                <Gamepad2 className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono tracking-wider uppercase text-slate-400">
                {game.category}
              </span>
            </div>
          )}

          {/* Quick Play Hover Scrim */}
          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-2xs">
            <div className="w-12 h-12 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
              <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
            </div>
          </div>

          {/* Favorite button (top right) */}
          <button
            onClick={(e) => onToggleFavorite(game.id, e)}
            className="absolute top-2.5 right-2.5 p-2 rounded-lg bg-slate-950/70 hover:bg-slate-900 text-slate-300 hover:text-white backdrop-blur-xs transition-colors z-10"
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'text-rose-500 fill-rose-500' : ''}`} />
          </button>
        </div>

        {/* Card Content with Zero-Pill Typography */}
        <div className="p-4">
          {/* Unboxed Metadata with Typographic Separators */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
            <span className="capitalize">{game.category}</span>
            <span aria-hidden="true">·</span>
            <span>Unblocked</span>
            {game.isHot && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-amber-400 font-semibold">Popular</span>
              </>
            )}
          </div>

          <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors tracking-tight line-clamp-1">
            {game.title}
          </h3>

          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {game.shortDesc}
          </p>
        </div>
      </div>

      {/* Subtle bottom row */}
      <div className="px-4 pb-4 pt-1 flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/40">
        <span>Instant Play</span>
        <span className="text-slate-400 group-hover:text-slate-200 font-medium transition-colors">
          Launch &rarr;
        </span>
      </div>
    </div>
  );
};
