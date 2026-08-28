import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, PerspectiveCamera } from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import * as THREE from 'three';
import {
  Sparkles,
  ThumbsUp,
  RefreshCw,
  Hand,
  PartyPopper,
  Zap,
  EyeOff,
  Crosshair,
  Megaphone,
} from 'lucide-react';
import { CharacterSceneProps, CharacterState, FieldFocusTarget } from './types';
import { TinkerHubMascot3D } from './TinkerHubMascot3D';

// ==========================================
// 1. Responsive Camera Manager Component (R3F)
// ==========================================
interface CameraControllerProps {
  currentFocus?: FieldFocusTarget;
  isSuccess?: boolean;
  characterState?: CharacterState;
  pointerPos: React.MutableRefObject<THREE.Vector2>;
}

const ResponsiveCameraController: React.FC<CameraControllerProps> = ({
  currentFocus,
  isSuccess,
  characterState,
  pointerPos,
}) => {
  const { camera, size } = useThree();
  const targetLookAt = useRef(new THREE.Vector3(0, 0.95, 0));

  useFrame((_, delta) => {
    const width = size.width;
    let targetX = 0;
    let targetY = 1.22;
    let targetZ = 3.7;
    let lookTargetY = 0.95;
    let fov = 36;

    if (width < 480) {
      targetZ = 4.3;
      targetY = 1.18;
      fov = 42;
    } else if (width < 768) {
      targetZ = 3.9;
      targetY = 1.22;
      fov = 38;
    }

    if (characterState === 'FALLING' || characterState === 'ON_GROUND') {
      targetY = 0.85;
      lookTargetY = 0.45;
      targetZ += 0.2;
    } else if (characterState === 'HOLDING_BOARD' || characterState === 'LIFTING_BOARD') {
      targetY = 1.18;
      targetZ = width < 480 ? 4.1 : 3.65;
      lookTargetY = 0.92;
    } else if (characterState === 'LOOKING_AWAY') {
      targetX = 0.08;
    } else if (currentFocus === 'password') {
      targetX = -0.12;
      targetZ -= 0.15;
    } else if (currentFocus === 'email') {
      targetX = -0.08;
    } else if (isSuccess) {
      targetY = 1.1;
      targetZ -= 0.25;
    } else {
      // Subtle organic camera parallax follow
      targetX += pointerPos.current.x * 0.08;
      targetY += pointerPos.current.y * 0.05;
    }

    // Smooth camera position, lookAt target, and FOV interpolation
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 3.5, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 3.5, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 3.5, delta);

    targetLookAt.current.y = THREE.MathUtils.damp(targetLookAt.current.y, lookTargetY, 3.5, delta);

    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = THREE.MathUtils.damp(camera.fov, fov, 3.5, delta);
      camera.updateProjectionMatrix();
    }

    camera.lookAt(targetLookAt.current);
  });

  return <PerspectiveCamera makeDefault position={[0, 1.22, 3.7]} fov={36} />;
};

// ==========================================
// 2. Studio Lighting Environment (R3F)
// ==========================================
const StudioLighting: React.FC = () => {
  return (
    <>
      <ambientLight color="#ffffff" intensity={1.5} />

      {/* Main Warm Key Light */}
      <directionalLight
        position={[-2.5, 4.5, 3.5]}
        intensity={2.5}
        color="#fffaed"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0005}
      >
        <orthographicCamera attach="shadow-camera" args={[-2, 2, 3, -1, 0.5, 15]} />
      </directionalLight>

      {/* TinkerHub Signature Pink Rim Light */}
      <directionalLight position={[2.8, 3.0, -2.5]} intensity={2.8} color="#ec4899" />

      {/* Soft Pastel Ambient Fill */}
      <directionalLight position={[2.0, 1.5, 2.5]} intensity={1.1} color="#fdf2f8" />
    </>
  );
};

// ==========================================
// 3. Floating Ambient Particles (R3F)
// ==========================================
const AmbientSparkles: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 35;

  const [positions] = useState(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 2.8;
      pos[i * 3 + 1] = 0.2 + Math.random() * 2.4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2.0;
    }
    return pos;
  });

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.09;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#ec4899"
        size={0.045}
        transparent
        opacity={0.75}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// ==========================================
// 4. Procedural 3D Animated Figure Model (R3F)
// ==========================================
interface MascotAvatarProps {
  characterState: CharacterState;
  currentFocus: FieldFocusTarget;
  isSubmitting: boolean;
  isSuccess: boolean;
  pointerPos: React.MutableRefObject<THREE.Vector2>;
  minimal?: boolean;
}

