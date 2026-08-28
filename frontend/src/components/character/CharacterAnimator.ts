import * as THREE from 'three';
import { CharacterState } from './types';

export class CharacterAnimator {
  private mixer: THREE.AnimationMixer;
  private actions: Map<string, THREE.AnimationAction> = new Map();
  private currentAction: THREE.AnimationAction | null = null;
  private currentClipName: string = '';

  constructor(root: THREE.Object3D, clips: THREE.AnimationClip[]) {
    this.mixer = new THREE.AnimationMixer(root);
    this.registerClips(clips);
  }

  private registerClips(clips: THREE.AnimationClip[]) {
    for (const clip of clips) {
      const action = this.mixer.clipAction(clip);
      this.actions.set(clip.name.toLowerCase(), action);
    }
  }

  /**
   * Finds the best matching clip for a requested action name.
   */
  public findAction(name: string): THREE.AnimationAction | null {
    const search = name.toLowerCase();
    
    // Direct match
    if (this.actions.has(search)) {
      return this.actions.get(search)!;
    }

    // Fuzzy matching aliases
    const aliases: Record<string, string[]> = {
      walk: ['walk', 'walking', 'run', 'stride', 'move'],
      idle: ['idle', 'breathing', 'stand', 'pose', 'rest'],
      lean: ['lean', 'leaning', 'chill', 'posture', 'casual'],
      turn: ['turn', 'turning', 'rotate', 'look'],
      reaction: ['reaction', 'thumbs_up', 'thumbsup', 'cheer', 'celebrate', 'wave'],
      celebrating: ['celebrate', 'celebration', 'victory', 'cheer', 'jump'],
    };

    const targetAliases = aliases[search] || [search];
    for (const [clipName, action] of this.actions.entries()) {
      for (const alias of targetAliases) {
        if (clipName.includes(alias)) {
          return action;
        }
      }
    }

    // If still not found and we have actions, return the first available one
    if (this.actions.size > 0) {
      return this.actions.values().next().value || null;
    }

    return null;
  }

  /**
   * Smoothly cross-fades from the current animation to the target animation.
   */
  public playState(state: CharacterState, fadeDuration: number = 0.4): boolean {
    let actionName = 'idle';
    if (state === 'WALKING') actionName = 'walk';
    else if (state === 'IDLE_LOOKING') actionName = 'idle';
    else if (state === 'TURNING') actionName = 'turn';
    else if (state === 'LEANING' || state === 'IDLE_LEAN') actionName = 'lean';
    else if (state === 'REACTION' || state === 'CELEBRATING') actionName = 'reaction';

    const nextAction = this.findAction(actionName);
    if (!nextAction) return false;

    if (this.currentAction === nextAction) {
      return true;
    }

    nextAction.reset();
    nextAction.enabled = true;
    nextAction.setEffectiveTimeScale(1);
    nextAction.setEffectiveWeight(1);

    if (this.currentAction) {
      this.currentAction.crossFadeTo(nextAction, fadeDuration, true);
    }

    nextAction.play();
    this.currentAction = nextAction;
    this.currentClipName = actionName;
    return true;
  }

  public update(delta: number) {
    this.mixer.update(delta);
  }

  public stopAll() {
    this.mixer.stopAllAction();
  }

  public dispose() {
    this.stopAll();
    this.mixer.uncacheRoot(this.mixer.getRoot());
    this.actions.clear();
  }
}
