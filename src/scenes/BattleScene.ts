import Phaser from 'phaser';
import { getAnimon, getElementMultiplier } from '../data/animon';
import { PartyStore } from '../systems/partyStore';
import { QuestStore } from '../systems/questStore';
import type { AnimonSpecies } from '../data/animon';
import { GAME_HEIGHT, GAME_WIDTH } from '../config/gameConfig';

export class BattleScene extends Phaser.Scene {
  private wild!: AnimonSpecies;
  private wildHp = 1;
  private playerHp = 1;
  private status!: Phaser.GameObjects.Text;
  private wildBar!: Phaser.GameObjects.Rectangle;
  private playerBar!: Phaser.GameObjects.Rectangle;
  private wildSprite!: Phaser.GameObjects.Graphics;
  private heroSprite!: Phaser.GameObjects.Graphics;
  private locked = false;
  private trainerId?: string;
  private trainerName?: string;
  private keys!: { attack: Phaser.Input.Keyboard.Key; skill: Phaser.Input.Keyboard.Key; capture: Phaser.Input.Keyboard.Key; party: Phaser.Input.Keyboard.Key; back: Phaser.Input.Keyboard.Key };

  constructor() { super('BattleScene'); }

  init(data: { speciesId?: string; trainerId?: string; trainerName?: string }): void {
    this.wild = getAnimon(data.speciesId ?? 'mossprout');
    this.trainerId = data.trainerId;
    this.trainerName = data.trainerName;
    this.wildHp = this.wild.maxHp;
    const lead = PartyStore.active();
    this.playerHp = lead?.hp ?? getAnimon('spriglet').maxHp;
    this.locked = false;
  }

