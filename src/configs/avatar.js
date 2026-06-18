import { avataaars as typeAvataaars } from '@dicebear/collection'

// Hats / hijabs / turbans are kept in the full set so users can pick them
// from the editor, but the default and shuffle pool excludes them so the
// hair-color picker always has visible effect.
const HAT_TOPS = [
  'hat',
  'hijab',
  'turban',
  'winterHat1',
  'winterHat02',
  'winterHat03',
  'winterHat04'
]
const HAIR_TOPS = [
  'bob',
  'bun',
  'curly',
  'curvy',
  'dreads',
  'frida',
  'fro',
  'froBand',
  'longButNotTooLong',
  'miaWallace',
  'shavedSides',
  'straight02',
  'straight01',
  'straightAndStrand',
  'dreads01',
  'dreads02',
  'frizzle',
  'shaggy',
  'shaggyMullet',
  'shortCurly',
  'shortFlat',
  'shortRound',
  'shortWaved',
  'sides',
  'theCaesar',
  'theCaesarAndSidePart',
  'bigHair'
]

export const ALL_TOPS = [...HAT_TOPS, ...HAIR_TOPS]
export const SHUFFLE_TOPS = HAIR_TOPS

export const CONFIG_AVATAAARS = {
  avataaars: {
    type: typeAvataaars,
    configs_initial: {
      // High base size so the SVG is always downscaled to fit the
      // container (downscaling a vector is always crisp). On a 3x DPR
      // mobile device, this avoids the pixelation that occurred when
      // DiceBear avataaars' 128x128 design was upscaled to 192/288px.
      size: 512,
      randomizeIds: true,
      accessories: ['eyepatch', 'kurt', 'prescription01', 'prescription02', 'round', 'sunglasses', 'wayfarers'],
      accessoriesProbability: 100,
      // Default to a hair style (not a hat) so the hair color picker is meaningful.
      top: SHUFFLE_TOPS,
      topProbability: 100,
      // Pelo facial
      facialHairProbability: 100,
      facialHair: ['beardLight', 'beardMajestic', 'beardMedium', 'moustacheFancy', 'moustacheMagnum'],
      // Boca
      mouth: ['concerned', 'default', 'disbelief', 'eating', 'grimace', 'sad', 'screamOpen', 'serious', 'smile', 'tongue', 'twinkle', 'vomit'],
      // Ojos
      eyes: ['closed', 'cry', 'default', 'eyeRoll', 'happy', 'hearts', 'side', 'squint', 'surprised', 'winkWacky', 'wink', 'xDizzy'],
      eyebrows: ['angryNatural', 'defaultNatural', 'flatNatural', 'frownNatural', 'raisedExcitedNatural', 'sadConcernedNatural', 'unibrowNatural', 'upDownNatural', 'angry', 'default', 'raisedExcited', 'sadConcerned', 'upDown'],
      // Ropa
      clothingGraphic: ['bat', 'bear', 'cumbia', 'deer', 'diamond', 'hola', 'pizza', 'resist', 'skull', 'skullOutline'],
      clothing: ['blazerAndShirt', 'blazerAndSweater', 'collarAndSweater', 'graphicShirt', 'hoodie', 'overall', 'shirtCrewNeck', 'shirtScoopNeck', 'shirtVNeck']
    }
  }
}
