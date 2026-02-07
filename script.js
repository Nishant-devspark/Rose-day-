/**
 * ================================================
 * ULTRA PREMIUM LUXURY ROSE DAY WEBSITE
 * 10-Year Senior Developer Production JavaScript
 * 3D Particles | Canvas Animations | Advanced Interactions
 * ================================================
 */

(function() {
  'use strict';

  // ==================== STATE MANAGEMENT ====================
  const state = {
    isMusicPlaying: false,
    isExperienceActive: false,
    mouse: { x: 0, y: 0, targetX: 0, targetY: 0 },
    particles3D: [],
    fireworks: [],
    petals: []
  };

  // ==================== DOM CACHE ====================
  const el = {
    body: document.body,
    heroSection: document.getElementById('heroSection'),
    enterBtn: document.getElementById('enterExperience'),
    experienceLuxury: document.getElementById('experienceLuxury'),
    audioController: document.getElementById('audioController'),
    backgroundAudio: document.getElementById('backgroundAudio'),
    letterContent: document.getElementById('letterContent'),
    surpriseButton: document.getElementById('surpriseButton'),
    surpriseModal: document.getElementById('surpriseModal'),
    closeSuprise: document.getElementById('closeSuprise'),
    finalButton: document.getElementById('finalButton'),
    finalModal: document.getElementById('finalModal'),
    closeFinal: document.getElementById('closeFinal'),
    cursorMain: document.querySelector('.cursor-main'),
    cursorFollower: document.querySelector('.cursor-follower'),
    cursorCanvas: document.getElementById('cursorCanvas'),
    particleCanvas: document.getElementById('particleCanvas'),
    fireworksCanvas: document.getElementById('fireworksCanvas'),
    rosePetals3D: document.getElementById('rosePetals3D'),
    momentCards: document.querySelectorAll('.moment-card')
  };

  // ==================== 3D PARTICLE SYSTEM ====================
  class ParticleSystem3D {
    constructor() {
      this.canvas = el.particleCanvas;
      this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
      this.particles = [];
      this.particleCount = 80;
      
      if (this.ctx) {
        this.resize();
        this.init();
      }
    }

    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    init() {
      for (let i = 0; i < this.particleCount; i++) {
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          z: Math.random() * 1000,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          vz: (Math.random() - 0.5) * 2,
          size: Math.random() * 3 + 1,
          hue: Math.random() * 30 + 330 // Rose hues
        });
      }
      this.animate();
      window.addEventListener('resize', () => this.resize());
    }

    animate() {
      if (!this.ctx) return;
      
      this.ctx.fillStyle = 'rgba(255, 254, 249, 0.05)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
        
        if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;
        if (p.z < 0 || p.z > 1000) p.vz *= -1;
        
        const scale = 1000 / (1000 + p.z);
        const size = p.size * scale;
        const alpha = (1 - p.z / 1000) * 0.5;
        
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        this.ctx.fillStyle = `hsla(${p.hue}, 70%, 60%, ${alpha})`;
        this.ctx.fill();
      });
      
      requestAnimationFrame(() => this.animate());
    }
  }

  // ==================== CURSOR SYSTEM ====================
  class CursorSystem {
    constructor() {
      this.trail = [];
      this.maxTrail = 15;
      this.canvas = el.cursorCanvas;
      this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
      
      if (this.ctx) {
        this.init();
      }
    }

    init() {
      this.resize();
      
      document.addEventListener('mousemove', (e) => {
        state.mouse.targetX = e.clientX;
        state.mouse.targetY = e.clientY;
        
        this.trail.push({
          x: e.clientX,
          y: e.clientY,
          life: 1
        });
        
        if (this.trail.length > this.maxTrail) {
          this.trail.shift();
        }
      });
      
      // Hover detection
      document.querySelectorAll('button, a').forEach(elem => {
        elem.addEventListener('mouseenter', () => {
          el.body.classList.add('cursor-hover');
        });
        elem.addEventListener('mouseleave', () => {
          el.body.classList.remove('cursor-hover');
        });
      });
      
      window.addEventListener('resize', () => this.resize());
      this.animate();
    }

    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    animate() {
      if (!this.ctx) return;
      
      // Smooth cursor follow
      state.mouse.x += (state.mouse.targetX - state.mouse.x) * 0.15;
      state.mouse.y += (state.mouse.targetY - state.mouse.y) * 0.15;
      
      el.cursorMain.style.left = `${state.mouse.x}px`;
      el.cursorMain.style.top = `${state.mouse.y}px`;
      el.cursorFollower.style.left = `${state.mouse.x}px`;
      el.cursorFollower.style.top = `${state.mouse.y}px`;
      
      // Trail effect
      this.ctx.fillStyle = 'rgba(255, 254, 249, 0.1)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.trail.forEach((point, index) => {
        const alpha = (index / this.trail.length) * point.life * 0.3;
        const radius = (index / this.trail.length) * 4;
        
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(212, 54, 95, ${alpha})`;
        this.ctx.fill();
        
        point.life -= 0.02;
      });
      
      this.trail = this.trail.filter(p => p.life > 0);
      
      requestAnimationFrame(() => this.animate());
    }
  }

  // ==================== AUDIO CONTROLLER ====================
  class AudioManager {
    constructor() {
      this.audio = el.backgroundAudio;
      this.controller = el.audioController;
      this.init();
    }

    init() {
      this.controller.addEventListener('click', () => this.toggle());
    }

    toggle() {
      if (state.isMusicPlaying) {
        this.pause();
      } else {
        this.play();
      }
    }

    play() {
      this.audio.play().then(() => {
        state.isMusicPlaying = true;
        this.controller.classList.add('playing');
      }).catch(err => console.log('Audio play failed:', err));
    }

    pause() {
      this.audio.pause();
      state.isMusicPlaying = false;
      this.controller.classList.remove('playing');
    }
  }

  // ==================== PARALLAX EFFECT ====================
  class ParallaxEffect {
    constructor() {
      this.layers = document.querySelectorAll('.parallax-layer');
      this.init();
    }

    init() {
      window.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 100;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 100;
        
        this.layers.forEach((layer, index) => {
          const speed = layer.getAttribute('data-speed') || 0.5;
          const x = xAxis * speed;
          const y = yAxis * speed;
          layer.style.transform = `translate(${x}px, ${y}px)`;
        });
      });
    }
  }

  // ==================== HERO TRANSITION ====================
  class HeroTransition {
    constructor() {
      this.init();
    }

    init() {
      el.enterBtn.addEventListener('click', () => this.enter());
    }

    enter() {
      if (!state.isMusicPlaying) {
        audioManager.play();
      }

      el.heroSection.style.transition = 'opacity 1.5s cubic-bezier(0.19, 1, 0.22, 1), transform 1.5s cubic-bezier(0.19, 1, 0.22, 1)';
      el.heroSection.style.opacity = '0';
      el.heroSection.style.transform = 'scale(0.95)';

      setTimeout(() => {
        el.heroSection.style.display = 'none';
        el.experienceLuxury.classList.add('active');
        state.isExperienceActive = true;
        
        letterTyper.start();
        petalEffect.start();
        scrollReveal.observe();
      }, 1500);
    }
  }

  // ==================== LETTER TYPING EFFECT ====================
  class LetterTyper {
    constructor() {
      this.element = el.letterContent;
      this.text = `My Dearest Love,

Every morning when I open my eyes, my first thought is of you. Your smile, your laughter, the way your eyes sparkle when you're happy – these are the treasures that make my life complete.

Do you remember the first time we met? I was so nervous, my hands were shaking, but when you smiled at me, everything felt right. That was the moment I knew – my heart had found its home.

You are not just my wife, you are my best friend, my confidante, my partner in every adventure. With you, every ordinary day becomes extraordinary. Even the simple things – morning chai, evening walks, late-night talks – become magical moments I cherish forever.

On this Rose Day, I want you to know that among all the roses in the world, YOU are the most beautiful. Your beauty isn't just in how you look (though you're absolutely stunning), but in your kind heart, your loving soul, and the way you make everyone around you feel special.

Thank you for choosing me. Thank you for loving me with all your heart. Thank you for being YOU.

I promise to love you more with each passing day. I promise to make you smile, to support your dreams, to stand by you in every situation. You are my forever, my always, my everything.

Happy Rose Day, my beautiful rose! 🌹

Forever Yours,
Your Loving Husband ❤️`;
      this.index = 0;
      this.isTyping = false;
    }

    start() {
      if (this.isTyping) return;
      this.isTyping = true;
      this.type();
    }

    type() {
      if (this.index < this.text.length) {
        this.element.textContent += this.text.charAt(this.index);
        this.index++;
        
        const speed = this.text.charAt(this.index - 1) === '\n' ? 150 : 
                     Math.random() * 25 + 15;
        
        setTimeout(() => this.type(), speed);
      } else {
        this.isTyping = false;
      }
    }
  }

  // ==================== FLOATING PETALS 3D ====================
  class PetalEffect {
    constructor() {
      this.container = el.rosePetals3D;
      this.petals = ['🌹', '🌺', '💮', '🌸', '💐'];
      this.interval = null;
    }

    start() {
      this.create();
      this.interval = setInterval(() => this.create(), 1500);
    }

    create() {
      if (!this.container) return;
      
      const petal = document.createElement('div');
      petal.className = 'petal-floating';
      petal.textContent = this.petals[Math.floor(Math.random() * this.petals.length)];
      petal.style.left = `${Math.random() * 100}%`;
      petal.style.setProperty('--drift-x', `${(Math.random() - 0.5) * 100}vw`);
      petal.style.fontSize = `${Math.random() * 15 + 20}px`;
      petal.style.animationDuration = `${Math.random() * 10 + 20}s`;
      petal.style.animationDelay = `${Math.random() * 3}s`;
      
      this.container.appendChild(petal);
      
      setTimeout(() => petal.remove(), 30000);
    }
  }

  // ==================== SCROLL REVEAL ====================
  class ScrollReveal {
    constructor() {
      this.observer = null;
      this.options = {
        threshold: 0.2,
        rootMargin: '0px 0px -10% 0px'
      };
    }

    observe() {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.animationDelay = entry.target.dataset.moment ? 
              `${parseInt(entry.target.dataset.moment) * 0.15}s` : '0s';
            entry.target.style.animationPlayState = 'running';
          }
        });
      }, this.options);

      el.momentCards.forEach(card => {
        card.style.animationPlayState = 'paused';
        this.observer.observe(card);
      });
    }
  }

  // ==================== FIREWORKS ANIMATION ====================
  class FireworksAnimation {
    constructor() {
      this.canvas = el.fireworksCanvas;
      this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
      this.particles = [];
      this.colors = ['#D4365F', '#E85D75', '#FF8FA3', '#C9A96E', '#FFD6E0'];
      this.isActive = false;
    }

    resize() {
      if (!this.canvas) return;
      this.canvas.width = this.canvas.offsetWidth;
      this.canvas.height = this.canvas.offsetHeight;
    }

    launch() {
      if (!this.ctx) return;
      
      this.resize();
      this.isActive = true;
      
      for (let i = 0; i < 5; i++) {
        setTimeout(() => this.createBurst(), i * 500);
      }
      
      this.animate();
    }

    createBurst() {
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * (this.canvas.height * 0.6);
      const color = this.colors[Math.floor(Math.random() * this.colors.length)];
      
      for (let i = 0; i < 60; i++) {
        const angle = (Math.PI * 2 * i) / 60;
        const velocity = 2 + Math.random() * 3;
        
        this.particles.push({
          x, y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          color,
          life: 1,
          decay: 0.008 + Math.random() * 0.012
        });
      }
    }

    animate() {
      if (!this.isActive || !this.ctx) return;
      
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08; // gravity
        p.life -= p.decay;
        
        if (p.life > 0) {
          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
          this.ctx.fillStyle = p.color;
          this.ctx.globalAlpha = p.life;
          this.ctx.fill();
        } else {
          this.particles.splice(index, 1);
        }
      });
      
      this.ctx.globalAlpha = 1;
      
      if (this.particles.length > 0) {
        requestAnimationFrame(() => this.animate());
      } else {
        this.isActive = false;
      }
    }
  }

  // ==================== MODAL SYSTEM ====================
  class ModalSystem {
    constructor(modalEl, closeEl, onOpen = null) {
      this.modal = modalEl;
      this.closeBtn = closeEl;
      this.onOpen = onOpen;
      this.init();
    }

    init() {
      if (this.closeBtn) {
        this.closeBtn.addEventListener('click', () => this.close());
      }
      
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal || e.target.classList.contains('modal-backdrop')) {
          this.close();
        }
      });
      
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.modal.classList.contains('active')) {
          this.close();
        }
      });
    }

    open() {
      this.modal.classList.add('active');
      el.body.style.overflow = 'hidden';
      
      if (this.onOpen) {
        this.onOpen();
      }
    }

    close() {
      this.modal.classList.remove('active');
      el.body.style.overflow = '';
    }
  }

  // ==================== HEART BURST EFFECT ====================
  function createHeartBurst() {
    const container = document.querySelector('.final-modal-content .modal-inner');
    if (!container) return;
    
    const hearts = ['❤️', '💕', '💖', '💗', '💓', '💝', '💘', '💞'];
    
    for (let i = 0; i < 25; i++) {
      setTimeout(() => {
        const heart = document.createElement('div');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.position = 'absolute';
        heart.style.fontSize = `${Math.random() * 25 + 20}px`;
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.top = `${Math.random() * 100}%`;
        heart.style.pointerEvents = 'none';
        heart.style.animation = `heartBurst${i} 3s ease-out forwards`;
        heart.style.zIndex = '1';
        
        container.appendChild(heart);
        
        // Dynamic animation
        const style = document.createElement('style');
        style.textContent = `
          @keyframes heartBurst${i} {
            0% {
              transform: translate(0, 0) scale(0) rotate(0deg);
              opacity: 0;
            }
            20% {
              opacity: 1;
            }
            100% {
              transform: translate(
                ${(Math.random() - 0.5) * 300}px,
                ${(Math.random() - 0.5) * 300}px
              ) scale(1.8) rotate(${Math.random() * 720}deg);
              opacity: 0;
            }
          }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => {
          heart.remove();
          style.remove();
        }, 3000);
      }, i * 100);
    }
  }

  // ==================== INITIALIZE ====================
  function init() {
    // 3D Particle System
    new ParticleSystem3D();
    
    // Cursor System
    new CursorSystem();
    
    // Audio Manager
    window.audioManager = new AudioManager();
    
    // Parallax Effect
    new ParallaxEffect();
    
    // Hero Transition
    new HeroTransition();
    
    // Letter Typer
    window.letterTyper = new LetterTyper();
    
    // Petal Effect
    window.petalEffect = new PetalEffect();
    
    // Scroll Reveal
    window.scrollReveal = new ScrollReveal();
    
    // Fireworks
    const fireworks = new FireworksAnimation();
    
    // Modals
    const surpriseModal = new ModalSystem(
      el.surpriseModal,
      el.closeSuprise,
      () => fireworks.launch()
    );
    
    el.surpriseButton.addEventListener('click', () => surpriseModal.open());
    
    const finalModal = new ModalSystem(
      el.finalModal,
      el.closeFinal,
      () => createHeartBurst()
    );
    
    el.finalButton.addEventListener('click', () => finalModal.open());
    
    // Console Easter Egg
    console.log(
      '%c💎 ULTRA LUXURY PRODUCTION CODE 💎',
      'color: #D4365F; font-size: 20px; font-weight: bold; font-family: "Playfair Display", serif; text-shadow: 2px 2px 4px rgba(212, 54, 95, 0.3);'
    );
    console.log(
      '%c✨ Crafted with 10 Years of Development Expertise ✨',
      'color: #C9A96E; font-size: 14px; font-family: "Cormorant Garamond", serif;'
    );
    console.log(
      '%c🌹 For the Most Amazing Wife 🌹',
      'color: #FF8FA3; font-size: 16px; font-family: "Cinzel", serif;'
    );
  }

  // ==================== DOCUMENT READY ====================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ==================== WINDOW RESIZE HANDLER ====================
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (el.particleCanvas) {
        el.particleCanvas.width = window.innerWidth;
        el.particleCanvas.height = window.innerHeight;
      }
      if (el.cursorCanvas) {
        el.cursorCanvas.width = window.innerWidth;
        el.cursorCanvas.height = window.innerHeight;
      }
    }, 250);
  });

})();