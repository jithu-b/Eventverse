import * as THREE from 'three';

export type CharacterState =
  | 'IDLE'
  | 'WALKING'
  | 'ARRIVING'
  | 'DRAGGING_BOARD'
  | 'LIFTING_BOARD'
  | 'HOLDING_BOARD'
  | 'IDLE_LOOKING'
  | 'TURNING'
  | 'LEANING'
  | 'IDLE_LEAN'
  | 'LOOKING_AWAY'
  | 'WAVING'
  | 'REACTION'
  | 'FALLING'
  | 'ON_GROUND'
  | 'GETTING_UP'
  | 'CELEBRATING';

export type FieldFocusTarget = 'email' | 'password' | 'role' | 'submit' | 'none';

export interface HumanoidBones {
  root?: THREE.Object3D;
  hips?: THREE.Bone | THREE.Object3D;
  spine?: THREE.Bone | THREE.Object3D;
  chest?: THREE.Bone | THREE.Object3D;
  neck?: THREE.Bone | THREE.Object3D;
  head?: THREE.Bone | THREE.Object3D;
  leftEye?: THREE.Bone | THREE.Object3D;
  rightEye?: THREE.Bone | THREE.Object3D;
  leftShoulder?: THREE.Bone | THREE.Object3D;
  rightShoulder?: THREE.Bone | THREE.Object3D;
  leftArm?: THREE.Bone | THREE.Object3D;
  rightArm?: THREE.Bone | THREE.Object3D;
  leftForeArm?: THREE.Bone | THREE.Object3D;
  rightForeArm?: THREE.Bone | THREE.Object3D;
  leftHand?: THREE.Bone | THREE.Object3D;
  rightHand?: THREE.Bone | THREE.Object3D;
  leftUpLeg?: THREE.Bone | THREE.Object3D;
  rightUpLeg?: THREE.Bone | THREE.Object3D;
  leftLeg?: THREE.Bone | THREE.Object3D;
  rightLeg?: THREE.Bone | THREE.Object3D;
  leftFoot?: THREE.Bone | THREE.Object3D;
  rightFoot?: THREE.Bone | THREE.Object3D;
}

export interface CharacterModelData {
  scene: THREE.Group;
  animations: THREE.AnimationClip[];
  bones: HumanoidBones;
  skinnedMeshes: THREE.SkinnedMesh[];
}

export interface CharacterSceneProps {
  currentFocus?: FieldFocusTarget;
  isSubmitting?: boolean;
  isSuccess?: boolean;
  onCharacterClick?: () => void;
  characterName?: string;
  speechText?: string;
  glbUrl?: string;
  minimal?: boolean;
}
