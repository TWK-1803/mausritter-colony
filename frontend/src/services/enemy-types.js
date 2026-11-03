export const ENEMY_TYPES = [
  {
    name: 'Cat',
    description: 'Warband scale',
    hp: 15, str: 15, dex: 15, wil: 10, armour: 1,
    attacks: 'd6 swipe, d8 bite',
    notes: []
  },
  {
    name: 'Centipede',
    hp: 8, str: 10, dex: 12, wil: 8, armour: 1,
    attacks: 'd6 venomous bite (damages DEX instead of STR)',
    notes: ['Critical damage: Venom takes effect, d12 damage to STR']
  },
  {
    name: 'Crow',
    hp: 12, str: 12, dex: 15, wil: 15, armour: 1,
    attacks: 'd8 peck',
    notes: ['Flies 3x normal speed, knows two songs']
  },
  {
    name: 'Faerie',
    hp: 6, str: 10, dex: 15, wil: 15, armour: 0,
    attacks: 'd8 silver rapier',
    notes: ['Knows one spell']
  },
  {
    name: 'Frog',
    hp: 6, str: 12, dex: 15, wil: 8, armour: 1,
    attacks: 'd10 spear or d6 tongue',
    notes: [
      'Critical damage: Leap out of reach',
      'Always goes first unless surprised, leaps 2x normal speed'
    ]
  },
  {
    name: 'Ghost',
    hp: 9, str: 5, dex: 10, wil: 10, armour: 0,
    attacks: 'ghostly power, d8 chilling touch (damages WIL)',
    notes: [
      'Critical damage: Possess the creature',
      'Only harmed by silver or magic weapons'
    ]
  },
  {
    name: 'Mouse',
    hp: 3, str: 9, dex: 9, wil: 9, armour: 0,
    attacks: 'd6 sword or d6 bow',
    notes: []
  },
  {
    name: 'Owl',
    hp: 15, str: 15, dex: 15, wil: 15, armour: 1,
    attacks: 'd10 bite',
    notes: ['Flies 3x normal speed. Knows two spells']
  },
  {
    name: 'Rat',
    hp: 3, str: 12, dex: 8, wil: 8, armour: 0,
    attacks: 'd6 cleaver',
    notes: []
  },
  {
    name: 'Snake',
    hp: 12, str: 12, dex: 10, wil: 10, armour: 2,
    attacks: 'd8 bite',
    notes: ['Critical damage: Swallow whole, d4 STR damage per Round until rescued or escape']
  },
  {
    name: 'Spider',
    hp: 6, str: 8, dex: 15, wil: 10, armour: 1,
    attacks: 'd6 poison bite (damages DEX instead of STR)',
    notes: ['Critical damage: Carry away in web']
  }
]