  create(): void {
    const keyboard = this.input.keyboard;
    if (!keyboard) throw new Error('Keyboard input unavailable');
    this.keys = {
      attack: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE),
      skill: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO),
      capture: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C),
      party: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P),
      back: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
    };

    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x9bc58b);
    this.add.rectangle(GAME_WIDTH / 2, 100, GAME_WIDTH, 150, 0x6c9c70);
    this.add.text(GAME_WIDTH / 2, 35, this.trainerName ? `TRAINER CHALLENGE  •  ${this.trainerName}` : 'WILD ANIMON ENCOUNTER', { fontSize: '22px', color: '#173b42', fontStyle: 'bold' }).setOrigin(0.5);

    this.wildSprite = this.drawCreature(680, 185, this.wild.color, this.wild.name);
    const lead = PartyStore.active();
    const hero = getAnimon(lead?.speciesId ?? 'spriglet');
    this.heroSprite = this.drawCreature(255, 330, hero.color, hero.name);

    this.add.text(535, 270, `${this.wild.name}  •  ${this.wild.element}`, { fontSize: '18px', color: '#173b42', fontStyle: 'bold' });
    this.add.text(65, 400, `${hero.name}  •  ${hero.element}`, { fontSize: '18px', color: '#173b42', fontStyle: 'bold' });
    this.add.text(535, 300, 'WILD HP', { fontSize: '12px', color: '#173b42' });
    this.add.text(65, 430, 'YOUR HP', { fontSize: '12px', color: '#173b42' });
    this.add.rectangle(650, 320, 210, 12, 0x38524a).setOrigin(0, 0.5);
    this.wildBar = this.add.rectangle(650, 320, 210, 12, 0x62ad62).setOrigin(0, 0.5);
    this.add.rectangle(180, 450, 210, 12, 0x38524a).setOrigin(0, 0.5);
    this.playerBar = this.add.rectangle(180, 450, 210, 12, 0x62ad62).setOrigin(0, 0.5);

    this.add.rectangle(GAME_WIDTH / 2, 505, GAME_WIDTH, 70, 0x173b42);
    this.status = this.add.text(24, 475, '', { fontSize: '15px', color: '#fff4d4', wordWrap: { width: 900 } });
    this.refreshStatus(`A wild ${this.wild.name} appeared! Choose your action.`);
    this.add.text(24, 520, '1 ATTACK   2 SKILL   C CAPTURE   P PARTY   SPACE RETURN', { fontSize: '13px', color: '#fff4d4' });
  }

  update(): void {
    if (this.locked) return;
    if (Phaser.Input.Keyboard.JustDown(this.keys.attack)) this.playerTurn(false);
    if (Phaser.Input.Keyboard.JustDown(this.keys.skill)) this.playerTurn(true);
    if (Phaser.Input.Keyboard.JustDown(this.keys.capture)) this.capture();
    if (Phaser.Input.Keyboard.JustDown(this.keys.party)) this.showParty();
    if (Phaser.Input.Keyboard.JustDown(this.keys.back)) this.finish('You left the encounter safely.');
  }

  private playerTurn(skill: boolean): void {
    const lead = PartyStore.active();
    const hero = getAnimon(lead?.speciesId ?? 'spriglet');
    const multiplier = getElementMultiplier(hero.element, this.wild.element);
    const damage = Math.max(2, Math.floor((hero.attack + (skill ? 5 : 0) + Phaser.Math.Between(-2, 2) - Math.floor(this.wild.defense / 2)) * multiplier));
    this.tweens.add({ targets: this.heroSprite, x: this.heroSprite.x + 28, duration: 100, yoyo: true, ease: 'Quad.Out' });
    this.tweens.add({ targets: this.wildSprite, alpha: 0.35, duration: 90, yoyo: true, repeat: 1 });
    this.wildHp = Math.max(0, this.wildHp - damage);
    this.wildBar.width = 210 * (this.wildHp / this.wild.maxHp);
    const effectiveness = multiplier > 1 ? ' It is super effective!' : multiplier < 1 ? ' It is not very effective.' : '';
    this.refreshStatus(`${hero.name} used ${skill ? hero.skills[1] : hero.skills[0]}! ${damage} damage!${effectiveness}`);
    if (this.wildHp <= 0) {
      this.locked = true;
      PartyStore.updateActiveHp(this.playerHp);
      const reward = PartyStore.awardActiveXp(12 + this.wild.maxHp);
      if (this.trainerId) QuestStore.completeTrainer(this.trainerId);
      else QuestStore.recordWildVictory();
      const levelText = reward.levels ? ` Level up! Now Lv. ${PartyStore.active()?.level}.` : '';
      const evolutionText = reward.evolution ? ` Your Animon evolved into ${reward.evolution}!` : '';
      this.time.delayedCall(900, () => this.finish(`${this.trainerName ? `${this.trainerName}'s ` : ''}${this.wild.name} was defeated! +${reward.gained} EXP.${levelText}${evolutionText}`));
      return;
    }
    this.enemyTurn();
  }

  private enemyTurn(): void {
    this.locked = true;
    this.time.delayedCall(700, () => {
      const lead = PartyStore.active();
      const hero = getAnimon(lead?.speciesId ?? 'spriglet');
      const multiplier = getElementMultiplier(this.wild.element, hero.element);
      const damage = Math.max(1, Math.floor((this.wild.attack - Math.floor(hero.defense / 2) + Phaser.Math.Between(-1, 2)) * multiplier));
      this.tweens.add({ targets: this.heroSprite, x: this.heroSprite.x - 18, duration: 90, yoyo: true, repeat: 1, ease: 'Quad.Out' });
      this.playerHp = Math.max(0, this.playerHp - damage);
      this.playerBar.width = 210 * (this.playerHp / hero.maxHp);
      PartyStore.updateActiveHp(this.playerHp);
      if (this.playerHp <= 0) {
        this.refreshStatus(`${this.wild.name} knocked out ${hero.name}. You retreat to the village.`);
        this.time.delayedCall(1200, () => this.finish('Your lead Animon needs rest. You returned to the village.'));
      } else {
        this.refreshStatus(`${this.wild.name} counterattacked for ${damage} damage. Your turn!`);
        this.locked = false;
      }
    });
  }

  private capture(): void {
    if (this.wildHp <= 0) return;
    if (!PartyStore.useCaptureOrb()) {
      this.refreshStatus('You are out of capture orbs. Visit the village to restock later.');
      return;
    }
    const chance = Phaser.Math.Clamp(0.25 + (1 - this.wildHp / this.wild.maxHp) * 0.65, 0.25, 0.9);
    if (Math.random() < chance) {
      const added = PartyStore.add(this.wild.id);
      this.locked = true;
      this.refreshStatus(added ? `Captured ${this.wild.name}! It joined your party.` : `Captured ${this.wild.name}, but your party is full. It was released.`);
      this.time.delayedCall(1200, () => this.finish('Encounter complete!'));
    } else {
      this.refreshStatus(`${this.wild.name} broke free! Capture chance was ${Math.round(chance * 100)}%.`);
      this.enemyTurn();
    }
  }

  private showParty(): void {
    const names = PartyStore.members().map((member) => {
      const species = getAnimon(member.speciesId);
      return `${species.name} (${member.hp}/${species.maxHp} HP)`;
    });
    this.refreshStatus(`Party: ${names.join(' • ')} | Capture orbs: ${PartyStore.captureOrbs}`);
  }

  private drawCreature(x: number, y: number, color: number, name: string): Phaser.GameObjects.Graphics {
    const shape = this.add.graphics();
    shape.fillStyle(0x1b3b35, 0.18).fillEllipse(x, y + 38, 120, 24);
    shape.fillStyle(color).fillEllipse(x, y, 88, 70);
    shape.fillStyle(0xffffff).fillCircle(x - 20, y - 8, 9).fillCircle(x + 20, y - 8, 9);
    shape.fillStyle(0x173b42).fillCircle(x - 20, y - 8, 4).fillCircle(x + 20, y - 8, 4);
    shape.fillStyle(0xf5d9a5).fillEllipse(x, y + 17, 34, 13);
    this.add.text(x, y + 58, name, { fontSize: '13px', color: '#173b42', fontStyle: 'bold' }).setOrigin(0.5);
    return shape;
  }

  private refreshStatus(value: string): void { this.status.setText(value); }

  private finish(message: string): void {
    this.scene.stop();
    this.scene.resume('WorldScene');
    this.scene.get('WorldScene').events.emit('battle-finished', message);
  }
}
