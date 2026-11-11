import Phaser from 'phaser';
import { GAME_HEIGHT } from '../config/gameConfig';
import { Player } from '../entities/Player';
import { PartyStore } from '../systems/partyStore';

interface VillageCharacter {
  x: number;
  y: number;
  name: string;
  dialogue: string[];
  color: number;
}

export class WorldScene extends Phaser.Scene {
  private player!: Player;
  private interactKey!: Phaser.Input.Keyboard.Key;
  private pauseKey!: Phaser.Input.Keyboard.Key;
  private partyKey!: Phaser.Input.Keyboard.Key;
  private message!: Phaser.GameObjects.Text;
  private messageTimer?: Phaser.Time.TimerEvent;
  private characters: VillageCharacter[] = [];
  private dialogueIndex = new Map<string, number>();
  private encounterCooldown = 0;
  private encounterZone!: Phaser.Geom.Rectangle;

  constructor() {
    super('WorldScene');
  }

  create(): void {
    this.physics.world.setBounds(0, 0, 1800, 1200);
    this.drawVillage();
    this.encounterZone = new Phaser.Geom.Rectangle(1080, 700, 280, 330);
    this.player = new Player(this, 460, 330);
    this.physics.world.setBoundsCollision(true, true, true, true);

    const obstacles = this.physics.add.staticGroup();
    this.addObstacle(obstacles, 270, 235, 170, 100);
    this.addObstacle(obstacles, 720, 210, 150, 100);
    this.addObstacle(obstacles, 1050, 420, 190, 110);
    this.addObstacle(obstacles, 1360, 260, 170, 100);
    // Tree trunks and the community hall foundation have solid footprints.
    for (let i = 0; i < 42; i += 1) {
      const x = 35 + ((i * 137) % 1320);
      const y = 35 + ((i * 89) % 1080);
      if ((x > 180 && x < 370 && y > 150 && y < 320) ||
          (x > 630 && x < 810) || (x > 1000 && x < 1200 && y > 350 && y < 520)) continue;
      this.addObstacle(obstacles, x, y + 8, 22, 18);
    }
    this.addObstacle(obstacles, 590, 755, 300, 90);
    this.physics.add.collider(this.player, obstacles);

    this.createVillageCharacters();
    this.events.on('battle-finished', (result: string) => this.showMessage(result, 2600));
    this.cameras.main.setBounds(0, 0, 1800, 1200);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setZoom(1);

    const keyboard = this.input.keyboard;
    if (!keyboard) throw new Error('Keyboard input is unavailable.');
    this.interactKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.pauseKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.partyKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    this.message = this.add.text(0, 0, '', {
      fontSize: '14px', color: '#fff5d6', backgroundColor: '#182f31',
      padding: { x: 12, y: 8 }, wordWrap: { width: 520 },
    }).setScrollFactor(0).setDepth(100).setVisible(false);

    this.add.text(16, 16, 'FANTASY BELISON  •  VILLAGE OUTSKIRTS', {
      fontSize: '13px', color: '#fff4d4', backgroundColor: '#173b42',
      padding: { x: 10, y: 7 },
    }).setScrollFactor(0).setDepth(100);
    this.add.text(16, GAME_HEIGHT - 24, 'WASD / ARROWS: MOVE   SHIFT: RUN   B: BICYCLE   E: TALK / HEAL   P: PARTY   GRASS: WILD ANIMON   ESC: PAUSE', {
      fontSize: '11px', color: '#fff4d4', backgroundColor: '#173b42',
      padding: { x: 8, y: 5 },
    }).setScrollFactor(0).setDepth(100);
    this.showMessage('Welcome to Belison! Talk to the locals and explore the village. Press B to ride your bicycle.', 4200);
  }

