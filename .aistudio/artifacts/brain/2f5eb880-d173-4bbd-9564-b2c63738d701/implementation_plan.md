# Flash & Retro Arcade Integration — Gunblood, Age of War, and Bloons TD

Integrate three iconic browser classics—**Gunblood Western Shootout**, **Age of War**, and **Bloons Tower Defense**—into Sonar OS, providing desktop icons, category routing, Ruffle Flash player compatibility, responsive window sizing, and input guides.

> [!IMPORTANT]
> **User Confirmed Decisions**:
> - **Gunblood**: Run with Ruffle Flash emulator inside the window at 880×520px using the western shootout SWF source.
> - **Age of War**: Connect to an unblocked HTML5 Age of War web mirror with full 600px frame height, bypassing local `/age-of-war.embedgame` missing path errors.
> - **Bloons Tower Defense**: Integrate the CrazyGames Ruffle Bloons TD embed with complete sandbox and fullscreen permissions.

---

### 1. Overview & Core Concept

1. **Gunblood**: Fast-paced western quick-draw duel shootout. The player tests their reaction speed by hovering over their holster on countdown and quick-firing with precision before the outlaw shoots back.
2. **Age of War**: Legendary historical evolution defense game. Build units across 5 epochs (Stone Age, Castle Age, Renaissance, Modern, and Future) while raining down artillery to protect the home base.
3. **Bloons Tower Defense**: The quintessential tower defense game. Deploy dart monkeys, tack shooters, bomb towers, and super monkeys to pop advancing waves of bloons before they breach the perimeter.

---

### 2. User Experience & Visual Design

#### Desktop Grid Experience
- Each new game gets an authentic desktop icon matching Sonar's Windows Vista Aurora aesthetic:
  - **Gunblood**: Target duel crosshair / revolver emblem (`Crosshair` / `Target`) with "Gunblood" label beneath.
  - **Age of War**: Historical shield and crossed swords (`Shield` / `Swords`) with "Age of War" label beneath.
  - **Bloons TD**: Dart / target pin emblem (`Target` / `CircleDot`) with "Bloons TD" label beneath.
- Icons are automatically filterable via the top search bar and searchable in Settings.

#### Sidebar Directory Routing
- **Gunblood**: Categorized under *Action & Combat* (`action`).
- **Age of War**: Categorized under *Classic and Retro* (`classic`).
- **Bloons TD**: Categorized under *Arcade & Strategy* (`arcade`).

#### In-Window Player Implementations
- **Gunblood**:
  - Embedded in window with 880px width × 520px height frame.
  - Controls guide:
    - *Mouse Hover*: Place cursor on bottom-left gun chamber to start countdown.
    - *Mouse Aim & Left Click*: Draw and fire at rival outlaw when timer sounds.
- **Age of War**:
  - Embedded in 600px height window with full unblocked HTML5 mirror.
  - Controls guide:
    - *Mouse Left Click*: Select unit deployment, upgrade base defenses, evolve era.
    - *Special Ability Button*: Call in era-specific meteor / air strikes.
- **Bloons Tower Defense**:
  - Full sandbox support (`allow-scripts`, `allow-same-origin`, `allow-modals`, `allow-popups`, `allow-forms`).
  - Controls guide:
    - *Mouse Drag & Click*: Place defense towers along track.
    - *Click Tower*: Upgrade attack speed, pierce, and range.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Gunblood Ruffle Architecture**
  - *Chosen Approach*: Ruffle HTML5 Flash runner embedded in a sanitized iframe wrapper pointing to the SWF source, ensuring instant execution on modern Chromebooks and Chrome browsers without NPAPI Flash plugins.
  - *Why*: Modern browsers removed native Adobe Flash Player; Ruffle compiles Flash Bytecode into WebAssembly (Wasm) and WebGL directly in-browser.

- **Decision 2: Age of War Mirror Resolution**
  - *Chosen Approach*: Utilize verified unblocked HTML5 mirror (`unblockedgames76.gitlab.io/age-of-war/` or `html5.gamedistribution.com/rvvASMiM/...`) while setting the frame attributes matching the user's requested `height="600px"` and `scrolling="no"`.
  - *Why*: The local path `/age-of-war.embedgame` produces a 404 in isolated hosting environments.

---

### 4. Technical Architecture & Modifications

```
┌─────────────────────────────────────────────────────────────┐
│ games.json (/src/data/games.json & /public/games.json)      │
│   ├─ Add "gunblood" (Action, Ruffle SWF runner)             │
│   ├─ Add "age-of-war" (Classic, HTML5 unblocked mirror)     │
│   └─ Add "bloons-td" (Arcade, CrazyGames Ruffle embed)      │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ DesktopView.jsx                                             │
│   ├─ Add getAppIcon handlers for gunblood, age-of-war,      │
│   │   and bloons-td                                         │
│   └─ Support sandbox & allow attributes for CrazyGames      │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ Sidebar.jsx                                                 │
│   └─ Add getGameIcon handlers for all 3 new titles          │
└─────────────────────────────────────────────────────────────┘
```

---

### 5. Verification Plan

1. **Compilation Check**: Run `compile_applet` and `lint_applet` (`vite build`) to verify bundle integrity.
2. **Interaction Verification**:
   - Verify Gunblood appears on the desktop grid and launches in 880×520px window with Ruffle Flash player.
   - Verify Age of War launches cleanly with working sound and controls at 600px.
   - Verify Bloons Tower Defense loads with all required iframe permissions.
   - Confirm Confront, Happy Room, Happy Wheels, Duck.ai, Settings, and Account remain fully functional.
