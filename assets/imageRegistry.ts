export const images = {
  jeans: require('../assets/images/jeans.png'),
  laptop13: require('../assets/images/laptop13.png'),
  miniDryer: require('../assets/images/mini-dryer.png'),
  kettle: require('../assets/images/kettle.png'),
  whiteSkirt: require('../assets/images/white-skirt.png'),
  leatherJacket: require('../assets/images/leather-jacket.png'),
} as const;

export type ImageKey = keyof typeof images;