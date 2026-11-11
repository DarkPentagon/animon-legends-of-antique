import Phaser from 'phaser';
import { GAME_HEIGHT } from '../config/gameConfig';
import { Player } from '../entities/Player';
import { PartyStore } from '../systems/partyStore';

const CHEST_KEY = 'animon-forest-chest-v1';

export class ForestScene extends Phaser.Scene {
  private player!: Player;
  private interactKey!: Phaser.Input.Keyboard.Key;
  private partyKey!: Phaser.Input.Keyboard.Key;
  private message!: Phaser.GameObjects.Text;
  private encounterCooldown = 0;
  private chestClaimed = false;

  constructor() { super('ForestScene'); }

  create(): void {
    this.physics.world.setBounds(0, 0, 1500, 1050);
    this.drawForest();
    this.player = new Player(this, 150, 520);
    const obstacles = this.physics.add.staticGroup();
    for (let i = 0; i < 48; i += 1) {
      const x = 220 + ((i * 173) % 1190);
      const y = 35 + ((i * 97) % 950);
      if ((x < 430 && y > 420 && y < 630) || (x > 950 && y > 650)) continue;
      const tree = this.add.rectangle(x, y, 30, 24, 0x000000, 0);
      this.physics.add.existing(tree, true);
      obstacles.add(tree);
    }
    this.physics.add.collider(this.player, obstacles);
    this.chestClaimed = localStorage.getItem(CHEST_KEY) === 'claimed';
    const keyboard = this.input.keyboard;
    if (!keyboard) throw new Error('Keyboard input is unavailable.');
    this.interactKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.partyKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    this.message = this.add.text(0, 0, '', {
      fontSize: '14px', color: '#fff5d6', backgroundColor: '#182f31',
      padding: { x: 12, y: 8 }, wordWrap: { width: 520 },
    }).setScrollFactor(0).setDepth(100).setVisible(false);
    this.add.text(16, 16, 'ANTIQUE WILDS  •  SUNDERING FOREST', {
      fontSize: '13px', color: '#fff4d4', backgroundColor: '#173b42',
      padding: { x: 10, y: 7 },
    }).setScrollFactor(0).setDepth(100);
    this.add.text(16, GAME_HEIGHT - 24, 'WASD / ARROWS: MOVE   SHIFT: RUN   B: BICYCLE   E: OPEN CHEST / RETURN   P: PARTY   GRASS: WILD ANIMON', {
      fontSize: '11px', color: '#fff4d4', backgroundColor: '#173b42',
      padding: { x: 8, y: 5 },
    }).setScrollFactor(0).setDepth(100);
    this.cameras.main.setBounds(0, 0, 1500, 1050);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.showMessage('The Sundering Forest begins here. Search the clearing for a supply chest, and watch the tall grass!', 4200);
  }

  update(): void {
    this.player.update();
    this.encounterCooldown = Math.max(0, this.encounterCooldown - this.game.loop.delta);
    const inGrass = Phaser.Geom.Rectangle.Contains(new Phaser.Geom.Rectangle(650, 280, 520, 390), this.player.x, this.player.y);
    if (inGrass && Boolean(this.player.body?.velocity.length()) && !this.player.isRidingBicycle &&
        this.encounterCooldown <= 0 && Math.random() < 0.022) {
      this.encounterCooldown = 6500;
      const speciesId = Phaser.Math.RND.pick(['mossprout', 'embercub', 'tidefin', 'thornhare', 'ashwing', 'brooklet']);
      this.scene.launch('BattleScene', { speciesId });
      this.scene.pause();
      return;
    }
    if (Phaser.Input.Keyboard.JustDown(this.partyKey)) {
      this.scene.launch('PartyScene');
      this.scene.pause();
      return;
    }
    if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
      if (Phaser.Math.Distance.Between(this.player.x, this.player.y, 1100, 760) < 90) {
        if (this.chestClaimed) this.showMessage('The supply chest is empty. You have already collected its reward.', 2600);
        else {
          this.chestClaimed = true;
          localStorage.setItem(CHEST_KEY, 'claimed');
          PartyStore.grantCaptureOrbs(3);
          this.showMessage('You opened the forest supply chest and found 3 capture orbs!', 3200);
        }
      } else if (Phaser.Math.Distance.Between(this.player.x, this.player.y, 115, 520) < 100) {
        this.scene.start('WorldScene');
      } else this.showMessage('Nothing nearby. Look for the chest in the eastern clearing or the village trail to the west.', 2400);
    }
  }

  private showMessage(message: string, duration: number): void {
    this.message.setText(message).setVisible(true);
    this.time.delayedCall(duration, () => this.message.setVisible(false));
  }

  private drawForest(): void {
    const g = this.add.graphics();
    g.fillStyle(0x315f45).fillRect(0, 0, 1500, 1050);
    g.fillStyle(0x9a9360).fillRect(0, 455, 1500, 135);
    g.fillStyle(0x477b50).fillRect(650, 280, 520, 390);
    for (let i = 0; i < 130; i += 1) {
      const x = 660 + ((i * 41) % 500);
      const y = 290 + ((i * 67) % 370);
      g.lineStyle(2, i % 2 ? 0xa4c76b : 0x6eaa62).lineBetween(x, y + 8, x + 4, y - 7);
    }
    for (let i = 0; i < 48; i += 1) {
      const x = 220 + ((i * 173) % 1190);
      const y = 35 + ((i * 97) % 950);
      if ((x < 430 && y > 420 && y < 630) || (x > 950 && y > 650)) continue;
      g.fillStyle(i % 2 ? 0x174b37 : 0x236343).fillCircle(x, y, 24 + (i % 3) * 5);
      g.fillStyle(0x57965a).fillCircle(x - 7, y - 8, 9);
    }
    g.fillStyle(0x9b633e).fillRect(1065, 740, 70, 42);
    g.fillStyle(0xd9a84f).fillRect(1070, 735, 60, 12);
    g.fillStyle(0xf6df9d).fillRect(1094, 748, 12, 8);
    this.add.text(1100, 710, 'SUPPLY CHEST', { fontSize: '12px', color: '#fff4d4', backgroundColor: '#315b3c', padding: { x: 5, y: 3 } }).setOrigin(0.5);
    this.add.text(115, 480, '← BELISON VILLAGE', { fontSize: '12px', color: '#fff4d4', backgroundColor: '#315b3c', padding: { x: 5, y: 3 } }).setOrigin(0.5);
    this.add.text(910, 260, 'WILD GRASS', { fontSize: '13px', color: '#fff4d4', backgroundColor: '#315b3c', padding: { x: 6, y: 3 } }).setOrigin(0.5);
    g.destroy();
  }
}
