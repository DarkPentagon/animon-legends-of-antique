import Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  create(): void {
    this.createPlayerTexture();
    this.scene.start('MenuScene');
  }

  private createPlayerTexture(): void {
    const graphics = this.make.graphics({ x: 0, y: 0 });
    graphics.fillStyle(0x25364b);
    graphics.fillRect(5, 4, 22, 27);
    graphics.fillStyle(0xf1c49a);
    graphics.fillRect(9, 7, 14, 12);
    graphics.fillStyle(0xb83e35);
    graphics.fillRect(7, 2, 18, 7);
    graphics.fillRect(21, 5, 8, 4);
    graphics.fillStyle(0x315b91);
    graphics.fillRect(7, 20, 18, 10);
    graphics.fillStyle(0x47352d);
    graphics.fillRect(7, 29, 8, 5);
    graphics.fillRect(18, 29, 8, 5);
    graphics.generateTexture('player-placeholder', 34, 36);
    graphics.destroy();
  }
}
