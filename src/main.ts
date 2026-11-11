import Phaser from 'phaser';
import { gameConfig } from './config/gameConfig';
import { BootScene } from './scenes/BootScene';
import { PreloadScene } from './scenes/PreloadScene';
import { MenuScene } from './scenes/MenuScene';
import { WorldScene } from './scenes/WorldScene';
import { PauseScene } from './scenes/PauseScene';
import { BattleScene } from './scenes/BattleScene';
import { PartyScene } from './scenes/PartyScene';
import './styles/game.css';

new Phaser.Game({
  ...gameConfig,
  parent: 'app',
  scene: [BootScene, PreloadScene, MenuScene, WorldScene, PauseScene, BattleScene, PartyScene],
});
