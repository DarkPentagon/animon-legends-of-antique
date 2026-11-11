# Animon: Legends of Antique

An original 2D monster-catching RPG set in a fantasy world inspired by Antique, Philippines.

## Phase 1 — playable foundation
- Phaser 3 + TypeScript + Vite
- Main menu and playable village prototype
- Four-direction movement, walking and Shift-to-run
- Camera follow, world bounds and obstacle collisions

## Phase 1.1 — village life
- Procedurally drawn, original player and bicycle textures
- Four-direction player walk animations and facing-aware idle frames
- Bicycle mode (B) with faster movement
- Three named villagers with rotating dialogue
- NPC collision and proximity-based interaction (E)
- Improved village collision footprints for trees, houses and community hall
- On-screen control guide and welcome message

## Phase 1.2 — first Animon encounters and battles\n- Three original species: Mossprout (Nature), Embercub (Fire), and Tidefin (Water)\n- Wild encounters while walking through the village grassland\n- Turn-based attack and skill actions with HP bars and damage calculations\n- Capture orbs with capture chance improved as wild Animon lose HP\n- Six-member party limit and party status view\n- Battle return flow and lead Animon HP persistence for the current play session\n\n## Requirements
- Node.js 20.19+ or 22.12+
- npm

## Run locally
```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Verify
```bash
npm run typecheck
npm run build
npm run preview
```

## Controls
| Key | Action |
| --- | --- |
| WASD / Arrow keys | Move |
| Shift | Run |
| B | Toggle bicycle |
| E | Talk to a nearby villager |\n| Walk through wild grass | Chance to encounter a wild Animon |\n| 1 / 2 | Basic attack / skill in battle |\n| C | Throw a capture orb in battle |\n| P | View party and capture orb count in battle |\n| Space | Return from battle |
| Escape | Pause / resume |

## Project structure
- `src/scenes` — Phaser scenes
- `src/entities` — player entity
- `src/config` — game configuration
- `src/systems` — reusable input and movement systems
- `src/styles` — page and canvas styling

All creature names, designs, assets, and branding will be original. Pokémon is a genre reference only; no Pokémon assets or trademarks are included.
