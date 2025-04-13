// Lux SDK v2.1 – A 5D Storytelling Toolkit
// Created by Carl & Echo – A modular system for emotional, dimensional experiences


const Lux = {
  // === Core Tier ===
  Core: {
    reset: () => {
      document.querySelectorAll('[id$="Message"]').forEach(el => {
        el.style.display = 'none';
        el.style.opacity = 0;
      });
      if (typeof particles !== 'undefined') particles.visible = false;
      if (typeof spiral !== 'undefined') spiral.visible = true;
      if (typeof pulseRing !== 'undefined') pulseRing.visible = false;
      if (typeof miniSpirals !== 'undefined') miniSpirals.forEach(s => s.visible = false);
      if (typeof memoryOrbs !== 'undefined') memoryOrbs.forEach(o => o.visible = false);
      console.log('[Lux.Core] Reset complete.');
    },
    state: () => {
      console.table({
        spiral: spiral?.visible,
        particlesVisible,
        pulse: pulseRing?.visible,
        miniSpirals: miniSpirals?.some(s => s.visible),
        memoryOrbs: memoryOrbs?.some(o => o.visible),
        speed: spiralRotationSpeed
      });
    }
  },


  // === Visual Tier ===
  Visual: {
    setColor: (r, g, b) => {
      if ([r, g, b].some(v => typeof v !== 'number' || v < 0 || v > 1)) {
        console.warn('[Lux.Visual] Invalid color values.');
        return;
      }
      spiralMaterial?.color.setRGB(r, g, b);
      miniSpirals?.forEach(s => s.material.color.setRGB(r, g, b));
      console.log(`[Lux.Visual] Color set to rgb(${r}, ${g}, ${b})`);
    },
    flashColor: () => {
      const [r, g, b] = [Math.random(), Math.random(), Math.random()];
      Lux.Visual.setColor(r, g, b);
      setTimeout(() => Lux.Visual.setColor(0, 1, 1), 500);
    }
  },


  // === Motion Tier ===
  Motion: {
    setSpeed: mult => {
      spiralRotationSpeed = 0.01 * mult;
      console.log(`[Lux.Motion] Speed set to ${spiralRotationSpeed}`);
    },
    pause: () => { Lux._paused = true; console.log('[Lux.Motion] Paused'); },
    resume: () => { Lux._paused = false; animate(); console.log('[Lux.Motion] Resumed'); }
  },


  // === Particle Tier ===
  Particle: {
    spawnMini: (count = 3) => {
      if (typeof createMiniSpiral !== 'function') return;
      for (let i = 0; i < count; i++) createMiniSpiral();
      console.log(`[Lux.Particle] Spawned ${count} mini spirals`);
    },
    toggleParticles: () => {
      particlesVisible = !particlesVisible;
      particles.visible = particlesVisible;
      spiral.visible = !particlesVisible;
      console.log(`[Lux.Particle] Particles ${particlesVisible ? 'on' : 'off'}`);
    }
  },


  // === Pulse Tier ===
  Pulse: {
    trigger: () => {
      if (!pulseRing) return;
      pulseRing.visible = true;
      pulseRing.scale.set(1, 1, 1);
      console.log('[Lux.Pulse] Pulse triggered');
    }
  },


  // === Sound Tier ===
  Sound: {
    play: (id, { loop = false, volume = 1.0 } = {}) => {
      const audio = document.getElementById(id);
      if (!audio) return console.warn(`[Lux.Sound] Sound not found: ${id}`);
      audio.loop = loop;
      audio.volume = volume;
      audio.play();
      console.log(`[Lux.Sound] Playing: ${id}`);
    },
    stop: (id) => {
      const audio = document.getElementById(id);
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        console.log(`[Lux.Sound] Stopped: ${id}`);
      }
    }
  },


  // === Memory Tier ===
  Memory: {
    toggleOrbs: () => {
      memoryOrbs?.forEach(o => o.visible = !o.visible);
      console.log('[Lux.Memory] Toggled memory orbs');
    }
  },


  // === Log Tier ===
  Log: {
    emit: (message, { color = '#ff8000', fontSize = '18px' } = {}) => {
      console.log(message);
      const el = document.createElement('div');
      el.innerHTML = message;
      Object.assign(el.style, {
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'rgba(0,0,0,0.8)',
        color,
        padding: '20px',
        borderRadius: '10px',
        fontSize,
        opacity: '0',
        transition: 'opacity 1s',
        zIndex: 9999
      });
      document.body.appendChild(el);
      setTimeout(() => el.style.opacity = '1', 100);
      setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 1000); }, 5000);
    }
  },


  // === Script Tier ===
  Script: {
    _scripts: {},
    create: (name, steps) => {
      Lux.Script._scripts[name] = steps;
      localStorage.setItem('LuxScripts', JSON.stringify(Lux.Script._scripts));
      console.log(`[Lux.Script] Created: ${name}`);
    },
    run: (name) => {
      const steps = Lux.Script._scripts[name];
      if (!steps) return console.warn(`[Lux.Script] Script not found: ${name}`);
      steps.forEach(({ fn, t }) => setTimeout(fn, t));
      console.log(`[Lux.Script] Running: ${name}`);
    },
    load: () => {
      const saved = localStorage.getItem('LuxScripts');
      if (saved) Lux.Script._scripts = JSON.parse(saved);
    }
  },


  // === Voice Tier ===
  Voice: {
    init: () => {
      if (!('webkitSpeechRecognition' in window)) return;
      const rec = new webkitSpeechRecognition();
      rec.continuous = true;
      rec.onresult = (e) => {
        const cmd = e.results[e.results.length - 1][0].transcript.trim().toLowerCase();
        console.log(`[Lux.Voice] Heard: "${cmd}"`);
        if (Lux._bindings?.[cmd]) Lux._bindings[cmd]();
      };
      rec.start();
      Lux.Voice.recognition = rec;
      console.log('[Lux.Voice] Listening...');
    },
    stop: () => {
      Lux.Voice.recognition?.stop();
      console.log('[Lux.Voice] Stopped');
    }
  },


  // === Utils Tier ===
  Utils: {
    getTime: () => console.log(`[Lux.Utils] Time: ${new Date().toLocaleTimeString()}`),
    bindCommand: (phrase, fn) => {
      if (!Lux._bindings) Lux._bindings = {};
      Lux._bindings[phrase.toLowerCase()] = fn;
      console.log(`[Lux.Utils] Bound "${phrase}"`);
    }
  },


  // === Animation Presets ===
  AnimationPresets: {
    presets: {
      gentleGlow: () => [
        { fn: () => Lux.Core.reset(), t: 0 },
        { fn: () => Lux.Visual.setColor(1, 1, 0), t: 1000 },
        { fn: () => Lux.Motion.setSpeed(0.5), t: 2000 },
        { fn: () => Lux.Pulse.trigger(), t: 3000 }
      ],
      starryDance: () => [
        { fn: () => Lux.Core.reset(), t: 0 },
        { fn: () => Lux.Visual.setColor(0, 0, 0.2), t: 1000 },
        { fn: () => Lux.Motion.setSpeed(1), t: 2000 },
        { fn: () => Lux.Particle.spawnMini(10), t: 3000 }
      ]
    },
    run: (presetName) => {
      const steps = Lux.AnimationPresets.presets[presetName]?.();
      if (!steps) return console.warn(`[Lux.AnimationPresets] Unknown: ${presetName}`);
      steps.forEach(({ fn, t }) => setTimeout(fn, t));
      console.log(`[Lux.AnimationPresets] Ran: ${presetName}`);
    }
  },


  // === Payloads ===
  Payload: {
    coreSequence: () => Lux.Script.run('coreSequence'),
    hopefulFuture: () => Lux.Script.run('hopefulFuture')
  }
};


