import Phaser from 'phaser';
import { getAnimon } from '../data/animon';
import { PartyStore } from '../systems/partyStore';
import { GAME_HEIGHT, GAME_WIDTH } from '../config/gameConfig';

export class PartyScene extends Phaser.Scene {
  private numberKeys: Phaser.Input.Keyboard.Key[] = [];
  private escapeKey!: Phaser.Input.Keyboard.Key;
  private partyKey!: Phaser.Input.Keyboard.Key;

  constructor() { super('PartyScene'); }

  create(): void {
    const keyboard = this.input.keyboard;
    if (!keyboard) throw new Error('Keyboard input unavailable');
    this.numberKeys = [
      Phaser.Input.Keyboard.KeyCodes.ONE, Phaser.Input.Keyboard.KeyCodes.TWO,
      Phaser.Input.Keyboard.KeyCodes.THREE, Phaser.Input.Keyboard.KeyCodes.FOUR,
      Phaser.Input.Keyboard.KeyCodes.FIVE, Phaser.Input.Keyboard.KeyCodes.SIX,
    ].map((code) => keyboard.addKey(code));
    this.escapeKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.partyKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x173b42);
    this.add.text(GAME_WIDTH / 2, 34, 'YOUR ANIMON PARTY', {
      fontSize: '25px', color: '#fff4d4', fontStyle: 'bold',
    }).setOrigin(0.5);
    const members = PartyStore.members();
    members.forEach((member, index) => {
      const species = getAnimon(member.speciesId);
      const y = 105 + index * 62;
      const active = index === PartyStore.activeIndex();
      this.add.rectangle(GAME_WIDTH / 2, y, 760, 52, active ? 0x477d5a : 0x28545a)
        .setStrokeStyle(active ? 3 : 1, active ? 0xe8d69b : 0x6d9690);
      this.add.circle(145, y, 15, species.color);
      this.add.text(180, y - 15,
        `${index + 1}. ${species.name}  •  Lv. ${member.level}  •  ${species.element}`,
        { fontSize: '16px', color: '#fff4d4', fontStyle: active ? 'bold' : 'normal' });
      const hp = member.hp <= 0 ? 'FAINTED' : `HP ${member.hp}/${species.maxHp + (member.level - 1) * 2}`;
      this.add.text(700, y - 10, hp, { fontSize: '14px', color: member.hp > 0 ? '#d9f0ce' : '#ffb4a8' }).setOrigin(0.5);
      this.add.text(180, y + 8, `EXP ${member.xp}/${member.level * 20}`, { fontSize: '11px', color: '#c4d9c9' });
    });
    this.add.text(GAME_WIDTH / 2, 490, 'PRESS 1–6 TO SET ACTIVE ANIMON     ESC / P TO RETURN',
      { fontSize: '14px', color: '#fff4d4' }).setOrigin(0.5);
    this.add.text(GAME_WIDTH / 2, 520, `Capture orbs: ${PartyStore.captureOrbs}  •  Party: ${members.length}/6`,
      { fontSize: '12px', color: '#b9d4ca' }).setOrigin(0.5);
  }

  update(): void {
    for (let index = 0; index < this.numberKeys.length; index += 1) {
      if (Phaser.Input.Keyboard.JustDown(this.numberKeys[index])) {
        const member = PartyStore.members()[index];
        if (!member) continue;
        const name = getAnimon(member.speciesId).name;
        const changed = PartyStore.setActive(index);
        this.closeScene(changed ? `${name} is now your active Animon.` : 'A fainted Animon cannot battle. Visit Mila to heal your party.');
        return;
      }
    }
    if (Phaser.Input.Keyboard.JustDown(this.escapeKey) || Phaser.Input.Keyboard.JustDown(this.partyKey)) {
      this.closeScene('');
    }
  }

  private closeScene(message: string): void {
    this.scene.stop();
    this.scene.resume('WorldScene');
    if (message) this.scene.get('WorldScene').events.emit('battle-finished', message);
  }
}
