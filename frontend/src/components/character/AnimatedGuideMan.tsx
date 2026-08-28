import React from 'react';
import { ThreeDCharacterScene } from './ThreeDCharacterScene';
import { CharacterSceneProps } from './types';

export type AnimatedGuideManProps = CharacterSceneProps;

export const AnimatedGuideMan: React.FC<AnimatedGuideManProps> = (props) => {
  return <ThreeDCharacterScene {...props} />;
};

export const AnimatedGuideLady = AnimatedGuideMan;
export default AnimatedGuideMan;
