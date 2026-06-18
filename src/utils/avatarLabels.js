const LABELS = {
  // Eyes
  closed: 'Cerrados',
  cry: 'Llorando',
  eyeRoll: 'Ojos arriba',
  happy: 'Felices',
  hearts: 'Corazones',
  side: 'Laterales',
  squint: 'Entrecerrados',
  surprised: 'Sorprendidos',
  winkWacky: 'Guiño loco',
  wink: 'Guiño',
  xDizzy: 'Mareados',

  // Eyebrows
  angryNatural: 'Enojadas · Natural',
  defaultNatural: 'Normales · Natural',
  flatNatural: 'Rectas · Natural',
  frownNatural: 'Ceño · Natural',
  raisedExcitedNatural: 'Emocionadas · Natural',
  sadConcernedNatural: 'Tristes · Natural',
  unibrowNatural: 'Ceja única · Natural',
  upDownNatural: 'Arriba/abajo · Natural',

  // Mouth
  concerned: 'Preocupada',
  disbelief: 'Incredulidad',
  eating: 'Comiendo',
  grimace: 'Mueca',
  sad: 'Triste',
  screamOpen: 'Gritando',
  serious: 'Seria',
  smile: 'Sonrisa',
  tongue: 'Lengua afuera',
  twinkle: 'Traviesa',
  vomit: 'Vómito',

  // Facial hair
  beardLight: 'Barba ligera',
  beardMajestic: 'Barba majestuosa',
  beardMedium: 'Barba media',
  moustacheFancy: 'Bigote elegante',
  moustacheMagnum: 'Bigote grueso',

  // Hair / top
  hat: 'Sombrero',
  hijab: 'Hijab',
  turban: 'Turbante',
  winterHat1: 'Gorro de invierno 1',
  winterHat02: 'Gorro de invierno 2',
  winterHat03: 'Gorro de invierno 3',
  winterHat04: 'Gorro de invierno 4',
  bob: 'Bob',
  bun: 'Moño',
  curly: 'Rizado',
  curvy: 'Ondulado',
  dreads: 'Dreads',
  frida: 'Frida',
  fro: 'Afro',
  froBand: 'Afro con banda',
  longButNotTooLong: 'Largo medio',
  miaWallace: 'Mia Wallace',
  shavedSides: 'Lados rapados',
  straight02: 'Liso largo',
  straight01: 'Liso corto',
  straightAndStrand: 'Liso con mechón',
  dreads01: 'Dreads cortos',
  dreads02: 'Dreads largos',
  frizzle: 'Encrespado',
  shaggy: 'Despeinado',
  shaggyMullet: 'Mullet despeinado',
  shortCurly: 'Corto rizado',
  shortFlat: 'Corto liso',
  shortRound: 'Corto redondo',
  shortWaved: 'Corto ondulado',
  sides: 'A los lados',
  theCaesar: 'César',
  theCaesarAndSidePart: 'César con raya',
  bigHair: 'Pelo grande',

  // Accessories
  eyepatch: 'Parche',
  kurt: 'Kurt',
  prescription01: 'Lentes 1',
  prescription02: 'Lentes 2',
  round: 'Lentes redondos',
  sunglasses: 'Gafas de sol',
  wayfarers: 'Wayfarers',

  // Clothing
  blazerAndShirt: 'Blazer y camisa',
  blazerAndSweater: 'Blazer y suéter',
  collarAndSweater: 'Cuello y suéter',
  graphicShirt: 'Camisa estampada',
  hoodie: 'Hoodie',
  overall: 'Overol',
  shirtCrewNeck: 'Camisa cuello redondo',
  shirtScoopNeck: 'Camisa cuello amplio',
  shirtVNeck: 'Camisa cuello V',

  // Clothing graphic
  bat: 'Murciélago',
  bear: 'Oso',
  cumbia: 'Cumbia',
  deer: 'Venado',
  diamond: 'Diamante',
  hola: '¡Hola!',
  pizza: 'Pizza',
  resist: 'Resiste',
  skull: 'Calavera',
  skullOutline: 'Calavera · línea'
}

const COMMON = {
  default: 'Normal',
  angry: 'Enojadas',
  raisedExcited: 'Emocionadas',
  sadConcerned: 'Tristes',
  upDown: 'Arriba/abajo'
}

export const getOptionLabel = (value) => {
  if (!value) return ''
  return LABELS[value] || COMMON[value] || value
}
