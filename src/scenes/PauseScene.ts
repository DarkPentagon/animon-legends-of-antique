import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config/gameConfig';

export class PauseScene extends Phaser.Scene {
  constructor() {
    super('PauseScene');
  }

  create(): void {
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x071b20, 0.78);
    this.add.text(GAME_WIDTH / 2, 175, 'PAUSED', {
      fontSize: '46px', color: '#ffda78', fontStyle: 'bold',
    }).setOrigin(0.5);
    this.add.text(GAME_WIDTH / 2, 225, 'Take a breath, adventurer.', {
      fontSize: '16px', color: '#fff1cf',
    }).setOrigin(0.5);
    this.addButton(300, 'RESUME', () => {
      this.scene.stop();
      this.scene.resume('WorldScene');
    });
    this.addButton(365, 'MAIN MENU', () => {
      this.scene.stop('WorldScene');
      this.scene.start('MenuScene');
    });
    this.input.keyboard?.once('keydown-ESC', () => {
      this.scene.stop();
      this.scene.resume('WorldScene');
    });
  }

  private addButton(y: number, label: string, action: () => void): void {
    const button = this.add.text(GAME_WIDTH / 2, y, label, {
      fontSize: '19px', color: '#fff3cf', backgroundColor: '#713f35',
      padding: { x: 24, y: 10 }, fontStyle: 'bold',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    button.on('pointerover', () => button.setColor('#ffe07a'));
    button.on('pointerout', () => button.setColor('#fff3cf'));
    button.on('pointerdown', action);
  }
}
