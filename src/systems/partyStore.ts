import { getAnimon } from '../data/animon';

export interface PartyMember {
  speciesId: string;
  hp: number;
}

const party: PartyMember[] = [{ speciesId: 'spriglet', hp: getAnimon('spriglet').maxHp }];
let captureOrbs = 5;

export const PartyStore = {
  members(): PartyMember[] {
    return party.map((member) => ({ ...member }));
  },
  add(speciesId: string): boolean {
    if (party.length >= 6) return false;
    party.push({ speciesId, hp: getAnimon(speciesId).maxHp });
    return true;
  },
  updateFirstHp(hp: number): void {
    if (party[0]) party[0].hp = Math.max(0, hp);
  },
  get captureOrbs(): number {
    return captureOrbs;
  },
  useCaptureOrb(): boolean {
    if (captureOrbs <= 0) return false;
    captureOrbs -= 1;
    return true;
  },
};
