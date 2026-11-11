export type AnimonElement = 'Nature' | 'Fire' | 'Water';

export interface AnimonSpecies {
  id: string;
  name: string;
  element: AnimonElement;
  maxHp: number;
  attack: number;
  defense: number;
  color: number;
  skills: [string, string];
  evolvesTo?: string;
  evolveAt?: number;
}

export const ANIMON: AnimonSpecies[] = [
  { id: 'spriglet', name: 'Spriglet', element: 'Nature', maxHp: 34, attack: 9, defense: 7, color: 0x62ad62, skills: ['Leaf Flick', 'Root Snare'], evolvesTo: 'brambleon', evolveAt: 10 },
  { id: 'brambleon', name: 'Brambleon', element: 'Nature', maxHp: 48, attack: 13, defense: 11, color: 0x397b4b, skills: ['Thorn Burst', 'Ancient Grove'] },
  { id: 'mossprout', name: 'Mossprout', element: 'Nature', maxHp: 26, attack: 7, defense: 5, color: 0x4c9b65, skills: ['Vine Tap', 'Spore Puff'], evolvesTo: 'mosswarden', evolveAt: 8 },
  { id: 'mosswarden', name: 'Mosswarden', element: 'Nature', maxHp: 42, attack: 11, defense: 12, color: 0x326e50, skills: ['Moss Shield', 'Verdant Wave'] },
  { id: 'thornhare', name: 'Thornhare', element: 'Nature', maxHp: 30, attack: 10, defense: 5, color: 0x8cbf65, skills: ['Briar Hop', 'Bramble Dash'] },
  { id: 'embercub', name: 'Embercub', element: 'Fire', maxHp: 24, attack: 9, defense: 4, color: 0xe77c45, skills: ['Cinder Paw', 'Warm Roar'], evolvesTo: 'cindervox', evolveAt: 10 },
  { id: 'cindervox', name: 'Cindervox', element: 'Fire', maxHp: 39, attack: 14, defense: 7, color: 0xb94c32, skills: ['Blazing Pounce', 'Solar Howl'] },
  { id: 'ashwing', name: 'Ashwing', element: 'Fire', maxHp: 28, attack: 11, defense: 5, color: 0xd65c3e, skills: ['Ember Feather', 'Searing Gust'] },
  { id: 'tidefin', name: 'Tidefin', element: 'Water', maxHp: 29, attack: 8, defense: 6, color: 0x5b9fd1, skills: ['Bubble Pop', 'Current Rush'], evolvesTo: 'tiderush', evolveAt: 10 },
  { id: 'tiderush', name: 'Tiderush', element: 'Water', maxHp: 44, attack: 12, defense: 10, color: 0x347fba, skills: ['Riptide Spin', 'Monsoon Crest'] },
  { id: 'brooklet', name: 'Brooklet', element: 'Water', maxHp: 33, attack: 7, defense: 9, color: 0x73c7d0, skills: ['Stream Flick', 'Rain Veil'] },
];

export function getAnimon(id: string): AnimonSpecies {
  const species = ANIMON.find((entry) => entry.id === id);
  if (!species) throw new Error(`Unknown Animon species: ${id}`);
  return species;
}

export function getElementMultiplier(attacker: AnimonElement, defender: AnimonElement): number {
  if ((attacker === 'Nature' && defender === 'Water') ||
      (attacker === 'Water' && defender === 'Fire') ||
      (attacker === 'Fire' && defender === 'Nature')) return 1.5;
  if ((attacker === 'Nature' && defender === 'Fire') ||
      (attacker === 'Fire' && defender === 'Water') ||
      (attacker === 'Water' && defender === 'Nature')) return 0.75;
  return 1;
}
