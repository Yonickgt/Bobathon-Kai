/* ═══════════════════════════════════════════════════════════════
   Git Battle — app.js
   Vanilla JS, no imports, no framework.
═══════════════════════════════════════════════════════════════ */

const TIER_CONFIG = {
  beginner:     { playerHP: 100, hearts: 5, bossHP: 80,  bossDmg: 10, bossName: "Noob Ghost",      bossSprite: "👾", atk: [30,20,10], rec: [15,10,5]  },
  intermediate: { playerHP: 80,  hearts: 4, bossHP: 120, bossDmg: 15, bossName: "Merge Demon",     bossSprite: "👹", atk: [40,28,15], rec: [12,8,4]   },
  experienced:  { playerHP: 60,  hearts: 3, bossHP: 150, bossDmg: 20, bossName: "Rebase Overlord", bossSprite: "💀", atk: [50,35,20], rec: [10,6,3]   }
};
// atk[0]=0-5s, atk[1]=5-10s, atk[2]=10-15s  |  rec same index

let state = {
  tier: null,
  cfg: null,
  questions: [],
  qIndex: 0,
  playerHP: 0,
  playerMaxHP: 0,
  hearts: 0,
  maxHearts: 0,
  bossHP: 0,
  bossMaxHP: 0,
  timerInterval: null,
  elapsed: 0,
  combo: 0,
  maxCombo: 0,
  comboActive: false,
  score: 0,
  totalDmg: 0,
  isAdaptive: false,
  lastTier: null,
  cardFlipped: false,
  matchSelected: null,
  matchPairs: [],
  hintUsedFc: false,
  hintUsedSub: false,
};

/* ─────────────────────────────────────────── SCREEN MANAGEMENT */

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function exitBattle() {
  stopTimer();
  showScreen('screen-home');
  renderWeaknessPanel();
}

function retryBattle() {
  if (state.lastTier) {
    startBattle(state.lastTier, state.isAdaptive);
  }
}

/* ────────────────────────────────────────────── BATTLE INIT */

function startBattle(tier, adaptive, categoryFilter) {
  adaptive = adaptive || false;
  categoryFilter = categoryFilter || null;

  const cfg = TIER_CONFIG[tier];
  if (!cfg) return;

  // Draw questions
  let pool;
  if (tier === 'intermediate') {
    pool = (window.MATCHING_SETS || []).filter(q => q.tier === tier);
  } else {
    pool = (window.QUESTIONS || []).filter(q => q.tier === tier);
  }

  if (categoryFilter && categoryFilter.length > 0) {
    const filtered = pool.filter(q => categoryFilter.includes(q.category));
    if (filtered.length > 0) pool = filtered;
  }

  const shuffled = shuffleArray(pool.slice());
  const questions = shuffled.slice(0, 10);

  // Reset state
  state.tier          = tier;
  state.cfg           = cfg;
  state.questions     = questions;
  state.qIndex        = 0;
  state.playerHP      = cfg.playerHP;
  state.playerMaxHP   = cfg.playerHP;
  state.hearts        = cfg.hearts;
  state.maxHearts     = cfg.hearts;
  state.bossHP        = cfg.bossHP;
  state.bossMaxHP     = cfg.bossHP;
  state.timerInterval = null;
  state.elapsed       = 0;
  state.combo         = 0;
  state.maxCombo      = 0;
  state.comboActive   = false;
  state.score         = 0;
  state.totalDmg      = 0;
  state.isAdaptive    = adaptive;
  state.lastTier      = tier;
  state.cardFlipped   = false;
  state.matchSelected = null;
  state.matchPairs    = [];
  state.hintUsedFc    = false;
  state.hintUsedSub   = false;
  state.perQResult    = {};
  state._resolving    = false;

  // Set enemy info
  document.getElementById('enemy-name').textContent = cfg.bossName;
  document.getElementById('enemy-sprite').textContent = cfg.bossSprite;

  // Init HP bars
  document.getElementById('player-hp-bar').style.width = '100%';
  document.getElementById('player-hp-label').textContent = cfg.playerHP;
  document.getElementById('enemy-hp-bar').style.width = '100%';
  document.getElementById('enemy-hp-label').textContent = cfg.bossHP;

  renderHearts();
  showScreen('screen-battle');
  nextQuestion();
}

