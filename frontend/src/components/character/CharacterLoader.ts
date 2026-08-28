import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { CharacterModelData, HumanoidBones } from './types';

export class CharacterLoader {
  private loader: GLTFLoader;

  constructor() {
    this.loader = new GLTFLoader();
  }

  /**
   * Loads a GLB/GLTF model from a URL or Object URL, discovers humanoid bones,
   * configures shadow casting/receiving, and returns model data.
   */
  public async loadModel(url: string, onProgress?: (percent: number) => void): Promise<CharacterModelData> {
    return new Promise((resolve, reject) => {
      this.loader.load(
        url,
        (gltf) => {
          const scene = gltf.scene;
          const animations = gltf.animations || [];
          const skinnedMeshes: THREE.SkinnedMesh[] = [];
          const bones: HumanoidBones = {};

          // Auto-scale to standard humanoid height (~1.75m - 1.8m) if necessary
          const box = new THREE.Box3().setFromObject(scene);
          const size = box.getSize(new THREE.Vector3());
          if (size.y > 0.01) {
            const desiredHeight = 1.75;
            const scaleFactor = desiredHeight / size.y;
            scene.scale.set(scaleFactor, scaleFactor, scaleFactor);
          }

          // Traverse to find bones, meshes, and configure materials
          scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;

              if ((child as THREE.SkinnedMesh).isSkinnedMesh) {
                skinnedMeshes.push(child as THREE.SkinnedMesh);
              }
            }

            if ((child as THREE.Bone).isBone || child.name) {
              const name = child.name.toLowerCase();

              if (!bones.head && (name.includes('head') || name === 'head')) {
                bones.head = child;
              } else if (!bones.neck && (name.includes('neck') || name === 'neck')) {
                bones.neck = child;
              } else if (!bones.chest && (name.includes('chest') || name.includes('spine2') || name.includes('upperchest'))) {
                bones.chest = child;
              } else if (!bones.spine && (name.includes('spine') || name === 'spine')) {
                bones.spine = child;
              } else if (!bones.hips && (name.includes('hip') || name.includes('pelvis') || name === 'root')) {
                bones.hips = child;
              } else if (!bones.leftShoulder && (name.includes('leftshoulder') || name.includes('shoulder.l') || name.includes('shoulder_l'))) {
                bones.leftShoulder = child;
              } else if (!bones.rightShoulder && (name.includes('rightshoulder') || name.includes('shoulder.r') || name.includes('shoulder_r'))) {
                bones.rightShoulder = child;
              } else if (!bones.leftArm && (name.includes('leftarm') || name.includes('arm.l') || name.includes('upperarm_l'))) {
                bones.leftArm = child;
              } else if (!bones.rightArm && (name.includes('rightarm') || name.includes('arm.r') || name.includes('upperarm_r'))) {
                bones.rightArm = child;
              } else if (!bones.leftForeArm && (name.includes('leftforearm') || name.includes('forearm.l') || name.includes('lowerarm_l'))) {
                bones.leftForeArm = child;
              } else if (!bones.rightForeArm && (name.includes('rightforearm') || name.includes('forearm.r') || name.includes('lowerarm_r'))) {
                bones.rightForeArm = child;
              } else if (!bones.leftHand && (name.includes('lefthand') || name.includes('hand.l') || name.includes('hand_l'))) {
                bones.leftHand = child;
              } else if (!bones.rightHand && (name.includes('righthand') || name.includes('hand.r') || name.includes('hand_r'))) {
                bones.rightHand = child;
              }
            }
          });

          resolve({
            scene,
            animations,
            bones,
            skinnedMeshes,
          });
        },
        (xhr) => {
          if (xhr.total > 0 && onProgress) {
            onProgress(Math.round((xhr.loaded / xhr.total) * 100));
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
}