  update(): void {
    this.player.update();
    this.encounterCooldown = Math.max(0, this.encounterCooldown - this.game.loop.delta);
    const inWildGrass = Phaser.Geom.Rectangle.Contains(this.encounterZone, this.player.x, this.player.y);
    const moving = Boolean(this.player.body?.velocity.length());
    if (inWildGrass && moving && !this.player.isRidingBicycle && this.encounterCooldown <= 0 && Math.random() < 0.018) {
      this.encounterCooldown = 6500;
      const speciesId = Phaser.Math.RND.pick(['mossprout', 'embercub', 'tidefin']);
      this.scene.launch('BattleScene', { speciesId });
      this.scene.pause();
      return;
    }
    if (Phaser.Input.Keyboard.JustDown(this.partyKey)) {
      this.scene.launch('PartyScene');
      this.scene.pause();
      return;
    }
    if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
      this.scene.launch('PauseScene');
      this.scene.pause();
    }
    if (Phaser.Input.Keyboard.JustDown(this.interactKey)) this.interact();
  }

  private createVillageCharacters(): void {
    this.characters = [
      { x: 520, y: 350, name: 'Ate Lina', color: 0xe5a45e, dialogue: ['Maayong adlaw! Welcome to our little town.', 'They say unusual Animon have been seen near the old river.', 'Keep your eyes open, trainer. Antique has many secrets.'] },
      { x: 930, y: 590, name: 'Mang Isko', color: 0x6c91c8, dialogue: ['The road beside the river leads to the wild grasslands.', 'A bicycle makes long journeys much faster. Press B to ride or park it.'] },
      { x: 570, y: 880, name: 'Nena', color: 0xc77c9a, dialogue: ['The community hall is where neighbors gather.', 'One day, trainers from all over Antique will meet here.'] },
      { x: 820, y: 850, name: 'Mila', color: 0x72b7a5, dialogue: ['Welcome to the village healing station!', 'Your Animon are all rested. I also replenished five capture orbs.'] },
    ];

    for (const character of this.characters) {
      const npc = this.add.container(character.x, character.y);
      const body = this.add.rectangle(0, 0, 22, 25, character.color).setStrokeStyle(2, 0x273b3c);
      const head = this.add.circle(0, -18, 9, 0xf0c49a).setStrokeStyle(1, 0x49362c);
      const marker = this.add.text(0, -38, character.name, {
        fontSize: '11px', color: '#fff7dc', backgroundColor: '#24454a',
        padding: { x: 4, y: 2 },
      }).setOrigin(0.5);
      npc.add([body, head, marker]).setDepth(12);
      const collider = this.add.rectangle(character.x, character.y + 5, 25, 22, 0x000000, 0);
      this.physics.add.existing(collider, true);
      this.physics.add.collider(this.player, collider);
    }
  }

  private interact(): void {
    let nearest: VillageCharacter | undefined;
    let nearestDistance = 82;
    for (const character of this.characters) {
      const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, character.x, character.y);
      if (distance < nearestDistance) {
        nearest = character;
        nearestDistance = distance;
      }
    }
    if (!nearest) {
      this.showMessage('There is no one nearby. Try approaching a villager.', 1800);
      return;
    }
    if (nearest.name === 'Mila') {
      PartyStore.healAll();
      this.showMessage('Mila: Your whole party is fully healed, and you received 5 capture orbs!', 3600);
      return;
    }
    const index = this.dialogueIndex.get(nearest.name) ?? 0;
    this.showMessage(`${nearest.name}: ${nearest.dialogue[index]}`, 3600);
    this.dialogueIndex.set(nearest.name, (index + 1) % nearest.dialogue.length);
  }

  private showMessage(message: string, duration: number): void {
    this.messageTimer?.remove(false);
    this.message.setText(message).setVisible(true);
    this.messageTimer = this.time.delayedCall(duration, () => this.message.setVisible(false));
  }

  private drawVillage(): void {
    const g = this.add.graphics();
    g.fillStyle(0x6eaa62).fillRect(0, 0, 1800, 1200);
    g.fillStyle(0x83bd70).fillRect(0, 780, 1800, 420);
    g.fillStyle(0xc9ad78).fillRect(0, 500, 1800, 120);
    g.fillRect(790, 0, 120, 1200);
    // Wild grass patch: the first place trainers can encounter Animon.
    g.fillStyle(0x4a9caa).fillRect(1450, 0, 350, 1200);
    g.fillStyle(0x4f8d48).fillRect(1080, 700, 280, 330);
    for (let i = 0; i < 90; i += 1) {
      const x = 1090 + ((i * 37) % 260);
      const y = 710 + ((i * 53) % 310);
      g.lineStyle(2, i % 2 ? 0x9bc86a : 0x6eaa62).lineBetween(x, y + 8, x + 3, y - 5);
    }
    this.add.text(1220, 690, 'WILD GRASS', { fontSize: '13px', color: '#f5edc7', backgroundColor: '#315b3c', padding: { x: 7, y: 4 } }).setOrigin(0.5);
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
