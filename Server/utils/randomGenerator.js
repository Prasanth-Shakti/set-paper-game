import {
  avatarStyle,
  topTypeArray,
  accessoriesTypeArray,
  hairColorArray,
  clotheColorArray,
  clotheTypeArray,
  eyeTypeArray,
  eyebrowTypeArray,
  facialHairColorArray,
  facialHairTypeArray,
  graphicTypeArray,
  hatColorArray,
  skinColorArray,
  mouthTypeArray,
} from "./avatarOptions.js";
import { botNames } from "./botNames.js";
import { botCardNames } from "./botCardNames.js";
import { generateRandomElementFromArray } from "./index.js";
import { avatarURL } from "../config.js";

const generateAvatar = function () {
  const topType = generateRandomElementFromArray(topTypeArray);
  const accessoriesType = generateRandomElementFromArray(accessoriesTypeArray);
  const hairColor = generateRandomElementFromArray(hairColorArray);
  const clotheColor = generateRandomElementFromArray(clotheColorArray);
  const clotheType = generateRandomElementFromArray(clotheTypeArray);
  const eyeType = generateRandomElementFromArray(eyeTypeArray);
  const eyebrowType = generateRandomElementFromArray(eyebrowTypeArray);
  const facialHairColor = generateRandomElementFromArray(facialHairColorArray);
  let facialHairType = generateRandomElementFromArray(facialHairTypeArray);
  const graphicType = generateRandomElementFromArray(graphicTypeArray);
  const mouthType = generateRandomElementFromArray(mouthTypeArray);
  const hatColor = generateRandomElementFromArray(hatColorArray);
  const skinColor = generateRandomElementFromArray(skinColorArray);
  if (topType.includes("LongHair")) {
    facialHairType = facialHairTypeArray[0];
  }
  const avatar = `${avatarURL}/?avatarStyle=${avatarStyle}&topType=${topType}&accessoriesType=${accessoriesType}&hatColor=${hatColor}&hairColor=${hairColor}&graphicType=${graphicType}&facialHairType=${facialHairType}&facialHairColor=${facialHairColor}&clotheType=${clotheType}&clotheColor=${clotheColor}&eyeType=${eyeType}&eyebrowType=${eyebrowType}&mouthType=${mouthType}&skinColor=${skinColor}`;
  return avatar;
};

const generatePlayerName = function () {
  return generateRandomElementFromArray(botNames);
};

const generateCardName = function () {
  return generateRandomElementFromArray(botCardNames);
};

export { generateAvatar, generatePlayerName, generateCardName };
