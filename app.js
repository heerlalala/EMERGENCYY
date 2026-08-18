/* ==========================================================================
   PANCAKE IS SICK - INTERACTIVE APP SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================================================
  // STATE MANAGEMENT
  // ==========================================================================
  let quizStep = 1;
  let tissueScore = 0;
  let tissueGameInterval = null;
  let tissueGameActive = false;
  let dontClickClicks = 0;
  let cuddleCount = 0;
  let recoveryProgress = 0;
  let randomToastInterval = null;
  let currentFaceState = 'fine';
  
  // Compliments List
  const complimentsList = [
    "You're still cute even when you look like a defeated potato. 🥔❤️",
    "10/10 Pancake. 2/10 immune system. Let's fix that ratio! 📈",
    "Your face is my favorite face. Unfortunately, currently it is a sick face. 🤧",
    "You are medically required to recover because I have plans for you! 🗓️✨",
    "Even your fever cannot compete with your level of cuteness. 🌡️🔥",
    "You are my favorite human-shaped Pancake. 🥞",
    "Honestly rude of your immune system to make you sick. I'm filing a complaint. 😤",
    "You're adorable. Now stop being dramatic and take your meds. 💊",
    "If being cute cured illness, you'd already be completely healthy. 🥺",
    "I pancake you. Unfortunately, this does not exempt you from drinking water. 💧",
    "You are too precious to be sneezed on by microscopic germs. Let me beat them up. 👊",
    "Please get better, I need my favorite target for bullying and snuggling. 😂🫂"
  ];

  // DOM Elements Selection
  const pContainer = document.getElementById('particle-container');
  const soundToast = document.getElementById('sound-toast');
  const characterThought = document.getElementById('character-thought');
  const mainProgressBar = document.getElementById('main-progress-bar');
  const progressBubble = document.getElementById('progress-bubble');
  const recoveryPercent = document.getElementById('recovery-percent');
  const recoveryLog = document.getElementById('recovery-log-message');
  const celebrationOverlay = document.getElementById('celebration-overlay');
  
  // SVG Face Layers
  const eyeFine = document.querySelector('.eye-state-fine');
  const eyeSick = document.querySelector('.eye-state-sick');
  const eyeDizzy = document.querySelector('.eye-state-dizzy');
  const eyeSleeping = document.querySelector('.eye-state-sleeping');
  const mouthFine = document.querySelector('.mouth-state-fine');
  const mouthSick = document.querySelector('.mouth-state-sick');
  const mouthThermo = document.querySelector('.mouth-state-thermo');
  const mouthSneeze = document.querySelector('.mouth-state-sneeze');
  const sweatDrops = document.querySelectorAll('.sweat-drop');
  const pancakeBody = document.getElementById('pancake-body-el');

  // ==========================================================================
  // PARTICLE & HEART ENGINE
  // ==========================================================================
  function createParticle(emoji, isHeart = false, xPos = null) {
    const p = document.createElement('div');
    p.classList.add('floating-particle');
    p.innerText = emoji;
    
    // Randomize initial positions & animations
    const x = xPos !== null ? xPos : Math.random() * window.innerWidth;
    p.style.left = `${x}px`;
    p.style.fontSize = `${Math.random() * 20 + 16}px`;
    
    // Duration randomizer
    const duration = Math.random() * 3 + 3; // 3s to 6s
    p.style.animationDuration = `${duration}s`;
    
    if (isHeart) {
      p.style.color = '#ff4d6d';
    }
    
    pContainer.appendChild(p);
    
    // Self-destruct after animation ends
    setTimeout(() => {
      p.remove();
    }, duration * 1000);
  }

  function triggerExplosion(emoji, count = 20, centerOffset = 0.5) {
    const screenWidth = window.innerWidth;
    const startX = screenWidth * centerOffset;
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        // Spread offset slightly around the center
        const offset = (Math.random() - 0.5) * 200;
        createParticle(emoji, emoji === '❤️', startX + offset);
      }, i * 40);
    }
  }

  // Visual audio toaster
  function playVisualSound(text) {
    soundToast.innerHTML = `<i class="fa-solid fa-volume-high"></i> ${text}`;
    soundToast.classList.add('show');
    setTimeout(() => {
      soundToast.classList.remove('show');
    }, 2000);
  }

  // Ambient emoji floaters trigger
  setInterval(() => {
    const emojis = ['❤️', '🥞', '🥺', '🫂', '💊', '💧', '🎀'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    createParticle(randomEmoji);
  }, 3500);

  // ==========================================================================
  // PANCAKE FACIAL INTERACTIVITY
  // ==========================================================================
  function setPancakeFace(state) {
    currentFaceState = state;
    
    // Hide all eye states
    eyeFine.classList.add('d-none');
    eyeSick.classList.add('d-none');
    eyeDizzy.classList.add('d-none');
    eyeSleeping.classList.add('d-none');
    
    // Hide all mouth states
    mouthFine.classList.add('d-none');
    mouthSick.classList.add('d-none');
    mouthThermo.classList.add('d-none');
    mouthSneeze.classList.add('d-none');
    
    // Hide sweat details
    sweatDrops.forEach(el => el.classList.add('d-none'));

    // Enable selected states
    switch (state) {
      case 'fine':
        eyeFine.classList.remove('d-none');
        mouthFine.classList.remove('d-none');
        break;
      case 'sick':
        eyeSick.classList.remove('d-none');
        mouthSick.classList.remove('d-none');
        sweatDrops.forEach(el => el.classList.remove('d-none'));
        break;
      case 'dizzy':
        eyeDizzy.classList.remove('d-none');
        mouthSick.classList.remove('d-none');
        sweatDrops.forEach(el => el.classList.remove('d-none'));
        break;
      case 'sleeping':
        eyeSleeping.classList.remove('d-none');
        mouthFine.classList.remove('d-none');
        break;
      case 'thermo':
        eyeSick.classList.remove('d-none');
        mouthThermo.classList.remove('d-none');
        sweatDrops.forEach(el => el.classList.remove('d-none'));
        break;
    }
  }

  // Trigger Sneeze Animation occasionally
  function triggerSneeze() {
    if (currentFaceState === 'sleeping') return; // Don't sneeze while sleeping
    
    const prevFaceState = currentFaceState;
    const thoughts = [
      "ACHOO! 🤧", 
      "Ugh, germs are stupid! 😤", 
      "Can I get a refund on this immune system? 🧾", 
      "Need... tissue... quickly... 🧻",
      "I sneezed and I think my brain vibrated. 🧠"
    ];
    
    pancakeBody.classList.add('sneeze-active');
    
    // Temporarily swap face components
    eyeSick.classList.remove('d-none');
    eyeFine.classList.add('d-none');
    eyeDizzy.classList.add('d-none');
    
    mouthSneeze.classList.remove('d-none');
    mouthFine.classList.add('d-none');
    mouthSick.classList.add('d-none');
    mouthThermo.classList.add('d-none');

    // Update dialogue bubbles
    characterThought.innerText = thoughts[Math.floor(Math.random() * thoughts.length)];
    characterThought.style.transform = 'scale(1.2)';
    
    playVisualSound("A-CHOOO! 🤧💨");
    
    // Spawn flyaway tissue particles
    for (let i = 0; i < 5; i++) {
      createParticle('🧻', false, window.innerWidth * 0.5 + (Math.random() - 0.5) * 80);
    }

    setTimeout(() => {
      pancakeBody.classList.remove('sneeze-active');
      characterThought.style.transform = 'scale(1)';
      setPancakeFace(prevFaceState);
    }, 600);
  }

  // Sneeze interval (every 18 seconds)
  setInterval(triggerSneeze, 18000);

  // ==========================================================================
  // NAVIGATION CONTROL
  // ==========================================================================
  function revealSection(sectionId, callback) {
    const target = document.getElementById(sectionId);
    target.classList.remove('d-none');
    
    // Scroll to the new section smoothly
    setTimeout(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (callback) callback();
    }, 150);
  }

  // START RECOVERY PROTOCOL CLICK
  document.getElementById('start-recovery-btn').addEventListener('click', (e) => {
    e.target.classList.remove('pulse');
    playVisualSound("🚨 EMERGENCY MODE ENGAGED 🚨");
    
    // Screen Shake Effect
    document.body.style.animation = 'sneeze-shake 0.5s ease-in-out';
    setTimeout(() => { document.body.style.animation = ''; }, 500);
    
    triggerExplosion('❤️', 15);
    triggerExplosion('🚨', 10, 0.3);
    triggerExplosion('🩹', 10, 0.7);
    
    revealSection('section-diagnostics', () => {
      // Start the toast scheduler once diagnostics open
      startToastScheduler();
    });
  });

  // ==========================================================================
  // DIAGNOSTICS LOGIC
  // ==========================================================================
  const quizBoxes = document.querySelectorAll('.quiz-question-box');
  const quizProgressBar = document.getElementById('quiz-progress-bar');
  const reportContainer = document.getElementById('report-container');
  const reportSeverityText = document.getElementById('report-severity');
  
  let userAnswers = {};

  document.querySelectorAll('.quiz-question-box .btn-option').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const parentBox = e.target.closest('.quiz-question-box');
      const step = parseInt(parentBox.getAttribute('data-step'));
      const answerVal = e.target.getAttribute('data-ans');
      
      // Highlight selection
      parentBox.querySelectorAll('.btn-option').forEach(b => b.classList.remove('selected'));
      e.target.classList.add('selected');
      
      // Save answer
      userAnswers[step] = answerVal;
      
      // Progress animation
      setTimeout(() => {
        parentBox.classList.remove('active');
        const nextStep = step + 1;
        const nextBox = document.querySelector(`.quiz-question-box[data-step="${nextStep}"]`);
        
        if (nextBox) {
          nextBox.classList.add('active');
          quizProgressBar.style.width = `${nextStep * 20}%`;
        } else {
          // Finished Quiz -> Show Diagnostics
          quizProgressBar.parentElement.classList.add('d-none');
          showDiagnosticsReport();
        }
      }, 350);
    });
  });

  function showDiagnosticsReport() {
    // Custom calculations based on answers
    let severity = 95;
    if (userAnswers[3] === 'dying') severity = 99; // Dramatic boost
    if (userAnswers[1] === 'yes' && userAnswers[2] === 'yes') severity = 88; // Slightly healthy pancake
    
    reportSeverityText.innerText = `${severity}%`;
    
    // Set Pancake face to sad/sick
    setPancakeFace('sick');
    characterThought.innerText = "I have severe Pancakeitis... 🥺";
    
    reportContainer.classList.remove('d-none');
    playVisualSound("🔬 DIAGNOSIS COMPLETE");
    triggerExplosion('🩹', 12);
  }

  document.getElementById('diagnostics-done-btn').addEventListener('click', () => {
    revealSection('section-slider');
  });

  // ==========================================================================
  // SICKNESS SLIDER LOGIC
  // ==========================================================================
  const sickSlider = document.getElementById('sick-slider');
  const sliderDramaTitle = document.getElementById('slider-drama-title');
  const sliderDramaText = document.getElementById('slider-drama-text');
  
  sickSlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    sliderDramaText.innerText = `Sickness Level: ${val}%`;
    
    if (val <= 20) {
      setPancakeFace('fine');
      sliderDramaTitle.innerText = "Bro you're literally fine. 😎";
      characterThought.innerText = "Okay, maybe I was faking it a little bit... 🤫";
    } else if (val > 20 && val <= 45) {
      setPancakeFace('fine');
      sliderDramaTitle.innerText = "Okay. Maybe drink some water. 😐";
      characterThought.innerText = "I feel slightly soggy. Like a leftover flapjack.";
    } else if (val > 45 && val <= 70) {
      setPancakeFace('sick');
      sliderDramaTitle.innerText = "Hmm. Pancake requires immediate attention. 🥺";
      characterThought.innerText = "Cuddle deficits are rising. S.O.S! 🆘";
    } else if (val > 70 && val <= 90) {
      setPancakeFace('thermo');
      sliderDramaTitle.innerText = "THIS IS NOT A DRILL. 🚨";
      characterThought.innerText = "Thermometer reads: Extreme Cuteness Overload!";
    } else {
      setPancakeFace('dizzy');
      sliderDramaTitle.innerText = "CALL THE PRESIDENT. THE PANCAKE IS SICK.";
      characterThought.innerText = "Tell everyone I was beautiful... 🪦👻";
    }
  });

  document.getElementById('slider-done-btn').addEventListener('click', () => {
    revealSection('section-delivery');
  });

  // ==========================================================================
  // EMERGENCY DELIVERY SERVICE LOGIC
  // ==========================================================================
  const deliveryResultBox = document.getElementById('delivery-result-box');
  const deliveryResTitle = document.getElementById('delivery-res-title');
  const deliveryResText = document.getElementById('delivery-res-text');
  
  const deliveryMessages = {
    'deliv-food': {
      title: "🍔 FOOD REQUEST STATUS",
      text: "Food request received. Your Waffle has been notified! Unfortunately, teleportation technology is still under development. In the meantime, please consume any soup within arms reach. 🍜",
      emoji: '🍜'
    },
    'deliv-water': {
      title: "💧 HYDRATION ALARM ACTIVED",
      text: "HYDRATION REQUEST ACCEPTED. Please drink a glass of water immediately before I personally dispatch the Hydration Police. 💧👮",
      emoji: '💧'
    },
    'deliv-cuddles': {
      title: "🫂 CUDDLE INVENTORY CHECK",
      text: "CUDDLE REQUEST RECEIVED. Processing... Processing... ERROR: Waffle is too far away. Virtual hugs have been dispatched at lightspeed. 🫂💖",
      emoji: '🫂'
    },
    'deliv-entertainment': {
      title: "🎬 ENTERTAINMENT MODE INITIALIZED",
      text: "Congratulations! You have been officially assigned the task of doing absolutely nothing, staring at the ceiling, or playing my goofy games. Do NOT scroll Instagram for 6 hours! 🛌⚠️",
      emoji: '🎬'
    },
    'deliv-you': {
      title: "🥺 SPECIAL SERVICE ENROUTE",
      text: "Request received ❤️. While I cannot break physics to teleport instantly, consider this a reminder that I love you too, I pancake you very, very, VERY much. Hang tight, cutie! 🥰",
      emoji: '❤️'
    }
  };

  document.querySelectorAll('.delivery-grid .delivery-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const cardId = e.currentTarget.id;
      const data = deliveryMessages[cardId];
      
      deliveryResultBox.classList.remove('d-none');
      deliveryResTitle.innerText = data.title;
      deliveryResText.innerText = data.text;
      
      // Explosion of related emojis
      triggerExplosion(data.emoji, 15);
      playVisualSound("🛵 REQUEST SENT!");
      
      // Dynamic pancake speech
      if (cardId === 'deliv-food') {
        characterThought.innerText = "Feed me! 😋";
      } else if (cardId === 'deliv-water') {
        characterThought.innerText = "Glug glug... 💧";
      } else if (cardId === 'deliv-cuddles') {
        characterThought.innerText = "Squeeze me! 🥰";
      } else {
        characterThought.innerText = "GF attention incoming! ❤️";
      }
    });
  });

  document.getElementById('delivery-done-btn').addEventListener('click', () => {
    revealSection('section-games');
  });

  // ==========================================================================
  // MINI-GAMES INTERFACE
  // ==========================================================================
  
  // Tab Swapping
  const tabBtns = document.querySelectorAll('.game-tab-btn');
  const gamePanels = document.querySelectorAll('.game-panel');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      tabBtns.forEach(b => b.classList.remove('active'));
      gamePanels.forEach(p => p.classList.remove('active'));
      
      e.target.classList.add('active');
      const gameId = e.target.getAttribute('data-game');
      document.getElementById(`game-${gameId}-panel`).classList.add('active');
      
      // Stop tissue game if active and tab changed
      if (gameId !== 'tissue' && tissueGameActive) {
        stopTissueGame();
      }
    });
  });

  // --- GAME 1: CATCH THE TISSUES ---
  const tissueArea = document.getElementById('tissue-game-area');
  const tissueScoreText = document.getElementById('tissue-score');
  const tissueMilestoneText = document.getElementById('tissue-milestone');
  const startTissueBtn = document.getElementById('start-tissue-game');
  const startPrompt = document.getElementById('game-start-prompt');

  startTissueBtn.addEventListener('click', () => {
    if (tissueGameActive) {
      stopTissueGame();
    } else {
      startTissueGame();
    }
  });

  function startTissueGame() {
    tissueGameActive = true;
    tissueScore = 0;
    tissueScoreText.innerText = '0';
    tissueMilestoneText.innerText = "Defend Pancake's nose!";
    startTissueBtn.innerText = "STOP GAME";
    startPrompt.classList.add('d-none');
    
    // Clear area of leftovers
    const elements = tissueArea.querySelectorAll('.falling-tissue');
    elements.forEach(el => el.remove());
    
    playVisualSound("🎮 GAME STARTED");
    
    // Spawn loop
    tissueGameInterval = setInterval(spawnTissue, 900);
  }

  function stopTissueGame() {
    tissueGameActive = false;
    startTissueBtn.innerText = "START GAME";
    clearInterval(tissueGameInterval);
    startPrompt.classList.remove('d-none');
    
    const elements = tissueArea.querySelectorAll('.falling-tissue');
    elements.forEach(el => el.remove());
  }

  function spawnTissue() {
    if (!tissueGameActive) return;
    
    const tissue = document.createElement('div');
    tissue.classList.add('falling-tissue');
    
    const tissueEmojis = ['🧻', '🤧'];
    tissue.innerText = tissueEmojis[Math.floor(Math.random() * tissueEmojis.length)];
    
    // Random position inside the playbox bounds
    const maxLeft = tissueArea.clientWidth - 20;
    const randomLeft = Math.random() * maxLeft + 10;
    tissue.style.left = `${randomLeft}px`;
    
    // Handle click
    tissue.addEventListener('click', (e) => {
      if (!tissueGameActive) return;
      
      tissueScore++;
      tissueScoreText.innerText = tissueScore;
      
      // Floating score splash inside game box
      const clickX = e.clientX - tissueArea.getBoundingClientRect().left;
      const clickY = e.clientY - tissueArea.getBoundingClientRect().top;
      showScoreSplash(clickX, clickY);
      
      // Remove clicked tissue
      e.target.remove();
      
      // Check Milestones
      updateTissueMilestones();
    });
    
    tissueArea.appendChild(tissue);
    
    // Remove if it finishes falling past bottom
    setTimeout(() => {
      if (tissue.parentElement) {
        tissue.remove();
      }
    }, 3000);
  }

  function showScoreSplash(x, y) {
    const splash = document.createElement('span');
    splash.innerText = '+1 🤧';
    splash.style.position = 'absolute';
    splash.style.left = `${x}px`;
    splash.style.top = `${y}px`;
    splash.style.color = '#ff4d6d';
    splash.style.fontWeight = 'bold';
    splash.style.fontFamily = 'var(--font-title)';
    splash.style.fontSize = '12px';
    splash.style.pointerEvents = 'none';
    splash.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
    
    tissueArea.appendChild(splash);
    
    setTimeout(() => {
      splash.style.transform = 'translateY(-20px)';
      splash.style.opacity = '0';
    }, 10);
    
    setTimeout(() => {
      splash.remove();
    }, 600);
  }

  function updateTissueMilestones() {
    if (tissueScore === 10) {
      tissueMilestoneText.innerText = "Okay tissue warrior! 🤧";
      triggerExplosion('🧻', 6);
    } else if (tissueScore === 25) {
      tissueMilestoneText.innerText = "The immune system fears you. 💪";
      triggerExplosion('✨', 8);
    } else if (tissueScore === 50) {
      tissueMilestoneText.innerText = "You have become one with the tissues. 🧻";
      triggerExplosion('❤️', 12);
    } else if (tissueScore === 100) {
      tissueMilestoneText.innerText = "LEGENDARY PANCAKE STATUS ACHIEVED. 🏆";
      triggerExplosion('🎉', 20);
    }
  }

  // --- GAME 2: DO NOT CLICK THIS BUTTON ---
  const runawayBtn = document.getElementById('runaway-btn');
  const runawayContainer = document.getElementById('runaway-container');
  const dontClickCounter = document.getElementById('dont-click-counter');
  const dontClickComment = document.getElementById('dont-click-comment');

  const runawayMessages = [
    "Why did you click it? 🧐",
    "I specifically told you not to. 😤",
    "Pancake... stop. 🥞",
    "Are you always this obedient? 🙄",
    "STOP IT. 🛑",
    "I'm disappointed in your listening skills. 🧍‍♀️",
    "Okay, this is getting personal now.",
    "Are you challenging my authority? ⚡",
    "Now you're just clicking it out of spite.",
    "Fine. You win. 🧍‍♀️ I knew you couldn't resist."
  ];

  function moveButton() {
    const btnWidth = runawayBtn.clientWidth || 180;
    const btnHeight = runawayBtn.clientHeight || 50;
    
    const containerWidth = runawayContainer.clientWidth;
    const containerHeight = runawayContainer.clientHeight;
    
    // Keep it within borders safely
    const maxX = containerWidth - btnWidth - 10;
    const maxY = containerHeight - btnHeight - 10;
    
    const randomX = Math.max(10, Math.floor(Math.random() * maxX));
    const randomY = Math.max(10, Math.floor(Math.random() * maxY));
    
    runawayBtn.style.left = `${randomX}px`;
    runawayBtn.style.top = `${randomY}px`;
  }

  // Move away on hover
  runawayBtn.addEventListener('mouseenter', () => {
    // Only escape 90% of the time, letting them catch it sometimes
    if (Math.random() < 0.9) {
      moveButton();
      playVisualSound("💨 SWOOSH!");
    }
  });

  // Also move on touch devices (so they have to tap fast)
  runawayBtn.addEventListener('touchstart', (e) => {
    if (Math.random() < 0.7) {
      moveButton();
      e.preventDefault(); // Stop click triggers on teleport
    }
  });

  // Successful Click Handler
  runawayBtn.addEventListener('click', () => {
    dontClickClicks++;
    dontClickCounter.innerText = `Forbidden Clicks: ${dontClickClicks}`;
    
    // Change text dynamically
    const msgIdx = Math.min(dontClickClicks - 1, runawayMessages.length - 1);
    dontClickComment.innerText = runawayMessages[msgIdx];
    
    // Spawn dynamic elements
    triggerExplosion('⚠️', 8);
    playVisualSound("💥 BONK!");
    
    if (dontClickClicks >= 10) {
      dontClickComment.innerHTML = "<strong>I knew you couldn't resist. You rebellious little Pancake. 🥞❤️</strong>";
    }
    
    // Sneeze Pancake for defiance
    triggerSneeze();
    
    // Teleport to new spot immediately after click
    moveButton();
  });

  // Initialize button position
  moveButton();

  // --- GAME 3: CUDDLE METER ---
  const cuddleTrigger = document.getElementById('cuddle-trigger-btn');
  const cuddleCountText = document.getElementById('cuddle-count-text');
  const cuddleMilestoneText = document.getElementById('cuddle-milestone-msg');

  cuddleTrigger.addEventListener('click', (e) => {
    cuddleCount++;
    cuddleCountText.innerText = `CUDDLES DELIVERED: ${cuddleCount}`;
    
    // Explode hearts around cursor
    triggerExplosion('❤️', 8, e.clientX / window.innerWidth);
    playVisualSound("💖 SQUEEZE!");
    
    // Micro-scale-up effect
    cuddleTrigger.style.transform = 'scale(1.1)';
    setTimeout(() => { cuddleTrigger.style.transform = ''; }, 100);
    
    // Update labels
    if (cuddleCount === 10) {
      cuddleMilestoneText.innerText = "Warm and cozy. ☕";
      setPancakeFace('sleeping');
    } else if (cuddleCount === 25) {
      cuddleMilestoneText.innerText = "Getting cozy. 🛌";
    } else if (cuddleCount === 50) {
      cuddleMilestoneText.innerText = "Maximum coziness approaching. 🧸";
    } else if (cuddleCount === 100) {
      cuddleMilestoneText.innerText = "You are now legally required to feel better. 📜";
      triggerExplosion('🫂', 25);
    } else if (cuddleCount === 250) {
      cuddleMilestoneText.innerText = "Pancake has reached maximum cuddle capacity! 🫂✨";
      triggerExplosion('👑', 30);
    }
  });

  document.getElementById('games-done-btn').addEventListener('click', () => {
    // Stop tissue game if they advance
    stopTissueGame();
    revealSection('section-letters');
  });

  // ==========================================================================
  // ENVELOPES / LETTERS SYSTEM
  // ==========================================================================
  document.querySelectorAll('.envelope-wrapper').forEach(wrapper => {
    wrapper.addEventListener('click', (e) => {
      const envelope = wrapper.querySelector('.envelope');
      const letterType = wrapper.getAttribute('data-letter');
      const isAlreadyOpen = envelope.classList.contains('open');
      
      // Close all others first
      document.querySelectorAll('.envelope').forEach(env => env.classList.remove('open'));
      
      if (!isAlreadyOpen) {
        envelope.classList.add('open');
        playVisualSound("💌 RUSTLE!");
        
        // Spawn emojis corresponding to moods
        let emoji = '❤️';
        if (letterType === 'sad') emoji = '🥺';
        if (letterType === 'bored') emoji = '😐';
        if (letterType === 'dramatic') emoji = '🎭';
        if (letterType === 'motivation') emoji = '💪';
        
        triggerExplosion(emoji, 12, (wrapper.getBoundingClientRect().left + 80) / window.innerWidth);
      }
    });
  });

  document.getElementById('letters-done-btn').addEventListener('click', () => {
    revealSection('section-compliment');
  });

  // ==========================================================================
  // COMPLIMENT MACHINE LOGIC
  // ==========================================================================
  const compCard = document.getElementById('compliment-card');
  const compText = document.getElementById('compliment-text');
  const nextCompBtn = document.getElementById('next-compliment-btn');
  let lastCompIdx = -1;

  nextCompBtn.addEventListener('click', () => {
    // Prevent immediate repeated index
    let newIdx = lastCompIdx;
    while (newIdx === lastCompIdx) {
      newIdx = Math.floor(Math.random() * complimentsList.length);
    }
    lastCompIdx = newIdx;
    
    // Animate transition
    compCard.style.opacity = '0';
    compCard.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
      compText.innerText = complimentsList[newIdx];
      compCard.style.opacity = '1';
      compCard.style.transform = 'scale(1)';
      playVisualSound("✨ POP!");
      triggerExplosion('💖', 10);
    }, 200);
  });

  document.getElementById('compliment-done-btn').addEventListener('click', () => {
    revealSection('section-recovery');
  });

  // ==========================================================================
  // ULTIMATE RECOVERY PROGRESS SYSTEM
  // ==========================================================================
  const recoveryButtons = {
    'action-water': { percent: 10, msg: "HYDRATION +10% 💧 (Responsible Pancake!)", emoji: '💧' },
    'action-food': { percent: 15, msg: "CALORIES ACQUIRED +15% 🍜 (Energy restoring!)", emoji: '🍜' },
    'action-medicine': { percent: 20, msg: "RESPONSIBLE PANCAKE POINTS +20% 💊 (Germs are fleeing!)", emoji: '💊' },
    'action-sleep': { percent: 20, msg: "REST MODE ACTIVATED +20% 😴 (Power nap powers!)", emoji: '😴' },
    'action-cuddles': { percent: 25, msg: "EMOTIONAL SUPPORT +25% 🫂 (Cuddle level rising!)", emoji: '🫂' }
  };

  Object.keys(recoveryButtons).forEach(btnId => {
    const btn = document.getElementById(btnId);
    const config = recoveryButtons[btnId];
    
    btn.addEventListener('click', () => {
      if (recoveryProgress >= 100) return;
      
      // Add progress
      recoveryProgress = Math.min(100, recoveryProgress + config.percent);
      
      // Update UI displays
      mainProgressBar.style.width = `${recoveryProgress}%`;
      progressBubble.innerText = `${recoveryProgress}%`;
      recoveryPercent.innerText = `${recoveryProgress}%`;
      
      // Update logs
      recoveryLog.innerHTML = `<strong>${config.msg}</strong>`;
      recoveryLog.style.color = 'var(--color-primary)';
      
      triggerExplosion(config.emoji, 15);
      playVisualSound("⚡ POWER UP!");
      
      // Update pancake character visual
      if (recoveryProgress >= 40 && recoveryProgress < 75) {
        setPancakeFace('fine');
        characterThought.innerText = "I feel the energy returning... ✨";
      } else if (recoveryProgress >= 75 && recoveryProgress < 100) {
        setPancakeFace('sleeping');
        characterThought.innerText = "Ah, getting cozy. Almost cured! 🛌";
      }
      
      // Check for victory
      if (recoveryProgress >= 100) {
        triggerUltimateCelebration();
      }
    });
  });

  // ==========================================================================
  // 100% RECOVERY CELEBRATION MODAL
  // ==========================================================================
  function triggerUltimateCelebration() {
    // Stop any chaotic intervals
    clearInterval(randomToastInterval);
    
    // Set pancake character face to happy / fine
    setPancakeFace('fine');
    characterThought.innerText = "I AM REBORN! 🥞👑";
    
    playVisualSound("🎉 TADAA!");
    
    // Show overlay
    celebrationOverlay.style.display = 'flex';
    
    // Shower confetti everywhere
    let count = 0;
    const celebrateInterval = setInterval(() => {
      const celebrateEmojis = ['🎉', '🥞', '💖', '👑', '🎈', '⭐', '❤️', '🫂'];
      const em = celebrateEmojis[Math.floor(Math.random() * celebrateEmojis.length)];
      createParticle(em);
      count++;
      if (count >= 80) clearInterval(celebrateInterval);
    }, 50);
  }

  // Claim Reward button click
  const claimBtn = document.getElementById('claim-reward-btn');
  const rewardBox = document.getElementById('reward-box');
  
  claimBtn.addEventListener('click', () => {
    rewardBox.style.display = 'block';
    claimBtn.classList.add('d-none');
    triggerExplosion('💖', 30);
    playVisualSound("🎁 REWARD UNLOCKED!");
    
    // Auto scroll down inside overlay to see box
    celebrationOverlay.scrollTop = celebrationOverlay.scrollHeight;
    
    // Add close interaction or button to return to page
    setTimeout(() => {
      const dismissBtn = document.createElement('button');
      dismissBtn.className = 'btn btn-option';
      dismissBtn.innerText = "RETURN TO SITE (Stay cozy) 🛌";
      dismissBtn.style.marginTop = '20px';
      dismissBtn.style.alignSelf = 'center';
      
      dismissBtn.addEventListener('click', () => {
        celebrationOverlay.style.display = 'none';
        revealSection('section-footer');
      });
      
      rewardBox.appendChild(dismissBtn);
    }, 1000);
  });

  // ==========================================================================
  // SECRET EASTER EGG LOGIC
  // ==========================================================================
  const eggBtn = document.getElementById('easter-egg-btn');
  const eggModal = document.getElementById('easter-egg-modal');
  const closeEggBtn = document.getElementById('close-egg-btn');
  const eggHearts = document.getElementById('egg-hearts');

  eggBtn.addEventListener('click', () => {
    eggModal.style.display = 'flex';
    playVisualSound("🤫 SECRET FOUND!");
    
    // Spawn floating hearts loop inside modal
    let heartCount = 0;
    const eggHeartsInterval = setInterval(() => {
      if (eggModal.style.display === 'none') {
        clearInterval(eggHeartsInterval);
        return;
      }
      const heart = document.createElement('span');
      heart.innerText = '❤️';
      heart.style.position = 'absolute';
      heart.style.left = `${Math.random() * 85 + 5}%`;
      heart.style.bottom = '0';
      heart.style.fontSize = `${Math.random() * 20 + 12}px`;
      heart.style.animation = 'floatUp 3s linear forwards';
      
      eggHearts.appendChild(heart);
      
      heartCount++;
      if (heartCount >= 30) clearInterval(eggHeartsInterval);
      
      setTimeout(() => heart.remove(), 3000);
    }, 150);
  });

  closeEggBtn.addEventListener('click', () => {
    eggModal.style.display = 'none';
  });

  // Click outside to close egg modal
  eggModal.addEventListener('click', (e) => {
    if (e.target === eggModal) {
      eggModal.style.display = 'none';
    }
  });

  // ==========================================================================
  // FINAL LOVING REVEAL
  // ==========================================================================
  const revealBtn = document.getElementById('reveal-love-btn');
  const revealContent = document.getElementById('love-reveal-content');

  revealBtn.addEventListener('click', () => {
    revealBtn.classList.add('d-none');
    revealContent.classList.remove('d-none');
    playVisualSound("💖 AWWWW");
    triggerExplosion('❤️', 30);
  });

  // ==========================================================================
  // RANDOM CHAOTIC TOAST POPUPS WIDGET
  // ==========================================================================
  const toastContainer = document.getElementById('chaotic-popups-container');
  
  const toastTemplates = [
    {
      header: "🚨 PANCAKE ALERT",
      body: "Emergency system check: Just a quick reminder that you are incredibly cute.",
      hasActions: false
    },
    {
      header: "💧 HYDRATION POLICE",
      body: "This is a random inspection. Have you consumed water in the last 60 minutes?",
      hasActions: false
    },
    {
      header: "🥺 WAFFLE CHECK",
      body: "Are you feeling pancaked enough right now? Be honest.",
      hasActions: true,
      btn1: "YES ❤️",
      btn2: "NEED MORE ❤️"
    },
    {
      header: "🚨 IMPORTANT MEDICAL UPDATE",
      body: "Lab results have returned. Confirmed: Pancake remains 100% precious.",
      hasActions: false
    },
    {
      header: "🧍‍♀️ SYSTEM MESSAGE",
      body: "Alert: Waffle is thinking about you. Go rest!",
      hasActions: false
    }
  ];

  function startToastScheduler() {
    // Fire every 24 seconds
    randomToastInterval = setInterval(spawnChaoticToast, 24000);
    // Spawn the first toast 8 seconds in
    setTimeout(spawnChaoticToast, 8000);
  }

  function spawnChaoticToast() {
    if (recoveryProgress >= 100) return; // Don't annoy them if they recovered
    
    // Pick random template
    const template = toastTemplates[Math.floor(Math.random() * toastTemplates.length)];
    
    // Clear old toast if any
    const oldToast = toastContainer.querySelector('.chaotic-toast');
    if (oldToast) oldToast.remove();

    const toast = document.createElement('div');
    toast.className = 'chaotic-toast';
    
    let actionsHTML = '';
    if (template.hasActions) {
      actionsHTML = `
        <div class="chaotic-toast-actions">
          <button class="chaotic-toast-btn btn-primary-toast" id="toast-yes-btn">${template.btn1}</button>
          <button class="chaotic-toast-btn" id="toast-more-btn">${template.btn2}</button>
        </div>
      `;
    }

    toast.innerHTML = `
      <div class="chaotic-toast-header">
        <i class="fa-solid fa-bell"></i> ${template.header}
      </div>
      <div class="chaotic-toast-body">${template.body}</div>
      ${actionsHTML}
    `;

    toastContainer.appendChild(toast);
    playVisualSound("🔔 ALERT!");
    
    // Auto dismiss after 8 seconds
    const dismissTimer = setTimeout(() => {
      toast.remove();
    }, 8000);

    // Bind action events if present
    if (template.hasActions) {
      const yesBtn = toast.querySelector('#toast-yes-btn');
      const moreBtn = toast.querySelector('#toast-more-btn');
      
      yesBtn.addEventListener('click', () => {
        clearTimeout(dismissTimer);
        toast.remove();
        playVisualSound("🥰 Awww, good!");
        triggerExplosion('❤️', 15);
      });
      
      moreBtn.addEventListener('click', () => {
        clearTimeout(dismissTimer);
        toast.remove();
        playVisualSound("🚀 INCOMING CUDDLE INVASION!");
        triggerExplosion('❤️', 40); // Cuddle bombardment!
        // Shake screen
        document.body.style.animation = 'sneeze-shake 0.4s ease-in-out';
        setTimeout(() => { document.body.style.animation = ''; }, 400);
      });
    }
  }

  // ==========================================================================
  // SHARING SYSTEM (So Waffle can see responses!)
  // ==========================================================================
  function generateReportText() {
    const q1 = userAnswers[1] === 'yes' ? "💧 Yes, hydrated!" : (userAnswers[1] === 'no' ? "💧 No water! 🚨" : "💧 Forgot water 😭");
    const q2 = userAnswers[2] === 'yes' ? "💊 Meds taken ⭐" : (userAnswers[2] === 'no' ? "💊 No meds 😤" : "💊 About to take them");
    const q3 = userAnswers[3] === 'no' ? "🎭 Not dramatic (Liar 🤥)" : (userAnswers[3] === 'maybe' ? "🎭 Tiny bit dramatic 🤏" : "🎭 I'M DYING 🪦");
    const q4 = userAnswers[4] === 'yes' ? "🍜 Munch eaten" : (userAnswers[4] === 'no' ? "🍜 No munch!" : "🍜 Chocolate counts? 🍫");
    const q5 = userAnswers[5] === 'yes' ? "🥺 Needs attention" : (userAnswers[5] === 'obviously' ? "🥺 Obviously" : "🥺 24/7 attention please ❤️");
    const sicknessVal = sickSlider.value;
    
    return `🥞 PANCAKE EMERGENCY HEALTH REPORT 🥞
====================================
🤒 Sickness Severity: ${sicknessVal}%
📈 Quiz Responses:
   - Hydration: ${q1}
   - Medicine: ${q2}
   - Drama check: ${q3}
   - Want a munch: ${q4}
   - Needs Waffle attention: ${q5}
   
🎮 Mini-Game Scores:
   - Cuddles Delivered: ${cuddleCount} 🫂
   - Tissues Caught: ${tissueScore} 🤧
   - Forbidden Clicks: ${dontClickClicks} ⚠️
   
🔋 Ultimate Recovery: ${recoveryProgress}%
====================================
Status: Extremely cute but mildly pathetic. 
Sent with 🥞 and 💖 to my favorite Waffle!`;
  }

  function shareReport() {
    const text = generateReportText();
    
    // Copy to clipboard
    navigator.clipboard.writeText(text).then(() => {
      playVisualSound("📋 REPORT COPIED!");
      
      // Try opening WhatsApp
      const encodedText = encodeURIComponent(text);
      window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank');
      
      // Trigger a floating notification toast
      const oldToast = toastContainer.querySelector('.chaotic-toast');
      if (oldToast) oldToast.remove();
      
      const shareToast = document.createElement('div');
      shareToast.className = 'chaotic-toast';
      shareToast.innerHTML = `
        <div class="chaotic-toast-header" style="color: var(--color-blue-dark); font-family: var(--font-title); font-size: 13px;">
          <i class="fa-solid fa-clipboard-check"></i> REPORT COPIED!
        </div>
        <div class="chaotic-toast-body" style="font-size: 12px; line-height: 1.4; margin-top: 5px;">
          Pancake's report is copied to your clipboard! We also opened WhatsApp so you can text it directly to your Waffle. 📲
        </div>
      `;
      toastContainer.appendChild(shareToast);
      setTimeout(() => shareToast.remove(), 7000);
      
      triggerExplosion('💖', 12);
    }).catch(err => {
      console.error('Could not copy text: ', err);
      // Fallback alert
      alert(text);
    });
  }

  document.getElementById('share-diagnostics-btn').addEventListener('click', shareReport);
  document.getElementById('share-recovery-btn').addEventListener('click', shareReport);

});