const MascotAvatarScene: React.FC<MascotAvatarProps> = ({
  characterState,
  currentFocus,
  isSubmitting,
  isSuccess,
  pointerPos,
  minimal,
}) => {
  const mascotRef = useRef<TinkerHubMascot3D | null>(null);
  const groupRef = useRef<THREE.Group>(null);
  const smoothedPointer = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    const mascot = new TinkerHubMascot3D();
    mascot.signboardGroup.visible = !minimal;
    mascotRef.current = mascot;
    if (groupRef.current) {
      groupRef.current.add(mascot.root);
    }
    return () => {
      mascot.dispose();
      if (groupRef.current) {
        groupRef.current.remove(mascot.root);
      }
    };
  }, []);

  useEffect(() => {
    if (characterState === 'DRAGGING_BOARD' && mascotRef.current) {
      mascotRef.current.resetEntrancePosition();
    }
  }, [characterState]);

  useFrame((state, delta) => {
    if (mascotRef.current) {
      // Smooth interpolation for silky fluid head tracking
      smoothedPointer.current.lerp(pointerPos.current, 0.14);

      mascotRef.current.update(
        delta,
        state.clock.elapsedTime,
        characterState,
        currentFocus,
        isSubmitting,
        isSuccess,
        smoothedPointer.current
      );
    }
  });

  return <group ref={groupRef} />;
};

