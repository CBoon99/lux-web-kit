// src/init.js


let scene, camera, renderer, spiral, spiralMaterial;
let particles = { visible: false };
let pulseRing;
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


function createScene() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.z = 5;


  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);


  spiralMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff });
  const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
  spiral = new THREE.Mesh(geometry, spiralMaterial);
  scene.add(spiral);


  animate();
}


function createMiniSpiral() {
  const mat = new THREE.MeshBasicMaterial({ color: 0xff00ff });
  const geo = new THREE.SphereGeometry(0.1, 16, 16);
  const mini = new THREE.Mesh(geo, mat);
  mini.position.set(
    (Math.random() - 0.5) * 5,
    (Math.random() - 0.5) * 5,
    (Math.random() - 0.5) * 5
  );
  scene.add(mini);
  miniSpirals.push(mini);
}


// expose globally for SDK access
window.spiral = spiral;
window.spiralMaterial = spiralMaterial;
window.spiralRotationSpeed = spiralRotationSpeed;
window.createMiniSpiral = createMiniSpiral;
window.miniSpirals = miniSpirals;
window.pulseRing = pulseRing;
window.particles = particles;
window.memoryOrbs = memoryOrbs;
window.particlesVisible = particlesVisible;


createScene();