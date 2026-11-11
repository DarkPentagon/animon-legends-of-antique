import { getAnimon } from '../data/animon';

export interface PartyMember { speciesId: string; hp: number; level: number; xp: number }
interface SaveData { party: PartyMember[]; captureOrbs: number; activeIndex: number }
const SAVE_KEY = 'animon-legends-save-v1';
const MAX_LEVEL = 50;
const createMember = (speciesId: string): PartyMember => ({
  speciesId, hp: getAnimon(speciesId).maxHp, level: 1, xp: 0,
});
function loadSave(): SaveData {
  const initial: SaveData = { party: [createMember('spriglet')], captureOrbs: 5, activeIndex: 0 };
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return initial;
    const value = JSON.parse(raw) as Partial<SaveData>;
    if (!Array.isArray(value.party) || !value.party.length) return initial;
    const party = value.party.slice(0, 6).filter((member) => {
      if (!member || typeof member.speciesId !== 'string' || !Number.isFinite(member.hp) ||
          !Number.isFinite(member.level) || !Number.isFinite(member.xp)) return false;
      try { getAnimon(member.speciesId); return true; } catch { return false; }
    }).map((member) => {
      const species = getAnimon(member.speciesId);
      const level = Math.min(MAX_LEVEL, Math.max(1, Math.floor(member.level)));
      return { speciesId: member.speciesId, level, xp: Math.max(0, Math.floor(member.xp)),
        hp: Math.min(species.maxHp + (level - 1) * 2, Math.max(0, Math.floor(member.hp))) };
    });
    return { party: party.length ? party : initial.party,
      captureOrbs: Math.min(99, Math.max(0, Math.floor(value.captureOrbs ?? 5))),
      activeIndex: Math.min(Math.max(0, party.length - 1), Math.max(0, Math.floor(value.activeIndex ?? 0))) };
  } catch { return initial; }
}
const saved = loadSave();
const party = saved.party;
let captureOrbs = saved.captureOrbs;
let activeIndex = saved.activeIndex;
function persist(): void {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify({ party, captureOrbs, activeIndex })); }
  catch { /* Continue without saving if browser storage is unavailable. */ }
}
const maxHp = (member: PartyMember): number => getAnimon(member.speciesId).maxHp + (member.level - 1) * 2;

export const PartyStore = {
  members: (): PartyMember[] => party.map((member) => ({ ...member })),
  active: (): PartyMember | undefined => party[activeIndex] ? { ...party[activeIndex] } : undefined,
  activeIndex: (): number => activeIndex,
  setActive(index: number): boolean {
    if (!Number.isInteger(index) || index < 0 || index >= party.length || party[index].hp <= 0) return false;
    activeIndex = index; persist(); return true;
  },
  add(speciesId: string): boolean {
    if (party.length >= 6) return false;
    try { getAnimon(speciesId); } catch { return false; }
    party.push(createMember(speciesId)); persist(); return true;
  },
  updateActiveHp(hp: number): void {
    const member = party[activeIndex];
    if (member) { member.hp = Math.min(maxHp(member), Math.max(0, Math.floor(hp))); persist(); }
  },
  awardActiveXp(amount: number): { gained: number; levels: number; evolution?: string } {
    const member = party[activeIndex];
    if (!member || amount <= 0) return { gained: 0, levels: 0 };
    const gained = Math.floor(amount);
    member.xp += gained;
    let levels = 0;
    while (member.level < MAX_LEVEL && member.xp >= member.level * 20) {
      member.xp -= member.level * 20;
      member.level += 1;
      levels += 1;
    }
    member.hp = Math.min(maxHp(member), member.hp + levels * 2);
    const currentSpecies = getAnimon(member.speciesId);
    let evolution: string | undefined;
    if (currentSpecies.evolvesTo && member.level >= (currentSpecies.evolveAt ?? MAX_LEVEL)) {
      const oldMax = maxHp(member);
      member.speciesId = currentSpecies.evolvesTo;
      const newMax = maxHp(member);
      member.hp = Math.min(newMax, member.hp + (newMax - oldMax));
      evolution = getAnimon(member.speciesId).name;
    }
    persist();
    return { gained, levels, evolution };
  },
  healAll(): void {
    party.forEach((member) => { member.hp = maxHp(member); });
    captureOrbs = Math.min(99, captureOrbs + 5); persist();
  },
  get captureOrbs(): number { return captureOrbs; },
  useCaptureOrb(): boolean {
    if (captureOrbs <= 0) return false;
    captureOrbs -= 1; persist(); return true;
  },
};