// ==========================================
// 5. Main 3DCharacterScene Component
// ==========================================
export const ThreeDCharacterScene: React.FC<CharacterSceneProps> = ({
  currentFocus = 'none',
  isSubmitting = false,
  isSuccess = false,
  onCharacterClick,
  characterName = 'TinkerBot',
  speechText,
  minimal = false,
}) => {
  const [characterState, setCharacterState] = useState<CharacterState>(minimal ? 'IDLE' : 'DRAGGING_BOARD');
  const [speechMessage, setSpeechMessage] = useState<string>('Dragging board over for you... 🪧');
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const pointerPos = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    if (!minimal) return;
    const actions = [
      () => setCharacterState('WAVING'),
      () => setCharacterState('REACTION'),
      () => setCharacterState('TURNING'),
      () => setCharacterState('LEANING'),
      () => setCharacterState('IDLE_LOOKING'),
      () => setCharacterState('CELEBRATING'),
    ];
    const id = setInterval(() => {
      const pick = actions[Math.floor(Math.random() * actions.length)];
      pick();
      setTimeout(() => setCharacterState('IDLE'), 1800);
    }, 4000);
    return () => clearInterval(id);
  }, [minimal]);

  const clearPendingTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  // Screen-wide active cursor tracking listener
  useEffect(() => {
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = window.innerWidth / 2;
      let clientY = window.innerHeight / 2;

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }

      // Normalized coordinates: center = (0,0), left = -1, right = +1, top = +1, bottom = -1
      const nx = (clientX / window.innerWidth) * 2 - 1;
      const ny = -(clientY / window.innerHeight) * 2 + 1;

      pointerPos.current.set(
        THREE.MathUtils.clamp(nx * 1.15, -1.2, 1.2),
        THREE.MathUtils.clamp(ny * 1.15, -1.2, 1.2)
      );
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
    };
  }, []);

  // Entrance sequence: Drag board from right side -> Lift board up -> Hold board -> Transition to IDLE
  useEffect(() => {
    clearPendingTimeouts();
    setCharacterState('DRAGGING_BOARD');
    setSpeechMessage("Heave-ho! Dragging this board over for you... 🪧🚶‍♂️");

    // Phase 2: Arrives at center and lifts board up (at 3.2s)
    const t1 = setTimeout(() => {
      setCharacterState('LIFTING_BOARD');
      setSpeechMessage("Aha! Check out this announcement... 📢✨");
    }, 3200);

    // Phase 3: Proudly holds board up showing text (at 4.2s)
    const t2 = setTimeout(() => {
      setCharacterState('HOLDING_BOARD');
      setSpeechMessage("Jithu here — Don't hurt my bot! 🤖✨");
    }, 4200);

    // Phase 4: Lowers board to side and starts active cursor follow (at 11.5s)
    const t3 = setTimeout(() => {
      setCharacterState('IDLE');
      setSpeechMessage("Now tracking your cursor wherever you move! 👀✨");
    }, 11500);

    timeoutsRef.current = [t1, t2, t3];

    return () => clearPendingTimeouts();
  }, []);

  // Update speech bubble dynamic dialogues
  useEffect(() => {
    if (speechText) {
      setSpeechMessage(speechText);
      return;
    }
    if (isSuccess) {
      setSpeechMessage("Awesome! You're authenticated into TinkerHub EventVerse! 🚀✨");
    } else if (isSubmitting) {
      setSpeechMessage("Authenticating campus builder credentials... ⚡");
    } else if (currentFocus === 'password') {
      setSpeechMessage("Password encrypted and secure. TinkerHub has your back! 🔒👍");
    } else if (currentFocus === 'email') {
      setSpeechMessage("Enter your TinkerHub SBCE College Email or ID right here! ✉️👇");
    } else if (characterState === 'DRAGGING_BOARD') {
      setSpeechMessage("Heave-ho! Dragging this board over for you... 🪧🚶‍♂️");
    } else if (characterState === 'LIFTING_BOARD') {
      setSpeechMessage("Aha! Check out this announcement... 📢✨");
    } else if (characterState === 'HOLDING_BOARD') {
      setSpeechMessage("Jithu here — Don't hurt my bot! 🤖✨");
    } else if (characterState === 'FALLING') {
      setSpeechMessage("Whoa-whoa-whoa! You touched me! Falling down! 😵💫💥");
    } else if (characterState === 'ON_GROUND') {
      setSpeechMessage("Ouch... my circuits are spinning! 🤕💫 Give me a sec to reboot...");
    } else if (characterState === 'GETTING_UP') {
      setSpeechMessage("Dusting off my hoodie... TinkerHub builders always bounce back! 🦾✨");
    } else if (characterState === 'LOOKING_AWAY') {
      setSpeechMessage("Looking away coolly... (Click 'Track Cursor 🎯' to follow your mouse!)");
    } else if (characterState === 'WALKING') {
      setSpeechMessage("Walking over to guide your login... 🚶‍♂️");
    } else if (characterState === 'IDLE_LOOKING') {
      setSpeechMessage("Checking the login portal... 📋");
    } else if (characterState === 'TURNING') {
      setSpeechMessage("Hey campus builder! Ready for tech events? 👋");
    } else if (characterState === 'WAVING') {
      setSpeechMessage("Hey there! Great to see you at TinkerHub SBCE! 👋✨");
    } else if (characterState === 'CELEBRATING') {
      setSpeechMessage("Woohoo! Let's build incredible things together! 🎉🚀");
    } else {
      setSpeechMessage("I'm tracking your cursor wherever you move! 👀✨");
    }
  }, [currentFocus, isSubmitting, isSuccess, characterState, speechText]);

  // ==========================================
  // Interactive Actions
  // ==========================================

  // 1. DRAG & SHOW SIGNBOARD
  const triggerShowBoard = () => {
    clearPendingTimeouts();
    setCharacterState('DRAGGING_BOARD');
    setSpeechMessage("Heave-ho! Dragging this board over for you... 🪧🚶‍♂️");

    const t1 = setTimeout(() => {
      setCharacterState('LIFTING_BOARD');
      setSpeechMessage("Aha! Check out this announcement... 📢✨");
    }, 3200);

    const t2 = setTimeout(() => {
      setCharacterState('HOLDING_BOARD');
      setSpeechMessage("Jithu here — Don't hurt my bot! 🤖✨");
    }, 4200);

    const t3 = setTimeout(() => {
      setCharacterState('IDLE');
      setSpeechMessage("Now tracking your cursor wherever you move! 👀✨");
    }, 11500);

    timeoutsRef.current = [t1, t2, t3];
    if (onCharacterClick) onCharacterClick();
  };

  // 2. TOUCH / CLICK TO FALL DOWN INTERACTION
  const triggerFallDown = () => {
    clearPendingTimeouts();
    setCharacterState('FALLING');
    setSpeechMessage('Whoa-whoa-whoa! You touched me! Falling down! 😵💫💥');

    // Phase 2: Sitting dazed on the ground with spinning stars
    const t1 = setTimeout(() => {
      setCharacterState('ON_GROUND');
      setSpeechMessage('Oof! My circuits are spinning... 🤕💫 Give me a sec...');
    }, 600);

    // Phase 3: Push off floor and stand up
    const t2 = setTimeout(() => {
      setCharacterState('GETTING_UP');
      setSpeechMessage('Alright, dusting off my hoodie... 🦾✨');
    }, 2800);

    // Phase 4: Settle back into active cursor tracking
    const t3 = setTimeout(() => {
      setCharacterState('IDLE');
      setSpeechMessage('Back on my feet and tracking your cursor! 👀✨');
    }, 4400);

    timeoutsRef.current = [t1, t2, t3];
    if (onCharacterClick) onCharacterClick();
  };

  // 3. ACTIVE CURSOR TRACKING
  const triggerTrackCursor = () => {
    clearPendingTimeouts();
    setCharacterState('IDLE');
    setSpeechMessage('Tracking your cursor! Move your mouse around! 👀🎯');
  };

  // 4. LOOK AWAY
  const triggerLookAway = () => {
    clearPendingTimeouts();
    setCharacterState('LOOKING_AWAY');
    setSpeechMessage('Looking away coolly... Not even paying attention! 👀✨');
  };

  // 5. THUMBS UP
  const triggerThumbsUp = () => {
    clearPendingTimeouts();
    setCharacterState('REACTION');
    setSpeechMessage('Awesome! Keep building! 👍🔥');
    const t = setTimeout(() => {
      setCharacterState('IDLE');
    }, 1800);
    timeoutsRef.current = [t];
    if (onCharacterClick) onCharacterClick();
  };

  // 6. WAVE
  const triggerWave = () => {
    clearPendingTimeouts();
    setCharacterState('WAVING');
    setSpeechMessage('Hey! Welcome to TinkerHub EventVerse! 👋💫');
    const t = setTimeout(() => {
      setCharacterState('IDLE');
    }, 2400);
    timeoutsRef.current = [t];
    if (onCharacterClick) onCharacterClick();
  };

  // 7. CELEBRATE
  const triggerCelebrate = () => {
    clearPendingTimeouts();
    setCharacterState('CELEBRATING');
    setSpeechMessage('Let’s go! Build, learn and tinker! 🎉🚀');
    const t = setTimeout(() => {
      setCharacterState('IDLE');
    }, 2500);
    timeoutsRef.current = [t];
    if (onCharacterClick) onCharacterClick();
  };

  return (
    <div className={minimal ? "w-full h-full relative flex flex-col items-center select-none" : "w-full relative flex flex-col items-center select-none"}>
      {/* Dynamic Speech Dialogue Bubble */}
      {!minimal && (
      <div className="w-full max-w-sm mb-2 px-2 z-10">
        <div className="relative bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg shadow-pink-500/10 border border-pink-100 transition-all duration-300">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold text-gray-900 tracking-wide uppercase">
              {characterName} · 3D Mascot
            </span>
            <span className="ml-auto text-[10px] text-pink-600 font-semibold px-2 py-0.5 bg-pink-50 rounded-full border border-pink-200">
              {characterState === 'IDLE' ? 'LOOKING AT CURSOR' : characterState.replace('_', ' ')}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed">
            {speechMessage}
          </p>
          <div className="absolute -bottom-2 left-8 w-4 h-4 bg-white/95 border-r border-b border-pink-100 transform rotate-45" />
        </div>
      </div>
      )}

      {/* React Three Fiber Interactive Canvas Stage */}
      <div
        className={minimal
          ? "w-full h-full relative rounded-full overflow-hidden bg-transparent"
          : "w-full h-[380px] sm:h-[430px] md:h-[470px] relative rounded-3xl overflow-hidden cursor-pointer bg-gradient-to-b from-slate-50/60 via-pink-50/30 to-slate-100/60 shadow-inner group"}
        onClick={minimal ? undefined : triggerFallDown}
        onTouchStart={minimal ? undefined : triggerFallDown}
        title={minimal ? undefined : "Touch or click TinkerBot to make him fall down!"}
      >
        {!minimal && (
        <>
        {/* Animated Avatar Status Badge */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 bg-white/85 backdrop-blur-md rounded-full border border-pink-100 shadow-2xs text-[11px] font-bold text-gray-800 pointer-events-none">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>3D Cursor Follow</span>
        </div>

        {/* Interactive Push Hint Badge */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full border border-pink-200 shadow-md text-[11px] font-bold text-pink-600 group-hover:scale-105 transition-all pointer-events-none">
          <Zap className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
          <span>Touch or Click me to push me down! 💥</span>
        </div>

        <div className="absolute top-3 right-3 z-20 flex items-center gap-1 px-2.5 py-1 bg-pink-50/90 backdrop-blur-md rounded-full border border-pink-200 text-[10px] font-semibold text-pink-700 pointer-events-none">
          <Sparkles className="w-3 h-3 text-pink-600 animate-spin" />
          <span>Live 3D Engine</span>
        </div>
        </>
        )}

        {/* 3D Canvas with Cannon Physics Integration */}
        <Canvas
          shadows
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.15,
          }}
          className="w-full h-full"
        >
          <ResponsiveCameraController
            currentFocus={currentFocus}
            isSuccess={isSuccess}
            characterState={characterState}
            pointerPos={pointerPos}
          />
          <StudioLighting />
          <AmbientSparkles />

          <Physics
            gravity={[0, -9.82, 0]}
            defaultContactMaterial={{ friction: 0.45, restitution: 0.25 }}
            tolerance={0.001}
            iterations={10}
          >
            <MascotAvatarScene
              characterState={characterState}
              currentFocus={currentFocus}
              isSubmitting={isSubmitting}
              isSuccess={isSuccess}
              pointerPos={pointerPos}
              minimal={minimal}
            />
          </Physics>

          <ContactShadows
            position={[0, 0, 0]}
            opacity={0.38}
            scale={4.8}
            blur={2.2}
            far={1.6}
            color="#db2777"
          />
        </Canvas>
      </div>

      {/* Quick Interactive Animation Controls */}
      {!minimal && (
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2 z-10">
        <button
          type="button"
          onClick={triggerShowBoard}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 font-bold text-xs rounded-full shadow-md transition-all cursor-pointer ${
            characterState === 'HOLDING_BOARD' || characterState === 'DRAGGING_BOARD' || characterState === 'LIFTING_BOARD'
              ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-pink-500/30 ring-2 ring-pink-400'
              : 'bg-white hover:bg-pink-50 text-pink-700 border border-pink-200 hover:border-pink-400 shadow-2xs'
          }`}
        >
          <Megaphone className="w-3.5 h-3.5 text-pink-600" />
          <span>Show Board 🪧</span>
        </button>

        <button
          type="button"
          onClick={triggerTrackCursor}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 font-bold text-xs rounded-full shadow-2xs transition-all cursor-pointer ${
            characterState === 'IDLE'
              ? 'bg-pink-600 text-white shadow-pink-500/25 ring-2 ring-pink-400'
              : 'bg-white/90 hover:bg-white text-gray-700 border border-pink-100 hover:border-pink-300'
          }`}
        >
          <Crosshair className={`w-3.5 h-3.5 ${characterState === 'IDLE' ? 'text-white' : 'text-pink-600'}`} />
          <span>Track Cursor 🎯</span>
        </button>

        <button
          type="button"
          onClick={triggerFallDown}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-500 via-rose-500 to-pink-600 hover:opacity-95 text-white font-bold text-xs rounded-full shadow-md shadow-rose-500/25 active:scale-95 transition-all cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5 fill-white text-white" />
          <span>Poke / Push 💥</span>
        </button>

        <button
          type="button"
          onClick={triggerLookAway}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 font-bold text-xs rounded-full shadow-2xs transition-all cursor-pointer ${
            characterState === 'LOOKING_AWAY'
              ? 'bg-pink-600 text-white shadow-pink-500/25 ring-2 ring-pink-400'
              : 'bg-white/90 hover:bg-white text-gray-700 border border-pink-100 hover:border-pink-300'
          }`}
        >
          <EyeOff className={`w-3.5 h-3.5 ${characterState === 'LOOKING_AWAY' ? 'text-white' : 'text-pink-600'}`} />
          <span>Look Away 👀</span>
        </button>

        <button
          type="button"
          onClick={triggerThumbsUp}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/90 hover:bg-white text-gray-700 font-bold text-xs rounded-full border border-pink-100 shadow-2xs hover:border-pink-300 transition-all cursor-pointer"
        >
          <ThumbsUp className="w-3.5 h-3.5 text-pink-600" />
          <span>Thumbs Up 👍</span>
        </button>

        <button
          type="button"
          onClick={triggerWave}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/90 hover:bg-white text-gray-700 font-bold text-xs rounded-full border border-pink-100 shadow-2xs hover:border-pink-300 transition-all cursor-pointer"
        >
          <Hand className="w-3.5 h-3.5 text-pink-600" />
          <span>Wave 👋</span>
        </button>

        <button
          type="button"
          onClick={triggerCelebrate}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/90 hover:bg-white text-gray-700 font-bold text-xs rounded-full border border-pink-100 shadow-2xs hover:border-pink-300 transition-all cursor-pointer"
        >
          <PartyPopper className="w-3.5 h-3.5 text-amber-500" />
          <span>Celebrate 🎉</span>
        </button>
      </div>
      )}
    </div>
  );
};

// Aliases for seamless imports across naming conventions
export const ThreeDCharacterCanvas = ThreeDCharacterScene;
export const AnimatedGuideMan = ThreeDCharacterScene;
export default ThreeDCharacterScene;