function startAdaptiveBattle() {
  const raw = localStorage.getItem('git-game-weaknesses');
  if (!raw) {
    alert('No weakness data yet. Play a few rounds first!');
    return;
  }
  const weaknesses = JSON.parse(raw);
  if (Object.keys(weaknesses).length === 0) {
    alert('No weakness data yet. Play a few rounds first!');
    return;
  }
  const top3 = getWeakCategories(3);
  if (top3.length === 0) {
    alert('No weakness data yet. Play a few rounds first!');
    return;
  }
  // Determine tier from most-missed categories — default to beginner
  const tier = state.lastTier || 'beginner';
  startBattle(tier, true, top3);
}

/* ────────────────────────────────────────────────────── TIMER */

function startTimer() {
  stopTimer();
  state.elapsed = 0;
  updateTimerDisplay(0);

  state.timerInterval = setInterval(function() {
    state.elapsed = Math.round((state.elapsed + 0.1) * 10) / 10;
    updateTimerDisplay(state.elapsed);

    if (state.elapsed >= 15) {
      resolveAnswer(false, 15);
    }
  }, 100);
}

function stopTimer() {
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }
}

function updateTimerDisplay(elapsed) {
  const circumference = 213.6;
  const offset = circumference * (elapsed / 15);
  const circle = document.getElementById('timer-circle');
  if (circle) {
    circle.style.strokeDashoffset = offset;
    // colour: green → yellow at 8s remaining → red at 4s remaining
    const remaining = 15 - elapsed;
    circle.classList.remove('warn', 'danger');
    if (remaining <= 4)      circle.classList.add('danger');
    else if (remaining <= 8) circle.classList.add('warn');
  }

  const remaining = Math.ceil(15 - elapsed);
  const num = document.getElementById('timer-number');
  if (num) num.textContent = Math.max(0, remaining);
}

/* ────────────────────────────────────────────── ANSWER RESOLUTION */

function resolveAnswer(correct, elapsedSecs) {
  stopTimer();

  // Prevent double-resolving
  if (state._resolving) return;
  state._resolving = true;

  const bucket = elapsedSecs <= 5 ? 0 : elapsedSecs <= 10 ? 1 : 2;
  const currentQ = state.questions[state.qIndex];

  // Track per-question result for end-screen breakdown
  state.perQResult[state.qIndex] = correct;

  if (correct) {
    const multiplier = state.comboActive ? 2 : 1;
    const dmg = state.cfg.atk[bucket] * multiplier;
    const rec = state.cfg.rec[bucket];

    applyDamageToEnemy(dmg);
    healPlayer(rec);

    state.combo++;
    state.score++;
    state.totalDmg += dmg;

    if (state.combo > state.maxCombo) state.maxCombo = state.combo;

    if (state.combo >= 3) {
      state.comboActive = true;
      const banner = document.getElementById('combo-banner');
      if (banner) {
        banner.classList.remove('hidden');
        setTimeout(function() { banner.classList.add('hidden'); }, 1500);
      }
    }

    // Player attacks enemy animation
    animateSprite('player-sprite', 'flash-green');
    animateSprite('enemy-sprite', 'flash-red');

  } else {
    state.combo = 0;
    state.comboActive = false;

    applyDamageToPlayer(state.cfg.bossDmg);

    if (currentQ && currentQ.category) {
      recordWeakness(currentQ.category);
    }

    // Enemy attacks player animation
    animateSprite('enemy-sprite', 'flash-green');
    animateSprite('player-sprite', 'shake');
  }

  setTimeout(function() {
    state._resolving = false;
    if (state.bossHP <= 0 || state.playerHP <= 0) {
      endBattle();
    } else {
      state.qIndex++;
      nextQuestion();
    }
  }, 1800);
}

/* ─────────────────────────────────────────────── HP + HEARTS */

function applyDamageToEnemy(dmg) {
  state.bossHP = Math.max(0, state.bossHP - dmg);
  const pct = (state.bossHP / state.bossMaxHP) * 100;
  document.getElementById('enemy-hp-bar').style.width = pct + '%';
  document.getElementById('enemy-hp-label').textContent = state.bossHP;
  // flash handled by resolveAnswer to avoid double animation
}

function applyDamageToPlayer(dmg) {
  state.playerHP = Math.max(0, state.playerHP - dmg);
  const pct = (state.playerHP / state.playerMaxHP) * 100;
  document.getElementById('player-hp-bar').style.width = pct + '%';
  document.getElementById('player-hp-label').textContent = state.playerHP;
  state.hearts = Math.ceil((state.playerHP / state.playerMaxHP) * state.maxHearts);
  renderHearts();
  animateSprite('player-sprite', 'shake');
}

