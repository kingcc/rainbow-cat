// Custom element for cat animation
class CatElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.setupStyles();
    this.createElements();
    this.initializeState();
    this.setupEventListeners();
    this.startAnimationLoop();
  }

  // Add method to generate random jump height
  getRandomJumpHeight() {
    // Random height between 30vh and 70vh
    const height = Math.floor(Math.random() * 40 + 30);
    // Calculate duration using physics formula: t = sqrt(2h/g)
    // Using g = 1000 vh/s² (real gravity in vh units)
    const duration = Math.sqrt(2 * height / 1000).toFixed(2) * 2;
    return { height: height + 'vh', duration: duration + 's' };
  }

  getJumpParams() {
    // Calculate jump height based on mouse position
    // Convert mouse Y position to vh units and make it relative to bottom
    const viewportHeight = window.innerHeight;
    const mouseHeightVh = ((viewportHeight - this.pos.y) / viewportHeight) * 100 * (0.8 + 0.2 * Math.random());
    const height = Math.max(10, Math.min(90, mouseHeightVh));
    // Calculate duration using physics formula: t = sqrt(2h/g)
    // Using g = 100vh/s² for game-like feel
    const duration = Math.sqrt(2 * height / 100).toFixed(2) * 2;
    return { height: height, duration: duration };
  }

  setupStyles() {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      :host {
        --cat-height: 45px;
        --cat-width: 60px;
        --cat-body-height: 30px;
        --cat-body-width: 60px;
        --cat-head-height: 40px;
        --cat-head-width: 48px;
        --cat-tail-height: 36px;
        --cat-tail-width: 15px;
        --cat-leg-height: 20px;
        --cat-leg-width: 10px;
        --legs-container-height: 30px;
        --front-legs-width: 30px;
        --back-legs-width: 25px;
        --jump-height: 50vh;  /* Initial height */
        --jump-duration: 1s;   /* Initial duration */
  
        display: block;
        width: 100%;
        height: 100vh;  /* Changed from 100% to 0 */
        pointer-events: none;
        position: fixed;
        bottom: 0;  /* Add this to ensure it's at the bottom of viewport */
        left: 0;    /* Add this for proper positioning */
        z-index: 9999;  /* Ensure it appears above other elements */
        overflow: visible;  /* Allow the cat to be visible outside the host bounds */
      }

      .outer_wrapper {
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
      
      .wrapper {
        position: absolute;
        height: 100%;
        width: 100%;
        top: 0;
      }
      
      .cat {
        position: absolute;
        bottom: 0;
        left: 100px;
        height: var(--cat-height);
        width: var(--cat-width);
        transition: 1.5s;
        transform-origin: center;
        background-color: transparent;
      }
      
      .body {
        position: absolute;
        height: var(--cat-body-height);
        width: var(--cat-body-width);
      }
      
      .face_left .body { 
        animation: turn_body_left forwards 0.5s;
      }
      
      @keyframes turn_body_left {
        0%,100% { transform: scale(1); }
        50% { transform: scale(0.5, 1); }
      }
      
      .face_right .body {
        animation: turn_body_right forwards 0.5s;
      }
      
      @keyframes turn_body_right {
        0%,100% { transform: scale(1); }
        50% { transform: scale(0.5, 1); }
      }
      
      .cat_head {
        position: absolute;
        height: var(--cat-head-height);
        width: var(--cat-head-width);
        right: -10px;
        top: -30px;
        transition: 0.5s;
        z-index: 50;
      }
      
      .first_pose .cat_head,
      .face_left .cat_head{ 
        right: 22px;
      }
      
      .tail {
        position: absolute;
        top: -25px;
        height: var(--cat-tail-height);
        width: var(--cat-tail-width);
        animation: tail_motion forwards 2s;
        transform-origin: bottom right;
      }
      
      @keyframes tail_motion {
        0%,100% { 
          left: -5px;
          transform: rotate(0deg) scale(1); 
        }
        50% { 
          left: -10px;
          transform: rotate(-50deg) scale(-1,1); 
        }
      }
      
      .first_pose .tail,
      .face_left .tail {
        left: 45px;
        animation: tail_motion_alt forwards 2s;
      }
      
      @keyframes tail_motion_alt {
        0%,100% { 
          left: 45px;
          transform: rotate(0deg) scale(1); 
        }
        50% { 
          left: 40px;
          transform: rotate(50deg) scale(-1,1); 
        }
      }
      
      .leg {
        position: absolute;
        height: var(--cat-leg-height);
        width: var(--cat-leg-width);
        transform-origin: top center;
      }
      
      .front_legs,
      .back_legs {
        position: absolute;
        height: var(--legs-container-height);
        transition: 0.7s;
      }
      
      .front_legs {
        width: var(--front-legs-width);
        right: 0;
      }
      
      .back_legs {
        width: var(--back-legs-width);
        left: 0; 
      }
      
      .face_left .leg svg {
        transform: scale(-1,1);
      }
      
      .face_right .front_legs { right: 0; }
      
      .first_pose .front_legs,
      .face_left .front_legs { right: 30px; }
      
      .face_right .back_legs { left: 0; }
      
      .first_pose .back_legs,
      .face_left .back_legs { left: 35px; }
      
      .one,
      .three  {
        bottom: -15px;
        right: 0;
      }
      
      .two, 
      .four {
        bottom: -15px;
        left: 0px;
      }
      
      .one.walk, 
      .three.walk {
        animation: infinite 0.3s walk;
      }
      
      .two.walk, 
      .four.walk {
        animation: infinite 0.3s walk_alt;
      }
      
      @keyframes walk {
        0%,100% {transform: rotate(-10deg);}
        50% {transform: rotate(10deg);}
      }
      
      @keyframes walk_alt {
        0%,100% {transform: rotate(10deg);}
        50% {transform: rotate(-10deg);}
      }
      
      .cat_wrapper {
        position: absolute;
        bottom: 0;
      }
      
      .cat_wrapper.jump .one { 
        animation: infinite .3s walk;
      }
      
      .cat_wrapper.jump .two { 
        animation: infinite .3s walk_alt;
      }
      
      .cat_wrapper.jump .three,
      .cat_wrapper.jump .four {
        animation: none;
      }
      
      .cat_wrapper.jump .cat.face_right .back_legs {
        transform-origin: center;
        transform: rotate(50deg);
      }
      
      .cat_wrapper.jump .cat.face_left .back_legs {
        transform-origin: center;
        transform: rotate(-50deg);
      }
      
      .cat_wrapper.jump .cat.face_right .front_legs {
        transform-origin: center;
        transform: rotate(-60deg);
      }
      
      .cat_wrapper.jump .cat.face_left .front_legs {
        transform-origin: center;
        transform: rotate(60deg);
      }
      
      .cat_wrapper.jump {
        animation: jump var(--jump-duration) ease-in-out forwards;
      }
      
      @keyframes jump {
        0% {
          bottom: 0;
        }
        50% {
          bottom: var(--jump-height);
        }
        100% {
          bottom: 0;
        }
      }
      
      .jump .face_left { 
        animation: forwards .3s body_stand_left;
        transform-origin: right bottom;
      }
      
      .jump .face_right { 
        animation: forwards .3s body_stand_right;
        transform-origin: left bottom;
      }
      
      @keyframes body_stand_right {
        0% {transform: rotate(0deg);}
        100% {transform: rotate(-45deg);}
      }
      
      @keyframes body_stand_left {
        0% {transform: rotate(0deg);}
        100% {transform: rotate(45deg);}
      }
      
      svg {
        height: 100%;
        width: 100%;
      }
      
      polygon,
      path {
        fill: transparent;
        animation: rainbow 4s linear infinite;
      }

      polygon.eyes {
        filter: invert(1);
      }

      @keyframes rainbow { 
        0% { fill: #ff0000; }   /* Red */
        14.28% { fill: #ff8000; }  /* Orange */
        28.57% { fill: #ffff00; }  /* Yellow */
        42.86% { fill: #00ff00; }  /* Green */
        57.14% { fill: #0000ff; }  /* Blue */
        71.43% { fill: #4b0082; }  /* Indigo */
        85.71% { fill: #8f00ff; }  /* Violet */
        100% { fill: #ff0000; }    /* Back to red */
      }
    `;
    this.shadowRoot.appendChild(styleSheet);
  }

  createElements() {
    const template = `
      <div class="outer_wrapper">
        <div class="wrapper">
          <div class="cat_wrapper">
            <div class="cat first_pose">
              <div class="cat_head">
                <svg x="0px" y="0px" width="100%" height="100%" viewBox="0 0 76.4 61.2">
                  <polygon class="eyes" points="63.8,54.1 50.7,54.1 50.7,59.6 27.1,59.6 27.1,54.1 12.4,54.1 12.4,31.8 63.8,31.8"/>
                  <path d="M15.3,45.9h5.1V35.7h-5.1C15.3,35.7,15.3,45.9,15.3,45.9z M48,54v-5h-3v5z M45,55v-3h-5v3z M40,54v-4h-3v3z M37,55v-3h-5v3z M32,54v-5h-3v5z M61.1,35.7H56v10.2h5.1V35.7z M10.2,61.2v-5.1H5.1V51H0V25.5h5.1V15.3h5.1V5.1h5.1V0h5.1v5.1h5.1v5.1h5.1v5.1c0,0,15.2,0,15.2,0v-5.1h5.1V5.1H56V0h5.1v5.1h5.1v10.2h5.1v10.2h5.1l0,25.5h-5.1v5.1h-5.1v5.1H10.2z"/>                </svg>
              </div>
              <div class="body">
                <svg x="0px" y="0px" width="100%" height="100%" viewBox="0 0 91.7 40.8">
                  <path class="st0" d="M91.7,40.8H0V10.2h5.1V5.1h5.1V0h66.2v5.1h10.2v5.1h5.1L91.7,40.8z"/>
                </svg>
                <div class="tail">
                  <svg x="0px" y="0px" width="100%" height="100%" viewBox="0 0 25.5 61.1">
                    <polygon class="st0" points="10.2,56 10.2,50.9 5.1,50.9 5.1,40.7 0,40.7 0,20.4 5.1,20.4 5.1,10.2 10.2,10.2 10.2,5.1 15.3,5.1 15.3,0 25.5,0 25.5,10.2 20.4,10.2 20.4,15.3 15.3,15.3 15.3,20.4 10.2,20.4 10.2,40.7 15.3,40.7 15.3,45.8 20.4,45.8 20.4,50.9 25.5,50.9 25.5,61.1 15.3,61.1 15.3,56"/>
                  </svg>
                </div>
              </div>
              <div class="front_legs">
                <div class="leg one">
                  <svg x="0px" y="0px" width="100%" height="100%" viewBox="0 0 14 30.5">
                    <polygon points="15.3,30.5 5.1,30.5 5.1,25.4 0,25.4 0,0 15.3,0"/>
                  </svg>
                </div>
                <div class="leg two">
                  <svg x="0px" y="0px" width="100%" height="100%" viewBox="0 0 14 30.5">
                    <polygon points="15.3,30.5 5.1,30.5 5.1,25.4 0,25.4 0,0 15.3,0"/>
                  </svg>
                </div>
              </div>
              <div class="back_legs">
                <div class="leg three">
                  <svg x="0px" y="0px" width="100%" height="100%" viewBox="0 0 14 30.5">
                    <polygon points="15.3,30.5 5.1,30.5 5.1,25.4 0,25.4 0,0 15.3,0"/>
                  </svg>
                </div>
                <div class="leg four">
                  <svg x="0px" y="0px" width="100%" height="100%" viewBox="0 0 14 30.5">
                    <polygon points="15.3,30.5 5.1,30.5 5.1,25.4 0,25.4 0,0 15.3,0"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    this.shadowRoot.innerHTML += template;
  }

  initializeState() {
    this.catWrapper = this.shadowRoot.querySelector('.cat_wrapper');
    this.wrapper = this.shadowRoot.querySelector('.wrapper');
    this.cat = this.shadowRoot.querySelector('.cat');
    this.head = this.shadowRoot.querySelector('.cat_head');
    this.legs = this.shadowRoot.querySelectorAll('.leg');
    this.pos = { x: null, y: null };
  }

  // Event handlers and animation methods
  walk() {
    this.cat.classList.remove('first_pose');
    this.legs.forEach(leg => leg.classList.add('walk'));
  }

  handleMouseMotion = (e) => {
    const rect = this.getBoundingClientRect();
    this.pos.x = e.clientX - rect.left;
    this.pos.y = e.clientY - rect.top;
    this.walk();
  }

  handleTouchMotion = (e) => {
    if (!e.targetTouches) return;
    const rect = this.getBoundingClientRect();
    this.pos.x = e.targetTouches[0].clientX - rect.left;
    this.pos.y = e.targetTouches[0].clientY - rect.top;
    this.walk();
  }

  turnRight() {
    this.cat.style.left = `${this.pos.x - 90}px`;
    this.cat.classList.remove('face_left');
    this.cat.classList.add('face_right');
  }

  turnLeft() {
    this.cat.style.left = `${this.pos.x + 10}px`;
    this.cat.classList.remove('face_right');
    this.cat.classList.add('face_left');
  }

  decideTurnDirection() {
    this.cat.getBoundingClientRect().x < this.pos.x
      ? this.turnRight()
      : this.turnLeft();
  }

  headMotion() {
    this.head.style.top = this.pos.y > (this.wrapper.clientHeight - 100)
      ? '-15px'
      : '-30px';
  }

  jumpBegin = 0;

  jumpEnd = Infinity;

  checkJump() {
    if (this.pos.y < (this.wrapper.clientHeight - 200)) {
      if (!this.jumpBegin) {
        const jumpParams = this.getJumpParams();
        // Update both height and animation duration
        this.style.setProperty('--jump-height', jumpParams.height + 'vh');
        this.style.setProperty('--jump-duration', jumpParams.duration + 's');
        this.jumpBegin = Date.now();
        this.jumpEnd = this.jumpBegin + jumpParams.duration * 1000;
        this.catWrapper.classList.add('jump');
      } else if (Date.now() > this.jumpEnd) {
        this.catWrapper.classList.remove('jump');
        this.jumpBegin = 0;
      }
    } else {
      this.catWrapper.classList.remove('jump');
      this.jumpBegin = 0;
    }
  }

  decideStop() {
    if ((this.cat.classList.contains('face_right') && this.pos.x - 90 === this.cat.offsetLeft) ||
        (this.cat.classList.contains('face_left') && this.pos.x + 10 === this.cat.offsetLeft)) {
      this.legs.forEach(leg => leg.classList.remove('walk'));
    }
  }

  connectedCallback() {
    this.setupEventListeners();
    this.startAnimationLoop();
  }

  disconnectedCallback() {
    // Cleanup event listeners when element is removed
    document.removeEventListener('mousemove', this.handleMouseMotion);
    document.removeEventListener('touchmove', this.handleTouchMotion);
  }

  setupEventListeners() {
    document.addEventListener('mousemove', this.handleMouseMotion);
    document.addEventListener('touchmove', this.handleTouchMotion);
  }
  startAnimationLoop() {
    let lastCall = 0;
    
    const animate = (timestamp) => {
      if (!this.pos.x || !this.pos.y) {
        this.animationFrame = requestAnimationFrame(animate);
        return;
      }

      if (timestamp - lastCall < 128) {
        this.animationFrame = requestAnimationFrame(animate);
        return;
      }

      lastCall = timestamp;

      this.decideTurnDirection();
      this.headMotion();
      this.decideStop();
      this.checkJump();

      this.animationFrame = requestAnimationFrame(animate);
    };

    this.animationFrame = requestAnimationFrame(animate);
  }
}

// Register the custom element
customElements.define('rainbow-cat', CatElement);
