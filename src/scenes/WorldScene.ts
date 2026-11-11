import Phaser from 'phaser';
import { GAME_HEIGHT } from '../config/gameConfig';
import { Player } from '../entities/Player';

export class WorldScene extends Phaser.Scene {
  private player!: Player;
  private interactKey!: Phaser.Input.Keyboard.Key;
  private pauseKey!: Phaser.Input.Keyboard.Key;
  private message!: Phaser.GameObjects.Text;

  constructor() {
    super('WorldScene');
  }

  create(): void {
    this.physics.world.setBounds(0, 0, 1800, 1200);
    this.drawVillage();
    this.player = new Player(this, 460, 330);
    this.physics.world.setBoundsCollision(true, true, true, true);

    const obstacles = this.physics.add.staticGroup();
    this.addObstacle(obstacles, 270, 235, 170, 100);
    this.addObstacle(obstacles, 720, 210, 150, 100);
    this.addObstacle(obstacles, 1050, 420, 190, 110);
    this.addObstacle(obstacles, 1360, 260, 170, 100);
    this.physics.add.collider(this.player, obstacles);

    this.cameras.main.setBounds(0, 0, 1800, 1200);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setZoom(1);

    const keyboard = this.input.keyboard;
    if (!keyboard) throw new Error('Keyboard input is unavailable.');
    this.interactKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.pauseKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.message = this.add.text(0, 0, '', {
      fontSize: '14px', color: '#fff5d6', backgroundColor: '#182f31',
      padding: { x: 12, y: 8 },
    }).setScrollFactor(0).setDepth(100).setVisible(false);

    this.add.text(16, 16, 'FANTASY BELISON  •  VILLAGE OUTSKIRTS', {
      fontSize: '13px', color: '#fff4d4', backgroundColor: '#173b42',
      padding: { x: 10, y: 7 },
    }).setScrollFactor(0).setDepth(100);
    this.add.text(16, GAME_HEIGHT - 24, 'WASD / ARROWS: MOVE    SHIFT: RUN    E: INTERACT    ESC: PAUSE', {
      fontSize: '11px', color: '#fff4d4', backgroundColor: '#173b42',
      padding: { x: 8, y: 5 },
    }).setScrollFactor(0).setDepth(100);
  }

  update(): void {
    this.player.update();
    if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
      this.scene.launch('PauseScene');
      this.scene.pause();
    }
    if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
      this.message.setText('The village path leads to new adventures!').setVisible(true);
      this.time.delayedCall(2200, () => this.message?.setVisible(false));
    }
  }

  private drawVillage(): void {
    const g = this.add.graphics();
    g.fillStyle(0x6eaa62).fillRect(0, 0, 1800, 1200);
    g.fillStyle(0x83bd70).fillRect(0, 780, 1800, 420);
    g.fillStyle(0xc9ad78).fillRect(0, 500, 1800, 120);
    g.fillRect(790, 0, 120, 1200);
    g.fillStyle(0x4a9caa).fillRect(1450, 0, 350, 1200);
    g.fillStyle(0xe4d09a).fillRect(1390, 0, 60, 1200);

    for (let i = 0; i < 42; i += 1) {
      const x = 35 + ((i * 137) % 1320);
      const y = 35 + ((i * 89) % 1080);
      if ((x > 180 && x < 370 && y > 150 && y < 320) ||
          (x > 630 && x < 810) || (x > 1000 && x < 1200 && y > 350 && y < 520)) continue;
      g.fillStyle(i % 2 ? 0x286044 : 0x34734c);
      g.fillCircle(x, y, 16 + (i % 4) * 3);
      g.fillStyle(0x8bc66d).fillCircle(x - 5, y - 5, 6);
    }

    this.drawHouse(g, 270, 235);
    this.drawHouse(g, 720, 210);
    this.drawHouse(g, 1050, 420);
    this.drawHouse(g, 1360, 260);
    g.fillStyle(0xeadcae).fillRect(410, 690, 360, 150);
    g.fillStyle(0x9a5a42).fillRect(445, 660, 290, 55);
    this.add.text(590, 755, 'COMMUNITY HALL', {
      fontSize: '15px', color: '#493c2c', fontStyle: 'bold',
    }).setOrigin(0.5);
    g.destroy();
  }

  private drawHouse(g: Phaser.GameObjects.Graphics, x: number, y: number): void {
    g.fillStyle(0x574338).fillRect(x - 72, y - 28, 144, 82);
    g.fillStyle(0xd6b879);
    g.fillTriangle(x - 88, y - 28, x, y - 92, x + 88, y - 28);
    g.fillStyle(0x80513c).fillRect(x - 14, y + 8, 28, 46);
    g.fillStyle(0xa9d5d0).fillRect(x - 55, y - 12, 25, 23);
    g.fillRect(x + 30, y - 12, 25, 23);
  }

  private addObstacle(
    group: Phaser.Physics.Arcade.StaticGroup,
    x: number, y: number, width: number, height: number,
  ): void {
    const block = this.add.rectangle(x, y, width, height, 0x000000, 0);
    this.physics.add.existing(block, true);
    group.add(block);
    (block.body as Phaser.Physics.Arcade.StaticBody).setSize(width, height);
  }
}