function healPlayer(hp) {
  state.playerHP = Math.min(state.playerMaxHP, state.playerHP + hp);
  const pct = (state.playerHP / state.playerMaxHP) * 100;
  document.getElementById('player-hp-bar').style.width = pct + '%';
  document.getElementById('player-hp-label').textContent = state.playerHP;
  state.hearts = Math.ceil((state.playerHP / state.playerMaxHP) * state.maxHearts);
  renderHearts();
}

function renderHearts() {
  const row = document.getElementById('hearts-row');
  if (!row) return;
  let html = '';
  for (let i = 0; i < state.maxHearts; i++) {
    html += i < state.hearts ? '<span class="heart full">❤️</span>' : '<span class="heart empty">🖤</span>';
  }
  row.innerHTML = html;
}

/* ─────────────────────────────────────────── QUESTION RENDERING */

function nextQuestion() {
  if (state.qIndex >= state.questions.length) {
    endBattle();
    return;
  }

  state.hintUsedFc = false;
  state.hintUsedSub = false;
  state.cardFlipped = false;
  state.matchSelected = null;
  state.matchPairs = [];
  state._resolving = false;

  // Hide all card faces
  document.getElementById('flashcard-face').classList.add('hidden');
  document.getElementById('matching-face').classList.add('hidden');
  document.getElementById('subjective-face').classList.add('hidden');

  // Hide wrong reveals
  document.getElementById('fc-wrong-reveal').classList.add('hidden');
  document.getElementById('mt-wrong-reveal').classList.add('hidden');
  document.getElementById('sub-wrong-reveal').classList.add('hidden');

  // Reset hint buttons
  const fcHintBtn = document.getElementById('fc-hint-btn');
  const fcHintText = document.getElementById('fc-hint-text');
  if (fcHintBtn) { fcHintBtn.disabled = false; fcHintBtn.classList.remove('disabled'); }
  if (fcHintText) fcHintText.classList.add('hidden');

  const subHintBtn = document.getElementById('sub-hint-btn');
  const subHintText = document.getElementById('sub-hint-text');
  if (subHintBtn) { subHintBtn.disabled = false; subHintBtn.classList.remove('disabled'); }
  if (subHintText) subHintText.classList.add('hidden');

  // Clear subjective input
  const subInput = document.getElementById('sub-input');
  if (subInput) subInput.value = '';

  // Update progress
  const total = state.questions.length;
  const current = state.qIndex + 1;
  const progressBar = document.getElementById('progress-bar');
  const progressLabel = document.getElementById('progress-label');
  if (progressBar) progressBar.style.width = ((current - 1) / total * 100) + '%';
  if (progressLabel) progressLabel.textContent = current + ' / ' + total;

  // Show appropriate face then immediately start timer
  if (state.tier === 'beginner') {
    showFlashcard();
  } else if (state.tier === 'intermediate') {
    showMatching();
  } else {
    showSubjective();
  }

  startTimer();
}

function showFlashcard() {
  const q = state.questions[state.qIndex];
  if (!q) return;

  document.getElementById('fc-category').textContent = q.category || '';
  document.getElementById('fc-question').textContent = q.question || '';
  document.getElementById('fc-wrong-reveal').classList.add('hidden');

  const fcInput = document.getElementById('fc-input');
  if (fcInput) {
    fcInput.value = '';
    fcInput.disabled = false;
    setTimeout(function() { fcInput.focus(); }, 50);
  }

  document.getElementById('flashcard-face').classList.remove('hidden');
}

function submitFlashcard() {
  if (state._resolving) return;

  const q = state.questions[state.qIndex];
  if (!q) return;

  const input = document.getElementById('fc-input');
  const val = input ? input.value.trim().toLowerCase() : '';

  if (!val) return; // don't submit empty

  const keywords = q.keywords || [];
  const correct = keywords.length > 0
    ? keywords.every(function(kw) { return val.includes(kw.toLowerCase()); })
    : val.includes((q.answer || '').toLowerCase());

  if (!correct) {
    document.getElementById('fc-correct-text').textContent = q.answer || '';
    document.getElementById('fc-wrong-reveal').classList.remove('hidden');
  }

  if (input) input.disabled = true;
  resolveAnswer(correct, state.elapsed);
}

