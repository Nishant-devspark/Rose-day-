/**
 * ==========================================
 * PRODUCTION-GRADE ROSE DAY WEBSITE
 * Advanced JavaScript Architecture
 * ==========================================
 */

(function() {
  'use strict';

  // ==========================================
  // State Management
  // ==========================================
  const state = {
    isMusicPlaying: false,
    isExperienceActive: false,
    cursorPosition: { x: 0, y: 0 },
    particles: [],
    fireworks: []
  };

  // ==========================================
  // DOM Elements Cache
  // ==========================================
  const elements = {
    body: document.body,
    heroLanding: document.getElementById('heroLanding'),
    enterBtn: document.getElementById('enterBtn'),
    experienceContainer: document.getElementById('experienceContainer'),
    audioControl: document.getElementById('audioControl'),
    backgroundMusic: document.getElementById('backgroundMusic'),
    letterBody: document.getElementById('letterBody'),
    floatingPetals: document.getElementById('floatingPetals'),
    surpriseBtn: document.getElementById('surpriseBtn'),
    surpriseModal: document.getElementById('surpriseModal'),
    closeModal: document.getElementById('closeModal'),
    finalBtn: document.getElementById('finalBtn'),
    finalModal: document.getElementById('finalModal'),
    closeFinalModal: document.getElementById('closeFinalModal'),
    cursorTrail: document.querySelector('.cursor-trail'),
    cursorCanvas: document.getElementById('cursorCanvas'),
    fireworksCanvas: document.getElementById('fireworksCanvas'),
    memoryCards: document.querySelectorAll('.memory-card')
  };

  // ==========================================
  // Custom Cursor with Canvas Trail
  // ==========================================
  class CursorEffect {
    constructor() {
      this.canvas = elements.cursorCanvas;
      this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
      this.trail = [];
      this.maxTrailLength = 20;
      
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
      document.addEventListener('mousemove', (e) => {
        state.cursorPosition = { x: e.clientX, y: e.clientY };
        
        // Update trail element
        elements.cursorTrail.style.left = `${e.clientX}px`;
        elements.cursorTrail.style.top = `${e.clientY}px`;
        
        // Add to trail array
        this.trail.push({ 
          x: e.clientX, 
          y: e.clientY, 
          life: 1 
        });
        
        if (this.trail.length > this.maxTrailLength) {
          this.trail.shift();
        }
      });

      window.addEventListener('resize', () => this.resize());
      this.animate();
    }

    animate() {
      if (!this.ctx) return;
      
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.trail.forEach((point, index) => {
        const alpha = (index / this.trail.length) * point.life * 0.5;
        const radius = (index / this.trail.length) * 3;
        
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(212, 54, 95, ${alpha})`;
        this.ctx.fill();
        
        point.life -= 0.05;
      });
      
      this.trail = this.trail.filter(p => p.life > 0);
      
      requestAnimationFrame(() => this.animate());
    }
  }

  // ==========================================
  // Audio Control
  // ==========================================
  class AudioController {
    constructor() {
      this.audio = elements.backgroundMusic;
      this.control = elements.audioControl;
      this.init();
    }

    init() {
      this.control.addEventListener('click', () => this.toggle());
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
        this.control.classList.add('playing');
      }).catch(err => {
        console.log('Audio playback failed:', err);
      });
    }

    pause() {
      this.audio.pause();
      state.isMusicPlaying = false;
      this.control.classList.remove('playing');
    }
  }

  // ==========================================
  // Hero Landing Transition
  // ==========================================
  class HeroTransition {
    constructor() {
      this.init();
    }

    init() {
      elements.enterBtn.addEventListener('click', () => this.enter());
    }

    enter() {
      // Attempt to play music
      if (!state.isMusicPlaying) {
        audioController.play();
      }

      // Fade out hero
      elements.heroLanding.style.transition = 'opacity 1.2s cubic-bezier(0.19, 1, 0.22, 1)';
      elements.heroLanding.style.opacity = '0';

      setTimeout(() => {
        elements.heroLanding.style.display = 'none';
        elements.experienceContainer.classList.add('active');
        state.isExperienceActive = true;
        
        // Initialize experience components
        letterTyper.start();
        floatingPetalsEffect.start();
        scrollAnimations.observe();
      }, 1200);
    }
  }

  // ==========================================
  // Letter Typing Effect
  // ==========================================
  class LetterTyper {
    constructor() {
      this.element = elements.letterBody;
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
        
        // Variable speed for natural feel
        const speed = this.text.charAt(this.index - 1) === '\n' ? 100 : 
                     Math.random() * 20 + 15;
        
        setTimeout(() => this.type(), speed);
      } else {
        this.isTyping = false;
      }
    }
  }

  // ==========================================
  // Floating Petals Effect
  // ==========================================
  class FloatingPetalsEffect {
    constructor() {
      this.container = elements.floatingPetals;
      this.petals = ['🌹', '🌺', '💮', '🌸', '💐'];
      this.interval = null;
    }

    start() {
      this.createPetal();
      this.interval = setInterval(() => this.createPetal(), 1000);
    }

    createPetal() {
      if (!this.container) return;
      
      const petal = document.createElement('div');
      petal.className = 'floating-petal';
      petal.textContent = this.petals[Math.floor(Math.random() * this.petals.length)];
      petal.style.left = `${Math.random() * 100}%`;
      petal.style.fontSize = `${Math.random() * 15 + 20}px`;
      petal.style.animationDuration = `${Math.random() * 4 + 6}s`;
      petal.style.animationDelay = `${Math.random() * 2}s`;
      
      this.container.appendChild(petal);
      
      // Remove after animation
      setTimeout(() => petal.remove(), 10000);
    }

    stop() {
      if (this.interval) {
        clearInterval(this.interval);
      }
    }
  }

  // ==========================================
  // Scroll Animations Observer
  // ==========================================
  class ScrollAnimations {
    constructor() {
      this.observer = null;
      this.options = {
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px'
      };
    }

    observe() {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
          }
        });
      }, this.options);

      elements.memoryCards.forEach(card => {
        this.observer.observe(card);
      });
    }
  }

  // ==========================================
  // Fireworks Canvas Animation
  // ==========================================
  class FireworksAnimation {
    constructor() {
      this.canvas = elements.fireworksCanvas;
      this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
      this.particles = [];
      this.colors = ['#D4365F', '#E85D75', '#FF8FA3', '#FFD6E0', '#C9A96E'];
      this.isAnimating = false;
    }

    resize() {
      if (!this.canvas) return;
      this.canvas.width = this.canvas.offsetWidth;
      this.canvas.height = this.canvas.offsetHeight;
    }

    launch() {
      if (!this.ctx) return;
      
      this.resize();
      this.isAnimating = true;
      
      // Launch multiple fireworks
      for (let i = 0; i < 3; i++) {
        setTimeout(() => this.createFirework(), i * 400);
      }
      
      this.animate();
    }

    createFirework() {
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * (this.canvas.height * 0.5);
      const color = this.colors[Math.floor(Math.random() * this.colors.length)];
      const particleCount = 50;
      
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = 2 + Math.random() * 2;
        
        this.particles.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          color: color,
          life: 1,
          decay: 0.01 + Math.random() * 0.01
        });
      }
    }

    animate() {
      if (!this.isAnimating || !this.ctx) return;
      
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.05; // gravity
        particle.life -= particle.decay;
        
        if (particle.life > 0) {
          this.ctx.beginPath();
          this.ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
          this.ctx.fillStyle = particle.color;
          this.ctx.globalAlpha = particle.life;
          this.ctx.fill();
        } else {
          this.particles.splice(index, 1);
        }
      });
      
      this.ctx.globalAlpha = 1;
      
      if (this.particles.length > 0) {
        requestAnimationFrame(() => this.animate());
      } else {
        this.isAnimating = false;
      }
    }

    stop() {
      this.isAnimating = false;
      this.particles = [];
    }
  }

  // ==========================================
  // Modal Controllers
  // ==========================================
  class ModalController {
    constructor(modalElement, closeElement, onOpen = null) {
      this.modal = modalElement;
      this.closeBtn = closeElement;
      this.onOpen = onOpen;
      this.init();
    }

    init() {
      if (this.closeBtn) {
        this.closeBtn.addEventListener('click', () => this.close());
      }
      
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) {
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
      document.body.style.overflow = 'hidden';
      
      if (this.onOpen) {
        this.onOpen();
      }
    }

    close() {
      this.modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // ==========================================
  // Initialize All Components
  // ==========================================
  function init() {
    // Initialize cursor effect
    const cursorEffect = new CursorEffect();
    
    // Initialize audio controller
    window.audioController = new AudioController();
    
    // Initialize hero transition
    const heroTransition = new HeroTransition();
    
    // Initialize letter typer (will start after transition)
    window.letterTyper = new LetterTyper();
    
    // Initialize floating petals (will start after transition)
    window.floatingPetalsEffect = new FloatingPetalsEffect();
    
    // Initialize scroll animations (will start after transition)
    window.scrollAnimations = new ScrollAnimations();
    
    // Initialize fireworks
    const fireworksAnimation = new FireworksAnimation();
    
    // Initialize surprise modal
    const surpriseModal = new ModalController(
      elements.surpriseModal,
      elements.closeModal,
      () => fireworksAnimation.launch()
    );
    
    elements.surpriseBtn.addEventListener('click', () => {
      surpriseModal.open();
    });
    
    // Initialize final modal
    const finalModal = new ModalController(
      elements.finalModal,
      elements.closeFinalModal,
      () => createHeartBurst()
    );
    
    elements.finalBtn.addEventListener('click', () => {
      finalModal.open();
    });
    
    // Add CSS for floating petals animation
    addPetalStyles();
    
    // Console Easter Egg
    console.log(
      '%c❤️ Made with Love ❤️',
      'color: #D4365F; font-size: 24px; font-weight: bold; font-family: "Crimson Pro", serif;'
    );
    console.log(
      '%cFor the most amazing wife in the world! 🌹',
      'color: #FF8FA3; font-size: 16px; font-family: "Lora", serif;'
    );
  }

  // ==========================================
  // Dynamic Style Injection
  // ==========================================
  function addPetalStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .floating-petal {
        position: absolute;
        animation: petalFall linear forwards;
        pointer-events: none;
        user-select: none;
        opacity: 0;
      }
      
      @keyframes petalFall {
        0% {
          transform: translateY(-20px) rotate(0deg);
          opacity: 0;
        }
        10% {
          opacity: 0.8;
        }
        90% {
          opacity: 0.4;
        }
        100% {
          transform: translateY(600px) rotate(720deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // ==========================================
  // Heart Burst Animation
  // ==========================================
  function createHeartBurst() {
    const modalContent = document.querySelector('.final-modal .modal-content');
    if (!modalContent) return;
    
    const hearts = ['❤️', '💕', '💖', '💗', '💓', '💝', '💘'];
    const burstCount = 20;
    
    for (let i = 0; i < burstCount; i++) {
      setTimeout(() => {
        const heart = document.createElement('div');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.position = 'absolute';
        heart.style.fontSize = `${Math.random() * 20 + 25}px`;
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.top = `${Math.random() * 100}%`;
        heart.style.pointerEvents = 'none';
        heart.style.animation = 'heartBurstFloat 2.5s ease-out forwards';
        
        modalContent.appendChild(heart);
        
        setTimeout(() => heart.remove(), 2500);
      }, i * 80);
    }
    
    // Add animation if not exists
    if (!document.getElementById('heartBurstAnimation')) {
      const style = document.createElement('style');
      style.id = 'heartBurstAnimation';
      style.textContent = `
        @keyframes heartBurstFloat {
          0% {
            transform: translate(0, 0) scale(0);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            transform: translate(
              ${Math.random() * 200 - 100}px,
              ${Math.random() * 200 - 100}px
            ) scale(1.5);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // ==========================================
  // Performance Optimizations
  // ==========================================
  
  // Debounce function for resize events
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Lazy load images
  function initLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            imageObserver.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  // ==========================================
  // Document Ready
  // ==========================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Initialize lazy loading
  initLazyLoading();

  // Handle window resize
  window.addEventListener('resize', debounce(() => {
    // Recalculate canvas sizes if needed
    const cursorCanvas = document.getElementById('cursorCanvas');
    const fireworksCanvas = document.getElementById('fireworksCanvas');
    
    if (cursorCanvas) {
      cursorCanvas.width = window.innerWidth;
      cursorCanvas.height = window.innerHeight;
    }
  }, 250));

  // Prevent context menu on images (optional)
  // document.addEventListener('contextmenu', (e) => {
  //   if (e.target.tagName === 'IMG') {
  //     e.preventDefault();
  //   }
  // });

})();