import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const Navbar = ({
  activeCategory,
  onSelectCategory,
  onTriggerStealth,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Single element brand wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onSelectCategory('all');
          }}
          className="text-xl font-extrabold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-amber-400 transition-colors"
        >
          Nova Arcade
        </a>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => onSelectCategory('all')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              activeCategory === 'all' ? 'text-white font-semibold underline underline-offset-8 decoration-amber-500' : ''
            }`}
          >
            All Games
          </button>
          <button
            onClick={() => onSelectCategory('arcade')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              activeCategory === 'arcade' ? 'text-white font-semibold underline underline-offset-8 decoration-cyan-500' : ''
            }`}
          >
            Arcades
          </button>
          <button
            onClick={() => onSelectCategory('puzzle')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              activeCategory === 'puzzle' ? 'text-white font-semibold underline underline-offset-8 decoration-amber-500' : ''
            }`}
          >
            Puzzles
          </button>
          <button
            onClick={() => onSelectCategory('action')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              activeCategory === 'action' ? 'text-white font-semibold underline underline-offset-8 decoration-purple-500' : ''
            }`}
          >
            Action
          </button>
          <button
            onClick={() => onSelectCategory('2-player')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              activeCategory === '2-player' ? 'text-white font-semibold underline underline-offset-8 decoration-sky-500' : ''
            }`}
          >
            2-Player
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onTriggerStealth}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm active:scale-95 transition-all whitespace-nowrap shrink-0"
            title="Instantly switch to educational screen (Shortcut: Esc or ~)"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Classroom Mode (Esc)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
