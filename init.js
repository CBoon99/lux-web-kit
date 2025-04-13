// init.js

let scene, camera, renderer, spiral, spiralMaterial;
let particles = new THREE.Object3D(); particles.visible = false;
let pulseRing = new THREE.Mesh(new THREE.RingGeometry(1, 1.2, 32), new THREE.MeshBasicMaterial({ color: 0xffff00 }));
pulseRing.visible = false;
let miniSpirals = [];
let memoryOrbs = [];
let spiralRotationSpeed = 0.01;
let particlesVisible = false;
let animationFrameId;

function animate() {
  if (!Lux._paused && spiral) {
    spiral.rotation.y += spiralRotationSpeed;
  }
  animationFrameId = requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

// Init 3D scene
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Spiral geometry
const geometry = new THREE.TorusKnotGeometry(10, 1, 100, 16);
spiralMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff });
spiral = new THREE.Mesh(geometry, spiralMaterial);
scene.add(spiral);

// Pulse ring
scene.add(pulseRing);

// Position camera
camera.position.z = 30;

animate();
