import Phaser from 'phaser';

type Facing = 'down' | 'left' | 'right' | 'up';

export class Player extends Phaser.Physics.Arcade.Sprite {
  private readonly cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private readonly keys: Record<string, Phaser.Input.Keyboard.Key>;
  private readonly walkSpeed = 105;
  private readonly runSpeed = 175;
  private readonly bicycleSpeed = 255;
  private facing: Facing = 'down';
  private ridingBicycle = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player-down-0');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDepth(10);
    this.setCollideWorldBounds(true);
    this.setOrigin(0.5, 0.78);
    this.body?.setSize(16, 15);
    this.body?.setOffset(8, 24);

    const keyboard = scene.input.keyboard;
    if (!keyboard) throw new Error('Keyboard input is unavailable.');
    this.cursors = keyboard.createCursorKeys();
    this.keys = {
      W: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      SHIFT: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT),
      B: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B),
    };
  }

  get isRidingBicycle(): boolean {
    return this.ridingBicycle;
  }

  toggleBicycle(): boolean {
    this.ridingBicycle = !this.ridingBicycle;
    this.anims.stop();
    this.setTexture(this.ridingBicycle ? 'player-bicycle' : `player-${this.facing}-0`);
    this.setScale(this.ridingBicycle ? 1.08 : 1);
    return this.ridingBicycle;
  }

  update(): void {
    if (Phaser.Input.Keyboard.JustDown(this.keys.B)) this.toggleBicycle();

    const left = this.cursors.left?.isDown || this.keys.A.isDown;
    const right = this.cursors.right?.isDown || this.keys.D.isDown;
    const up = this.cursors.up?.isDown || this.keys.W.isDown;
    const down = this.cursors.down?.isDown || this.keys.S.isDown;
    const speed = this.ridingBicycle
      ? this.bicycleSpeed
      : this.keys.SHIFT.isDown ? this.runSpeed : this.walkSpeed;

    let x = Number(right) - Number(left);
    let y = Number(down) - Number(up);
    const length = Math.hypot(x, y);
    if (length > 0) {
      x /= length;
      y /= length;
      if (Math.abs(x) > Math.abs(y)) this.facing = x < 0 ? 'left' : 'right';
      else this.facing = y < 0 ? 'up' : 'down';
      this.setVelocity(x * speed, y * speed);
      if (!this.ridingBicycle) this.anims.play(`player-walk-${this.facing}`, true);
      else this.setTexture('player-bicycle');
    } else {
      this.setVelocity(0, 0);
      this.anims.stop();
      if (!this.ridingBicycle) this.setTexture(`player-${this.facing}-0`);
    }
  }
}
