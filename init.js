<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Lux Init Scene – 5D SDK</title>
  <style>
    body {
      margin: 0;
      overflow: hidden;
      background: #111;
      color: #eee;
      font-family: sans-serif;
    }
  </style>
</head>
<body>
  <!-- Scripts -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"></script>
  <script>
    // Basic 3D scene setup using Three.js
    let scene, camera, renderer;
    let spiral, spiralMaterial;
    let particlesVisible = false;
    let spiralRotationSpeed = 0.01;
    let miniSpirals = [];
    let memoryOrbs = [];
    let pulseRing;

    init();
    animate();

    function init() {
      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 30;

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.domElement);

      // Spiral
      const spiralGeo = new THREE.TorusKnotGeometry(10, 3, 100, 16);
      spiralMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true });
      spiral = new THREE.Mesh(spiralGeo, spiralMaterial);
      scene.add(spiral);

      // Pulse ring
      const pulseGeo = new THREE.RingGeometry(5, 6, 64);
      const pulseMat = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
      pulseRing = new THREE.Mesh(pulseGeo, pulseMat);
      pulseRing.rotation.x = Math.PI / 2;
      pulseRing.visible = false;
      scene.add(pulseRing);

      // Memory orbs
      for (let i = 0; i < 5; i++) {
        const orbGeo = new THREE.SphereGeometry(1, 16, 16);
        const orbMat = new THREE.MeshBasicMaterial({ color: 0xff00ff });
        const orb = new THREE.Mesh(orbGeo, orbMat);
        orb.position.set(
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 30
        );
        orb.visible = false;
        memoryOrbs.push(orb);
        scene.add(orb);
      }

      window.addEventListener("resize", onWindowResize, false);
    }

    function animate() {
      requestAnimationFrame(animate);
      if (!window.Lux || !Lux._paused) spiral.rotation.y += spiralRotationSpeed;
      renderer.render(scene, camera);
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function createMiniSpiral() {
      const geo = new THREE.TorusGeometry(1, 0.2, 8, 16);
      const mat = new THREE.MeshBasicMaterial({ color: 0xff00ff });
      const mini = new THREE.Mesh(geo, mat);
      mini.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      );
      scene.add(mini);
      miniSpirals.push(mini);
    }
  </script>
</body>
</html>
