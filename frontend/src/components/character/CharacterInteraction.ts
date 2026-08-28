import * as THREE from 'three';
import { FieldFocusTarget, HumanoidBones } from './types';

export class CharacterInteraction {
  private bones: HumanoidBones;
  private mouseTarget: THREE.Vector2 = new THREE.Vector2(0, 0);
  private currentHeadEuler: THREE.Euler = new THREE.Euler();
  private targetHeadEuler: THREE.Euler = new THREE.Euler();

  constructor(bones: HumanoidBones) {
    this.bones = bones;
  }

  public setMousePosition(normalizedX: number, normalizedY: number) {
    this.mouseTarget.set(
      THREE.MathUtils.clamp(normalizedX, -1, 1),
      THREE.MathUtils.clamp(normalizedY, -1, 1)
    );
  }

  /**
   * Applies procedural skeletal IK/bone orientation to track login fields and subtle cursor motion.
   */
  public update(
    delta: number,
    elapsedTime: number,
    focus: FieldFocusTarget,
    isSubmitting: boolean,
    isSuccess: boolean
  ) {
    // 1. Calculate Target Head/Neck Rotations based on Login Form Focus
    let targetYaw = 0;
    let targetPitch = 0;
    let targetRoll = 0;

    if (focus === 'email') {
      // Look towards email field (to the right and slightly down)
      targetYaw = 0.35;
      targetPitch = 0.12;
    } else if (focus === 'password') {
      // Look towards password field (to the right and further down)
      targetYaw = 0.38;
      targetPitch = 0.18;
    } else if (focus === 'role') {
      targetYaw = 0.3;
      targetPitch = 0.05;
    } else if (focus === 'submit' || isSubmitting || isSuccess) {
      // Look directly forward/user with slight confidence lift
      targetYaw = 0.05;
      targetPitch = -0.08;
      if (isSuccess) {
        targetPitch += Math.sin(elapsedTime * 8) * 0.05; // Nodding celebration
      }
    } else {
      // Subtle cursor tracking (clamped to natural human neck limits)
      targetYaw = this.mouseTarget.x * 0.22;
      targetPitch = -this.mouseTarget.y * 0.15;
    }

    // Natural breathing micro-rotation
    const breatheAngle = Math.sin(elapsedTime * 2.0) * 0.015;
    targetPitch += breatheAngle;

    // Smooth interpolation with damping
    this.currentHeadEuler.y = THREE.MathUtils.damp(this.currentHeadEuler.y, targetYaw, 6, delta);
    this.currentHeadEuler.x = THREE.MathUtils.damp(this.currentHeadEuler.x, targetPitch, 6, delta);
    this.currentHeadEuler.z = THREE.MathUtils.damp(this.currentHeadEuler.z, targetRoll, 6, delta);

    // Apply to Head & Neck bones if available in the skeletal hierarchy
    if (this.bones.head) {
      this.bones.head.rotation.y = this.currentHeadEuler.y * 0.7;
      this.bones.head.rotation.x = this.currentHeadEuler.x * 0.7;
    }
    if (this.bones.neck) {
      this.bones.neck.rotation.y = this.currentHeadEuler.y * 0.3;
      this.bones.neck.rotation.x = this.currentHeadEuler.x * 0.3;
    }

    // Subtle spine breathing
    if (this.bones.spine && !this.bones.neck) {
      this.bones.spine.rotation.x = breatheAngle * 0.5;
    }
  }

  public updateBones(bones: HumanoidBones) {
    this.bones = bones;
  }
}