function showHint(mode) {
  if (mode === 'fc') {
    if (state.hintUsedFc) return;
    state.hintUsedFc = true;
    const q = state.questions[state.qIndex];
    const hintText = document.getElementById('fc-hint-text');
    const hintBtn = document.getElementById('fc-hint-btn');
    if (hintText) {
      hintText.textContent = q && q.hint ? q.hint : 'No hint available.';
      hintText.classList.remove('hidden');
    }
    if (hintBtn) hintBtn.disabled = true;
  } else if (mode === 'sub') {
    if (state.hintUsedSub) return;
    state.hintUsedSub = true;
    const q = state.questions[state.qIndex];
    const hintText = document.getElementById('sub-hint-text');
    const hintBtn = document.getElementById('sub-hint-btn');
    if (hintText) {
      hintText.textContent = q && q.hint ? q.hint : 'No hint available.';
      hintText.classList.remove('hidden');
    }
    if (hintBtn) hintBtn.disabled = true;
  }
}

function showMatching() {
  const set = state.questions[state.qIndex];
  if (!set) return;

  document.getElementById('mt-category').textContent = set.category || '';
  document.getElementById('mt-wrong-reveal').classList.add('hidden');

  // Pairs: array of { left, right }
  const pairs = set.pairs || [];
  const leftItems  = shuffleArray(pairs.map(function(p) { return p.left; }));
  const rightItems = shuffleArray(pairs.map(function(p) { return p.right; }));

  state.matchPairs = [];
  state.matchSelected = null;

  const arena = document.getElementById('match-arena');
  arena.innerHTML = '';

  const leftCol = document.createElement('div');
  leftCol.className = 'match-col match-col-left';

  const rightCol = document.createElement('div');
  rightCol.className = 'match-col match-col-right';

  leftItems.forEach(function(text) {
    const btn = document.createElement('button');
    btn.className = 'match-btn match-btn-left';
    btn.textContent = text;
    btn.dataset.value = text;
    btn.addEventListener('click', function() { onMatchLeft(btn); });
    leftCol.appendChild(btn);
  });

  rightItems.forEach(function(text) {
    const btn = document.createElement('button');
    btn.className = 'match-btn match-btn-right';
    btn.textContent = text;
    btn.dataset.value = text;
    btn.addEventListener('click', function() { onMatchRight(btn); });
    rightCol.appendChild(btn);
  });

  arena.appendChild(leftCol);
  arena.appendChild(rightCol);

  document.getElementById('matching-face').classList.remove('hidden');
}

function onMatchLeft(btn) {
  if (btn.disabled) return;

  // Deselect previous left selection
  document.querySelectorAll('.match-btn-left.selected').forEach(function(b) {
    b.classList.remove('selected');
  });

  state.matchSelected = btn;
  btn.classList.add('selected');
}

function onMatchRight(btn) {
  if (!state.matchSelected) return;
  if (btn.disabled) return;

  const leftVal  = state.matchSelected.dataset.value;
  const rightVal = btn.dataset.value;

  // Look up if this is a valid pair
  const set = state.questions[state.qIndex];
  const pairs = set ? (set.pairs || []) : [];
  const isCorrect = pairs.some(function(p) {
    return p.left === leftVal && p.right === rightVal;
  });

  if (isCorrect) {
    state.matchSelected.classList.remove('selected');
    state.matchSelected.classList.add('matched');
    state.matchSelected.disabled = true;
    btn.classList.add('matched');
    btn.disabled = true;

    state.matchPairs.push({ left: leftVal, right: rightVal });

    state.matchSelected = null;

    // Check if all pairs are matched
    if (state.matchPairs.length === pairs.length) {
      resolveAnswer(true, state.elapsed);
    }
  } else {
    // Flash red on right button, deselect
    btn.classList.add('flash-red');
    setTimeout(function() { btn.classList.remove('flash-red'); }, 600);
    state.matchSelected.classList.remove('selected');
    state.matchSelected = null;
  }
}

function showSubjective() {
  const q = state.questions[state.qIndex];
  if (!q) return;

  document.getElementById('sub-category').textContent = q.category || '';
  document.getElementById('sub-question').textContent = q.question || '';
  document.getElementById('sub-wrong-reveal').classList.add('hidden');

  const subInput = document.getElementById('sub-input');
  if (subInput) subInput.value = '';

  document.getElementById('subjective-face').classList.remove('hidden');
  if (subInput) setTimeout(function() { subInput.focus(); }, 50);
}

function submitSubjective() {
  if (state._resolving) return;

  const q = state.questions[state.qIndex];
  if (!q) return;

  const input = document.getElementById('sub-input');
  const val = input ? input.value.trim().toLowerCase() : '';

  const keywords = q.keywords || (q.answer ? [q.answer] : []);
  const correct = keywords.every(function(kw) {
    return val.includes(kw.toLowerCase());
  });

  if (correct) {
    animateSprite('player-sprite', 'flash-green');
    resolveAnswer(true, state.elapsed);
  } else {
    const wrongReveal = document.getElementById('sub-wrong-reveal');
    document.getElementById('sub-correct-text').textContent = q.answer || '';
    wrongReveal.classList.remove('hidden');
    resolveAnswer(false, state.elapsed);
  }
}

