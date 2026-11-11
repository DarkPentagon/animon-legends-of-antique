# Animon: Legends of Antique

An original 2D monster-catching RPG set in a fantasy world inspired by Antique, Philippines.

## Phase 1 — playable foundation

- Phaser 3 + TypeScript + Vite
- Main menu and playable village prototype
- Four-direction movement, walking and Shift-to-run
- Camera follow, world bounds and obstacle collisions
- E interaction prompt and ESC pause menu
- Responsive pixel-art canvas scaling

## Requirements

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
| E | Interact |
| Escape | Pause / resume |

Bicycle mode, creature selection, battles, quests, save slots, and multiplayer are planned for later milestones. The initial village and art are original prototype placeholders, not a finished map or final character art.

## Project structure

- `src/scenes` — Phaser scenes
- `src/entities` — player entity
- `src/config` — game configuration
- `src/systems` — reusable input and movement systems
- `src/styles` — page and canvas styling

All creature names, designs, assets, and branding will be original. Pokémon is a genre reference only; no Pokémon assets or trademarks are included.
