// Punto d'ingresso del bundle vendor: tutto il 3D di terze parti in un solo file ESM locale (niente CDN).
export * as THREE from 'three';
export { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
export { OrbitControls } from 'three/addons/controls/OrbitControls.js';
export * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
export * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
export { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
export { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
export { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
export { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
export { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
export * as VRM from '@pixiv/three-vrm';
export * as VRMA from '@pixiv/three-vrm-animation';
