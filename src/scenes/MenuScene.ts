import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config/gameConfig';

type MenuAction = 'new' | 'continue' | 'settings' | 'credits';

export class MenuScene extends Phaser.Scene {
  private selectedIndex = 0;
  private menuItems: Phaser.GameObjects.Container[] = [];
  private statusText!: Phaser.GameObjects.Text;
  private hasSave = false;

  constructor() {
    super('MenuScene');
  }

  create(): void {
    this.hasSave = this.checkForSave();
    this.drawBackdrop();
    this.drawLogo();
    this.drawLandscape();
    this.drawTrainerAndCompanions();
    this.createMenu();
    this.statusText = this.add.text(28, GAME_HEIGHT - 24, 'BELISON • ANTIQUE, PHILIPPINES', {
      fontFamily: 'Georgia, serif', fontSize: '11px', color: '#e8dfb7',
      letterSpacing: 2, backgroundColor: '#183a3b', padding: { x: 8, y: 5 },
    }).setOrigin(0, 0.5).setDepth(30);
    this.add.text(GAME_WIDTH - 24, GAME_HEIGHT - 24, 'v1.7 • ANIMON LEGENDS', {
      fontSize: '10px', color: '#d5e6d1', letterSpacing: 1,
    }).setOrigin(1, 0.5).setDepth(30);

    const keyboard = this.input.keyboard;
    if (keyboard) {
      keyboard.on('keydown-UP', () => this.moveSelection(-1));
      keyboard.on('keydown-DOWN', () => this.moveSelection(1));
      keyboard.on('keydown-W', () => this.moveSelection(-1));
      keyboard.on('keydown-S', () => this.moveSelection(1));
      keyboard.on('keydown-ENTER', () => this.activateSelected());
      keyboard.on('keydown-SPACE', () => this.activateSelected());
      keyboard.on('keydown-ESC', () => this.closePanels());
    }
    this.selectItem(0);
  }

  private checkForSave(): boolean {
    try {
      const raw = localStorage.getItem('animon-legends-save-v1');
      if (!raw) return false;
      const save = JSON.parse(raw) as { party?: unknown[] };
      return Array.isArray(save.party) && save.party.length > 0;
    } catch {
      return false;
    }
  }

  private drawBackdrop(): void {
    const g = this.add.graphics();
    g.fillGradientStyle(0x193b58, 0x193b58, 0x83b8c0, 0x83b8c0, 1);
    g.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    // Sunrise and distant Antique mountain silhouettes.
    g.fillStyle(0xffd98a, 0.95).fillCircle(485, 185, 86);
    g.fillStyle(0xffefbd, 0.35).fillCircle(485, 185, 106);
    g.fillStyle(0x496f79).fillTriangle(0, 300, 220, 95, 440, 300);
    g.fillStyle(0x315c67).fillTriangle(240, 305, 520, 65, 790, 305);
    g.fillStyle(0x3c7374).fillTriangle(590, 300, 820, 130, 1040, 300);
    g.fillStyle(0x387d79).fillRect(0, 280, GAME_WIDTH, 260);
    g.fillStyle(0x3c9da2).fillRect(0, 360, GAME_WIDTH, 180);
    // Sea inlet and the curving river.
    g.fillStyle(0x287d9b).fillEllipse(730, 355, 540, 105);
    g.fillStyle(0x64c0bb).fillEllipse(720, 348, 470, 54);
    g.fillStyle(0x3c9da2).fillEllipse(690, 344, 420, 32);
    g.fillStyle(0x6a9c58).fillRect(0, 400, GAME_WIDTH, 140);
    g.fillStyle(0x8dbb69).fillRect(0, 454, GAME_WIDTH, 86);
    // Rice-field terraces.
    for (let i = 0; i < 6; i += 1) {
      g.lineStyle(3, i % 2 ? 0xb3ca75 : 0xd1d18a, 0.8);
      g.beginPath();
      g.moveTo(0, 415 + i * 20);
      g.lineTo(440, 392 + i * 17);
      g.lineTo(760, 420 + i * 17);
      g.strokePath();
    }
    // A small coastal town and church silhouette.
    g.fillStyle(0xf0dfbd).fillRect(650, 342, 45, 44);
    g.fillStyle(0xb96e4d).fillTriangle(643, 343, 673, 315, 702, 343);
    g.fillStyle(0xf5e8c9).fillRect(755, 322, 27, 68);
    g.fillStyle(0xb96e4d).fillTriangle(751, 322, 768, 293, 786, 322);
    g.fillStyle(0x4c6b62).fillRect(767, 306, 2, 10);
    // Palm silhouettes framing the scene.
    this.drawPalm(g, 44, 332, 1.25);
    this.drawPalm(g, 900, 375, 0.9);
    // Foreground flowers.
    for (let i = 0; i < 7; i += 1) {
      const x = 25 + i * 32;
      g.fillStyle(0x39714a).fillRect(x + 7, 468, 3, 40);
      g.fillStyle(i % 2 ? 0xf18b8c : 0xffc0a0).fillCircle(x + 8, 466, 9);
      g.fillStyle(0xffe39a).fillCircle(x + 8, 466, 3);
    }
    g.destroy();
  }

