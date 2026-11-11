import Phaser from 'phaser';

type Facing = 'down' | 'left' | 'right' | 'up';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  create(): void {
    this.createPlayerTextures();
    this.scene.start('MenuScene');
  }

  private createPlayerTextures(): void {
    const directions: Facing[] = ['down', 'left', 'right', 'up'];
    for (const direction of directions) {
      for (let frame = 0; frame < 3; frame += 1) {
        const graphics = this.make.graphics({ x: 0, y: 0 });
        const step = frame === 1 ? -2 : frame === 2 ? 2 : 0;
        graphics.fillStyle(0x172c32, 0.25).fillEllipse(16, 37, 19, 5);
        graphics.fillStyle(0x26394a).fillRect(8 + step, 25, 6, 10);
        graphics.fillRect(18 - step, 25, 6, 10);
        graphics.fillStyle(0x49362c).fillRect(7 + step, 33, 8, 4);
        graphics.fillRect(17 - step, 33, 8, 4);
        graphics.fillStyle(0x315b91).fillRect(7, 17, 18, 11);
        graphics.fillStyle(0xf0c49a).fillRect(9, 6, 14, 13);
        graphics.fillStyle(0xb83e35).fillRect(6, 3, 20, 7);
        graphics.fillRect(20, 6, 8, 4);
        graphics.fillStyle(0x26394a).fillRect(direction === 'left' ? 7 : 23, 19, 4, 9);
        if (direction === 'up') {
          graphics.fillStyle(0x7b3c2e).fillRect(9, 8, 14, 9);
        }
        graphics.generateTexture(`player-${direction}-${frame}`, 32, 40);
        graphics.destroy();
      }
      this.anims.create({
        key: `player-walk-${direction}`,
        frames: [0, 1, 2, 1].map((frame) => ({ key: `player-${direction}-${frame}` })),
        frameRate: 8,
        repeat: -1,
      });
    }

    const bike = this.make.graphics({ x: 0, y: 0 });
    bike.lineStyle(2, 0x273c43).strokeCircle(8, 29, 6).strokeCircle(25, 29, 6);
    bike.lineBetween(8, 29, 15, 20).lineBetween(15, 20, 25, 29);
    bike.lineBetween(15, 20, 20, 29).lineBetween(20, 29, 8, 29);
    bike.fillStyle(0xb83e35).fillRect(13, 8, 9, 12);
    bike.fillStyle(0xf0c49a).fillCircle(17, 5, 5);
    bike.fillStyle(0x315b91).fillRect(12, 18, 11, 5);
    bike.generateTexture('player-bicycle', 34, 40);
    bike.destroy();
  }
}
