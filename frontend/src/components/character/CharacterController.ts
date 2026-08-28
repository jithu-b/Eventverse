import * as THREE from 'three';
import { CharacterState } from './types';
import { CharacterAnimator } from './CharacterAnimator';

export class CharacterController {
  private root: THREE.Object3D;
  private animator: CharacterAnimator | null = null;
  private state: CharacterState = 'WALKING';
  private stateStartTime: number = performance.now();
  private onStateChange?: (state: CharacterState) => void;

  constructor(root: THREE.Object3D, onStateChange?: (state: CharacterState) => void) {
    this.root = root;
    this.onStateChange = onStateChange;
    this.resetToStart();
  }

  public setAnimator(animator: CharacterAnimator) {
    this.animator = animator;
    this.animator.playState(this.state, 0.1);
  }

  public resetToStart() {
    this.state = 'WALKING';
    this.stateStartTime = performance.now();
    this.root.position.set(-1.6, 0, 0); // Start outside left
    this.root.rotation.set(0, Math.PI / 2 - 0.2, 0); // Face walking path
    if (this.animator) {
      this.animator.playState('WALKING', 0.2);
    }
    if (this.onStateChange) {
      this.onStateChange('WALKING');
    }
  }

  public setState(newState: CharacterState, fadeDuration: number = 0.4) {
    if (this.state === newState) return;
    this.state = newState;
    this.stateStartTime = performance.now();
    if (this.animator) {
      this.animator.playState(newState, fadeDuration);
    }
    if (this.onStateChange) {
      this.onStateChange(newState);
    }
  }

  public getState(): CharacterState {
    return this.state;
  }

  public update(delta: number, elapsedTime: number) {
    const age = (performance.now() - this.stateStartTime) / 1000;

    // Update animation clips
    if (this.animator) {
      this.animator.update(delta);
    }

    // Phase 1: WALKING ENTRANCE
    if (this.state === 'WALKING') {
      const walkSpeed = 0.95;
      this.root.position.x += walkSpeed * delta;

      if (this.root.position.x >= 0.0) {
        this.root.position.x = 0.0;
        this.setState('ARRIVING', 0.35);
      }
    }

    // Phase 2: ARRIVING (Slow down & Decelerate)
    else if (this.state === 'ARRIVING') {
      if (age >= 0.6) {
        this.setState('IDLE_LOOKING', 0.4);
      }
    }

    // Phase 3: IDLE_LOOKING (Inspect Login Card)
    else if (this.state === 'IDLE_LOOKING') {
      this.root.rotation.y = THREE.MathUtils.lerp(this.root.rotation.y, 0.4, 0.08);

      if (age >= 0.9) {
        this.setState('TURNING', 0.45);
      }
    }

    // Phase 4: TURNING (Turn smoothly toward user/camera)
    else if (this.state === 'TURNING') {
      this.root.rotation.y = THREE.MathUtils.lerp(this.root.rotation.y, 0.12, 0.07);

      if (age >= 0.8) {
        this.setState('LEANING', 0.4);
      }
    }

    // Phase 5: LEANING (Transition into casual lean pose)
    else if (this.state === 'LEANING') {
      this.root.rotation.y = THREE.MathUtils.lerp(this.root.rotation.y, 0.1, 0.08);
      if (age >= 1.0) {
        this.setState('IDLE_LEAN', 0.4);
      }
    }

    // Phase 6: IDLE_LEAN (Living Idle)
    else if (this.state === 'IDLE_LEAN') {
      // Subtle natural breathing sway on root
      const microSway = Math.sin(elapsedTime * 1.5) * 0.005;
      this.root.position.y = microSway;
    }
  }
}
