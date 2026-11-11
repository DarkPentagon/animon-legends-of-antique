export interface AnimonSpecies {
  id: string;
  name: string;
  element: 'Nature' | 'Fire' | 'Water';
  maxHp: number;
  attack: number;
  defense: number;
  color: number;
  skills: [string, string];
}

export const ANIMON: AnimonSpecies[] = [
  { id: 'spriglet', name: 'Spriglet', element: 'Nature', maxHp: 34, attack: 9, defense: 7, color: 0x62ad62, skills: ['Leaf Flick', 'Root Snare'] },
  { id: 'mossprout', name: 'Mossprout', element: 'Nature', maxHp: 26, attack: 7, defense: 5, color: 0x4c9b65, skills: ['Vine Tap', 'Spore Puff'] },
  { id: 'embercub', name: 'Embercub', element: 'Fire', maxHp: 24, attack: 9, defense: 4, color: 0xe77c45, skills: ['Cinder Paw', 'Warm Roar'] },
  { id: 'tidefin', name: 'Tidefin', element: 'Water', maxHp: 29, attack: 8, defense: 6, color: 0x5b9fd1, skills: ['Bubble Pop', 'Current Rush'] },
];

export function getAnimon(id: string): AnimonSpecies {
  const species = ANIMON.find((entry) => entry.id === id);
  if (!species) throw new Error(`Unknown Animon species: ${id}`);
  return species;
}
