import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { CharacterState, FieldFocusTarget } from './types';

/**
 * Creates high-resolution retina canvas texture for the draggable signboard
 * containing the user's custom text:
 * "Jithu here — Don't hurt my bot"
 * Rendered in giant, ultra-crisp, bright, high-contrast typography without blurry glow.
 */
function createSignboardTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1400;
  canvas.height = 880;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  // 1. Solid High-Contrast Dark Slate Cyber Backing Plate
  const bgGrad = ctx.createLinearGradient(0, 0, 1400, 880);
  bgGrad.addColorStop(0, '#090d16');
  bgGrad.addColorStop(0.5, '#0f172a');
  bgGrad.addColorStop(1, '#1e1b4b');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1400, 880);

  // Subtle clean cyber grid (sharp, zero blur)
  ctx.strokeStyle = 'rgba(236, 72, 153, 0.15)';
  ctx.lineWidth = 2;
  for (let x = 50; x < 1400; x += 70) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 880);
    ctx.stroke();
  }
  for (let y = 50; y < 880; y += 70) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1400, y);
    ctx.stroke();
  }

  // Crisp Solid Outer Border (Vivid Neon Pink, no blurry glow)
  ctx.strokeStyle = '#ec4899';
  ctx.lineWidth = 16;
  ctx.strokeRect(20, 20, 1360, 840);

  // Crisp Inner White Wireframe Border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 3;
  ctx.strokeRect(36, 36, 1328, 808);

  // 2. Top Header Pill Badge: "⚡ JITHU HERE ⚡"
  const pillGrad = ctx.createLinearGradient(380, 52, 1020, 132);
  pillGrad.addColorStop(0, '#ec4899');
  pillGrad.addColorStop(0.5, '#f43f5e');
  pillGrad.addColorStop(1, '#ec4899');
  ctx.fillStyle = pillGrad;
  ctx.beginPath();
  ctx.roundRect(380, 52, 640, 78, 39);
  ctx.fill();

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3.5;
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 42px "Plus Jakarta Sans", "Segoe UI", system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('⚡ JITHU HERE ⚡', 700, 91);

  // 3. Central Big Message Box Container (Crisp Solid Border, No Blur)
  const boxGrad = ctx.createLinearGradient(70, 155, 1330, 725);
  boxGrad.addColorStop(0, '#0f172a');
  boxGrad.addColorStop(0.5, '#2e1065');
  boxGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = boxGrad;
  ctx.beginPath();
  ctx.roundRect(65, 155, 1270, 570, 28);
  ctx.fill();

  ctx.strokeStyle = '#f43f5e';
  ctx.lineWidth = 5;
  ctx.stroke();

  // Inner decorative crisp cyan corner brackets (sharp lines, zero blur)
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 5;
  // Top-left corner bracket
  ctx.beginPath();
  ctx.moveTo(95, 240);
  ctx.lineTo(95, 185);
  ctx.lineTo(150, 185);
  ctx.stroke();
  // Top-right corner bracket
  ctx.beginPath();
  ctx.moveTo(1305, 240);
  ctx.lineTo(1305, 185);
  ctx.lineTo(1250, 185);
  ctx.stroke();
  // Bottom-left corner bracket
  ctx.beginPath();
  ctx.moveTo(95, 640);
  ctx.lineTo(95, 695);
  ctx.lineTo(150, 695);
  ctx.stroke();
  // Bottom-right corner bracket
  ctx.beginPath();
  ctx.moveTo(1305, 640);
  ctx.lineTo(1305, 695);
  ctx.lineTo(1250, 695);
  ctx.stroke();

  // 4. GIANT, CRISP, BRIGHT, ULTRA-VISIBLE TYPOGRAPHY (NO GLOW / BLUR)
  // Line 1: "Jithu here —"
  ctx.fillStyle = '#fde047'; // Bright Vivid Amber / Golden Yellow
  ctx.font = '900 102px "Plus Jakarta Sans", "Segoe UI", system-ui, -apple-system, sans-serif';
  ctx.fillText('Jithu here —', 700, 310);

  // Line 2: "Don't hurt my bot"
  ctx.fillStyle = '#ffffff'; // Bright Pure Solid White
  ctx.font = '900 100px "Plus Jakarta Sans", "Segoe UI", system-ui, -apple-system, sans-serif';
  ctx.fillText("Don't hurt my bot", 700, 470);

  // Accent icon badge below line 2
  ctx.fillStyle = '#38bdf8'; // Bright Electric Cyan
  ctx.font = '900 68px "Plus Jakarta Sans", "Segoe UI", system-ui, -apple-system, sans-serif';
  ctx.fillText('🤖 ⚡ 🦾', 700, 615);

  // 5. Bottom TinkerHub Subtext
  ctx.fillStyle = '#93c5fd';
  ctx.font = '800 30px "Plus Jakarta Sans", "Segoe UI", system-ui, -apple-system, sans-serif';
  ctx.fillText('✦ TinkerHub SBCE Campus Edition · Pure Vibes Only ✦', 700, 795);

  // 6. Corner Decorative Metal Hex Screws
  const drawScrew = (x: number, y: number) => {
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.arc(x, y, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.fill();
  };
  drawScrew(56, 56);
  drawScrew(1344, 56);
  drawScrew(56, 824);
  drawScrew(1344, 824);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

/**
 * Ultra-High Definition Stylized 3D TinkerHub Mascot Bot:
 * - Defined Athletic Tech-Streetwear Silhouette (Sculpted Pectorals, Tapered Waist, Deltoids & Calves)
 * - Two-Tone Premium White/Ice-Mist Hoodie with Embroidered Chest Patch, Metal Zipper Pull & Tech Aglets
 * - Deep Charcoal Cargo Joggers with 3D Flap Pockets, Neon Pull-Tabs, Articulated Knees & Dual Athletic Piping
 * - Designer Chunky High-Top Sneakers with Translucent Air-Cushion Heels, TPU Stabilizer & Criss-Cross Laces
 * - Cyber Over-Ear Tech Headphones with Pulsing Neon Sound Rings & Brushed Titanium Arch
 * - Translucent Chromatic Visor with Animated Digital LED Eyes (Blinking, Expressions, Gaze Tracking)
 * - Interactive Holographic Smartwatch with Glowing Radial UI
 * - Draggable & Liftable 3D Signboard with Custom Canvas Graphics
 * - Full Ragdoll Physics, Aloof Look-Away, Screen-Wide Gaze Follow, and Celebration Sequences
 */
export class TinkerHubMascot3D {
  public root: THREE.Group;

  // Skeletal Hierarchy Nodes
  public hips: THREE.Group;
  public spine: THREE.Group;
  public chest: THREE.Group;
  public neck: THREE.Group;
  public head: THREE.Group;

  // Head & Visor Components
  public logoEmblem: THREE.Group;
  public logoGlowDisc: THREE.Mesh;
  public haloRing: THREE.Mesh;
  public haloRingOuter: THREE.Mesh;
  public dizzyStarsGroup: THREE.Group;
  public leftEye: THREE.Mesh;
  public rightEye: THREE.Mesh;
  public leftHeadphoneLight: THREE.Mesh;
  public rightHeadphoneLight: THREE.Mesh;

  // Upper Body & Arms
  public leftShoulder: THREE.Group;
  public leftUpperArm: THREE.Group;
  public leftForearm: THREE.Group;
  public leftHand: THREE.Group;
  public leftWristwatch: THREE.Group;
  public watchHoloScreen: THREE.Mesh;

  public rightShoulder: THREE.Group;
  public rightUpperArm: THREE.Group;
  public rightForearm: THREE.Group;
  public rightHand: THREE.Group;
  public thumbJoint: THREE.Group;
  public glintMesh: THREE.Mesh;

  // Lower Body & Legs
  public leftHip: THREE.Group;
  public leftKnee: THREE.Group;
  public leftFoot: THREE.Group;
  public leftAirCushion: THREE.Mesh;

  public rightHip: THREE.Group;
  public rightKnee: THREE.Group;
  public rightFoot: THREE.Group;
  public rightAirCushion: THREE.Mesh;

  // Drawstrings on hoodie
  public leftString: THREE.Group;
  public rightString: THREE.Group;

  // Draggable Signboard
  public signboardGroup: THREE.Group;
  public signboardFace: THREE.Mesh;
  public signboardTexture: THREE.CanvasTexture | null = null;

  // Weighted Physics & Spring-Damper Inertial Simulation State
  public boardPosOffset = new THREE.Vector3(0, 0, 0);
  public boardPosVel = new THREE.Vector3(0, 0, 0);
  public boardRotOffset = new THREE.Vector3(0, 0, 0); // (pitch X, yaw Y, roll Z)
  public boardRotVel = new THREE.Vector3(0, 0, 0);

  public boardBasePos = new THREE.Vector3(0.55, 0.32, -0.25);
  public boardBaseRot = new THREE.Vector3(0.2, 0.35, -0.55);

  private prevRootX = 1.8;
  private prevPointer = new THREE.Vector2(0, 0);
  private prevHipsY = 0.88;
  private prevCharacterState: CharacterState = 'DRAGGING_BOARD';

  private materials: THREE.Material[] = [];
  private blinkTimer = 0;
  private isBlinking = false;

  constructor() {
    this.root = new THREE.Group();

    // ==========================================
    // 1. High-Quality PBR & Physical Materials
    // ==========================================
    // Primary Crisp White Hoodie Fabric with subtle micro-sheen
    const hoodieMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#f8fafc'),
      roughness: 0.55,
      metalness: 0.04,
    });
    this.materials.push(hoodieMat);

    // Accent Icy-Slate Hoodie Trim
    const hoodieTrimMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#cbd5e1'),
      roughness: 0.5,
      metalness: 0.12,
    });
    this.materials.push(hoodieTrimMat);

    // High-Contrast Cyber Pink Accent Material
    const cyberPinkMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#ec4899'),
      emissive: new THREE.Color('#db2777'),
      emissiveIntensity: 0.9,
      roughness: 0.2,
      metalness: 0.1,
    });
    this.materials.push(cyberPinkMat);

    // Shiny Polished Chrome Metal
    const chromeMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#f1f5f9'),
      metalness: 0.95,
      roughness: 0.15,
    });
    this.materials.push(chromeMat);

    // Dark Gunmetal Tech Accents
    const darkGunmetalMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#0f172a'),
      metalness: 0.85,
      roughness: 0.25,
    });
    this.materials.push(darkGunmetalMat);

    // Deep Charcoal Athletic Cargo Pants Fabric
    const cargoPantsMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1e293b'),
      roughness: 0.78,
      metalness: 0.05,
    });
    this.materials.push(cargoPantsMat);

    const cargoPantsAccentMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#334155'),
      roughness: 0.7,
      metalness: 0.1,
    });
    this.materials.push(cargoPantsAccentMat);

    // Athletic Neon / Crisp White Side Piping
    const pipingWhiteMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#ffffff'),
      roughness: 0.4,
    });
    this.materials.push(pipingWhiteMat);

    const pipingPinkMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#f43f5e'),
      emissive: new THREE.Color('#e11d48'),
      emissiveIntensity: 0.7,
      roughness: 0.3,
    });
    this.materials.push(pipingPinkMat);

    // Sculpted Skin Tone for Hands & Neck Base
    const skinMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#e2a17b'),
      roughness: 0.48,
      metalness: 0.02,
    });
    this.materials.push(skinMat);

    // Sneaker Materials
    const sneakerWhiteMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#ffffff'),
      roughness: 0.3,
      metalness: 0.05,
    });
    this.materials.push(sneakerWhiteMat);

    const sneakerOrangeMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#fb923c'),
      emissive: new THREE.Color('#ea580c'),
      emissiveIntensity: 0.3,
      roughness: 0.4,
    });
    this.materials.push(sneakerOrangeMat);

    const sneakerDarkMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#090d16'),
      roughness: 0.85,
    });
    this.materials.push(sneakerDarkMat);

    // Translucent Air Cushion Sole Material
    const airCushionMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#38bdf8'),
      emissive: new THREE.Color('#0284c7'),
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.7,
      roughness: 0.1,
      transmission: 0.85,
      thickness: 0.4,
    });
    this.materials.push(airCushionMat);

    // Translucent Glass Visor Dome
    const glassVisorMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#fbcfe8'),
      transparent: true,
      opacity: 0.32,
      roughness: 0.06,
      transmission: 0.88,
      thickness: 0.5,
      reflectivity: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    this.materials.push(glassVisorMat);

    // Glowing LED Digital Eyes
    const ledEyeMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
    });
    this.materials.push(ledEyeMat);

    // Holographic Smartwatch Display
    const holoScreenMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
    });
    this.materials.push(holoScreenMat);

    // TinkerHub 3D Logo Block Materials
    const logoBlockWhiteMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#ffffff'),
      emissive: new THREE.Color('#ffffff'),
      emissiveIntensity: 0.6,
      roughness: 0.1,
      metalness: 0.1,
    });
    this.materials.push(logoBlockWhiteMat);

    const logoBlockPinkMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#ec4899'),
      emissive: new THREE.Color('#db2777'),
      emissiveIntensity: 1.2,
      roughness: 0.15,
      metalness: 0.2,
    });
    this.materials.push(logoBlockPinkMat);

    // Star Material
    const starMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#fbbf24'),
      emissive: new THREE.Color('#f59e0b'),
      emissiveIntensity: 0.9,
      roughness: 0.15,
      metalness: 0.5,
    });
    this.materials.push(starMat);

    // ==========================================
    // 2. Pelvis & Hips (Contoured Zero-Gap Waist)
    // ==========================================
    this.hips = new THREE.Group();
    this.hips.position.y = 0.88;
    this.root.add(this.hips);

    // Seamless Pelvic Saddle
    const pelvisMain = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.16, 0.19, 24), cargoPantsMat);
    pelvisMain.position.y = -0.045;
    pelvisMain.castShadow = true;
    pelvisMain.receiveShadow = true;
    this.hips.add(pelvisMain);

    const pelvisBottom = new THREE.Mesh(new THREE.SphereGeometry(0.165, 18, 14), cargoPantsMat);
    pelvisBottom.scale.set(1.05, 0.72, 0.92);
    pelvisBottom.position.y = -0.095;
    pelvisBottom.castShadow = true;
    this.hips.add(pelvisBottom);

    // Inguinal Crotch Bridge Gusset (Ensures zero gap between legs during wide steps)
    const crotchGusset = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.14), cargoPantsMat);
    crotchGusset.position.set(0, -0.085, 0);
    this.hips.add(crotchGusset);

    // Left & Right Pelvic Acetabular Leg Sockets
    const leftPelvicSocket = new THREE.Mesh(
      new THREE.TorusGeometry(0.095, 0.016, 12, 24),
      cargoPantsAccentMat
    );
    leftPelvicSocket.position.set(-0.105, -0.06, 0);
    leftPelvicSocket.rotation.x = Math.PI / 2;
    this.hips.add(leftPelvicSocket);

    const rightPelvicSocket = new THREE.Mesh(
      new THREE.TorusGeometry(0.095, 0.016, 12, 24),
      cargoPantsAccentMat
    );
    rightPelvicSocket.position.set(0.105, -0.06, 0);
    rightPelvicSocket.rotation.x = Math.PI / 2;
    this.hips.add(rightPelvicSocket);

    // Front Pants Fly & Utility Stitch Line
    const pantsFly = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.13, 0.01), cargoPantsAccentMat);
    pantsFly.position.set(0, -0.04, 0.165);
    this.hips.add(pantsFly);

    // ==========================================
    // 3. Spine, Waist & Torso (Sculpted Athletic Hoodie)
    // ==========================================
    this.spine = new THREE.Group();
    this.spine.position.y = 0.05;
    this.hips.add(this.spine);

    // Multi-Groove Ribbed Waistband
    const waistBand = new THREE.Mesh(new THREE.CylinderGeometry(0.188, 0.185, 0.065, 24), hoodieTrimMat);
    waistBand.position.y = 0.025;
    waistBand.castShadow = true;
    this.spine.add(waistBand);

    // Waistband contrast piping ring
    const waistPiping = new THREE.Mesh(new THREE.TorusGeometry(0.187, 0.006, 8, 32), cyberPinkMat);
    waistPiping.rotation.x = Math.PI / 2;
    waistPiping.position.y = 0.05;
    this.spine.add(waistPiping);

    this.chest = new THREE.Group();
    this.chest.position.y = 0.18;
    this.spine.add(this.chest);

    // Sculpted Athletic Torso (Broad shoulders, subtle taper to waist)
    const torsoMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.225, 0.192, 0.32, 28), hoodieMat);
    torsoMesh.position.y = 0.05;
    torsoMesh.castShadow = true;
    torsoMesh.receiveShadow = true;
    this.chest.add(torsoMesh);

    // Left & Right Glenoid Shoulder Socket Housings (Zero-gap ball-and-socket anchor)
    const leftShoulderSocket = new THREE.Mesh(
      new THREE.TorusGeometry(0.095, 0.022, 16, 24),
      hoodieTrimMat
    );
    leftShoulderSocket.position.set(-0.21, 0.17, 0);
    leftShoulderSocket.rotation.set(0, 0.15, -Math.PI / 2 + 0.15);
    this.chest.add(leftShoulderSocket);

    const leftAxillaryBridge = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 16, 16),
      hoodieMat
    );
    leftAxillaryBridge.scale.set(0.85, 1.25, 0.85);
    leftAxillaryBridge.position.set(-0.19, 0.09, 0);
    this.chest.add(leftAxillaryBridge);

    const rightShoulderSocket = new THREE.Mesh(
      new THREE.TorusGeometry(0.095, 0.022, 16, 24),
      hoodieTrimMat
    );
    rightShoulderSocket.position.set(0.21, 0.17, 0);
    rightShoulderSocket.rotation.set(0, -0.15, Math.PI / 2 - 0.15);
    this.chest.add(rightShoulderSocket);

    const rightAxillaryBridge = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 16, 16),
      hoodieMat
    );
    rightAxillaryBridge.scale.set(0.85, 1.25, 0.85);
    rightAxillaryBridge.position.set(0.19, 0.09, 0);
    this.chest.add(rightAxillaryBridge);

    // Defined Pectoral Contours
    const chestLeftPec = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 16), hoodieMat);
    chestLeftPec.scale.set(0.95, 0.75, 0.8);
    chestLeftPec.position.set(-0.08, 0.09, 0.09);
    chestLeftPec.castShadow = true;
    this.chest.add(chestLeftPec);

    const chestRightPec = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 16), hoodieMat);
    chestRightPec.scale.set(0.95, 0.75, 0.8);
    chestRightPec.position.set(0.08, 0.09, 0.09);
    chestRightPec.castShadow = true;
    this.chest.add(chestRightPec);

    // Polished Chrome Center Zipper Track
    const zipperTrack = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.32, 0.015), chromeMat);
    zipperTrack.position.set(0, 0.05, 0.208);
    zipperTrack.castShadow = true;
    this.chest.add(zipperTrack);

    // Metallic Zipper Slider & Pull Tab
    const zipperSlider = new THREE.Mesh(new THREE.BoxGeometry(0.026, 0.038, 0.022), darkGunmetalMat);
    zipperSlider.position.set(0, 0.14, 0.218);
    this.chest.add(zipperSlider);

    const zipperPullTab = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.045, 0.008), chromeMat);
    zipperPullTab.position.set(0, 0.11, 0.228);
    zipperPullTab.rotation.x = 0.15;
    this.chest.add(zipperPullTab);

    // Embroidered TinkerHub SBCE Tech Chest Patch (Left Chest)
    const chestBadge = new THREE.Group();
    chestBadge.position.set(-0.11, 0.12, 0.185);
    chestBadge.rotation.y = -0.3;
    this.chest.add(chestBadge);

    const badgeBase = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.042, 0.01), darkGunmetalMat);
    chestBadge.add(badgeBase);

    const badgeEmblem = new THREE.Mesh(new THREE.BoxGeometry(0.042, 0.024, 0.012), cyberPinkMat);
    badgeEmblem.position.z = 0.004;
    chestBadge.add(badgeEmblem);

    // Tailored Kangaroo Pocket with Flap Trim
    const pouchPocket = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.11, 0.052), hoodieTrimMat);
    pouchPocket.position.set(0, -0.06, 0.182);
    pouchPocket.castShadow = true;
    this.chest.add(pouchPocket);

    // Left & Right Pocket Slits with Pink Accent Trims
    const leftPocketTrim = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.09, 0.012), cyberPinkMat);
    leftPocketTrim.position.set(-0.115, -0.06, 0.208);
    leftPocketTrim.rotation.z = -0.28;
    this.chest.add(leftPocketTrim);

    const rightPocketTrim = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.09, 0.012), cyberPinkMat);
    rightPocketTrim.position.set(0.115, -0.06, 0.208);
    rightPocketTrim.rotation.z = 0.28;
    this.chest.add(rightPocketTrim);

    // Tech Drawstrings with Metal Aglets & Silicone Stoppers
    this.leftString = new THREE.Group();
    this.leftString.position.set(-0.065, 0.19, 0.18);
    this.chest.add(this.leftString);

    const leftCord = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.13, 8), hoodieMat);
    leftCord.position.y = -0.065;
    this.leftString.add(leftCord);

    const leftStopper = new THREE.Mesh(new THREE.SphereGeometry(0.01, 8, 8), darkGunmetalMat);
    leftStopper.position.y = -0.02;
    this.leftString.add(leftStopper);

    const leftAglet = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.025, 8), chromeMat);
    leftAglet.position.y = -0.135;
    this.leftString.add(leftAglet);

    this.rightString = new THREE.Group();
    this.rightString.position.set(0.065, 0.19, 0.18);
    this.chest.add(this.rightString);

    const rightCord = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.13, 8), hoodieMat);
    rightCord.position.y = -0.065;
    this.rightString.add(rightCord);

    const rightStopper = new THREE.Mesh(new THREE.SphereGeometry(0.01, 8, 8), darkGunmetalMat);
    rightStopper.position.y = -0.02;
    this.rightString.add(rightStopper);

    const rightAglet = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.025, 8), chromeMat);
    rightAglet.position.y = -0.135;
    this.rightString.add(rightAglet);

    // Sculpted Cowl Hood Collar (Surrounds Neck Base)
    const hoodCollar = new THREE.Mesh(
      new THREE.TorusGeometry(0.135, 0.058, 16, 28, Math.PI * 2),
      hoodieMat
    );
    hoodCollar.position.set(0, 0.215, 0.02);
    hoodCollar.rotation.x = Math.PI / 2.2;
    hoodCollar.castShadow = true;
    this.chest.add(hoodCollar);

    const hoodDrapeBack = new THREE.Mesh(
      new THREE.TorusGeometry(0.155, 0.065, 14, 24, Math.PI * 1.3),
      hoodieTrimMat
    );
    hoodDrapeBack.position.set(0, 0.195, -0.105);
    hoodDrapeBack.rotation.x = Math.PI / 2.1;
    hoodDrapeBack.castShadow = true;
    this.chest.add(hoodDrapeBack);

    // ==========================================
    // 4. Neck & Head Base
    // ==========================================
    this.neck = new THREE.Group();
    this.neck.position.y = 0.24;
    this.chest.add(this.neck);

    const neckBaseCap = new THREE.Mesh(new THREE.SphereGeometry(0.075, 14, 10), skinMat);
    neckBaseCap.position.y = 0.01;
    this.neck.add(neckBaseCap);

    const neckMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.075, 0.1, 16), skinMat);
    neckMesh.position.y = 0.05;
    neckMesh.castShadow = true;
    this.neck.add(neckMesh);

    // ==========================================
    // 5. 3D Cyber Mascot Head, Visor & Animated Face
    // ==========================================
    this.head = new THREE.Group();
    this.head.position.y = 0.11;
    this.neck.add(this.head);

    // Collar Socket Cap
    const headSocket = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.08, 0.04, 20), hoodieTrimMat);
    headSocket.position.y = 0.02;
    this.head.add(headSocket);

    // Glowing Neon Energy Base Disc
    const glowDiscGeo = new THREE.RingGeometry(0.12, 0.27, 32);
    const glowDiscMat = new THREE.MeshBasicMaterial({
      color: 0xec4899,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide,
    });
    this.logoGlowDisc = new THREE.Mesh(glowDiscGeo, glowDiscMat);
    this.logoGlowDisc.rotation.x = Math.PI / 2;
    this.logoGlowDisc.position.y = 0.03;
    this.head.add(this.logoGlowDisc);

    // Aerodynamic Translucent Glass Visor Pod
    const podGeo = new THREE.SphereGeometry(0.235, 32, 32);
    podGeo.scale(1.18, 1.08, 0.94);
    const podMesh = new THREE.Mesh(podGeo, glassVisorMat);
    podMesh.position.set(0, 0.2, 0);
    this.head.add(podMesh);

    // Animated Digital LED Eyes inside Visor
    const eyeGeo = new THREE.CapsuleGeometry(0.016, 0.042, 8, 12);
    eyeGeo.rotateZ(Math.PI / 2);

    this.leftEye = new THREE.Mesh(eyeGeo, ledEyeMat);
    this.leftEye.position.set(-0.075, 0.23, 0.16);
    this.head.add(this.leftEye);

    this.rightEye = new THREE.Mesh(eyeGeo, ledEyeMat);
    this.rightEye.position.set(0.075, 0.23, 0.16);
    this.head.add(this.rightEye);

    // Cyber Tech Over-Ear Headphones (Left & Right)
    const headphoneArch = new THREE.Mesh(
      new THREE.TorusGeometry(0.245, 0.016, 12, 32, Math.PI),
      darkGunmetalMat
    );
    headphoneArch.position.set(0, 0.21, 0);
    headphoneArch.rotation.z = Math.PI;
    this.head.add(headphoneArch);

    // Left Ear Cup & Pulsing Neon Ring
    const leftEarCup = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.04, 20), darkGunmetalMat);
    leftEarCup.rotation.z = Math.PI / 2;
    leftEarCup.position.set(-0.25, 0.2, 0);
    this.head.add(leftEarCup);

    this.leftHeadphoneLight = new THREE.Mesh(
      new THREE.RingGeometry(0.03, 0.055, 20),
      new THREE.MeshBasicMaterial({ color: 0xec4899, side: THREE.DoubleSide })
    );
    this.leftHeadphoneLight.rotation.y = Math.PI / 2;
    this.leftHeadphoneLight.position.set(-0.272, 0.2, 0);
    this.head.add(this.leftHeadphoneLight);

    // Right Ear Cup & Pulsing Neon Ring
    const rightEarCup = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.04, 20), darkGunmetalMat);
    rightEarCup.rotation.z = Math.PI / 2;
    rightEarCup.position.set(0.25, 0.2, 0);
    this.head.add(rightEarCup);

    this.rightHeadphoneLight = new THREE.Mesh(
      new THREE.RingGeometry(0.03, 0.055, 20),
      new THREE.MeshBasicMaterial({ color: 0xec4899, side: THREE.DoubleSide })
    );
    this.rightHeadphoneLight.rotation.y = -Math.PI / 2;
    this.rightHeadphoneLight.position.set(0.272, 0.2, 0);
    this.head.add(this.rightHeadphoneLight);

    // Orbital Gyroscopic Tech Rings
    const haloGeo = new THREE.TorusGeometry(0.275, 0.015, 12, 36);
    const haloMat = new THREE.MeshBasicMaterial({ color: 0xf472b6, wireframe: true });
    this.haloRing = new THREE.Mesh(haloGeo, haloMat);
    this.haloRing.position.set(0, 0.21, 0);
    this.haloRing.rotation.x = Math.PI / 4;
    this.head.add(this.haloRing);

    const haloOuterGeo = new THREE.TorusGeometry(0.33, 0.01, 10, 36);
    const haloOuterMat = new THREE.MeshBasicMaterial({ color: 0xfbcfe8, wireframe: true });
    this.haloRingOuter = new THREE.Mesh(haloOuterGeo, haloOuterMat);
    this.haloRingOuter.position.set(0, 0.21, 0);
    this.haloRingOuter.rotation.y = Math.PI / 3;
    this.head.add(this.haloRingOuter);

    // Dizzy Stars Overhead (Active when fallen or dazed)
    this.dizzyStarsGroup = new THREE.Group();
    this.dizzyStarsGroup.position.set(0, 0.46, 0);
    this.dizzyStarsGroup.visible = false;
    this.head.add(this.dizzyStarsGroup);

    for (let s = 0; s < 4; s++) {
      const angle = (s / 4) * Math.PI * 2;
      const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.034, 0), starMat);
      star.position.set(Math.cos(angle) * 0.22, Math.sin(angle * 2) * 0.04, Math.sin(angle) * 0.22);
      this.dizzyStarsGroup.add(star);
    }

    // 3D Geometric TinkerHub Emblem
    this.logoEmblem = new THREE.Group();
    this.logoEmblem.position.set(0, 0.17, 0);
    this.head.add(this.logoEmblem);

    const createEmblemBlock = (x: number, y: number, w: number, h: number, isWhite = true) => {
      const sx = (x + w / 2 - 50) * 0.0035;
      const sy = -(y + h / 2 - 50) * 0.0035;
      const bw = w * 0.0035;
      const bh = h * 0.0035;
      const depth = 0.045;

      const blockMesh = new THREE.Mesh(
        new THREE.BoxGeometry(bw, bh, depth),
        isWhite ? logoBlockWhiteMat : logoBlockPinkMat
      );
      blockMesh.position.set(sx, sy, 0);
      blockMesh.castShadow = true;
      return blockMesh;
    };

    // Top Row
    this.logoEmblem.add(createEmblemBlock(10, 16, 48, 18, true));
    this.logoEmblem.add(createEmblemBlock(66, 16, 24, 18, true));
    // Middle Row
    this.logoEmblem.add(createEmblemBlock(10, 41, 80, 18, true));
    // Bottom Row
    this.logoEmblem.add(createEmblemBlock(10, 66, 22, 18, true));
    this.logoEmblem.add(createEmblemBlock(39, 66, 22, 18, true));
    this.logoEmblem.add(createEmblemBlock(68, 66, 22, 18, true));

    // Glowing Neon Backplate
    const corePlate = new THREE.Mesh(new THREE.BoxGeometry(0.33, 0.31, 0.022), logoBlockPinkMat);
    corePlate.position.set(0, 0, -0.02);
    this.logoEmblem.add(corePlate);

    // ==========================================
    // 6. LEFT ARM (Sculpted Multi-Joint Deltoid & Cyber Smartwatch)
    // ==========================================
    this.leftShoulder = new THREE.Group();
    this.leftShoulder.position.set(-0.24, 0.18, 0);
    this.chest.add(this.leftShoulder);

    // Deep Inner Glenohumeral Ball (Prevents interior void/gap during high arm raises)
    const leftInnerShoulderBall = new THREE.Mesh(new THREE.SphereGeometry(0.102, 20, 20), hoodieMat);
    this.leftShoulder.add(leftInnerShoulderBall);

    // Contoured Anatomical Deltoid Shoulder Cap (Covers anterior, lateral & posterior heads)
    const leftShoulderCap = new THREE.Mesh(new THREE.SphereGeometry(0.105, 20, 20), hoodieMat);
    leftShoulderCap.scale.set(1.15, 1.25, 1.15);
    leftShoulderCap.position.set(-0.015, -0.01, 0);
    leftShoulderCap.castShadow = true;
    this.leftShoulder.add(leftShoulderCap);

    // Drop-Shoulder Sleeve Overlap Collar (Wraps over upper arm cylinder)
    const leftSleeveDropCollar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.088, 0.082, 0.055, 20),
      hoodieTrimMat
    );
    leftSleeveDropCollar.position.set(0, -0.045, 0);
    leftSleeveDropCollar.castShadow = true;
    this.leftShoulder.add(leftSleeveDropCollar);

    // Shoulder Tech Strap Accent with Cyber Rivet
    const leftShoulderStrap = new THREE.Mesh(new THREE.TorusGeometry(0.092, 0.009, 8, 24), darkGunmetalMat);
    leftShoulderStrap.rotation.x = Math.PI / 2;
    this.leftShoulder.add(leftShoulderStrap);

    const leftShoulderRivet = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.01, 10), cyberPinkMat);
    leftShoulderRivet.position.set(-0.098, 0, 0);
    leftShoulderRivet.rotation.z = Math.PI / 2;
    this.leftShoulder.add(leftShoulderRivet);

    this.leftUpperArm = new THREE.Group();
    this.leftShoulder.add(this.leftUpperArm);

    const leftUpperArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.072, 0.24, 20), hoodieMat);
    leftUpperArmMesh.position.y = -0.12;
    leftUpperArmMesh.castShadow = true;
    this.leftUpperArm.add(leftUpperArmMesh);

    // Distal Bicep/Tricep Overlap Hem (Overlaps elbow ball)
    const leftUpperArmHem = new THREE.Mesh(new THREE.CylinderGeometry(0.078, 0.078, 0.04, 20), hoodieTrimMat);
    leftUpperArmHem.position.y = -0.22;
    leftUpperArmHem.castShadow = true;
    this.leftUpperArm.add(leftUpperArmHem);

    // Articulated Elbow Joint Assembly
    this.leftForearm = new THREE.Group();
    this.leftForearm.position.y = -0.24;
    this.leftUpperArm.add(this.leftForearm);

    // Central Trochlea Elbow Sphere
    const leftElbowBall = new THREE.Mesh(new THREE.SphereGeometry(0.076, 18, 18), hoodieMat);
    leftElbowBall.castShadow = true;
    this.leftForearm.add(leftElbowBall);

    // Posterior Olecranon Elbow Point Guard
    const leftOlecranonCap = new THREE.Mesh(new THREE.SphereGeometry(0.038, 12, 12), cargoPantsAccentMat);
    leftOlecranonCap.position.set(0, 0, -0.062);
    this.leftForearm.add(leftOlecranonCap);

    // Antecubital (Inner Crease) Flex Bellows Ring
    const leftElbowBellows = new THREE.Mesh(new THREE.TorusGeometry(0.068, 0.01, 8, 20), darkGunmetalMat);
    leftElbowBellows.rotation.x = Math.PI / 2;
    this.leftForearm.add(leftElbowBellows);

    const leftForearmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.074, 0.064, 0.22, 20), hoodieMat);
    leftForearmMesh.position.y = -0.11;
    leftForearmMesh.castShadow = true;
    this.leftForearm.add(leftForearmMesh);

    // Ribbed Sleeve Cuff
    const leftSleeveCuff = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.068, 0.045, 18), hoodieTrimMat);
    leftSleeveCuff.position.y = -0.21;
    leftSleeveCuff.castShadow = true;
    this.leftForearm.add(leftSleeveCuff);

    // Cyber Smartwatch on Left Wrist
    this.leftWristwatch = new THREE.Group();
    this.leftWristwatch.position.y = -0.21;
    this.leftForearm.add(this.leftWristwatch);

    const watchRing = new THREE.Mesh(new THREE.CylinderGeometry(0.072, 0.072, 0.032, 20), darkGunmetalMat);
    this.leftWristwatch.add(watchRing);

    const watchCase = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.04, 0.016), darkGunmetalMat);
    watchCase.position.set(0, 0, 0.07);
    this.leftWristwatch.add(watchCase);

    // Holographic Curved UI Screen
    this.watchHoloScreen = new THREE.Mesh(
      new THREE.RingGeometry(0.015, 0.028, 16),
      holoScreenMat
    );
    this.watchHoloScreen.position.set(0, 0, 0.08);
    this.leftWristwatch.add(this.watchHoloScreen);

    // Sculpted Left Hand
    this.leftHand = new THREE.Group();
    this.leftHand.position.y = -0.25;
    this.leftForearm.add(this.leftHand);

    const leftWristBall = new THREE.Mesh(new THREE.SphereGeometry(0.042, 12, 12), skinMat);
    this.leftHand.add(leftWristBall);

    const leftPalm = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.065, 0.032), skinMat);
    leftPalm.position.y = -0.03;
    leftPalm.castShadow = true;
    this.leftHand.add(leftPalm);

    const leftThumb = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.014, 0.045, 8), skinMat);
    leftThumb.position.set(0.03, -0.02, 0.015);
    leftThumb.rotation.z = -0.4;
    this.leftHand.add(leftThumb);

    // ==========================================
    // 7. RIGHT ARM (Sculpted Multi-Joint Deltoid & Thumbs Up 👍)
    // ==========================================
    this.rightShoulder = new THREE.Group();
    this.rightShoulder.position.set(0.24, 0.18, 0);
    this.chest.add(this.rightShoulder);

    // Deep Inner Glenohumeral Ball (Prevents interior void/gap during high arm raises)
    const rightInnerShoulderBall = new THREE.Mesh(new THREE.SphereGeometry(0.102, 20, 20), hoodieMat);
    this.rightShoulder.add(rightInnerShoulderBall);

    // Contoured Anatomical Deltoid Shoulder Cap (Covers anterior, lateral & posterior heads)
    const rightShoulderCap = new THREE.Mesh(new THREE.SphereGeometry(0.105, 20, 20), hoodieMat);
    rightShoulderCap.scale.set(1.15, 1.25, 1.15);
    rightShoulderCap.position.set(0.015, -0.01, 0);
    rightShoulderCap.castShadow = true;
    this.rightShoulder.add(rightShoulderCap);

    // Drop-Shoulder Sleeve Overlap Collar (Wraps over upper arm cylinder)
    const rightSleeveDropCollar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.088, 0.082, 0.055, 20),
      hoodieTrimMat
    );
    rightSleeveDropCollar.position.set(0, -0.045, 0);
    rightSleeveDropCollar.castShadow = true;
    this.rightShoulder.add(rightSleeveDropCollar);

    const rightShoulderStrap = new THREE.Mesh(new THREE.TorusGeometry(0.092, 0.009, 8, 24), darkGunmetalMat);
    rightShoulderStrap.rotation.x = Math.PI / 2;
    this.rightShoulder.add(rightShoulderStrap);

    const rightShoulderRivet = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.01, 10), cyberPinkMat);
    rightShoulderRivet.position.set(0.098, 0, 0);
    rightShoulderRivet.rotation.z = Math.PI / 2;
    this.rightShoulder.add(rightShoulderRivet);

    this.rightUpperArm = new THREE.Group();
    this.rightShoulder.add(this.rightUpperArm);

    const rightUpperArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.072, 0.24, 20), hoodieMat);
    rightUpperArmMesh.position.y = -0.12;
    rightUpperArmMesh.castShadow = true;
    this.rightUpperArm.add(rightUpperArmMesh);

    // Distal Bicep/Tricep Overlap Hem (Overlaps elbow ball)
    const rightUpperArmHem = new THREE.Mesh(new THREE.CylinderGeometry(0.078, 0.078, 0.04, 20), hoodieTrimMat);
    rightUpperArmHem.position.y = -0.22;
    rightUpperArmHem.castShadow = true;
    this.rightUpperArm.add(rightUpperArmHem);

    // Articulated Elbow Joint Assembly
    this.rightForearm = new THREE.Group();
    this.rightForearm.position.y = -0.24;
    this.rightUpperArm.add(this.rightForearm);

    // Central Trochlea Elbow Sphere
    const rightElbowBall = new THREE.Mesh(new THREE.SphereGeometry(0.076, 18, 18), hoodieMat);
    rightElbowBall.castShadow = true;
    this.rightForearm.add(rightElbowBall);

    // Posterior Olecranon Elbow Point Guard
    const rightOlecranonCap = new THREE.Mesh(new THREE.SphereGeometry(0.038, 12, 12), cargoPantsAccentMat);
    rightOlecranonCap.position.set(0, 0, -0.062);
    this.rightForearm.add(rightOlecranonCap);

    // Antecubital (Inner Crease) Flex Bellows Ring
    const rightElbowBellows = new THREE.Mesh(new THREE.TorusGeometry(0.068, 0.01, 8, 20), darkGunmetalMat);
    rightElbowBellows.rotation.x = Math.PI / 2;
    this.rightForearm.add(rightElbowBellows);

    const rightForearmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.074, 0.064, 0.22, 20), hoodieMat);
    rightForearmMesh.position.y = -0.11;
    rightForearmMesh.castShadow = true;
    this.rightForearm.add(rightForearmMesh);

    // Ribbed Sleeve Cuff
    const rightSleeveCuff = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.068, 0.045, 18), hoodieTrimMat);
    rightSleeveCuff.position.y = -0.21;
    rightSleeveCuff.castShadow = true;
    this.rightForearm.add(rightSleeveCuff);

    // Right Braided Builder Bangle
    const builderBangle = new THREE.Mesh(new THREE.TorusGeometry(0.068, 0.008, 8, 20), cyberPinkMat);
    builderBangle.position.y = -0.21;
    builderBangle.rotation.x = Math.PI / 2;
    this.rightForearm.add(builderBangle);

    // Right Hand (Defined Fist + Extended Thumb Joint)
    this.rightHand = new THREE.Group();
    this.rightHand.position.y = -0.25;
    this.rightForearm.add(this.rightHand);

    const rightWristBall = new THREE.Mesh(new THREE.SphereGeometry(0.042, 12, 12), skinMat);
    this.rightHand.add(rightWristBall);

    const rightPalm = new THREE.Mesh(new THREE.SphereGeometry(0.045, 14, 14), skinMat);
    rightPalm.scale.set(1.1, 0.95, 0.85);
    rightPalm.position.y = -0.025;
    rightPalm.castShadow = true;
    this.rightHand.add(rightPalm);

    // 4 Curled Knuckles / Fingers
    for (let i = 0; i < 4; i++) {
      const knuckle = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.038, 8), skinMat);
      knuckle.rotation.z = Math.PI / 2;
      knuckle.position.set(-0.025 + i * 0.017, -0.045, 0.02);
      this.rightHand.add(knuckle);
    }

    // Extended Upright Thumb
    this.thumbJoint = new THREE.Group();
    this.thumbJoint.position.set(0.028, 0, 0.018);
    this.rightHand.add(this.thumbJoint);

    const thumbBase = new THREE.Mesh(new THREE.SphereGeometry(0.018, 10, 10), skinMat);
    this.thumbJoint.add(thumbBase);

    const thumbMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.017, 0.06, 10), skinMat);
    thumbMesh.position.set(0, 0.032, 0);
    thumbMesh.castShadow = true;
    this.thumbJoint.add(thumbMesh);

    // Golden Sparkle Lens Flare Star on Thumb Tip
    this.glintMesh = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.026, 0),
      new THREE.MeshBasicMaterial({ color: 0xfbbf24, wireframe: true })
    );
    this.glintMesh.position.set(0, 0.075, 0);
    this.thumbJoint.add(this.glintMesh);

    // ==========================================
    // 8. HIGH-END DESIGNER SNEAKERS BUILDER
    // ==========================================
    const createDesignerSneaker = (isRight = false) => {
      const shoeGroup = new THREE.Group();

      // Multi-layer Midsole (white)
      const soleMid = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.034, 0.25), sneakerWhiteMat);
      soleMid.position.set(0, 0.017, 0.04);
      soleMid.castShadow = true;
      shoeGroup.add(soleMid);

      // Dark Rugged Tread Outsole
      const soleTread = new THREE.Mesh(new THREE.BoxGeometry(0.124, 0.014, 0.255), sneakerDarkMat);
      soleTread.position.set(0, 0.007, 0.04);
      shoeGroup.add(soleTread);

      // Translucent Air Cushion Heel Bubble
      const airCushion = new THREE.Mesh(new THREE.BoxGeometry(0.095, 0.022, 0.09), airCushionMat);
      airCushion.position.set(0, 0.02, -0.04);
      shoeGroup.add(airCushion);
      if (isRight) {
        this.rightAirCushion = airCushion;
      } else {
        this.leftAirCushion = airCushion;
      }

      // Molded TPU Heel Clip / Stabilizer
      const heelClip = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.035, 16, 1, false, 0, Math.PI), cyberPinkMat);
      heelClip.rotation.y = Math.PI / 2;
      heelClip.position.set(0, 0.035, -0.065);
      shoeGroup.add(heelClip);

      // Main Sneaker Upper Body (Crisp White & Cyber Orange Panel)
      const shoeBody = new THREE.Mesh(new THREE.BoxGeometry(0.112, 0.082, 0.235), sneakerWhiteMat);
      shoeBody.position.set(0, 0.048, 0.04);
      shoeBody.castShadow = true;
      shoeGroup.add(shoeBody);

      // Orange Suede Quarter Overlays
      const orangeOverlay = new THREE.Mesh(new THREE.BoxGeometry(0.118, 0.05, 0.14), sneakerOrangeMat);
      orangeOverlay.position.set(0, 0.045, 0.02);
      shoeGroup.add(orangeOverlay);

      // Sculpted Rounded Toe Mudguard Cap
      const shoeToe = new THREE.Mesh(new THREE.SphereGeometry(0.058, 16, 16), sneakerWhiteMat);
      shoeToe.scale.set(0.96, 0.72, 1.05);
      shoeToe.position.set(0, 0.04, 0.135);
      shoeToe.castShadow = true;
      shoeGroup.add(shoeToe);

      // Padded Tongue with TinkerHub Logo Tag
      const shoeTongue = new THREE.Mesh(new THREE.BoxGeometry(0.074, 0.105, 0.03), sneakerWhiteMat);
      shoeTongue.position.set(0, 0.082, 0.065);
      shoeTongue.rotation.x = -0.32;
      shoeGroup.add(shoeTongue);

      const tongueTag = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.025, 0.008), cyberPinkMat);
      tongueTag.position.set(0, 0.125, 0.058);
      tongueTag.rotation.x = -0.32;
      shoeGroup.add(tongueTag);

      // Criss-Cross High-Top Laces
      for (let l = 0; l < 4; l++) {
        const lace = new THREE.Mesh(new THREE.BoxGeometry(0.078, 0.009, 0.015), pipingWhiteMat);
        lace.position.set(0, 0.062 + l * 0.02, 0.082 - l * 0.02);
        shoeGroup.add(lace);
      }

      // Cyber Pink Side Lightning Swoosh / Accent
      const swooshL = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.022, 0.13), cyberPinkMat);
      swooshL.position.set(-0.06, 0.048, 0.04);
      swooshL.rotation.y = 0.08;
      shoeGroup.add(swooshL);

      const swooshR = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.022, 0.13), cyberPinkMat);
      swooshR.position.set(0.06, 0.048, 0.04);
      swooshR.rotation.y = -0.08;
      shoeGroup.add(swooshR);

      return shoeGroup;
    };

    // ==========================================
    // 9. LEGS (Charcoal Cargo Joggers + Multi-Point Articulated Knees & Hips)
    // ==========================================
    // --- LEFT LEG ---
    this.leftHip = new THREE.Group();
    this.leftHip.position.set(-0.105, -0.06, 0);
    this.hips.add(this.leftHip);

    // Deep Inner Acetabular Ball (Seals hip joint during high steps and striding)
    const leftHipBall = new THREE.Mesh(new THREE.SphereGeometry(0.102, 20, 20), cargoPantsMat);
    this.leftHip.add(leftHipBall);

    // Proximal Thigh Waistband Overlap Cuff
    const leftThighWaistCuff = new THREE.Mesh(
      new THREE.CylinderGeometry(0.098, 0.095, 0.06, 20),
      cargoPantsAccentMat
    );
    leftThighWaistCuff.position.y = -0.025;
    this.leftHip.add(leftThighWaistCuff);

    const leftThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.094, 0.082, 0.42, 20), cargoPantsMat);
    leftThigh.position.y = -0.21;
    leftThigh.castShadow = true;
    this.leftHip.add(leftThigh);

    // Distal Thigh Knee-Overlap Collar (Prevents gap above knee during bending)
    const leftThighKneeHem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.086, 0.086, 0.05, 20),
      cargoPantsAccentMat
    );
    leftThighKneeHem.position.y = -0.40;
    leftThighKneeHem.castShadow = true;
    this.leftHip.add(leftThighKneeHem);

    const leftThighKneePiping = new THREE.Mesh(
      new THREE.TorusGeometry(0.087, 0.006, 8, 24),
      cyberPinkMat
    );
    leftThighKneePiping.position.y = -0.40;
    leftThighKneePiping.rotation.x = Math.PI / 2;
    this.leftHip.add(leftThighKneePiping);

    // Left 3D Cargo Pocket with Flap & Neon Pull-Tab
    const leftCargoPocket = new THREE.Group();
    leftCargoPocket.position.set(-0.095, -0.19, 0);
    this.leftHip.add(leftCargoPocket);

    const leftPocketBox = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.11, 0.09), cargoPantsAccentMat);
    leftPocketBox.castShadow = true;
    leftCargoPocket.add(leftPocketBox);

    const leftPocketFlap = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.03, 0.095), cargoPantsMat);
    leftPocketFlap.position.set(0, 0.045, 0);
    leftCargoPocket.add(leftPocketFlap);

    const leftPocketTag = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.015, 0.02), cyberPinkMat);
    leftPocketTag.position.set(0, 0.035, 0.035);
    leftCargoPocket.add(leftPocketTag);

    // Dual Athletic Piping on Left Thigh
    const leftStripe1 = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.42, 0.012), pipingWhiteMat);
    leftStripe1.position.set(-0.092, -0.21, 0.02);
    this.leftHip.add(leftStripe1);

    const leftStripe2 = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.42, 0.012), pipingPinkMat);
    leftStripe2.position.set(-0.092, -0.21, -0.02);
    this.leftHip.add(leftStripe2);

    // ==========================================
    // Left Multi-Tier Articulated Knee Mechanism
    // ==========================================
    this.leftKnee = new THREE.Group();
    this.leftKnee.position.y = -0.42;
    this.leftHip.add(this.leftKnee);

    // 1. Central Femoral-Tibial Condyle Joint Sphere
    const leftKneeBall = new THREE.Mesh(new THREE.SphereGeometry(0.088, 20, 20), cargoPantsMat);
    this.leftKnee.add(leftKneeBall);

    // 2. Lateral & Medial Machined Articulation Hinge Dials
    const leftKneeHingeOuter = new THREE.Mesh(
      new THREE.CylinderGeometry(0.034, 0.034, 0.022, 16),
      darkGunmetalMat
    );
    leftKneeHingeOuter.position.set(-0.084, 0, 0);
    leftKneeHingeOuter.rotation.z = Math.PI / 2;
    this.leftKnee.add(leftKneeHingeOuter);

    const leftKneeRivetOuter = new THREE.Mesh(
      new THREE.CylinderGeometry(0.014, 0.014, 0.026, 12),
      cyberPinkMat
    );
    leftKneeRivetOuter.position.set(-0.084, 0, 0);
    leftKneeRivetOuter.rotation.z = Math.PI / 2;
    this.leftKnee.add(leftKneeRivetOuter);

    const leftKneeHingeInner = new THREE.Mesh(
      new THREE.CylinderGeometry(0.034, 0.034, 0.022, 16),
      darkGunmetalMat
    );
    leftKneeHingeInner.position.set(0.084, 0, 0);
    leftKneeHingeInner.rotation.z = Math.PI / 2;
    this.leftKnee.add(leftKneeHingeInner);

    const leftKneeRivetInner = new THREE.Mesh(
      new THREE.CylinderGeometry(0.014, 0.014, 0.026, 12),
      cyberPinkMat
    );
    leftKneeRivetInner.position.set(0.084, 0, 0);
    leftKneeRivetInner.rotation.z = Math.PI / 2;
    this.leftKnee.add(leftKneeRivetInner);

    // 3. Articulated 2-Tier Ergonomic Knee Guard (Patella Armor Plates)
    const leftKneeUpperPlate = new THREE.Mesh(
      new THREE.BoxGeometry(0.118, 0.065, 0.032),
      cargoPantsAccentMat
    );
    leftKneeUpperPlate.position.set(0, 0.025, 0.08);
    leftKneeUpperPlate.rotation.x = -0.15;
    leftKneeUpperPlate.castShadow = true;
    this.leftKnee.add(leftKneeUpperPlate);

    const leftKneeLowerPlate = new THREE.Mesh(
      new THREE.BoxGeometry(0.112, 0.055, 0.032),
      darkGunmetalMat
    );
    leftKneeLowerPlate.position.set(0, -0.03, 0.078);
    leftKneeLowerPlate.rotation.x = 0.12;
    leftKneeLowerPlate.castShadow = true;
    this.leftKnee.add(leftKneeLowerPlate);

    const leftKneeNeonSlit = new THREE.Mesh(
      new THREE.BoxGeometry(0.065, 0.012, 0.036),
      cyberPinkMat
    );
    leftKneeNeonSlit.position.set(0, 0, 0.085);
    this.leftKnee.add(leftKneeNeonSlit);

    // 4. Posterior Popliteal Fossa Flexible Bellows (Back of Knee Flex Ring)
    const leftPoplitealBellows = new THREE.Mesh(
      new THREE.TorusGeometry(0.074, 0.016, 10, 20, Math.PI * 1.1),
      darkGunmetalMat
    );
    leftPoplitealBellows.position.set(0, 0, -0.025);
    leftPoplitealBellows.rotation.set(Math.PI / 2, 0, Math.PI / 2);
    this.leftKnee.add(leftPoplitealBellows);

    // 5. Proximal Shin Overlap Collar
    const leftShinCuff = new THREE.Mesh(
      new THREE.CylinderGeometry(0.084, 0.080, 0.05, 20),
      cargoPantsMat
    );
    leftShinCuff.position.y = -0.025;
    this.leftKnee.add(leftShinCuff);

    const leftShin = new THREE.Mesh(new THREE.CylinderGeometry(0.080, 0.068, 0.42, 20), cargoPantsMat);
    leftShin.position.y = -0.21;
    leftShin.castShadow = true;
    this.leftKnee.add(leftShin);

    const leftShinStripe1 = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.42, 0.012), pipingWhiteMat);
    leftShinStripe1.position.set(-0.078, -0.21, 0.02);
    this.leftKnee.add(leftShinStripe1);

    const leftShinStripe2 = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.42, 0.012), pipingPinkMat);
    leftShinStripe2.position.set(-0.078, -0.21, -0.02);
    this.leftKnee.add(leftShinStripe2);

    // Left Ribbed Ankle Cuff
    const leftAnkleCuff = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.045, 18), darkGunmetalMat);
    leftAnkleCuff.position.y = -0.41;
    this.leftKnee.add(leftAnkleCuff);

    // Left Foot
    this.leftFoot = new THREE.Group();
    this.leftFoot.position.y = -0.44;
    this.leftKnee.add(this.leftFoot);
    this.leftFoot.add(createDesignerSneaker(false));

    // --- RIGHT LEG ---
    this.rightHip = new THREE.Group();
    this.rightHip.position.set(0.105, -0.06, 0);
    this.hips.add(this.rightHip);

    // Deep Inner Acetabular Ball (Seals hip joint during high steps and striding)
    const rightHipBall = new THREE.Mesh(new THREE.SphereGeometry(0.102, 20, 20), cargoPantsMat);
    this.rightHip.add(rightHipBall);

    // Proximal Thigh Waistband Overlap Cuff
    const rightThighWaistCuff = new THREE.Mesh(
      new THREE.CylinderGeometry(0.098, 0.095, 0.06, 20),
      cargoPantsAccentMat
    );
    rightThighWaistCuff.position.y = -0.025;
    this.rightHip.add(rightThighWaistCuff);

    const rightThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.094, 0.082, 0.42, 20), cargoPantsMat);
    rightThigh.position.y = -0.21;
    rightThigh.castShadow = true;
    this.rightHip.add(rightThigh);

    // Distal Thigh Knee-Overlap Collar (Prevents gap above knee during bending)
    const rightThighKneeHem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.086, 0.086, 0.05, 20),
      cargoPantsAccentMat
    );
    rightThighKneeHem.position.y = -0.40;
    rightThighKneeHem.castShadow = true;
    this.rightHip.add(rightThighKneeHem);

    const rightThighKneePiping = new THREE.Mesh(
      new THREE.TorusGeometry(0.087, 0.006, 8, 24),
      cyberPinkMat
    );
    rightThighKneePiping.position.y = -0.40;
    rightThighKneePiping.rotation.x = Math.PI / 2;
    this.rightHip.add(rightThighKneePiping);

    // Right 3D Cargo Pocket with Flap & Neon Pull-Tab
    const rightCargoPocket = new THREE.Group();
    rightCargoPocket.position.set(0.095, -0.19, 0);
    this.rightHip.add(rightCargoPocket);

    const rightPocketBox = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.11, 0.09), cargoPantsAccentMat);
    rightPocketBox.castShadow = true;
    rightCargoPocket.add(rightPocketBox);

    const rightPocketFlap = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.03, 0.095), cargoPantsMat);
    rightPocketFlap.position.set(0, 0.045, 0);
    rightCargoPocket.add(rightPocketFlap);

    const rightPocketTag = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.015, 0.02), cyberPinkMat);
    rightPocketTag.position.set(0, 0.035, 0.035);
    rightCargoPocket.add(rightPocketTag);

    // Dual Athletic Piping on Right Thigh
    const rightStripe1 = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.42, 0.012), pipingWhiteMat);
    rightStripe1.position.set(0.092, -0.21, 0.02);
    this.rightHip.add(rightStripe1);

    const rightStripe2 = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.42, 0.012), pipingPinkMat);
    rightStripe2.position.set(0.092, -0.21, -0.02);
    this.rightHip.add(rightStripe2);

    // ==========================================
    // Right Multi-Tier Articulated Knee Mechanism
    // ==========================================
    this.rightKnee = new THREE.Group();
    this.rightKnee.position.y = -0.42;
    this.rightHip.add(this.rightKnee);

    // 1. Central Femoral-Tibial Condyle Joint Sphere
    const rightKneeBall = new THREE.Mesh(new THREE.SphereGeometry(0.088, 20, 20), cargoPantsMat);
    this.rightKnee.add(rightKneeBall);

    // 2. Lateral & Medial Machined Articulation Hinge Dials
    const rightKneeHingeOuter = new THREE.Mesh(
      new THREE.CylinderGeometry(0.034, 0.034, 0.022, 16),
      darkGunmetalMat
    );
    rightKneeHingeOuter.position.set(0.084, 0, 0);
    rightKneeHingeOuter.rotation.z = Math.PI / 2;
    this.rightKnee.add(rightKneeHingeOuter);

    const rightKneeRivetOuter = new THREE.Mesh(
      new THREE.CylinderGeometry(0.014, 0.014, 0.026, 12),
      cyberPinkMat
    );
    rightKneeRivetOuter.position.set(0.084, 0, 0);
    rightKneeRivetOuter.rotation.z = Math.PI / 2;
    this.rightKnee.add(rightKneeRivetOuter);

    const rightKneeHingeInner = new THREE.Mesh(
      new THREE.CylinderGeometry(0.034, 0.034, 0.022, 16),
      darkGunmetalMat
    );
    rightKneeHingeInner.position.set(-0.084, 0, 0);
    rightKneeHingeInner.rotation.z = Math.PI / 2;
    this.rightKnee.add(rightKneeHingeInner);

    const rightKneeRivetInner = new THREE.Mesh(
      new THREE.CylinderGeometry(0.014, 0.014, 0.026, 12),
      cyberPinkMat
    );
    rightKneeRivetInner.position.set(-0.084, 0, 0);
    rightKneeRivetInner.rotation.z = Math.PI / 2;
    this.rightKnee.add(rightKneeRivetInner);

    // 3. Articulated 2-Tier Ergonomic Knee Guard (Patella Armor Plates)
    const rightKneeUpperPlate = new THREE.Mesh(
      new THREE.BoxGeometry(0.118, 0.065, 0.032),
      cargoPantsAccentMat
    );
    rightKneeUpperPlate.position.set(0, 0.025, 0.08);
    rightKneeUpperPlate.rotation.x = -0.15;
    rightKneeUpperPlate.castShadow = true;
    this.rightKnee.add(rightKneeUpperPlate);

    const rightKneeLowerPlate = new THREE.Mesh(
      new THREE.BoxGeometry(0.112, 0.055, 0.032),
      darkGunmetalMat
    );
    rightKneeLowerPlate.position.set(0, -0.03, 0.078);
    rightKneeLowerPlate.rotation.x = 0.12;
    rightKneeLowerPlate.castShadow = true;
    this.rightKnee.add(rightKneeLowerPlate);

    const rightKneeNeonSlit = new THREE.Mesh(
      new THREE.BoxGeometry(0.065, 0.012, 0.036),
      cyberPinkMat
    );
    rightKneeNeonSlit.position.set(0, 0, 0.085);
    this.rightKnee.add(rightKneeNeonSlit);

    // 4. Posterior Popliteal Fossa Flexible Bellows (Back of Knee Flex Ring)
    const rightPoplitealBellows = new THREE.Mesh(
      new THREE.TorusGeometry(0.074, 0.016, 10, 20, Math.PI * 1.1),
      darkGunmetalMat
    );
    rightPoplitealBellows.position.set(0, 0, -0.025);
    rightPoplitealBellows.rotation.set(Math.PI / 2, 0, Math.PI / 2);
    this.rightKnee.add(rightPoplitealBellows);

    // 5. Proximal Shin Overlap Collar
    const rightShinCuff = new THREE.Mesh(
      new THREE.CylinderGeometry(0.084, 0.080, 0.05, 20),
      cargoPantsMat
    );
    rightShinCuff.position.y = -0.025;
    this.rightKnee.add(rightShinCuff);

    const rightShin = new THREE.Mesh(new THREE.CylinderGeometry(0.080, 0.068, 0.42, 20), cargoPantsMat);
    rightShin.position.y = -0.21;
    rightShin.castShadow = true;
    this.rightKnee.add(rightShin);

    const rightShinStripe1 = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.42, 0.012), pipingWhiteMat);
    rightShinStripe1.position.set(0.078, -0.21, 0.02);
    this.rightKnee.add(rightShinStripe1);

    const rightShinStripe2 = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.42, 0.012), pipingPinkMat);
    rightShinStripe2.position.set(0.078, -0.21, -0.02);
    this.rightKnee.add(rightShinStripe2);

    // Right Ribbed Ankle Cuff
    const rightAnkleCuff = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.045, 18), darkGunmetalMat);
    rightAnkleCuff.position.y = -0.41;
    this.rightKnee.add(rightAnkleCuff);

    // Right Foot
    this.rightFoot = new THREE.Group();
    this.rightFoot.position.y = -0.44;
    this.rightKnee.add(this.rightFoot);
    this.rightFoot.add(createDesignerSneaker(true));

    // ==========================================
    // 10. DRAGGABLE & LIFTABLE SIGNBOARD (Custom Jithu Board - Enlarged Display)
    // ==========================================
    this.signboardGroup = new THREE.Group();
    this.signboardTexture = createSignboardTexture();

    const signFaceMat = new THREE.MeshStandardMaterial({
      map: this.signboardTexture,
      roughness: 0.28,
      metalness: 0.15,
      emissive: new THREE.Color('#381224'),
      emissiveIntensity: 0.45,
    });
    this.materials.push(signFaceMat);

    // Board Back Case (Rugged dark gunmetal casing - Enlarged footprint)
    const boardBack = new THREE.Mesh(
      new THREE.BoxGeometry(1.48, 0.94, 0.04),
      darkGunmetalMat
    );
    boardBack.castShadow = true;
    boardBack.receiveShadow = true;
    this.signboardGroup.add(boardBack);

    // Front Graphic Printed Face
    this.signboardFace = new THREE.Mesh(
      new THREE.PlaneGeometry(1.44, 0.90),
      signFaceMat
    );
    this.signboardFace.position.z = 0.022;
    this.signboardGroup.add(this.signboardFace);

    // Neon Accent Bezel Borders (Glowing Cyber Pink)
    const bezelTop = new THREE.Mesh(new THREE.BoxGeometry(1.50, 0.026, 0.046), cyberPinkMat);
    bezelTop.position.y = 0.47;
    this.signboardGroup.add(bezelTop);

    const bezelBottom = new THREE.Mesh(new THREE.BoxGeometry(1.50, 0.026, 0.046), cyberPinkMat);
    bezelBottom.position.y = -0.47;
    this.signboardGroup.add(bezelBottom);

    const bezelLeft = new THREE.Mesh(new THREE.BoxGeometry(0.026, 0.96, 0.046), cyberPinkMat);
    bezelLeft.position.x = -0.74;
    this.signboardGroup.add(bezelLeft);

    const bezelRight = new THREE.Mesh(new THREE.BoxGeometry(0.026, 0.96, 0.046), cyberPinkMat);
    bezelRight.position.x = 0.74;
    this.signboardGroup.add(bezelRight);

    // Chrome Corner Reinforcement Brackets
    for (const cx of [-0.73, 0.73]) {
      for (const cy of [-0.46, 0.46]) {
        const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.055, 0.05), chromeMat);
        bracket.position.set(cx, cy, 0);
        this.signboardGroup.add(bracket);
      }
    }

    // Side Grab Handles for character's hands
    const leftGrip = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.22, 12), darkGunmetalMat);
    leftGrip.position.set(-0.76, 0, 0);
    this.signboardGroup.add(leftGrip);

    const rightGrip = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.22, 12), darkGunmetalMat);
    rightGrip.position.set(0.76, 0, 0);
    this.signboardGroup.add(rightGrip);

    // Bottom Drag / Carry Pole with Rubber Grip
    const dragPole = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 1.1, 12), chromeMat);
    dragPole.position.set(0.74, -0.48, 0);
    this.signboardGroup.add(dragPole);

    const dragGrip = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.28, 12), darkGunmetalMat);
    dragGrip.position.set(0.74, -0.48, 0);
    this.signboardGroup.add(dragGrip);

    // Drag Caster / Floor Scuff Stopper
    const dragCaster = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 10), cyberPinkMat);
    dragCaster.position.set(0.74, -1.02, 0);
    this.signboardGroup.add(dragCaster);

    // Initial placement: to the right trailing
    this.signboardGroup.position.set(0.68, 0.42, -0.28);
    this.signboardGroup.rotation.set(0.25, 0.35, -0.55);
    this.root.add(this.signboardGroup);

    // Initial entrance position from right
    this.root.position.x = 1.8;
  }

  /**
   * Applies an external physics impulse to the signboard for weighted bounce and tilt reactions
   */
  public applyBoardImpulse(
    impulsePos?: { x?: number; y?: number; z?: number },
    impulseRot?: { x?: number; y?: number; z?: number }
  ) {
    if (impulsePos) {
      if (impulsePos.x !== undefined) this.boardPosVel.x += impulsePos.x;
      if (impulsePos.y !== undefined) this.boardPosVel.y += impulsePos.y;
      if (impulsePos.z !== undefined) this.boardPosVel.z += impulsePos.z;
    }
    if (impulseRot) {
      if (impulseRot.x !== undefined) this.boardRotVel.x += impulseRot.x;
      if (impulseRot.y !== undefined) this.boardRotVel.y += impulseRot.y;
      if (impulseRot.z !== undefined) this.boardRotVel.z += impulseRot.z;
    }
  }

  /**
   * Resets character and signboard to entrance starting point on the right
   */
  public resetEntrancePosition() {
    this.root.position.x = 1.8;
    this.root.position.z = 0;
    this.root.rotation.y = -0.25;
    this.boardBasePos.set(0.68, 0.42, -0.28);
    this.boardBaseRot.set(0.25, 0.35, -0.55);
    this.boardPosOffset.set(0, 0, 0);
    this.boardPosVel.set(0, 0, 0);
    this.boardRotOffset.set(0, 0, 0);
    this.boardRotVel.set(0, 0, 0);
    this.signboardGroup.position.copy(this.boardBasePos);
    this.signboardGroup.rotation.set(this.boardBaseRot.x, this.boardBaseRot.y, this.boardBaseRot.z);
    this.prevRootX = 1.8;
    this.prevHipsY = 0.88;
    this.prevCharacterState = 'DRAGGING_BOARD';
  }

  /**
   * Weighted Spring-Damper Physics simulation for signboard carrying, inertia & dynamic damping
   */
  private updateSignboardPhysics(
    delta: number,
    elapsedTime: number,
    state: CharacterState,
    mouseTarget: THREE.Vector2
  ) {
    const dt = Math.min(delta, 0.05);

    // 1. Detect state transitions to trigger physics impulse shocks
    if (state !== this.prevCharacterState) {
      if (state === 'LIFTING_BOARD') {
        // Upward hoist momentum impulse
        this.applyBoardImpulse({ y: 0.95, z: 0.18 }, { x: -0.35, z: 0.15 });
      } else if (state === 'HOLDING_BOARD') {
        // Catch settle and elastic downward bounce
        this.applyBoardImpulse({ y: -0.52, z: -0.08 }, { x: 0.28, z: -0.12 });
      } else if (state === 'FALLING') {
        // Drop impact impulse
        this.applyBoardImpulse({ y: -1.4, x: 0.45 }, { x: -0.8, z: 0.6 });
      } else if (state === 'DRAGGING_BOARD') {
        this.applyBoardImpulse({ y: -0.25, x: -0.35 }, { z: -0.22 });
      }
      this.prevCharacterState = state;
    }

    // 2. Kinematics & Velocity tracking for inertial drag
    const rootVelX = (this.root.position.x - this.prevRootX) / Math.max(dt, 0.001);
    const hipsVelY = (this.hips.position.y - this.prevHipsY) / Math.max(dt, 0.001);
    const ptrVelX = (mouseTarget.x - this.prevPointer.x) / Math.max(dt, 0.001);
    const ptrVelY = (mouseTarget.y - this.prevPointer.y) / Math.max(dt, 0.001);

    // 3. Dynamic Inertial Forces
    // Moving lateral inertia: when walking/dragging, the heavy board tilts opposite to motion
    this.boardRotVel.z -= THREE.MathUtils.clamp(rootVelX * 0.45, -3.2, 3.2);
    this.boardPosVel.x -= THREE.MathUtils.clamp(rootVelX * 0.16, -1.6, 1.6);

    // Vertical footstep & hips bounce shock
    this.boardPosVel.y += THREE.MathUtils.clamp(hipsVelY * 0.68, -2.4, 2.4);

    // Pointer look-at inertial lag and tilt (weighted carry feel)
    if (state === 'HOLDING_BOARD') {
      this.boardRotVel.z -= THREE.MathUtils.clamp(ptrVelX * 0.25, -3.0, 3.0); // roll tilt
      this.boardRotVel.y += THREE.MathUtils.clamp(ptrVelX * 0.35, -3.5, 3.5); // yaw lag
      this.boardRotVel.x -= THREE.MathUtils.clamp(ptrVelY * 0.28, -3.0, 3.0); // pitch tilt
      this.boardPosVel.y -= THREE.MathUtils.clamp(ptrVelY * 0.15, -1.5, 1.5);
    } else if (state === 'DRAGGING_BOARD') {
      // Ground scuff and rumble vibration while dragging across floor
      const isMoving = Math.abs(rootVelX) > 0.04;
      if (isMoving) {
        const scuffY = Math.sin(elapsedTime * 18.0) * 0.25;
        const scuffZ = Math.cos(elapsedTime * 14.0) * 0.4;
        this.boardPosVel.y += scuffY * 0.35;
        this.boardRotVel.z += scuffZ * 0.55;
      }
    }

    // 4. Spring-Damper System Tuning (Damped Harmonic Oscillator)
    let kPos = 34.0;
    let cPos = 6.8;
    let kRot = 28.0;
    let cRot = 5.8;

    if (state === 'HOLDING_BOARD') {
      kPos = 30.0; // supple weighted suspension
      cPos = 6.0;
      kRot = 24.0;
      cRot = 5.2;
    } else if (state === 'DRAGGING_BOARD') {
      kPos = 48.0;
      cPos = 9.0;
      kRot = 38.0;
      cRot = 8.0;
    } else if (state === 'LIFTING_BOARD') {
      kPos = 26.0;
      cPos = 5.0;
      kRot = 22.0;
      cRot = 4.6;
    }

    // Semi-implicit Euler integration: a = -k*x - c*v
    const forceX = -kPos * this.boardPosOffset.x - cPos * this.boardPosVel.x;
    const forceY = -kPos * this.boardPosOffset.y - cPos * this.boardPosVel.y;
    const forceZ = -kPos * this.boardPosOffset.z - cPos * this.boardPosVel.z;

    this.boardPosVel.x += forceX * dt;
    this.boardPosVel.y += forceY * dt;
    this.boardPosVel.z += forceZ * dt;

    this.boardPosOffset.x += this.boardPosVel.x * dt;
    this.boardPosOffset.y += this.boardPosVel.y * dt;
    this.boardPosOffset.z += this.boardPosVel.z * dt;

    const torqueX = -kRot * this.boardRotOffset.x - cRot * this.boardRotVel.x;
    const torqueY = -kRot * this.boardRotOffset.y - cRot * this.boardRotVel.y;
    const torqueZ = -kRot * this.boardRotOffset.z - cRot * this.boardRotVel.z;

    this.boardRotVel.x += torqueX * dt;
    this.boardRotVel.y += torqueY * dt;
    this.boardRotVel.z += torqueZ * dt;

    this.boardRotOffset.x += this.boardRotVel.x * dt;
    this.boardRotOffset.y += this.boardRotVel.y * dt;
    this.boardRotOffset.z += this.boardRotVel.z * dt;

    // Numerical safety clamping
    this.boardPosOffset.x = THREE.MathUtils.clamp(this.boardPosOffset.x, -0.3, 0.3);
    this.boardPosOffset.y = THREE.MathUtils.clamp(this.boardPosOffset.y, -0.35, 0.35);
    this.boardPosOffset.z = THREE.MathUtils.clamp(this.boardPosOffset.z, -0.3, 0.3);

    this.boardRotOffset.x = THREE.MathUtils.clamp(this.boardRotOffset.x, -0.42, 0.42);
    this.boardRotOffset.y = THREE.MathUtils.clamp(this.boardRotOffset.y, -0.4, 0.4);
    this.boardRotOffset.z = THREE.MathUtils.clamp(this.boardRotOffset.z, -0.5, 0.5);

    // Save tracking references
    this.prevRootX = this.root.position.x;
    this.prevHipsY = this.hips.position.y;
    this.prevPointer.copy(mouseTarget);
  }

  /**
   * Main skeletal animation update method (zero clipping & smooth damping)
   */
  public update(
    delta: number,
    elapsedTime: number,
    state: CharacterState,
    focus: FieldFocusTarget,
    isSubmitting: boolean,
    isSuccess: boolean,
    mouseTarget: THREE.Vector2
  ) {
    // 0. Update Board Dynamic Spring-Damper Physics
    this.updateSignboardPhysics(delta, elapsedTime, state, mouseTarget);

    // 1. Orbital Halos & Holographic Energy Rotation
    this.haloRing.rotation.y += delta * 1.6;
    this.haloRing.rotation.z += delta * 1.0;
    this.haloRingOuter.rotation.x += delta * 1.3;
    this.haloRingOuter.rotation.y += delta * 0.9;
    this.logoGlowDisc.rotation.z += delta * 0.7;

    // Headphone pulse lights
    const headPulse = (Math.sin(elapsedTime * 4.5) + 1) * 0.5;
    this.leftHeadphoneLight.scale.set(1 + headPulse * 0.15, 1 + headPulse * 0.15, 1);
    this.rightHeadphoneLight.scale.set(1 + headPulse * 0.15, 1 + headPulse * 0.15, 1);

    // Smartwatch Hologram Spin
    if (this.watchHoloScreen) {
      this.watchHoloScreen.rotation.z += delta * 2.2;
    }

    // Sparkle glint on thumb
    this.glintMesh.rotation.y += delta * 4.0;
    this.glintMesh.rotation.x += delta * 2.6;

    // Drawstrings subtle physics sway
    const stringSway = Math.sin(elapsedTime * 3) * 0.07;
    this.leftString.rotation.z = stringSway;
    this.rightString.rotation.z = -stringSway;

    // Head base energy pulse
    const pulse = (Math.sin(elapsedTime * 3.2) + 1) * 0.5;
    this.logoGlowDisc.scale.set(1 + pulse * 0.12, 1 + pulse * 0.12, 1);

    // Animated Digital Eye Blinking Logic
    this.blinkTimer += delta;
    if (this.blinkTimer > 3.8) {
      this.isBlinking = true;
      if (this.blinkTimer > 4.0) {
        this.isBlinking = false;
        this.blinkTimer = Math.random() * 1.2;
      }
    }

    // Set Eye Scale & Shape based on character state
    if (state === 'CELEBRATING' || isSuccess) {
      // Happy ^_^ arcs
      this.leftEye.scale.set(1.2, 0.4, 1);
      this.rightEye.scale.set(1.2, 0.4, 1);
      this.leftEye.rotation.z = 0.2;
      this.rightEye.rotation.z = -0.2;
    } else if (state === 'FALLING' || state === 'ON_GROUND') {
      // Dizzy x_x spin
      this.leftEye.scale.set(0.6, 0.6, 1);
      this.rightEye.scale.set(0.6, 0.6, 1);
      this.leftEye.rotation.z += delta * 8;
      this.rightEye.rotation.z -= delta * 8;
    } else if (this.isBlinking) {
      // Blinking closed
      this.leftEye.scale.set(1.2, 0.08, 1);
      this.rightEye.scale.set(1.2, 0.08, 1);
      this.leftEye.rotation.z = 0;
      this.rightEye.rotation.z = 0;
    } else {
      // Normal living open eyes with subtle pupil tracking
      this.leftEye.scale.set(1, 1, 1);
      this.rightEye.scale.set(1, 1, 1);
      this.leftEye.rotation.z = 0;
      this.rightEye.rotation.z = 0;
    }

    // Manage Dizzy Stars Overhead visibility & orbit
    if (state === 'FALLING' || state === 'ON_GROUND') {
      this.dizzyStarsGroup.visible = true;
      this.dizzyStarsGroup.rotation.y += delta * 6.5;
      this.dizzyStarsGroup.position.y = 0.46 + Math.sin(elapsedTime * 8) * 0.04;
    } else {
      this.dizzyStarsGroup.visible = false;
    }

    // ========================================================
    // 2. FALLING STATE (Ragdoll tumble backwards when touched)
    // ========================================================
    if (state === 'FALLING') {
      this.hips.position.y = THREE.MathUtils.damp(this.hips.position.y, 0.22, 9, delta);
      this.hips.position.z = THREE.MathUtils.damp(this.hips.position.z, -0.3, 8, delta);

      this.spine.rotation.x = THREE.MathUtils.damp(this.spine.rotation.x, -0.85, 9, delta);
      this.chest.rotation.x = THREE.MathUtils.damp(this.chest.rotation.x, -0.35, 9, delta);
      this.hips.rotation.x = THREE.MathUtils.damp(this.hips.rotation.x, -0.4, 9, delta);

      this.leftHip.rotation.x = THREE.MathUtils.damp(this.leftHip.rotation.x, -1.35, 10, delta);
      this.rightHip.rotation.x = THREE.MathUtils.damp(this.rightHip.rotation.x, -1.15, 10, delta);
      this.leftKnee.rotation.x = THREE.MathUtils.damp(this.leftKnee.rotation.x, 0.45, 10, delta);
      this.rightKnee.rotation.x = THREE.MathUtils.damp(this.rightKnee.rotation.x, 0.35, 10, delta);

      this.leftShoulder.rotation.x = THREE.MathUtils.damp(this.leftShoulder.rotation.x, 2.2, 12, delta);
      this.leftShoulder.rotation.z = THREE.MathUtils.damp(this.leftShoulder.rotation.z, 0.6, 12, delta);
      this.rightShoulder.rotation.x = THREE.MathUtils.damp(this.rightShoulder.rotation.x, 2.1, 12, delta);
      this.rightShoulder.rotation.z = THREE.MathUtils.damp(this.rightShoulder.rotation.z, -0.6, 12, delta);
      this.leftForearm.rotation.x = THREE.MathUtils.damp(this.leftForearm.rotation.x, 0.6, 12, delta);
      this.rightForearm.rotation.x = THREE.MathUtils.damp(this.rightForearm.rotation.x, 0.6, 12, delta);

      this.head.rotation.x = THREE.MathUtils.damp(this.head.rotation.x, -0.5, 9, delta);
      this.head.rotation.y = THREE.MathUtils.damp(this.head.rotation.y, 0, 9, delta);

      // Signboard topples onto floor
      this.boardBasePos.x = THREE.MathUtils.damp(this.boardBasePos.x, 0.62, 8, delta);
      this.boardBasePos.y = THREE.MathUtils.damp(this.boardBasePos.y, 0.03, 8, delta);
      this.boardBasePos.z = THREE.MathUtils.damp(this.boardBasePos.z, -0.15, 8, delta);
      this.boardBaseRot.x = THREE.MathUtils.damp(this.boardBaseRot.x, -Math.PI / 2 + 0.1, 8, delta);
      this.boardBaseRot.y = THREE.MathUtils.damp(this.boardBaseRot.y, 0, 8, delta);
      this.boardBaseRot.z = THREE.MathUtils.damp(this.boardBaseRot.z, 0.35, 8, delta);

      this.signboardGroup.position.set(
        this.boardBasePos.x + this.boardPosOffset.x,
        this.boardBasePos.y + this.boardPosOffset.y,
        this.boardBasePos.z + this.boardPosOffset.z
      );
      this.signboardGroup.rotation.set(
        this.boardBaseRot.x + this.boardRotOffset.x,
        this.boardBaseRot.y + this.boardRotOffset.y,
        this.boardBaseRot.z + this.boardRotOffset.z
      );
      return;
    }

    // ========================================================
    // 3. ON_GROUND STATE (Sitting dazed on floor, rubbing head)
    // ========================================================
    if (state === 'ON_GROUND') {
      this.hips.position.y = THREE.MathUtils.damp(this.hips.position.y, 0.18, 6, delta);
      this.hips.position.z = THREE.MathUtils.damp(this.hips.position.z, -0.2, 6, delta);

      this.spine.rotation.x = THREE.MathUtils.damp(this.spine.rotation.x, -0.3, 6, delta);
      this.chest.rotation.x = THREE.MathUtils.damp(this.chest.rotation.x, 0.1, 6, delta);
      this.hips.rotation.x = THREE.MathUtils.damp(this.hips.rotation.x, -0.1, 6, delta);

      this.leftHip.rotation.x = THREE.MathUtils.damp(this.leftHip.rotation.x, -1.45, 6, delta);
      this.rightHip.rotation.x = THREE.MathUtils.damp(this.rightHip.rotation.x, -1.35, 6, delta);
      this.leftHip.rotation.z = THREE.MathUtils.damp(this.leftHip.rotation.z, -0.2, 6, delta);
      this.rightHip.rotation.z = THREE.MathUtils.damp(this.rightHip.rotation.z, 0.2, 6, delta);
      this.leftKnee.rotation.x = THREE.MathUtils.damp(this.leftKnee.rotation.x, 0.15, 6, delta);
      this.rightKnee.rotation.x = THREE.MathUtils.damp(this.rightKnee.rotation.x, 0.15, 6, delta);

      this.leftShoulder.rotation.x = THREE.MathUtils.damp(this.leftShoulder.rotation.x, 0.75, 6, delta);
      this.leftShoulder.rotation.z = THREE.MathUtils.damp(this.leftShoulder.rotation.z, 0.45, 6, delta);
      this.leftForearm.rotation.x = THREE.MathUtils.damp(this.leftForearm.rotation.x, -0.85, 6, delta);

      this.rightShoulder.rotation.x = THREE.MathUtils.damp(this.rightShoulder.rotation.x, -2.1, 6, delta);
      this.rightShoulder.rotation.z = THREE.MathUtils.damp(this.rightShoulder.rotation.z, -0.35, 6, delta);
      this.rightForearm.rotation.x = THREE.MathUtils.damp(this.rightForearm.rotation.x, -1.65, 6, delta);
      this.rightForearm.rotation.y = THREE.MathUtils.damp(this.rightForearm.rotation.y, 0.6, 6, delta);

      this.head.rotation.z = Math.sin(elapsedTime * 4.5) * 0.22;
      this.head.rotation.y = Math.cos(elapsedTime * 4.5) * 0.25;
      this.head.rotation.x = 0.1 + Math.sin(elapsedTime * 3) * 0.1;

      // Signboard lies flat beside him
      this.boardBasePos.x = THREE.MathUtils.damp(this.boardBasePos.x, 0.62, 8, delta);
      this.boardBasePos.y = THREE.MathUtils.damp(this.boardBasePos.y, 0.03, 8, delta);
      this.boardBasePos.z = THREE.MathUtils.damp(this.boardBasePos.z, -0.15, 8, delta);
      this.boardBaseRot.x = THREE.MathUtils.damp(this.boardBaseRot.x, -Math.PI / 2 + 0.1, 8, delta);
      this.boardBaseRot.y = THREE.MathUtils.damp(this.boardBaseRot.y, 0, 8, delta);
      this.boardBaseRot.z = THREE.MathUtils.damp(this.boardBaseRot.z, 0.35, 8, delta);

      this.signboardGroup.position.set(
        this.boardBasePos.x + this.boardPosOffset.x,
        this.boardBasePos.y + this.boardPosOffset.y,
        this.boardBasePos.z + this.boardPosOffset.z
      );
      this.signboardGroup.rotation.set(
        this.boardBaseRot.x + this.boardRotOffset.x,
        this.boardBaseRot.y + this.boardRotOffset.y,
        this.boardBaseRot.z + this.boardRotOffset.z
      );
      return;
    }

    // ========================================================
    // 4. GETTING_UP STATE (Pushes off ground, stands & dusts off)
    // ========================================================
    if (state === 'GETTING_UP') {
      this.hips.position.y = THREE.MathUtils.damp(this.hips.position.y, 0.88, 5, delta);
      this.hips.position.z = THREE.MathUtils.damp(this.hips.position.z, 0, 5, delta);

      this.spine.rotation.x = THREE.MathUtils.damp(this.spine.rotation.x, 0, 5, delta);
      this.chest.rotation.x = THREE.MathUtils.damp(this.chest.rotation.x, 0, 5, delta);
      this.hips.rotation.x = THREE.MathUtils.damp(this.hips.rotation.x, 0, 5, delta);

      this.leftHip.rotation.x = THREE.MathUtils.damp(this.leftHip.rotation.x, 0, 6, delta);
      this.rightHip.rotation.x = THREE.MathUtils.damp(this.rightHip.rotation.x, 0, 6, delta);
      this.leftHip.rotation.z = THREE.MathUtils.damp(this.leftHip.rotation.z, 0, 6, delta);
      this.rightHip.rotation.z = THREE.MathUtils.damp(this.rightHip.rotation.z, 0, 6, delta);
      this.leftKnee.rotation.x = THREE.MathUtils.damp(this.leftKnee.rotation.x, 0, 6, delta);
      this.rightKnee.rotation.x = THREE.MathUtils.damp(this.rightKnee.rotation.x, 0, 6, delta);

      const dustBrush = Math.sin(elapsedTime * 9) * 0.3;
      this.leftShoulder.rotation.x = THREE.MathUtils.damp(this.leftShoulder.rotation.x, -0.6 + dustBrush, 6, delta);
      this.leftForearm.rotation.x = THREE.MathUtils.damp(this.leftForearm.rotation.x, -0.9, 6, delta);
      this.rightShoulder.rotation.x = THREE.MathUtils.damp(this.rightShoulder.rotation.x, -0.6 - dustBrush, 6, delta);
      this.rightForearm.rotation.x = THREE.MathUtils.damp(this.rightForearm.rotation.x, -0.9, 6, delta);

      this.head.rotation.x = THREE.MathUtils.damp(this.head.rotation.x, 0.25, 6, delta);
      this.head.rotation.y = THREE.MathUtils.damp(this.head.rotation.y, 0, 6, delta);
      this.head.rotation.z = THREE.MathUtils.damp(this.head.rotation.z, 0, 6, delta);
      return;
    }

    // Reset base offsets from ground
    this.hips.position.z = THREE.MathUtils.damp(this.hips.position.z, 0, 5, delta);
    this.spine.rotation.x = THREE.MathUtils.damp(this.spine.rotation.x, 0, 5, delta);
    this.chest.rotation.x = THREE.MathUtils.damp(this.chest.rotation.x, 0, 5, delta);
    this.hips.rotation.x = THREE.MathUtils.damp(this.hips.rotation.x, 0, 5, delta);
    this.leftHip.rotation.z = THREE.MathUtils.damp(this.leftHip.rotation.z, 0, 5, delta);
    this.rightHip.rotation.z = THREE.MathUtils.damp(this.rightHip.rotation.z, 0, 5, delta);

    // ========================================================
    // 5. DRAGGING_BOARD State (Initial walk-in pulling signboard from right)
    // ========================================================
    if (state === 'DRAGGING_BOARD') {
      // Smoothly advance mascot from the right side (1.8) to center (0)
      this.root.position.x = THREE.MathUtils.damp(this.root.position.x, 0, 1.25, delta);
      this.root.position.z = THREE.MathUtils.damp(this.root.position.z, 0, 2.0, delta);
      this.root.rotation.y = THREE.MathUtils.damp(this.root.rotation.y, -0.22, 2.5, delta);

      const walkFreq = 7.5;
      const legAngle = Math.sin(elapsedTime * walkFreq) * 0.44;

      this.leftHip.rotation.x = legAngle;
      this.rightHip.rotation.x = -legAngle;
      this.leftKnee.rotation.x = Math.max(0, -legAngle * 1.15);
      this.rightKnee.rotation.x = Math.max(0, legAngle * 1.15);

      // Left arm natural swing
      this.leftShoulder.rotation.x = -legAngle * 0.75;
      this.leftForearm.rotation.x = -0.3 + Math.abs(legAngle) * 0.38;

      // Right arm pulled back gripping the board handle with physical effort
      this.rightShoulder.rotation.x = THREE.MathUtils.lerp(this.rightShoulder.rotation.x, 0.54, 0.15);
      this.rightShoulder.rotation.z = THREE.MathUtils.lerp(this.rightShoulder.rotation.z, -0.38, 0.15);
      this.rightForearm.rotation.x = THREE.MathUtils.lerp(this.rightForearm.rotation.x, -0.35, 0.15);
      this.rightForearm.rotation.y = THREE.MathUtils.lerp(this.rightForearm.rotation.y, 0.28, 0.15);

      this.hips.position.y = 0.88 + Math.abs(Math.sin(elapsedTime * walkFreq)) * 0.04;
      this.spine.rotation.z = Math.sin(elapsedTime * walkFreq) * 0.03;
      this.spine.rotation.y = -0.12;

      // Mascot looks forward with determined expression
      this.head.rotation.y = THREE.MathUtils.lerp(this.head.rotation.y, 0.22, 0.1);
      this.head.rotation.x = 0.05;

      // Signboard trailing behind on the floor with dynamic weighted physics & scuff damping
      this.boardBasePos.x = THREE.MathUtils.lerp(this.boardBasePos.x, 0.68, 0.14);
      this.boardBasePos.y = THREE.MathUtils.lerp(this.boardBasePos.y, 0.42, 0.14);
      this.boardBasePos.z = THREE.MathUtils.lerp(this.boardBasePos.z, -0.28, 0.14);

      this.boardBaseRot.x = THREE.MathUtils.lerp(this.boardBaseRot.x, 0.25, 0.14);
      this.boardBaseRot.y = THREE.MathUtils.lerp(this.boardBaseRot.y, 0.35, 0.14);
      this.boardBaseRot.z = THREE.MathUtils.lerp(this.boardBaseRot.z, -0.55, 0.14);

      this.signboardGroup.position.set(
        this.boardBasePos.x + this.boardPosOffset.x,
        this.boardBasePos.y + this.boardPosOffset.y,
        this.boardBasePos.z + this.boardPosOffset.z
      );
      this.signboardGroup.rotation.set(
        this.boardBaseRot.x + this.boardRotOffset.x,
        this.boardBaseRot.y + this.boardRotOffset.y,
        this.boardBaseRot.z + this.boardRotOffset.z
      );
      return;
    }

    // ========================================================
    // 6. LIFTING_BOARD State (Arrives at center & hoists board up)
    // ========================================================
    if (state === 'LIFTING_BOARD') {
      this.root.position.x = THREE.MathUtils.damp(this.root.position.x, 0, 5, delta);
      this.root.rotation.y = THREE.MathUtils.damp(this.root.rotation.y, 0, 5, delta);

      this.leftHip.rotation.x = THREE.MathUtils.lerp(this.leftHip.rotation.x, 0, 0.15);
      this.rightHip.rotation.x = THREE.MathUtils.lerp(this.rightHip.rotation.x, 0, 0.15);
      this.leftKnee.rotation.x = THREE.MathUtils.lerp(this.leftKnee.rotation.x, 0, 0.15);
      this.rightKnee.rotation.x = THREE.MathUtils.lerp(this.rightKnee.rotation.x, 0, 0.15);
      this.hips.position.y = THREE.MathUtils.lerp(this.hips.position.y, 0.88, 0.15);

      // Both arms hoist the enlarged board upwards
      this.rightShoulder.rotation.x = THREE.MathUtils.lerp(this.rightShoulder.rotation.x, -1.18, 0.12);
      this.rightShoulder.rotation.z = THREE.MathUtils.lerp(this.rightShoulder.rotation.z, -0.56, 0.12);
      this.rightForearm.rotation.x = THREE.MathUtils.lerp(this.rightForearm.rotation.x, -0.65, 0.12);
      this.rightForearm.rotation.y = THREE.MathUtils.lerp(this.rightForearm.rotation.y, 0.1, 0.12);

      this.leftShoulder.rotation.x = THREE.MathUtils.lerp(this.leftShoulder.rotation.x, -1.18, 0.12);
      this.leftShoulder.rotation.z = THREE.MathUtils.lerp(this.leftShoulder.rotation.z, 0.56, 0.12);
      this.leftForearm.rotation.x = THREE.MathUtils.lerp(this.leftForearm.rotation.x, -0.65, 0.12);
      this.leftForearm.rotation.y = THREE.MathUtils.lerp(this.leftForearm.rotation.y, -0.1, 0.12);

      this.head.rotation.y = THREE.MathUtils.lerp(this.head.rotation.y, 0, 0.1);
      this.head.rotation.x = THREE.MathUtils.lerp(this.head.rotation.x, 0.05, 0.1);

      // Smoothly transition board to front chest height with upward momentum overshoot
      this.boardBasePos.x = THREE.MathUtils.damp(this.boardBasePos.x, 0, 5.5, delta);
      this.boardBasePos.y = THREE.MathUtils.damp(this.boardBasePos.y, 0.98, 5.5, delta);
      this.boardBasePos.z = THREE.MathUtils.damp(this.boardBasePos.z, 0.42, 5.5, delta);

      this.boardBaseRot.x = THREE.MathUtils.damp(this.boardBaseRot.x, 0.04, 5.5, delta);
      this.boardBaseRot.y = THREE.MathUtils.damp(this.boardBaseRot.y, 0, 5.5, delta);
      this.boardBaseRot.z = THREE.MathUtils.damp(this.boardBaseRot.z, 0, 5.5, delta);

      this.signboardGroup.position.set(
        this.boardBasePos.x + this.boardPosOffset.x,
        this.boardBasePos.y + this.boardPosOffset.y,
        this.boardBasePos.z + this.boardPosOffset.z
      );
      this.signboardGroup.rotation.set(
        this.boardBaseRot.x + this.boardRotOffset.x,
        this.boardBaseRot.y + this.boardRotOffset.y,
        this.boardBaseRot.z + this.boardRotOffset.z
      );
      return;
    }

    // ========================================================
    // 7. HOLDING_BOARD State (Proudly presenting the board to user)
    // ========================================================
    if (state === 'HOLDING_BOARD') {
      this.root.position.x = THREE.MathUtils.damp(this.root.position.x, 0, 5, delta);
      this.root.rotation.y = THREE.MathUtils.damp(this.root.rotation.y, 0, 5, delta);

      const breathe = Math.sin(elapsedTime * 2.5);
      const floatY = 0.98 + breathe * 0.015;
      const floatRotZ = Math.sin(elapsedTime * 1.8) * 0.02;

      this.boardBasePos.x = THREE.MathUtils.lerp(this.boardBasePos.x, 0, 0.15);
      this.boardBasePos.y = THREE.MathUtils.lerp(this.boardBasePos.y, floatY, 0.15);
      this.boardBasePos.z = THREE.MathUtils.lerp(this.boardBasePos.z, 0.42, 0.15);

      this.boardBaseRot.x = THREE.MathUtils.lerp(this.boardBaseRot.x, 0.04, 0.15);
      this.boardBaseRot.y = THREE.MathUtils.lerp(this.boardBaseRot.y, floatRotZ * 0.5, 0.15);
      this.boardBaseRot.z = THREE.MathUtils.lerp(this.boardBaseRot.z, floatRotZ, 0.15);

      // Signboard transform combined with weighted bounce & tilt damping offsets
      this.signboardGroup.position.set(
        this.boardBasePos.x + this.boardPosOffset.x,
        this.boardBasePos.y + this.boardPosOffset.y,
        this.boardBasePos.z + this.boardPosOffset.z
      );
      this.signboardGroup.rotation.set(
        this.boardBaseRot.x + this.boardRotOffset.x,
        this.boardBaseRot.y + this.boardRotOffset.y,
        this.boardBaseRot.z + this.boardRotOffset.z
      );

      // Gripping both sides firmly with reactive arm & wrist compliance
      this.rightShoulder.rotation.x = THREE.MathUtils.lerp(this.rightShoulder.rotation.x, -1.18 + this.boardPosOffset.y * 0.9, 0.15);
      this.rightShoulder.rotation.z = THREE.MathUtils.lerp(this.rightShoulder.rotation.z, -0.56 - this.boardRotOffset.z * 0.65, 0.15);
      this.rightForearm.rotation.x = THREE.MathUtils.lerp(this.rightForearm.rotation.x, -0.65 + this.boardRotOffset.x * 0.5, 0.15);
      this.rightForearm.rotation.z = THREE.MathUtils.lerp(this.rightForearm.rotation.z, -this.boardRotOffset.z * 0.45, 0.15);

      this.leftShoulder.rotation.x = THREE.MathUtils.lerp(this.leftShoulder.rotation.x, -1.18 + this.boardPosOffset.y * 0.9, 0.15);
      this.leftShoulder.rotation.z = THREE.MathUtils.lerp(this.leftShoulder.rotation.z, 0.56 - this.boardRotOffset.z * 0.65, 0.15);
      this.leftForearm.rotation.x = THREE.MathUtils.lerp(this.leftForearm.rotation.x, -0.65 + this.boardRotOffset.x * 0.5, 0.15);
      this.leftForearm.rotation.z = THREE.MathUtils.lerp(this.leftForearm.rotation.z, -this.boardRotOffset.z * 0.45, 0.15);

      // Cheeky subtle head tilt & smile
      this.head.rotation.y = Math.sin(elapsedTime * 1.5) * 0.06;
      this.head.rotation.z = Math.sin(elapsedTime * 2.0) * 0.04;
      this.head.rotation.x = 0.05 + breathe * 0.02;

      this.leftEye.scale.set(1.2, 0.4, 1);
      this.rightEye.scale.set(1.2, 0.4, 1);
      this.leftEye.rotation.z = 0.18;
      this.rightEye.rotation.z = -0.18;
      return;
    }

    // Default: in all other states (IDLE, WAVING, etc.), the signboard rests cleanly beside his right leg on the floor
    this.boardBasePos.x = THREE.MathUtils.damp(this.boardBasePos.x, 0.68, 4, delta);
    this.boardBasePos.y = THREE.MathUtils.damp(this.boardBasePos.y, 0.42, 4, delta);
    this.boardBasePos.z = THREE.MathUtils.damp(this.boardBasePos.z, 0.06, 4, delta);
    this.boardBaseRot.x = THREE.MathUtils.damp(this.boardBaseRot.x, 0.05, 4, delta);
    this.boardBaseRot.y = THREE.MathUtils.damp(this.boardBaseRot.y, -0.28, 4, delta);
    this.boardBaseRot.z = THREE.MathUtils.damp(this.boardBaseRot.z, -0.12, 4, delta);

    this.signboardGroup.position.set(
      this.boardBasePos.x + this.boardPosOffset.x,
      this.boardBasePos.y + this.boardPosOffset.y,
      this.boardBasePos.z + this.boardPosOffset.z
    );
    this.signboardGroup.rotation.set(
      this.boardBaseRot.x + this.boardRotOffset.x,
      this.boardBaseRot.y + this.boardRotOffset.y,
      this.boardBaseRot.z + this.boardRotOffset.z
    );
    this.root.position.x = THREE.MathUtils.damp(this.root.position.x, 0, 4, delta);

    // ========================================================
    // 8. WALKING Animation Gait
    // ========================================================
    if (state === 'WALKING') {
      const walkFreq = 7.5;
      const legAngle = Math.sin(elapsedTime * walkFreq) * 0.44;

      this.leftHip.rotation.x = legAngle;
      this.rightHip.rotation.x = -legAngle;
      this.leftKnee.rotation.x = Math.max(0, -legAngle * 1.15);
      this.rightKnee.rotation.x = Math.max(0, legAngle * 1.15);

      this.leftShoulder.rotation.x = -legAngle * 0.75;
      this.rightShoulder.rotation.x = legAngle * 0.75;
      this.leftForearm.rotation.x = -0.3 + Math.abs(legAngle) * 0.38;
      this.rightForearm.rotation.x = -0.3 + Math.abs(legAngle) * 0.38;

      this.hips.position.y = 0.88 + Math.abs(Math.sin(elapsedTime * walkFreq)) * 0.04;
      this.spine.rotation.z = Math.sin(elapsedTime * walkFreq) * 0.03;
      this.head.rotation.y = -0.18 + Math.sin(elapsedTime * (walkFreq / 2)) * 0.05;
      return;
    }

    // ========================================================
    // 6. ARRIVING / Deceleration
    // ========================================================
    if (state === 'ARRIVING') {
      this.leftHip.rotation.x = THREE.MathUtils.lerp(this.leftHip.rotation.x, -0.05, 0.15);
      this.rightHip.rotation.x = THREE.MathUtils.lerp(this.rightHip.rotation.x, 0.08, 0.15);
      this.leftKnee.rotation.x = THREE.MathUtils.lerp(this.leftKnee.rotation.x, 0.05, 0.15);
      this.rightKnee.rotation.x = THREE.MathUtils.lerp(this.rightKnee.rotation.x, 0.05, 0.15);
      this.hips.position.y = THREE.MathUtils.lerp(this.hips.position.y, 0.88, 0.15);
      return;
    }

    // ========================================================
    // 7. INSPECTING LOGIN FORM
    // ========================================================
    if (state === 'IDLE_LOOKING') {
      this.head.rotation.y = THREE.MathUtils.lerp(this.head.rotation.y, 0.55, 0.1);
      this.head.rotation.x = THREE.MathUtils.lerp(this.head.rotation.x, 0.08, 0.1);
      return;
    }

    // ========================================================
    // 8. TURNING TOWARDS USER
    // ========================================================
    if (state === 'TURNING') {
      this.head.rotation.y = THREE.MathUtils.lerp(this.head.rotation.y, 0.15, 0.1);
      this.rightShoulder.rotation.x = THREE.MathUtils.lerp(this.rightShoulder.rotation.x, -0.3, 0.1);
      return;
    }

    // ========================================================
    // 9. WAVING 👋 STATE
    // ========================================================
    if (state === 'WAVING') {
      this.rightShoulder.rotation.x = THREE.MathUtils.lerp(this.rightShoulder.rotation.x, -2.4, 0.12);
      this.rightShoulder.rotation.z = THREE.MathUtils.lerp(this.rightShoulder.rotation.z, -0.6, 0.12);
      this.rightForearm.rotation.x = THREE.MathUtils.lerp(this.rightForearm.rotation.x, -0.8, 0.12);

      const waveSpeed = 12;
      this.rightForearm.rotation.z = Math.sin(elapsedTime * waveSpeed) * 0.45;
      this.rightHand.rotation.z = Math.sin(elapsedTime * waveSpeed + 0.5) * 0.35;

      this.leftShoulder.rotation.x = THREE.MathUtils.lerp(this.leftShoulder.rotation.x, 0.15, 0.08);
      this.leftForearm.rotation.x = THREE.MathUtils.lerp(this.leftForearm.rotation.x, -0.7, 0.08);
      this.leftForearm.rotation.y = THREE.MathUtils.lerp(this.leftForearm.rotation.y, -0.3, 0.08);

      this.head.rotation.z = Math.sin(elapsedTime * 4) * 0.06;
      return;
    }

    // ========================================================
    // 10. CELEBRATING 🎉 / SUBMISSION SUCCESS
    // ========================================================
    if (state === 'CELEBRATING' || isSuccess) {
      const jumpBounce = Math.abs(Math.sin(elapsedTime * 8)) * 0.08;
      this.hips.position.y = 0.88 + jumpBounce;

      const armPump = Math.sin(elapsedTime * 8) * 0.25;

      this.leftShoulder.rotation.x = -2.2 + armPump;
      this.leftShoulder.rotation.z = 0.4;
      this.leftForearm.rotation.x = -0.5;

      this.rightShoulder.rotation.x = -2.2 + armPump;
      this.rightShoulder.rotation.z = -0.4;
      this.rightForearm.rotation.x = -0.5;

      this.head.rotation.x = Math.sin(elapsedTime * 8) * 0.1;
      this.head.rotation.y = 0;
      return;
    }

    // ========================================================
    // 11. LOOKING AWAY 👀 (Aloof, nonchalant stance & looking off to the side)
    // ========================================================
    if (state === 'LOOKING_AWAY') {
      this.spine.rotation.z = THREE.MathUtils.lerp(this.spine.rotation.z, -0.08, 0.08);
      this.spine.rotation.y = THREE.MathUtils.lerp(this.spine.rotation.y, 0.22, 0.08);
      this.hips.rotation.z = THREE.MathUtils.lerp(this.hips.rotation.z, 0.05, 0.08);

      this.leftShoulder.rotation.x = THREE.MathUtils.lerp(this.leftShoulder.rotation.x, 0.2, 0.08);
      this.leftShoulder.rotation.z = THREE.MathUtils.lerp(this.leftShoulder.rotation.z, 0.15, 0.08);
      this.leftForearm.rotation.x = THREE.MathUtils.lerp(this.leftForearm.rotation.x, -0.85, 0.08);
      this.leftForearm.rotation.y = THREE.MathUtils.lerp(this.leftForearm.rotation.y, -0.4, 0.08);

      this.rightShoulder.rotation.x = THREE.MathUtils.lerp(this.rightShoulder.rotation.x, 0.2, 0.08);
      this.rightShoulder.rotation.z = THREE.MathUtils.lerp(this.rightShoulder.rotation.z, -0.15, 0.08);
      this.rightForearm.rotation.x = THREE.MathUtils.lerp(this.rightForearm.rotation.x, -0.85, 0.08);
      this.rightForearm.rotation.y = THREE.MathUtils.lerp(this.rightForearm.rotation.y, 0.4, 0.08);

      const glanceCycle = Math.sin(elapsedTime * 0.8);
      let awayYaw = 1.05;
      let awayPitch = -0.14;

      if (glanceCycle > 0.85) {
        awayYaw = 0.2;
        awayPitch = 0.05;
      }

      this.head.rotation.y = THREE.MathUtils.lerp(this.head.rotation.y, awayYaw, 0.08);
      this.head.rotation.x = THREE.MathUtils.lerp(this.head.rotation.x, awayPitch, 0.08);
      this.head.rotation.z = THREE.MathUtils.lerp(this.head.rotation.z, 0.08, 0.08);

      this.rightFoot.rotation.x = Math.sin(elapsedTime * 5.5) * 0.08;

      const breathe = Math.sin(elapsedTime * 2.2);
      this.chest.scale.set(1 + breathe * 0.015, 1 + breathe * 0.01, 1 + breathe * 0.02);
      this.spine.position.y = 0.05 + breathe * 0.003;
      return;
    }

    // ========================================================
    // 12. CASUAL LEAN & LIVING IDLE (Full Active Cursor Look-At Tracking)
    // ========================================================
    const spineYawTarget = mouseTarget.x * 0.18;
    const spinePitchTarget = -mouseTarget.y * 0.06;

    this.spine.rotation.z = THREE.MathUtils.lerp(this.spine.rotation.z, -0.04 - mouseTarget.x * 0.03, 0.08);
    this.spine.rotation.y = THREE.MathUtils.lerp(this.spine.rotation.y, spineYawTarget, 0.08);
    this.spine.rotation.x = THREE.MathUtils.lerp(this.spine.rotation.x, spinePitchTarget, 0.08);
    this.chest.rotation.y = THREE.MathUtils.lerp(this.chest.rotation.y, mouseTarget.x * 0.12, 0.08);
    this.hips.rotation.z = THREE.MathUtils.lerp(this.hips.rotation.z, 0.03, 0.08);

    // Left hand in pocket
    this.leftShoulder.rotation.x = THREE.MathUtils.lerp(this.leftShoulder.rotation.x, 0.15, 0.08);
    this.leftShoulder.rotation.z = THREE.MathUtils.lerp(this.leftShoulder.rotation.z, 0.1, 0.08);
    this.leftForearm.rotation.x = THREE.MathUtils.lerp(this.leftForearm.rotation.x, -0.7, 0.08);
    this.leftForearm.rotation.y = THREE.MathUtils.lerp(this.leftForearm.rotation.y, -0.3, 0.08);

    // Right hand Thumbs-Up 👍
    let thumbForearmX = -1.25;
    let thumbShoulderX = -0.55;

    if (isSubmitting || state === 'REACTION') {
      const pump = Math.sin(elapsedTime * 9) * 0.18;
      thumbForearmX += pump;
      thumbShoulderX += pump * 0.5;
    }

    this.rightShoulder.rotation.x = THREE.MathUtils.lerp(this.rightShoulder.rotation.x, thumbShoulderX, 0.1);
    this.rightShoulder.rotation.y = THREE.MathUtils.lerp(this.rightShoulder.rotation.y, 0.25, 0.1);
    this.rightShoulder.rotation.z = THREE.MathUtils.lerp(this.rightShoulder.rotation.z, -0.2, 0.1);
    this.rightForearm.rotation.x = THREE.MathUtils.lerp(this.rightForearm.rotation.x, thumbForearmX, 0.1);
    this.rightForearm.rotation.z = THREE.MathUtils.lerp(this.rightForearm.rotation.z, -0.35, 0.1);

    // Breathing rhythm
    const breathe = Math.sin(elapsedTime * 2.2);
    this.chest.scale.set(1 + breathe * 0.015, 1 + breathe * 0.01, 1 + breathe * 0.02);
    this.spine.position.y = 0.05 + breathe * 0.003;

    // Comprehensive Field Focus & Fluid Screen-wide Cursor Tracking
    let targetYaw = mouseTarget.x * 0.85;
    let targetPitch = -mouseTarget.y * 0.55;
    let targetRoll = -mouseTarget.x * 0.08;

    if (focus === 'email') {
      targetYaw = 0.45;
      targetPitch = 0.14;
      targetRoll = -0.05;
    } else if (focus === 'password') {
      targetYaw = 0.52;
      targetPitch = 0.22;
      targetRoll = -0.07;
    } else if (focus === 'role') {
      targetYaw = 0.38;
      targetPitch = 0.08;
      targetRoll = -0.03;
    }

    // Natural head motion bounds
    targetYaw = THREE.MathUtils.clamp(targetYaw, -1.05, 1.05);
    targetPitch = THREE.MathUtils.clamp(targetPitch, -0.65, 0.65);

    // Neck rotation
    this.neck.rotation.y = THREE.MathUtils.lerp(this.neck.rotation.y, targetYaw * 0.35, 0.1);
    this.neck.rotation.x = THREE.MathUtils.lerp(this.neck.rotation.x, targetPitch * 0.3, 0.1);

    // Head rotation
    this.head.rotation.y = THREE.MathUtils.lerp(this.head.rotation.y, targetYaw * 0.75, 0.12);
    this.head.rotation.x = THREE.MathUtils.lerp(this.head.rotation.x, targetPitch * 0.75, 0.12);
    this.head.rotation.z = THREE.MathUtils.lerp(this.head.rotation.z, targetRoll, 0.08);

    // Holographic Emblem & Eyes Parallax (Pupil Gaze Direction)
    const eyeOffsetX = THREE.MathUtils.clamp(mouseTarget.x * 0.035, -0.04, 0.04);
    const eyeOffsetY = THREE.MathUtils.clamp(mouseTarget.y * 0.03, -0.035, 0.035);

    this.logoEmblem.position.x = THREE.MathUtils.lerp(this.logoEmblem.position.x, eyeOffsetX, 0.15);
    this.logoEmblem.position.y = THREE.MathUtils.lerp(this.logoEmblem.position.y, 0.17 + eyeOffsetY, 0.15);
    this.logoGlowDisc.position.x = THREE.MathUtils.lerp(this.logoGlowDisc.position.x, eyeOffsetX * 0.6, 0.15);

    // Dynamic Eye Pupil Tracking
    this.leftEye.position.x = THREE.MathUtils.lerp(this.leftEye.position.x, -0.075 + eyeOffsetX * 0.6, 0.15);
    this.leftEye.position.y = THREE.MathUtils.lerp(this.leftEye.position.y, 0.23 + eyeOffsetY * 0.6, 0.15);
    this.rightEye.position.x = THREE.MathUtils.lerp(this.rightEye.position.x, 0.075 + eyeOffsetX * 0.6, 0.15);
    this.rightEye.position.y = THREE.MathUtils.lerp(this.rightEye.position.y, 0.23 + eyeOffsetY * 0.6, 0.15);
  }

  public dispose() {
    this.materials.forEach((m) => m.dispose());
  }
}
