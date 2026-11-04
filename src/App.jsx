/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import GAMES from './data/games.json';
import { HardwareSpecGate } from './components/HardwareSpecGate';
import { DesktopView } from './components/DesktopView';

export default function App() {
  const [showSpecGate, setShowSpecGate] = useState(() => {
    // Check if acknowledged previously; default to showing the spec gate on first open
    return localStorage.getItem('sonar_hardware_acknowledged') !== 'true';
  });

  return (
    <div className="w-full h-screen overflow-hidden bg-black text-white font-sans select-none antialiased">
      {/* 1. Initial Hardware RAM Spec & Chromebook Overheating Warning Gate */}
      {showSpecGate && (
        <HardwareSpecGate onProceed={() => setShowSpecGate(false)} />
      )}

      {/* 2. Computer Screen Menu with Icons & Duck.ai in-site launcher */}
      <DesktopView
        games={GAMES}
        onOpenSpecs={() => setShowSpecGate(true)}
      />
    </div>
  );
}