  private drawPalm(g: Phaser.GameObjects.Graphics, x: number, y: number, scale: number): void {
    g.lineStyle(8 * scale, 0x594b3a).lineBetween(x, y, x - 7 * scale, y - 150 * scale);
    for (let i = 0; i < 7; i += 1) {
      const angle = -Math.PI + i * Math.PI / 6;
      const endX = x - 7 * scale + Math.cos(angle) * 75 * scale;
      const endY = y - 150 * scale + Math.sin(angle) * 48 * scale;
      g.lineStyle(7 * scale, 0x285b46).lineBetween(x - 7 * scale, y - 150 * scale, endX, endY);
    }
  }

  private drawLandscape(): void {
    // Decorative stone bridge across the inlet.
    const g = this.add.graphics();
    g.fillStyle(0xd5bd8b).fillRect(520, 350, 210, 12);
    g.fillStyle(0x8c7657).fillRect(535, 362, 10, 20);
    g.fillRect(700, 362, 10, 20);
    g.lineStyle(4, 0xe8d7ae).strokeLineShape(new Phaser.Geom.Line(520, 350, 730, 350));
    // Foreground ledge.
    g.fillStyle(0x6a5947).fillRect(35, 490, 520, 50);
    g.fillStyle(0xc9ae79).fillRect(35, 485, 520, 9);
    g.destroy();
  }

  private drawTrainerAndCompanions(): void {
    const trainer = this.add.container(210, 398).setDepth(8);
    trainer.add([
      this.add.ellipse(0, 73, 70, 14, 0x1c3a36, 0.3),
      this.add.rectangle(-13, 44, 17, 46, 0x293c4e),
      this.add.rectangle(12, 44, 17, 46, 0x293c4e),
      this.add.rectangle(0, 6, 54, 62, 0x315d91).setStrokeStyle(3, 0x203e4f),
      this.add.rectangle(0, -48, 43, 42, 0xf0c49a).setStrokeStyle(2, 0x5b4436),
      this.add.rectangle(-1, -70, 52, 13, 0xb94d49),
      this.add.rectangle(23, -64, 20, 7, 0xb94d49),
      this.add.rectangle(-1, 15, 43, 39, 0x8c5a35).setStrokeStyle(2, 0x573b2b),
      this.add.star(-1, 13, 8, 5, 10, 0xf2c45d),
    ]);
    // Three original companion silhouettes with elemental palettes.
    this.drawCompanion(105, 455, 0x91c94f, 'leaf');
    this.drawCompanion(280, 455, 0xf28c3d, 'fire');
    this.drawCompanion(385, 455, 0x5caee0, 'water');
  }

