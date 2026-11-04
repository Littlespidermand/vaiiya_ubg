import React, { useState } from 'react';
import {
  User,
  Mail,
  Lock,
  Key,
  ShieldCheck,
  LogOut,
  LogIn,
  UserCheck,
  X,
  Award,
  Gamepad2,
  Clock,
  Sparkles,
  Camera
} from 'lucide-react';

export const AccountModal = ({
  isOpen,
  onClose,
  userProfile,
  onSaveProfile,
  onSignOut,
}) => {
  const [isRegistering, setIsRegistering] = useState(!userProfile);
  const [email, setEmail] = useState(userProfile?.email || '');
  const [username, setUsername] = useState(userProfile?.username || '');
  const [gamerTag, setGamerTag] = useState(userProfile?.gamerTag || '');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(userProfile?.avatar || 'pilot');
  const [statusMessage, setStatusMessage] = useState('');

  const avatarOptions = [
    { id: 'pilot', label: 'Pilot', icon: '🪖' },
    { id: 'ninja', label: 'Ninja', icon: '🥷' },
    { id: 'bot', label: 'Cyborg', icon: '🤖' },
    { id: 'alien', label: 'Cosmic', icon: '👾' },
    { id: 'ghost', label: 'Phantom', icon: '👻' },
    { id: 'tiger', label: 'Apex', icon: '🐯' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatusMessage('Please enter a valid email address.');
      return;
    }
    if (!username.trim()) {
      setStatusMessage('Please enter a player username.');
      return;
    }

    const updatedProfile = {
      email: email.trim(),
      username: username.trim(),
      gamerTag: gamerTag.trim() || `#${Math.floor(1000 + Math.random() * 9000)}`,
      avatar: selectedAvatar,
      joinedAt: userProfile?.joinedAt || new Date().toLocaleDateString(),
      gamesPlayed: userProfile?.gamesPlayed || 0,
      verified: true,
    };

    onSaveProfile(updatedProfile);
    setStatusMessage('Account saved successfully!');
    setTimeout(() => {
      onClose();
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 select-none animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-[#0A0E17]/95 border-2 border-white/80 shadow-[0_0_60px_rgba(0,0,0,0.9)] rounded-xl overflow-hidden flex flex-col text-white font-sans"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#121622] border-b border-white/15 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                {userProfile ? 'PLAYER PROFILE' : (isRegistering ? 'CREATE OPERATOR ACCOUNT' : 'SIGN IN TO SONAR')}
              </h2>
              <p className="text-[10px] font-mono text-zinc-400">
                VAIIYA Unified Gamer Credentials
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* If already signed in, display profile overview card */}
          {userProfile ? (
            <div className="space-y-4">
              <div className="p-4 bg-white/5 border border-white/15 rounded-xl flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-3xl shadow-lg border-2 border-white/30 shrink-0">
                  {avatarOptions.find(a => a.id === userProfile.avatar)?.icon || '🪖'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white truncate">
                      {userProfile.username}
                    </h3>
                    <span className="text-xs font-mono text-cyan-300 bg-cyan-950/80 border border-cyan-500/30 px-1.5 py-0.5 rounded">
                      {userProfile.gamerTag}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-400 truncate mt-0.5">
                    {userProfile.email}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono font-bold mt-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>VERIFIED OPERATOR</span>
                  </div>
                </div>
              </div>

              {/* Stats Strip */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                  <span className="text-[10px] text-zinc-400 block uppercase">Registration</span>
                  <span className="text-white font-bold">{userProfile.joinedAt}</span>
                </div>
                <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                  <span className="text-[10px] text-zinc-400 block uppercase">Cloud Sync</span>
                  <span className="text-cyan-300 font-bold">Local Offline</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => setIsRegistering(true)}
                  className="flex-1 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => {
                    onSignOut();
                    onClose();
                  }}
                  className="py-2 px-4 bg-rose-600/20 hover:bg-rose-600 border border-rose-500/40 text-rose-300 hover:text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            /* Sign In / Sign Up Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Avatar Selector */}
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-300 block mb-2">
                  Select Gamer Avatar
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {avatarOptions.map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedAvatar(opt.id)}
                      className={`h-11 rounded-xl flex items-center justify-center text-xl transition-all cursor-pointer border ${
                        selectedAvatar === opt.id
                          ? 'border-cyan-400 bg-cyan-500/20 scale-105 shadow-md shadow-cyan-500/30'
                          : 'border-white/10 bg-white/5 hover:bg-white/15'
                      }`}
                      title={opt.label}
                    >
                      {opt.icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-1">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-300 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="operator@domain.com"
                    className="w-full bg-white/5 border border-white/15 focus:border-cyan-400 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Username Input */}
              <div className="space-y-1">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-300 block">
                  Player Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="GhostRunner77"
                    className="w-full bg-white/5 border border-white/15 focus:border-cyan-400 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Gamer Tag / Call-Sign (Optional) */}
              <div className="space-y-1">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-300 block">
                  Gamer Tag / Call-Sign (Optional)
                </label>
                <input
                  type="text"
                  value={gamerTag}
                  onChange={e => setGamerTag(e.target.value)}
                  placeholder="#0481"
                  className="w-full bg-white/5 border border-white/15 focus:border-cyan-400 rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none transition-colors font-mono"
                />
              </div>

              {/* Password or PIN */}
              <div className="space-y-1">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-300 block">
                  Password / Access PIN
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/15 focus:border-cyan-400 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Status Message */}
              {statusMessage && (
                <div className="text-xs font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 p-2 rounded">
                  {statusMessage}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>{isRegistering ? 'Register & Sign In' : 'Sign In'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
