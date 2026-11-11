import Phaser from 'phaser';
import { GAME_HEIGHT } from '../config/gameConfig';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create(): void {
    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width, height, 0x143a42);
    this.add.rectangle(width / 2, height / 2 + 95, width, 230, 0x245d50);
    this.add.rectangle(width / 2, height / 2 + 160, width, 100, 0x39724e);
    for (let i = 0; i < 18; i += 1) {
      const x = (i * 83 + 24) % width;
      const y = 270 + ((i * 47) % 210);
      this.add.circle(x, y, 12 + (i % 3) * 4, i % 2 ? 0x174b3e : 0x236344);
    }
    this.add.text(width / 2, 85, 'ANIMON', {
      fontFamily: 'Georgia, serif', fontSize: '72px', color: '#ffd66b',
      stroke: '#302344', strokeThickness: 10, fontStyle: 'bold',
    }).setOrigin(0.5);
    this.add.text(width / 2, 145, 'LEGENDS OF ANTIQUE', {
      fontFamily: 'Georgia, serif', fontSize: '24px', color: '#fff1c8',
      stroke: '#302344', strokeThickness: 5, letterSpacing: 4,
    }).setOrigin(0.5);
    this.add.text(width / 2, 205, 'A MONSTER-CATCHING ADVENTURE', {
      fontSize: '13px', color: '#d8f2dc', letterSpacing: 3,
    }).setOrigin(0.5);

    this.makeButton(width / 2, 330, 'NEW GAME', () => this.scene.start('WorldScene'));
    const continueButton = this.add.text(width / 2, 382, 'CONTINUE  •  COMING SOON', {
      fontSize: '16px', color: '#9eb4a8',
    }).setOrigin(0.5);
    this.makeButton(width / 2, 430, 'CREDITS', () => {
      this.add.text(width / 2, 480, 'An original adventure inspired by Antique, Philippines.', {
        fontSize: '12px', color: '#fff1c8',
      }).setOrigin(0.5);
    });
    continueButton.setAlpha(0.8);

    this.add.text(width / 2, height - 22, 'PHASE 1 PROTOTYPE', {
      fontSize: '11px', color: '#c6dfd0', letterSpacing: 2,
    }).setOrigin(0.5);
    this.cameras.main.setBackgroundColor('#143a42');
  }

  private makeButton(x: number, y: number, label: string, action: () => void): void {
    const button = this.add.text(x, y, label, {
      fontSize: '19px', color: '#fff3cf', backgroundColor: '#713f35',
      padding: { x: 22, y: 10 }, fontStyle: 'bold',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    button.on('pointerover', () => button.setStyle({ color: '#ffe07a', backgroundColor: '#92543e' }));
    button.on('pointerout', () => button.setStyle({ color: '#fff3cf', backgroundColor: '#713f35' }));
    button.on('pointerdown', action);
  }
}