  private drawCompanion(x: number, y: number, color: number, kind: string): void {
    const c = this.add.container(x, y).setDepth(9);
    c.add([
      this.add.ellipse(0, 22, 58, 12, 0x1c3a36, 0.25),
      this.add.ellipse(0, 0, 49, 37, color).setStrokeStyle(3, 0x263f3d),
      this.add.circle(13, -15, 19, color).setStrokeStyle(3, 0x263f3d),
      this.add.circle(19, -17, 4, 0xffffff),
      this.add.circle(20, -17, 2, 0x26333a),
      this.add.triangle(-17, -20, -25, -42, -3, -29, 5, -43, kind === 'fire' ? 0xf6b84c : kind === 'water' ? 0x9bd7f2 : 0x6eaa42),
    ]);
    if (kind === 'leaf') {
      c.add(this.add.ellipse(-12, -34, 17, 28, 0x7ebd46, 0).setStrokeStyle(4, 0x7ebd46).setAngle(-35));
    } else if (kind === 'fire') {
      c.add(this.add.star(-25, -5, 5, 5, 13, 0xf7c45b));
    } else {
      c.add(this.add.ellipse(-23, -20, 15, 28, 0x9bd7f2, 0).setStrokeStyle(4, 0x9bd7f2).setAngle(-30));
    }
  }

  private drawLogo(): void {
    this.add.text(370, 54, 'ANIMON', {
      fontFamily: 'Georgia, serif', fontSize: '64px', color: '#ffd76b',
      stroke: '#17354b', strokeThickness: 10, fontStyle: 'bold',
      shadow: { color: '#172e3c', blur: 0, offsetX: 4, offsetY: 5, fill: true },
    }).setOrigin(0.5).setDepth(20);
    this.add.text(370, 105, 'LEGENDS OF ANTIQUE', {
      fontFamily: 'Georgia, serif', fontSize: '19px', color: '#fff0ca',
      stroke: '#4b332c', strokeThickness: 5, letterSpacing: 3,
    }).setOrigin(0.5).setDepth(20);
    this.add.text(370, 138, '✦  A JOURNEY THROUGH THE HIDDEN ISLANDS  ✦', {
      fontSize: '9px', color: '#e6f1d9', letterSpacing: 2,
    }).setOrigin(0.5).setDepth(20);
  }

  private createMenu(): void {
    const items: { label: string; action: MenuAction; enabled: boolean }[] = [
      { label: 'NEW GAME', action: 'new', enabled: true },
      { label: 'CONTINUE', action: 'continue', enabled: this.hasSave },
      { label: 'SETTINGS', action: 'settings', enabled: true },
      { label: 'CREDITS', action: 'credits', enabled: true },
    ];
    items.forEach((item, index) => {
      const y = 235 + index * 58;
      const panel = this.add.container(755, y).setDepth(25);
      const plate = this.add.rectangle(0, 0, 310, 46, 0x142b43, 0.94)
        .setStrokeStyle(2, 0xd8b66c);
      const label = this.add.text(12, 0, item.enabled ? item.label : 'CONTINUE  •  NO SAVE', {
        fontFamily: 'Georgia, serif', fontSize: '17px',
        color: item.enabled ? '#fff1d0' : '#84969a', fontStyle: 'bold',
      }).setOrigin(0.5);
      const marker = this.add.triangle(-130, 0, 0, -11, 19, 0, 0, 11, 0xffd66b).setVisible(false);
      panel.add([plate, marker, label]);
      if (item.enabled) {
        plate.setInteractive({ useHandCursor: true });
        plate.on('pointerover', () => this.selectItem(index));
        plate.on('pointerdown', () => this.runAction(item.action));
      }
      this.menuItems.push(panel);
    });
  }

  private selectItem(index: number): void {
    const enabled = this.menuItems.map((_, i) => i).filter((i) => i !== 1 || this.hasSave);
    this.selectedIndex = enabled.includes(index) ? index : 0;
    this.menuItems.forEach((panel, i) => {
      const plate = panel.getAt(0) as Phaser.GameObjects.Rectangle;
      const marker = panel.getAt(1) as Phaser.GameObjects.Triangle;
      const label = panel.getAt(2) as Phaser.GameObjects.Text;
      const selected = i === this.selectedIndex;
      plate.setFillStyle(selected ? 0x236c91 : 0x142b43, selected ? 1 : 0.94);
      plate.setStrokeStyle(selected ? 4 : 2, selected ? 0xffdf82 : 0xd8b66c);
      marker.setVisible(selected);
      label.setColor(selected ? '#ffe18a' : (i === 1 && !this.hasSave ? '#84969a' : '#fff1d0'));
    });
  }

