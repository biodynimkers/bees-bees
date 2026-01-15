interface PollenColor {
  species: string[];
  hex: string;
  isNoPollenOption?: boolean;
}

export const pollenColors: PollenColor[] = [
  {
    species: ['hazelaar', 'els', 'peer', 'meidoorn', 'winderlinde', 'heide'],
    hex: '#d8b769',
  },
  {
    species: [
      'sneeuwklokje',
      'paardenbloem',
      'kers',
      'brem',
      'koningskaars',
      'aster',
    ],
    hex: '#e56e59',
  },
  {
    species: [
      'esdoorn',
      'aalbes',
      'stekelbes',
      'sneeuwbes',
      'mais',
      'zomerlinde',
    ],
    hex: '#fdfe97',
  },
  {
    species: [
      'wilgensoorten',
      'koolzaad',
      'raapzaad',
      'zonnebloem',
      'helenium',
      'guldenroede',
    ],
    hex: '#ffff32',
  },
  { species: ['appel', 'tulp', 'meidoorn', 'aardbei'], hex: '#cfbf62' },
  { species: ['paardenkastanje'], hex: '#a72744' },
  { species: ['framboos'], hex: '#d6c49c' },
  { species: ['klaproos'], hex: '#37255d' },
  { species: ['klaver', 'witte steenklaver', 'akelei'], hex: '#bb832b' },
  { species: ['bernagie', 'braam'], hex: '#e7dfbd' },
  { species: ['facelia', 'kogeldistel'], hex: '#3e65ee' },
  {
    species: ['geen stuifmeel zichtbaar'],
    hex: '#6b7280',
    isNoPollenOption: true,
  },
];