/* ─────────────────────────────────────────────────── END BATTLE */

function endBattle() {
  stopTimer();

  const win = state.bossHP <= 0;

  const banner = document.getElementById('end-banner');
  banner.textContent = win ? '🎉 VICTORY!' : '💀 DEFEAT';
  banner.className = 'end-banner ' + (win ? 'win' : 'lose');

  document.getElementById('end-score').textContent = state.score;
  document.getElementById('end-combo').textContent = state.maxCombo;
  document.getElementById('end-dmg').textContent = state.totalDmg;

  // Build per-category correct/wrong breakdown using perQResult tracked in state
  const catBreakdown = {};
  state.questions.forEach(function(q) {
    const cat = q ? (q.category || 'Unknown') : 'Unknown';
    if (!catBreakdown[cat]) catBreakdown[cat] = { correct: 0, wrong: 0 };
  });
  // perQResult is keyed by qIndex, set during resolveAnswer
  if (state.perQResult) {
    Object.keys(state.perQResult).forEach(function(idx) {
      const q = state.questions[idx];
      const cat = q ? (q.category || 'Unknown') : 'Unknown';
      if (!catBreakdown[cat]) catBreakdown[cat] = { correct: 0, wrong: 0 };
      if (state.perQResult[idx]) catBreakdown[cat].correct++;
      else catBreakdown[cat].wrong++;
    });
  }

  const breakdownEl = document.getElementById('end-breakdown');
  let html = '<p class="breakdown-title">Category Breakdown</p>';
  Object.keys(catBreakdown).forEach(function(cat) {
    const c = catBreakdown[cat].correct;
    const w = catBreakdown[cat].wrong;
    html += '<div class="breakdown-row">' +
      '<span class="breakdown-cat">' + escHtml(cat) + '</span>' +
      '<span class="breakdown-result"><span class="bd-correct">✓ ' + c + '</span><span class="bd-wrong">✗ ' + w + '</span></span>' +
      '</div>';
  });
  breakdownEl.innerHTML = html;

  showScreen('screen-end');
}

/* ──────────────────────────────────────────── WEAKNESS TRACKING */

function recordWeakness(category) {
  if (!category) return;
  const raw = localStorage.getItem('git-game-weaknesses');
  const data = raw ? JSON.parse(raw) : {};
  data[category] = (data[category] || 0) + 1;
  localStorage.setItem('git-game-weaknesses', JSON.stringify(data));
}

function getWeakCategories(n) {
  const raw = localStorage.getItem('git-game-weaknesses');
  if (!raw) return [];
  const data = JSON.parse(raw);
  return Object.keys(data)
    .sort(function(a, b) { return data[b] - data[a]; })
    .slice(0, n);
}

function renderWeaknessPanel() {
  const panel = document.getElementById('weakness-panel');
  const list  = document.getElementById('weakness-list');
  if (!panel || !list) return;

  const raw = localStorage.getItem('git-game-weaknesses');
  if (!raw) {
    panel.classList.add('hidden');
    return;
  }
  const data = JSON.parse(raw);
  const keys = Object.keys(data);
  if (keys.length === 0) {
    panel.classList.add('hidden');
    return;
  }

  panel.classList.remove('hidden');

  const top3 = getWeakCategories(3);
  let html = '';
  top3.forEach(function(cat) {
    html += '<div class="weakness-item"><span class="weakness-cat">' + escHtml(cat) + '</span><span class="weakness-count">' + data[cat] + ' miss' + (data[cat] > 1 ? 'es' : '') + '</span></div>';
  });
  list.innerHTML = html;
}

function resetProgress() {
  if (confirm('Reset all progress? This cannot be undone.')) {
    localStorage.removeItem('git-game-weaknesses');
    renderWeaknessPanel();
  }
}

/* ──────────────────────────────────────────────── ANIMATIONS */

function animateSprite(id, cls) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add(cls);
  setTimeout(function() { el.classList.remove(cls); }, 600);
}

/* ──────────────────────────────────────────────── UTILITIES */

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
  }
  return arr;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ──────────────────────────────────────── DOM CONTENT LOADED */

document.addEventListener('DOMContentLoaded', function() {
  renderWeaknessPanel();

  const subInput = document.getElementById('sub-input');
  if (subInput) {
    subInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') submitSubjective();
    });
  }
});