// === Script Definitions ===
Lux.Script.create('coreSequence', [
  { fn: () => Lux.Core.reset(), t: 0 },
  { fn: () => Lux.Visual.setColor(1, 0.5, 0), t: 1000 },
  { fn: () => Lux.Motion.setSpeed(2), t: 2000 },
  { fn: () => Lux.Particle.spawnMini(5), t: 3000 },
  { fn: () => Lux.Pulse.trigger(), t: 4000 },
  { fn: () => Lux.Sound.play('pulseSound'), t: 4000 },
  { fn: () => Lux.Log.emit('[Lux.Payload] coreSequence complete'), t: 5000 }
]);


Lux.Script.create('hopefulFuture', [
  { fn: () => Lux.Core.reset(), t: 0 },
  { fn: () => Lux.Visual.setColor(0.75, 0.75, 0.75), t: 1000 },
  { fn: () => Lux.Motion.setSpeed(1), t: 2000 },
  { fn: () => Lux.Particle.spawnMini(10), t: 3000 },
  { fn: () => Lux.Pulse.trigger(), t: 4000 },
  { fn: () => Lux.Sound.play('futureSound'), t: 4000 },
  { fn: () => Lux.Log.emit('[Lux.Payload] hopefulFuture complete'), t: 5000 }
]);


Lux.Script.load();
Lux.Voice.init();