  private moveSelection(direction: number): void {
    const enabled = this.menuItems.map((_, i) => i).filter((i) => i !== 1 || this.hasSave);
    const current = enabled.indexOf(this.selectedIndex);
    this.selectItem(enabled[(current + direction + enabled.length) % enabled.length]);
  }

  private activateSelected(): void {
    const action: MenuAction[] = ['new', 'continue', 'settings', 'credits'];
    if (this.selectedIndex === 1 && !this.hasSave) return;
    this.runAction(action[this.selectedIndex]);
  }

  private runAction(action: MenuAction): void {
    if (action === 'new' || action === 'continue') {
      this.scene.start('WorldScene');
      return;
    }
    if (action === 'settings') this.openSettings();
    if (action === 'credits') this.openCredits();
  }

  private openSettings(): void {
    this.closePanels();
    const panel = this.add.container(GAME_WIDTH / 2, GAME_HEIGHT / 2).setDepth(60);
    panel.add([
      this.add.rectangle(0, 0, 430, 220, 0x102b3d, 0.98).setStrokeStyle(3, 0xe0bf78),
      this.add.text(0, -75, 'SETTINGS', { fontSize: '27px', color: '#ffdf8b', fontStyle: 'bold' }).setOrigin(0.5),
      this.add.text(0, -20, 'Movement: WASD or Arrow Keys', { fontSize: '15px', color: '#fff1d0' }).setOrigin(0.5),
      this.add.text(0, 12, 'Interact: E     •     Run: SHIFT     •     Bicycle: B', { fontSize: '13px', color: '#fff1d0' }).setOrigin(0.5),
      this.add.text(0, 44, 'Party: P     •     Pause: ESC', { fontSize: '13px', color: '#fff1d0' }).setOrigin(0.5),
    ]);
    const close = this.add.text(0, 83, 'CLOSE', { fontSize: '16px', color: '#ffdf8b', backgroundColor: '#754638', padding: { x: 16, y: 7 } }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    close.on('pointerdown', () => { panel.destroy(); });
    panel.add(close);
    this.input.keyboard?.once('keydown-ESC', () => { panel.destroy(); this.settingsOpen = false; });
  }

  private openCredits(): void {
    this.closePanels();
    const panel = this.add.container(GAME_WIDTH / 2, GAME_HEIGHT / 2).setDepth(60);
    panel.add([
      this.add.rectangle(0, 0, 430, 205, 0x102b3d, 0.98).setStrokeStyle(3, 0xe0bf78),
      this.add.text(0, -62, 'CREDITS', { fontSize: '27px', color: '#ffdf8b', fontStyle: 'bold' }).setOrigin(0.5),
      this.add.text(0, -13, 'An original monster-catching adventure', { fontSize: '15px', color: '#fff1d0' }).setOrigin(0.5),
      this.add.text(0, 17, 'Inspired by the landscapes and culture of Antique,', { fontSize: '12px', color: '#fff1d0' }).setOrigin(0.5),
      this.add.text(0, 38, 'Western Visayas, Philippines.', { fontSize: '12px', color: '#fff1d0' }).setOrigin(0.5),
    ]);
    const close = this.add.text(0, 76, 'BACK', { fontSize: '16px', color: '#ffdf8b', backgroundColor: '#754638', padding: { x: 16, y: 7 } }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    close.on('pointerdown', () => { panel.destroy(); });
    panel.add(close);
    this.input.keyboard?.once('keydown-ESC', () => { panel.destroy(); this.creditsOpen = false; });
  }

  private closePanels(): void {
    this.children.list.filter((child) => child.depth === 60).forEach((child) => child.destroy());
  }
}
