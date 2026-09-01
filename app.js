(() => {
  "use strict";

  const DATA = window.KITCHEN_DATA;
  const screens = [...document.querySelectorAll(".screen")];

  const el = {
    homeButton: document.querySelector("#home-button"),
    menuScreen: document.querySelector("#menu-screen"),
    gameScreen: document.querySelector("#game-screen"),
    completeScreen: document.querySelector("#complete-screen"),
    mobileGameNav: document.querySelector("#mobile-game-nav"),
    dishMenu: document.querySelector("#dish-menu"),
    menuNotice: document.querySelector("#menu-notice"),
    ingredientGrid: document.querySelector("#ingredient-grid"),
    pantryScrollUp: document.querySelector("#pantry-scroll-up"),
    pantryScrollDown: document.querySelector("#pantry-scroll-down"),
    dropZone: document.querySelector("#drop-zone"),
    vessel: document.querySelector("#vessel"),
    vesselContent: document.querySelector("#vessel-content"),
    dropInstruction: document.querySelector("#drop-instruction"),
    addedChips: document.querySelector("#added-chips"),
    checklist: document.querySelector("#checklist"),
    recipeEmoji: document.querySelector("#recipe-emoji"),
    recipeName: document.querySelector("#recipe-name"),
    recipeRegion: document.querySelector("#recipe-region"),
    recipeDescription: document.querySelector("#recipe-description"),
    cultureNote: document.querySelector("#culture-note"),
    cookTitle: document.querySelector("#cook-title"),
    progressLabel: document.querySelector("#progress-label"),
    progressBar: document.querySelector("#progress-bar"),
    heatMeter: document.querySelector("#heat-meter"),
    heatLevel: document.querySelector("#heat-level"),
    heatDown: document.querySelector("#heat-down"),
    heatUp: document.querySelector("#heat-up"),
    heatStatus: document.querySelector("#heat-status"),
    idealHeatLabel: document.querySelector("#ideal-heat-label"),
    difficultyOptions: document.querySelector("#difficulty-options"),
    difficultyBadge: document.querySelector("#difficulty-badge"),
    liveScore: document.querySelector("#live-score"),
    gameTimer: document.querySelector("#game-timer"),
    fullscreenToggle: document.querySelector("#fullscreen-toggle"),
    fullscreenIcon: document.querySelector("#fullscreen-icon"),
    fullscreenLabel: document.querySelector("#fullscreen-label"),
    soundToggle: document.querySelector("#sound-toggle"),
    soundIcon: document.querySelector("#sound-icon"),
    soundLabel: document.querySelector("#sound-label"),
    musicSelect: document.querySelector("#music-select"),
    sessionStatus: document.querySelector("#session-status"),
    statusText: document.querySelector("#status-text"),
    idleIndicator: document.querySelector("#idle-indicator"),
    idleSeconds: document.querySelector("#idle-seconds"),
    variantDialog: document.querySelector("#variant-dialog"),
    variantTitle: document.querySelector("#variant-title"),
    variantSubtitle: document.querySelector("#variant-subtitle"),
    variantOptions: document.querySelector("#variant-options"),
    cultureToast: document.querySelector("#culture-toast"),
    toastTitle: document.querySelector("#toast-title"),
    toastMessage: document.querySelector("#toast-message"),
    toastClose: document.querySelector("#toast-close"),
    completeTitle: document.querySelector("#complete-title"),
    completeMessage: document.querySelector("#complete-message"),
    endingEyebrow: document.querySelector("#ending-eyebrow"),
    achievementLabel: document.querySelector("#achievement-label"),
    achievementIcon: document.querySelector("#achievement-icon"),
    achievementTitle: document.querySelector("#achievement-title"),
    secretAchievement: document.querySelector("#secret-achievement"),
    secretAchievementIcon: document.querySelector("#secret-achievement-icon"),
    secretAchievementTitle: document.querySelector("#secret-achievement-title"),
    secretAchievementDescription: document.querySelector("#secret-achievement-description"),
    victoryForm: document.querySelector("#victory-form"),
    playerName: document.querySelector("#player-name"),
    playerNickname: document.querySelector("#player-nickname"),
    visitorPlace: document.querySelector("#visitor-place"),
    competitionOption: document.querySelector("#competition-option"),
    joinCompetition: document.querySelector("#join-competition"),
    victorySignature: document.querySelector("#victory-signature"),
    retryRecipe: document.querySelector("#retry-recipe"),
    playAgain: document.querySelector("#play-again"),
    victoryQrCard: document.querySelector("#victory-qr-card"),
    qrcode: document.querySelector("#qrcode"),
    recipeLink: document.querySelector("#recipe-link"),
    recipeLibrary: document.querySelector("#recipe-library"),
    cookbookNav: document.querySelector("#cookbook-nav"),
    cookbookContent: document.querySelector("#cookbook-content"),
    scrollTopButton: document.querySelector("#scroll-top"),
    didYouKnow: document.querySelector("#did-you-know"),
    didYouKnowText: document.querySelector("#did-you-know-text"),
    didYouKnowClose: document.querySelector("#did-you-know-close"),
    leaderboardList: document.querySelector("#leaderboard-list"),
    leaderboardEmpty: document.querySelector("#leaderboard-empty"),
    exportRanking: document.querySelector("#export-ranking"),
    yaguareteCursor: document.querySelector("#yaguarete-cursor")
  };

  const state = {
    recipeId: null,
    added: new Set(),
    variationHistory: [],
    drag: null,
    idleDeadline: 0,
    idleDuration: DATA.config.inactivityMs,
    idleTimer: null,
    completionTimer: null,
    toastTimer: null,
    sessionActive: false,
    suppressClickUntil: 0,
    completed: false,
    ending: false,
    heat: 45,
    wrongAttempts: 0,
    wrongIngredients: new Map(),
    wrongSequence: [],
    pantryOrder: [],
    heatMoves: 0,
    lastHeatDirection: 0,
    heatDirectionChanges: 0,
    recoveredHeat: false,
    sessionAchievements: new Set(),
    factTimer: null,
    factHideTimer: null,
    factIndex: Math.floor(Math.random() * Math.max(1, DATA.didYouKnow?.length || 1)),
    failureVariantCounts: {}
    ,difficulty: "easy"
    ,requiredIds: []
    ,score: 1000
    ,gameDeadline: 0
    ,gameTimerId: null
  };

  const ACHIEVEMENT_STORAGE_KEY = "fogon-noa-logros-ocultos";
  const RANKING_STORAGE_KEY = "fogon-noa-ranking-v1";
  const DIFFICULTIES = {
    easy: { name: "Fácil", errors: 3, traps: 2, timer: 0 },
    medium: { name: "Media", errors: 2, traps: 5, timer: 0 },
    hard: { name: "Difícil", errors: 1, traps: 7, timer: 180 }
  };
  const TRAP_INGREDIENTS = ["sal", "azucar", "canela", "anis", "nuez_moscada", "laurel", "oregano", "pimienta"];
  const SEASONINGS = {
    empanadas: ["sal", "pimienta"], humita: ["sal", "pimienta"], locro: ["sal", "laurel"], tamales: ["sal", "pimienta"]
  };
  const unlockedAchievements = loadUnlockedAchievements();

  function loadUnlockedAchievements() {
    try {
      const saved = JSON.parse(window.localStorage.getItem(ACHIEVEMENT_STORAGE_KEY) || "[]");
      return new Set(Array.isArray(saved) ? saved : []);
    } catch (_) {
      return new Set();
    }
  }

  function unlockAchievement(id) {
    const achievement = DATA.hiddenAchievements?.[id];
    if (!achievement) return false;
    state.sessionAchievements.add(id);
    const isNew = !unlockedAchievements.has(id);
    unlockedAchievements.add(id);
    try {
      window.localStorage.setItem(ACHIEVEMENT_STORAGE_KEY, JSON.stringify([...unlockedAchievements]));
    } catch (_) {}
    return isNew;
  }

  function renderSecretAchievement(id) {
    const achievement = DATA.hiddenAchievements?.[id];
    if (!achievement) {
      el.secretAchievement.hidden = true;
      return;
    }
    el.secretAchievementIcon.textContent = achievement.icon;
    el.secretAchievementTitle.textContent = achievement.title;
    el.secretAchievementDescription.textContent = achievement.description;
    el.secretAchievement.hidden = false;
  }

  const audioState = {
    context: null,
    master: null,
    music: null,
    effects: null,
    noiseBuffer: null,
    enabled: true,
    sequenceTimer: null,
    player: null,
    trackId: window.localStorage.getItem("fogon-noa-pista") || "mozart-turca"
  };

  const CLASSICAL_TRACKS = {
    "mozart-turca": "mozart-rondo-alla-turca.ogg",
    "beethoven-elise": "beethoven-fur-elise.ogg",
    "bach-preludio": "bach-prelude-c-major.ogg"
  };

  let scrollButtonFrame = null;

  function activateScreen(target) {
    screens.forEach((screen) => {
      const active = screen === target;
      screen.hidden = !active;
      screen.classList.toggle("is-active", active);
    });
    scheduleScrollTopButtonUpdate();
  }

  function recipe() {
    return DATA.recipes[state.recipeId];
  }

  function ingredient(id) {
    return DATA.ingredients[id];
  }

  function initYaguareteCursor() {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!el.yaguareteCursor || !finePointer.matches) return;

    let cursorFrame = null;
    let pointerX = -100;
    let pointerY = -100;

    document.body.classList.add("has-yaguarete-cursor");

    const paintCursor = () => {
      el.yaguareteCursor.style.transform = `translate3d(${pointerX - 18}px, ${pointerY - 18}px, 0)`;
      cursorFrame = null;
    };

    document.addEventListener("mousemove", (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      el.yaguareteCursor.classList.add("is-visible");
      if (!cursorFrame) cursorFrame = window.requestAnimationFrame(paintCursor);
    }, { passive: true });

    document.addEventListener("mousedown", () => el.yaguareteCursor.classList.add("is-pressing"));
    document.addEventListener("mouseup", () => el.yaguareteCursor.classList.remove("is-pressing"));
    document.documentElement.addEventListener("mouseleave", () => el.yaguareteCursor.classList.remove("is-visible"));
    window.addEventListener("blur", () => el.yaguareteCursor.classList.remove("is-visible", "is-pressing"));
  }

  function noteFrequency(midiNote) {
    return 440 * (2 ** ((midiNote - 69) / 12));
  }

  function ensureAudio() {
    if (audioState.context) return audioState.context;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      audioState.enabled = false;
      updateSoundButton("Audio no disponible");
      el.soundToggle.disabled = true;
      return null;
    }

    const context = new AudioContextClass();
    const master = context.createGain();
    const music = context.createGain();
    const effects = context.createGain();

    master.gain.value = 0.72;
    music.gain.value = 0.22;
    effects.gain.value = 0.48;
    music.connect(master);
    effects.connect(master);
    master.connect(context.destination);

    audioState.context = context;
    audioState.master = master;
    audioState.music = music;
    audioState.effects = effects;
    return context;
  }

  function scheduleTone({ frequency, start, duration, type = "square", volume = 0.08, destination }) {
    const context = audioState.context;
    if (!context || !destination) return;
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    const attackEnd = start + Math.min(0.012, duration * 0.2);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.exponentialRampToValueAtTime(volume, attackEnd);
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(envelope);
    envelope.connect(destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
  }

  function classicalPlayer() {
    if (!audioState.player) {
      audioState.player = new Audio();
      audioState.player.preload = "auto";
      audioState.player.loop = true;
      audioState.player.volume = 0.34;
    }
    return audioState.player;
  }

  function changeMusicTrack() {
    const nextTrack = el.musicSelect.value;
    if (!CLASSICAL_TRACKS[nextTrack]) return;
    audioState.trackId = nextTrack;
    try { window.localStorage.setItem("fogon-noa-pista", nextTrack); } catch (_) {}
    const player = classicalPlayer();
    const wasPlaying = !player.paused;
    player.pause();
    player.src = CLASSICAL_TRACKS[nextTrack];
    player.currentTime = 0;
    if (wasPlaying) {
      player.play().catch(() => {});
    } else if (audioState.enabled) {
      startChiptune();
    }
  }

  function startChiptune() {
    if (!audioState.enabled) return;
    const player = classicalPlayer();
    const selectedTrack = CLASSICAL_TRACKS[audioState.trackId] || CLASSICAL_TRACKS["mozart-turca"];
    if (!player.src || !player.src.endsWith(selectedTrack)) player.src = selectedTrack;
    player.play().catch(() => {});
    audioState.sequenceTimer = true;
  }

  function stopChiptune() {
    if (audioState.player) audioState.player.pause();
    audioState.sequenceTimer = null;
  }

  function updateSoundButton(forcedLabel = "") {
    if (!el.soundToggle) return;
    const active = audioState.enabled;
    el.soundToggle.classList.toggle("is-on", active);
    el.soundToggle.classList.toggle("is-muted", !active);
    el.soundToggle.setAttribute("aria-pressed", String(active));
    el.soundToggle.setAttribute("aria-label", forcedLabel || (active ? "Silenciar música y efectos" : "Activar música y efectos"));
    el.soundIcon.textContent = active ? "♫" : "×";
    el.soundLabel.textContent = active ? "Sonido" : "Silenciado";
  }

  function toggleSound() {
    audioState.enabled = !audioState.enabled;
    updateSoundButton();
    if (audioState.enabled) startChiptune();
    else stopChiptune();
  }

  function fullscreenElement() {
    return document.fullscreenElement || document.webkitFullscreenElement || null;
  }

  function updateFullscreenButton() {
    if (!el.fullscreenToggle) return;
    const supported = Boolean(document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen);
    if (!supported) {
      el.fullscreenToggle.hidden = true;
      return;
    }
    const active = Boolean(fullscreenElement());
    el.fullscreenToggle.hidden = false;
    el.fullscreenToggle.classList.toggle("is-on", active);
    el.fullscreenToggle.setAttribute("aria-label", active ? "Salir de pantalla completa" : "Abrir en pantalla completa");
    el.fullscreenIcon.textContent = active ? "×" : "⛶";
    el.fullscreenLabel.textContent = active ? "Salir" : "Pantalla completa";
  }

  function enterFullscreenMode() {
    if (fullscreenElement()) return;
    const root = document.documentElement;
    const request = root.requestFullscreen || root.webkitRequestFullscreen;
    if (!request) return;
    try {
      const pending = request.call(root, { navigationUI: "hide" });
      pending?.catch(() => {});
    } catch (_) {
      try {
        const fallback = request.call(root);
        fallback?.catch(() => {});
      } catch (_) {}
    }
  }

  function toggleFullscreenMode() {
    if (!fullscreenElement()) {
      enterFullscreenMode();
      return;
    }
    const exit = document.exitFullscreen || document.webkitExitFullscreen;
    if (!exit) return;
    try {
      const pending = exit.call(document);
      pending?.catch(() => {});
    } catch (_) {}
  }

  function playIngredientSound(vesselType) {
    if (!audioState.enabled) return;
    const context = ensureAudio();
    if (!context) return;
    const now = context.currentTime + 0.01;
    const tones = vesselType === "board"
      ? [196, 294]
      : vesselType === "pot"
        ? [247, 370]
        : [392, 587];

    scheduleTone({ frequency: tones[0], start: now, duration: 0.075, type: "square", volume: 0.13, destination: audioState.effects });
    scheduleTone({ frequency: tones[1], start: now + 0.035, duration: 0.11, type: "triangle", volume: 0.1, destination: audioState.effects });
  }

  function playErrorSound() {
    if (!audioState.enabled) return;
    const context = ensureAudio();
    if (!context) return;
    const now = context.currentTime + 0.01;
    scheduleTone({ frequency: 155, start: now, duration: 0.12, type: "sawtooth", volume: 0.1, destination: audioState.effects });
    scheduleTone({ frequency: 116, start: now + 0.13, duration: 0.15, type: "sawtooth", volume: 0.085, destination: audioState.effects });
  }

  function playSuccessSound() {
    if (!audioState.enabled) return;
    const context = ensureAudio();
    if (!context) return;
    const now = context.currentTime + 0.02;
    [69, 72, 76, 81].forEach((note, index) => {
      scheduleTone({
        frequency: noteFrequency(note),
        start: now + index * 0.095,
        duration: 0.18,
        type: "square",
        volume: 0.1,
        destination: audioState.effects
      });
    });
  }

  function updateScrollTopButton() {
    scrollButtonFrame = null;
    if (!el.scrollTopButton) return;
    const menuIsActive = !el.menuScreen.hidden;
    const distance = Math.max(window.scrollY, el.menuScreen.scrollTop);
    el.scrollTopButton.hidden = !menuIsActive || distance < 520;
  }

  function scheduleScrollTopButtonUpdate() {
    if (scrollButtonFrame) return;
    scrollButtonFrame = window.requestAnimationFrame(updateScrollTopButton);
  }

  function scrollMainPageToTop() {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior = reducedMotion ? "auto" : "smooth";
    window.scrollTo({ top: 0, left: 0, behavior });
    el.menuScreen.scrollTo({ top: 0, left: 0, behavior });
  }

  function jumpToGameSection(targetId) {
    const target = document.getElementById(targetId);
    if (!target) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  }

  function openFamily(familyId) {
    const family = DATA.families[familyId];
    if (!family) return;

    el.variantTitle.textContent = family.title;
    el.variantSubtitle.textContent = family.subtitle;
    el.variantOptions.replaceChildren();

    family.options.forEach((recipeId) => {
      const item = DATA.recipes[recipeId];
      const button = document.createElement("button");
      button.type = "button";
      button.className = "variant-card";
      button.dataset.recipe = recipeId;
      button.innerHTML = `
        <span class="variant-emoji" aria-hidden="true">${item.emoji}</span>
        <span><strong>${item.name}</strong><small>${item.region}</small><em>${item.description}</em></span>
        <b aria-hidden="true">→</b>`;
      el.variantOptions.append(button);
    });

    el.variantDialog.hidden = false;
    requestAnimationFrame(() => el.variantDialog.classList.add("is-open"));
    state.sessionActive = true;
    armIdleTimer();
    requestAnimationFrame(() => el.variantOptions.querySelector("button")?.focus());
  }

  function closeFamily() {
    el.variantDialog.classList.remove("is-open");
    window.setTimeout(() => {
      el.variantDialog.hidden = true;
    }, 180);

    if (!state.recipeId) {
      state.sessionActive = false;
      stopIdleTimer();
    }
  }

  function renderCookbook() {
    const chapters = DATA.cookbookChapters;
    el.cookbookNav.replaceChildren();
    el.cookbookContent.replaceChildren();

    Object.values(chapters).forEach((chapter, index) => {
      const navButton = document.createElement("button");
      navButton.type = "button";
      navButton.className = "cookbook-nav-button";
      navButton.dataset.cookbookTarget = chapter.anchor;
      navButton.setAttribute("aria-label", `Ir a la receta de ${chapter.navName || chapter.name}`);
      navButton.innerHTML = `
        <span class="cookbook-nav-number" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
        <span class="cookbook-nav-icon" aria-hidden="true">${chapter.emoji}</span>
        <strong>${chapter.navName || chapter.name}</strong>`;
      el.cookbookNav.append(navButton);

      const metadata = chapter.meta.map((item) => `
        <div><small>${item.label}</small><strong>${item.value}</strong></div>`).join("");

      const ingredientGroups = chapter.ingredientGroups.map((group) => `
        <section class="cookbook-ingredient-group">
          <h4>${group.title}</h4>
          <ul>${group.items.map((item) => `<li>${item}</li>`).join("")}</ul>
        </section>`).join("");

      const variations = chapter.variations.map((variation) => `
        <section class="cookbook-variation">
          <div><strong>${variation.name}</strong><small>${variation.place}</small></div>
          <p>${variation.detail}</p>
        </section>`).join("");

      const steps = chapter.steps.map((step) => `
        <li>
          <div class="cookbook-step-heading"><strong>${step.title}</strong><time>${step.time}</time></div>
          <p>${step.detail}</p>
          <aside><span aria-hidden="true">💡</span><strong>Consejo de cocina:</strong> ${step.tip}</aside>
        </li>`).join("");

      const article = document.createElement("article");
      article.id = chapter.anchor;
      article.className = "cookbook-chapter";
      article.innerHTML = `
        <header class="cookbook-chapter-header">
          <span class="cookbook-chapter-emoji" aria-hidden="true">${chapter.emoji}</span>
          <div><p class="eyebrow">${chapter.region}</p><h3>${chapter.name}</h3><p>${chapter.introduction}</p></div>
        </header>
        <div class="cookbook-meta">${metadata}</div>
        <section class="cookbook-variations-block">
          <h4 class="cookbook-heading"><span aria-hidden="true">◆</span> Variaciones regionales</h4>
          <div class="cookbook-variations">${variations}</div>
        </section>
        <div class="cookbook-spread">
          <aside class="cookbook-pantry-page">
            <h4 class="cookbook-heading"><span aria-hidden="true">◆</span> Ingredientes y condimentos</h4>
            ${ingredientGroups}
            <section class="cookbook-equipment">
              <h4>Utensilios recomendados</h4>
              <ul>${chapter.equipment.map((item) => `<li>${item}</li>`).join("")}</ul>
            </section>
          </aside>
          <section class="cookbook-tutorial">
            <h4 class="cookbook-heading"><span aria-hidden="true">◆</span> Tutorial paso a paso</h4>
            <ol class="cookbook-steps">${steps}</ol>
          </section>
        </div>
        <footer class="cookbook-finish">
          <section><span aria-hidden="true">🍽️</span><div><strong>Cómo servir</strong><p>${chapter.serving}</p></div></section>
          <section><span aria-hidden="true">❄️</span><div><strong>Conservación</strong><p>${chapter.storage}</p></div></section>
          <section><span aria-hidden="true">🧼</span><div><strong>Cocina segura</strong><p>${chapter.safety}</p></div></section>
        </footer>
        <button class="cookbook-back" type="button" data-cookbook-top>↑ Volver al índice del recetario</button>`;
      el.cookbookContent.append(article);
    });
  }

  function startRecipe(recipeId) {
    if (!DATA.recipes[recipeId]) return;

    if (window.matchMedia("(pointer: coarse), (max-width: 700px), (max-width: 1400px) and (max-height: 700px)").matches) {
      enterFullscreenMode();
    }

    closeFamily();
    state.recipeId = recipeId;
    state.added = new Set();
    state.variationHistory = [];
    state.completed = false;
    state.ending = false;
    state.heat = 45;
    state.wrongAttempts = 0;
    state.wrongIngredients = new Map();
    state.wrongSequence = [];
    state.pantryOrder = shuffleIngredients(DATA.recipes[recipeId].pantry);
    state.heatMoves = 0;
    state.lastHeatDirection = 0;
    state.heatDirectionChanges = 0;
    state.recoveredHeat = false;
    state.sessionAchievements = new Set();
    state.score = 1000;
    state.requiredIds = requiredForDifficulty(DATA.recipes[recipeId]);
    state.gameDeadline = DIFFICULTIES[state.difficulty].timer ? Date.now() + DIFFICULTIES[state.difficulty].timer * 1000 : 0;
    startGameTimer();
    state.sessionActive = true;
    hideDidYouKnow(false);
    el.menuNotice.hidden = true;
    activateScreen(el.gameScreen);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    renderGame();
    armIdleTimer();
  }

  function requiredForDifficulty(current) {
    const required = [...current.required];
    if (state.difficulty !== "easy") {
      (SEASONINGS[current.family] || []).forEach((id) => { if (!required.includes(id)) required.push(id); });
    }
    return required;
  }

  function startGameTimer() {
    window.clearInterval(state.gameTimerId);
    el.gameTimer.hidden = !state.gameDeadline;
    if (!state.gameDeadline) return;
    updateGameTimer();
    state.gameTimerId = window.setInterval(updateGameTimer, 250);
  }

  function updateGameTimer() {
    if (!state.gameDeadline || state.completed) return;
    const remaining = Math.max(0, state.gameDeadline - Date.now());
    const seconds = Math.ceil(remaining / 1000);
    el.gameTimer.textContent = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
    el.gameTimer.classList.toggle("is-warning", seconds <= 30);
    if (!remaining) scheduleFailure("timeOut", 50);
  }

  function updateLiveScore() {
    const heatPenalty = state.heat < 40 ? (40 - state.heat) * 2 : state.heat > 75 ? (state.heat - 75) * 2 : 0;
    const live = Math.max(0, Math.round(state.score - heatPenalty));
    el.liveScore.textContent = `${live} puntos`;
    el.difficultyBadge.textContent = DIFFICULTIES[state.difficulty].name;
  }

  function renderGame() {
    const current = recipe();
    if (!current) return;

    el.recipeEmoji.textContent = current.emoji;
    el.recipeName.textContent = current.name;
    el.recipeRegion.textContent = current.region;
    el.recipeDescription.textContent = current.description;
    el.cultureNote.textContent = current.culture;
    el.cookTitle.textContent = current.vessel === "board" ? "A la tabla" : current.vessel === "bowl" ? "Al cuenco" : "Al fuego";
    el.statusText.textContent = `Preparando ${current.name}`;
    el.idleIndicator.hidden = false;

    renderPantry(current);
    renderChecklist(current);
    renderVessel(current);
    renderProgress(current);
    renderHeat();
    updateLiveScore();
  }

  function renderPantry(current) {
    el.ingredientGrid.replaceChildren();

    const seasoningIds = state.requiredIds.filter((id) => !current.pantry.includes(id));
    const traps = shuffleIngredients(TRAP_INGREDIENTS.filter((id) => !state.requiredIds.includes(id))).slice(0, DIFFICULTIES[state.difficulty].traps);
    const available = [...new Set([...current.pantry, ...seasoningIds, ...traps])];
    const missing = available.filter((id) => !state.pantryOrder.includes(id));
    state.pantryOrder = state.pantryOrder.filter((id) => available.includes(id)).concat(shuffleIngredients(missing));

    state.pantryOrder.forEach((id) => {
      const item = ingredient(id);
      const added = state.added.has(id);
      const button = document.createElement("button");
      button.type = "button";
      button.className = `ingredient-token ingredient-token--${item.tone}${added ? " is-added" : ""}`;
      button.dataset.ingredient = id;
      button.setAttribute("aria-pressed", String(added));
      button.setAttribute("aria-label", added ? `Quitar ${item.name}` : `Agregar ${item.name}`);
      button.innerHTML = `<span aria-hidden="true">${item.icon}</span><strong>${item.name}</strong><small>${added ? "Tocar para quitar ↶" : "Tocar o mover"}</small>`;
      el.ingredientGrid.append(button);
    });
  }

  function shuffleIngredients(items) {
    const shuffled = [...items];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    return shuffled;
  }

  function renderChecklist(current) {
    el.checklist.replaceChildren();
    state.requiredIds.forEach((id) => {
      const item = ingredient(id);
      const done = state.added.has(id);
      const li = document.createElement("li");
      li.className = done ? "is-done" : "";
      li.innerHTML = `<span aria-hidden="true">${done ? "✓" : ""}</span><strong>${item.name}</strong>`;
      el.checklist.append(li);
    });
  }

  function renderVessel(current) {
    el.vessel.className = `vessel vessel--${current.vessel}`;
    el.dropZone.dataset.vessel = current.vessel;
    const touchDevice = window.matchMedia("(pointer: coarse)").matches;
    el.dropInstruction.textContent = state.added.size
      ? "Tocá de nuevo un ingrediente para quitarlo"
      : touchDevice
        ? "Tocá un ingrediente de la alacena para agregarlo"
        : "Soltá aquí los ingredientes";
    el.vesselContent.replaceChildren();
    el.addedChips.replaceChildren();

    [...state.added].slice(-8).forEach((id, index) => {
      const item = ingredient(id);
      if (!item) return;

      const piece = document.createElement("span");
      piece.textContent = item.icon;
      piece.style.setProperty("--piece-index", index);
      el.vesselContent.append(piece);

      const chip = document.createElement("button");
      chip.type = "button";
      chip.dataset.removeIngredient = id;
      chip.setAttribute("aria-label", `Quitar ${item.name} de la preparación`);
      chip.innerHTML = `<span aria-hidden="true">${item.icon}</span> ${item.name} <b aria-hidden="true">×</b>`;
      el.addedChips.append(chip);
    });
  }

  function renderProgress(current) {
    const completed = state.requiredIds.filter((id) => state.added.has(id)).length;
    const total = state.requiredIds.length;
    const percent = total ? Math.round((completed / total) * 100) : 0;
    el.progressLabel.textContent = `${completed} de ${total}`;
    el.progressBar.style.width = `${percent}%`;
  }

  function renderHeat() {
    const heat = Math.max(0, Math.min(100, Math.round(state.heat)));
    const label = heat === 0
      ? "Fogón apagado"
      : heat < 20
        ? "Sin cocción"
        : heat < 40
          ? "Cocción insuficiente"
      : heat <= 75
        ? "Fuego parejo"
        : heat < 95
          ? "¡Fuego muy fuerte!"
          : "¡Se está quemando!";
    const level = heat < 40 ? "low" : heat <= 75 ? "ideal" : heat < 95 ? "warning" : "critical";

    el.heatMeter.style.setProperty("--heat-level", `${heat}%`);
    el.heatMeter.setAttribute("aria-valuenow", String(heat));
    el.heatMeter.setAttribute("aria-valuetext", `${label}, ${heat}%`);
    el.heatLevel.style.height = `${Math.max(heat, 8)}%`;
    el.heatStatus.textContent = label;
    el.dropZone.dataset.heat = level;
    el.heatMeter.dataset.heat = level;
  }

  function adjustHeat(delta) {
    if (!state.recipeId || state.completed || state.ending) return;
    noteActivity();
    const previousHeat = state.heat;
    const direction = Math.sign(delta);
    state.heatMoves += 1;
    if (state.lastHeatDirection && direction !== state.lastHeatDirection) state.heatDirectionChanges += 1;
    state.lastHeatDirection = direction;
    state.heat = Math.max(0, Math.min(100, state.heat + delta));

    if (previousHeat >= 80 && state.heat <= 75) {
      state.recoveredHeat = true;
      if (unlockAchievement("pulso_del_fogon")) {
        const achievement = DATA.hiddenAchievements.pulso_del_fogon;
        el.toastTitle.textContent = "¡Logro oculto descubierto!";
        el.toastMessage.textContent = `${achievement.icon} ${achievement.title}. ${achievement.description}`;
        showToast(9000, "discovery");
      }
    }

    renderHeat();
    updateLiveScore();
    if (state.heat >= 100) scheduleFailure("fire", 500);
  }

  function scheduleFailure(type, delayMs = 900) {
    if (state.completed || state.ending) return;
    state.ending = true;
    window.clearTimeout(state.completionTimer);
    state.completionTimer = window.setTimeout(() => failRecipe(type), delayMs);
  }

  function addIngredient(id) {
    if (!state.recipeId || state.completed || state.ending || state.added.has(id) || !ingredient(id)) return;

    noteActivity();
    const current = recipe();
    const variation = current.variations.find((rule) => rule.anyOf.includes(id));
    const belongsToRecipe = state.requiredIds.includes(id);
    const isOptional = (current.optional || []).includes(id);

    if (!belongsToRecipe && !isOptional && !variation) {
      rejectIngredient(id, current);
      return;
    }

    state.added.add(id);
    playIngredientSound(current.vessel);
    spawnIngredientBurst(id);

    if (variation && DATA.recipes[variation.target]) {
      transformRecipe(variation, id);
    } else {
      renderGame();
    }

    if (state.heat >= 100) {
      scheduleFailure("fire", 500);
      return;
    }

    state.completionTimer = window.setTimeout(checkCompletion, variation ? 1350 : 420);
  }

  function toggleIngredient(id) {
    if (state.added.has(id)) {
      removeIngredient(id);
    } else {
      addIngredient(id);
    }
  }

  function removeIngredient(id) {
    if (!state.recipeId || state.completed || state.ending || !state.added.has(id)) return;

    noteActivity();
    window.clearTimeout(state.completionTimer);
    state.added.delete(id);
    state.heat = Math.max(10, state.heat - 2);

    const lastVariation = state.variationHistory.at(-1);
    if (lastVariation?.trigger === id && lastVariation.to === state.recipeId) {
      const replacementTrigger = lastVariation.anyOf.find((candidate) => state.added.has(candidate));
      if (replacementTrigger) {
        lastVariation.trigger = replacementTrigger;
      } else {
        state.recipeId = lastVariation.from;
        state.variationHistory.pop();
        el.toastTitle.textContent = `Volviste a ${recipe().name}`;
        el.toastMessage.textContent = `Quitaste ${ingredient(id).name.toLowerCase()}, que había provocado el cambio regional. La comanda recuperó la versión anterior.`;
        showToast(7000, "info");
      }
    }

    renderGame();
  }

  function rejectIngredient(id, current) {
    const rejected = ingredient(id);
    const token = el.ingredientGrid.querySelector(`[data-ingredient="${id}"]`);
    const familyReasons = DATA.rejectionReasons[current.family] || {};
    const explanation = familyReasons[id] || familyReasons.default || "No figura en la comanda de esta versión.";

    state.wrongAttempts += 1;
    state.score = Math.max(0, state.score - (state.difficulty === "hard" ? 400 : state.difficulty === "medium" ? 180 : 100));
    updateLiveScore();
    const repeatedCount = (state.wrongIngredients.get(id) || 0) + 1;
    state.wrongIngredients.set(id, repeatedCount);
    state.wrongSequence.push(id);
    playErrorSound();
    el.toastTitle.textContent = "Ese ingrediente no va en esta receta";
    const errorLimit = DIFFICULTIES[state.difficulty].errors;
    const remainingErrors = Math.max(0, errorLimit - state.wrongAttempts);
    el.toastMessage.textContent = state.wrongAttempts >= errorLimit
      ? `${rejected.name} marca error en ${current.name}. ${explanation} Ya no quedan oportunidades en este modo.`
      : `${rejected.name} marca error en ${current.name}. ${explanation} Te ${remainingErrors === 1 ? "queda 1 oportunidad" : `quedan ${remainingErrors} oportunidades`}.`;
    el.dropZone.classList.remove("is-rejected");
    token?.classList.remove("is-rejected");
    void el.dropZone.offsetWidth;
    el.dropZone.classList.add("is-rejected");
    token?.classList.add("is-rejected");
    window.setTimeout(() => {
      el.dropZone.classList.remove("is-rejected");
      token?.classList.remove("is-rejected");
    }, 720);
    showToast(9000, "error");
    if (state.wrongAttempts >= errorLimit) scheduleFailure(failureFromWrongIngredients(id, repeatedCount), 1250);
  }

  function failureFromWrongIngredients(lastId, repeatedCount) {
    if (repeatedCount >= 3) return "stubborn";
    const mistakes = new Set(state.wrongSequence);
    if (["azucar", "pasas"].some((id) => mistakes.has(id))) return "sweetChaos";
    if (["queso", "leche"].some((id) => mistakes.has(id))) return "dairyChaos";
    const meats = ["carne", "matambre", "cerdo", "panceta", "chorizo", "charqui"];
    if (meats.filter((id) => mistakes.has(id)).length >= 2 || meats.includes(lastId)) return "meatChaos";
    return "spoiled";
  }

  function transformRecipe(variation, triggerId) {
    const trigger = ingredient(triggerId);
    state.variationHistory.push({
      from: state.recipeId,
      to: variation.target,
      trigger: triggerId,
      anyOf: [...variation.anyOf]
    });
    state.recipeId = variation.target;
    state.requiredIds = requiredForDifficulty(DATA.recipes[state.recipeId]);
    unlockAchievement("viajero_regional");
    renderGame();

    el.dropZone.classList.add("is-transforming");
    window.setTimeout(() => el.dropZone.classList.remove("is-transforming"), 900);

    const transformed = recipe();
    el.toastTitle.textContent = `¡Ahora es ${transformed.name}!`;
    el.toastMessage.textContent = `Le agregaste ${trigger.name.toLowerCase()}. Tu preparación acaba de transformarse. ${variation.message}`;
    showToast(12000, "discovery");
  }

  function spawnIngredientBurst(id) {
    const item = ingredient(id);
    const burst = document.createElement("span");
    burst.className = "ingredient-burst";
    burst.textContent = item.icon;
    burst.setAttribute("aria-hidden", "true");
    el.dropZone.append(burst);
    window.setTimeout(() => burst.remove(), 760);
  }

  function checkCompletion() {
    const current = recipe();
    if (!current || state.completed || state.ending) return;
    if (!state.requiredIds.every((id) => state.added.has(id))) return;
    finishCookingResult();
  }

  function finishCookingResult() {
    if (state.heat <= 15) return scheduleFailure("raw", 350);
    if (state.heat < 40) return scheduleFailure("undercooked", 350);
    if (state.heat >= 100) return scheduleFailure("fire", 250);
    if (state.heat > 85) return scheduleFailure("burned", 350);
    if (state.heatMoves >= 8 && state.heatDirectionChanges >= 4) return scheduleFailure("unstable", 350);
    const heatPenalty = state.heat < 40 ? (40 - state.heat) * 3 : state.heat > 75 ? (state.heat - 75) * 3 : 0;
    state.score = Math.max(0, Math.round(state.score - heatPenalty));
    completeRecipe();
  }

  function latestSessionAchievement() {
    return [...state.sessionAchievements].at(-1) || null;
  }

  function failRecipe(type) {
    if (state.completed) return;
    const current = recipe();
    const outcomes = {
      burned: {
        title: "¡El fogón se descontroló!",
        message: `El fuego quedó demasiado fuerte y ${current.name} terminó quemándose. Bajá la temperatura antes de llegar a la zona roja.`,
        achievement: "Aprendiz del Humo Norteño",
        achievementId: "fuego_descontrolado"
      },
      fire: { title: "¡Incendio en la cocina!", message: `El fuego llegó al máximo mientras preparabas ${current.name}. La partida se detuvo por seguridad.`, achievement: "Jefe/a de Bomberos del Fogón", achievementId: "cocina_en_llamas" },
      raw: { title: "¡Todavía estaba crudo!", message: `${current.name} llegó al plato prácticamente sin calor. Los ingredientes necesitan tiempo y temperatura para cocinarse.`, achievement: "Catador/a de Masa Cruda", achievementId: "catador_de_masa_cruda" },
      timeOut: { title: "¡Se terminó el tiempo!", message: `El cronómetro del modo difícil llegó a cero antes de completar ${current.name}.`, achievement: "Rival del Reloj Norteño", achievementId: "reloj_sin_piedad" },
      spoiled: {
        title: "¡La receta tomó un camino extraño!",
        message: `Tres ingredientes que no pertenecían a la comanda estropearon ${current.name}. Leé las explicaciones y volvé a probar otra combinación.`,
        achievement: "Alquimista del Desastre",
        achievementId: "mezcla_imposible"
      },
      stubborn: {
        title: "¡El cucharón se puso porfiado!",
        message: `Insististe tres veces con el mismo ingrediente aunque no pertenecía a ${current.name}. La comanda explicó el motivo, pero la mezcla terminó perdiendo su identidad.`,
        achievement: "Cucharón Porfiado",
        achievementId: "cucharon_porfiado"
      },
      sweetChaos: {
        title: "¡La receta se volvió demasiado dulce!",
        message: `Las pasas o el azúcar entraron en ${current.name} sin formar parte de esta variante. El contraste tapó sus sabores principales y abrió un final inesperado.`,
        achievement: "Dulzura Rebelde",
        achievementId: "dulzura_rebelde"
      },
      dairyChaos: {
        title: "¡Una nube de queso cubrió la receta!",
        message: `El queso o la leche cambiaron la textura que debía tener ${current.name}. En esta comanda, la cremosidad o el cuerpo se consiguen con otros ingredientes.`,
        achievement: "Domador/a de la Nube de Queso",
        achievementId: "nube_de_queso"
      },
      meatChaos: {
        title: "¡Se armó un carnaval de carnes!",
        message: `Agregaste una carne que no correspondía a ${current.name}. Cada corte necesita una técnica y un tiempo distinto, y la preparación perdió su equilibrio.`,
        achievement: "Director/a del Carnaval de Carnes",
        achievementId: "carnaval_de_carnes"
      },
      undercooked: {
        title: "¡Las brasas se quedaron dormidas!",
        message: `Agregaste todos los ingredientes de ${current.name}, pero el fuego quedó demasiado bajo. La preparación no alcanzó la temperatura necesaria para cocinarse correctamente.`,
        achievement: "Guardián/a de las Brasas Dormidas",
        achievementId: "fogon_dormido"
      },
      unstable: {
        title: "¡El fuego perdió el ritmo!",
        message: `Subiste y bajaste la intensidad demasiadas veces mientras preparabas ${current.name}. Los cambios bruscos dejaron una cocción despareja.`,
        achievement: "Termómetro Bailarín",
        achievementId: "termometro_bailarin"
      }
    };
    const outcome = outcomes[type] || outcomes.spoiled;
    const copyVariants = {
      fire: [{ title: "¡Incendio en la cocina!", message: `El fuego llegó al máximo y ${current.name} quedó entre humo y llamas. La partida se detuvo por seguridad.`, tip: "Nunca lleves el indicador al extremo superior" }],
      raw: [{ title: "¡Todavía estaba crudo!", message: `${current.name} fue servido con el fogón casi apagado y no alcanzó una cocción segura.`, tip: "Encendé el fuego y mantenelo dentro de la zona ideal" }],
      timeOut: [{ title: "¡El reloj llegó primero!", message: `El tiempo del modo difícil terminó antes de completar ${current.name}.`, tip: "Leé la comanda antes de empezar y mantené un ritmo constante" }],
      burned: [
        { title: "¡El fogón se descontroló!", message: `El fuego quedó demasiado fuerte y ${current.name} terminó quemándose. La zona roja indica que es momento de bajar la intensidad.`, tip: "Bajá el fuego antes de llegar a la zona roja" },
        { title: "¡Mucho fuego para una sola olla!", message: `${current.name} recibió más calor del que podía soportar. En la cocina regional, el tiempo y la paciencia también son ingredientes.`, tip: "Mantené el indicador en la franja de fuego parejo" },
        { title: "¡Del dorado al carbón!", message: `La temperatura subió hasta el máximo y los sabores de ${current.name} se perdieron entre el humo.`, tip: "Hacé ajustes pequeños y observá el termómetro" }
      ],
      spoiled: [
        { title: "¡La receta perdió el rumbo!", message: `Probaste varios ingredientes ajenos a ${current.name} y la mezcla dejó de seguir una identidad regional reconocible.`, tip: "Compará cada ingrediente con la comanda" },
        { title: "¡Demasiadas pistas falsas!", message: `Tres elecciones distintas no correspondían a ${current.name}. Explorar sirve, pero esta combinación no encontró equilibrio.`, tip: "Leé la explicación del error antes de continuar" },
        { title: "¡La alacena hizo una travesura!", message: `La preparación reunió sabores que pertenecían a otras recetas y ${current.name} terminó transformándose en una mezcla imposible.`, tip: "Buscá primero los ingredientes principales del plato" }
      ],
      stubborn: [
        { title: "¡El cucharón se puso porfiado!", message: `Insististe tres veces con el mismo ingrediente aunque no pertenecía a ${current.name}. La repetición terminó alterando su identidad.`, tip: "Si aparece un error, probá una opción diferente" },
        { title: "¡Tres veces no lo hicieron correcto!", message: `El mismo ingrediente volvió una y otra vez, pero seguía sin formar parte de la comanda de ${current.name}.`, tip: "Usá la explicación como pista para buscar otro ingrediente" },
        { title: "¡Ese ingrediente no quería irse!", message: `La receta rechazó tres veces la misma elección. ${current.name} necesita otro sabor para completar su preparación.`, tip: "Revisá los ingredientes todavía sin marcar" }
      ],
      sweetChaos: [
        { title: "¡La receta se volvió demasiado dulce!", message: `Las pasas o el azúcar entraron en ${current.name} sin pertenecer a esta variante y taparon sus sabores principales.`, tip: "Reservá los ingredientes dulces para variantes que los pidan" },
        { title: "¡Un dulzor fuera de lugar!", message: `${current.name} tomó un camino azucarado que no coincidía con la comanda regional elegida.`, tip: "Mirá la región de la receta antes de sumar pasas o azúcar" }
      ],
      dairyChaos: [
        { title: "¡Una nube de queso cubrió la receta!", message: `El queso o la leche cambiaron la textura que debía tener ${current.name}. En esta comanda, el cuerpo se consigue con otros ingredientes.`, tip: "Buscá qué ingrediente aporta la cremosidad original" },
        { title: "¡La textura tomó otro camino!", message: `Los lácteos no pertenecían a esta versión de ${current.name} y modificaron demasiado su consistencia.`, tip: "No todos los platos cremosos necesitan leche o queso" }
      ],
      meatChaos: [
        { title: "¡Se armó un carnaval de carnes!", message: `Agregaste una carne que no correspondía a ${current.name}. Cada corte necesita una técnica y un tiempo diferente.`, tip: "Identificá el corte específico que pide la comanda" },
        { title: "¡Los cortes se confundieron de olla!", message: `${current.name} recibió carnes de otras preparaciones y perdió el equilibrio entre sabor, textura y cocción.`, tip: "Carne, matambre, cerdo y charqui no son intercambiables" }
      ],
      undercooked: [
        { title: "¡Las brasas se quedaron dormidas!", message: `Agregaste todos los ingredientes de ${current.name}, pero el fuego quedó demasiado bajo para alcanzar una cocción segura.`, tip: "Terminá la receta con el fuego en la zona pareja" },
        { title: "¡Faltó despertar el fogón!", message: `La comanda estaba completa, aunque ${current.name} todavía necesitaba más temperatura y tiempo de cocción.`, tip: "Antes de finalizar, revisá también el termómetro" }
      ],
      unstable: [
        { title: "¡El fuego perdió el ritmo!", message: `Subiste y bajaste la intensidad demasiadas veces y ${current.name} terminó con una cocción despareja.`, tip: "Sostené una temperatura estable durante la preparación" },
        { title: "¡El termómetro no paró de bailar!", message: `Los cambios bruscos de calor cocinaron algunas partes de ${current.name} más rápido que otras.`, tip: "Corregí el fuego solo cuando realmente sea necesario" }
      ]
    };
    const variants = copyVariants[type] || copyVariants.spoiled;
    const variantIndex = state.failureVariantCounts[type] || 0;
    const selectedCopy = variants[variantIndex % variants.length];
    state.failureVariantCounts[type] = variantIndex + 1;

    state.completed = true;
    window.clearInterval(state.gameTimerId);
    state.ending = false;
    stopIdleTimer();
    hideToast();
    playErrorSound();
    unlockAchievement(outcome.achievementId);

    el.completeScreen.dataset.outcome = type;
    el.completeScreen.classList.add("is-failed");
    el.endingEyebrow.textContent = "Final alternativo · Qué pasó";
    el.achievementLabel.textContent = "Consejo para el próximo intento";
    el.achievementIcon.textContent = "💡";
    el.completeTitle.textContent = selectedCopy.title;
    el.completeMessage.textContent = selectedCopy.message;
    el.achievementTitle.textContent = selectedCopy.tip;
    el.victoryForm.reset();
    el.victoryForm.hidden = true;
    el.victorySignature.hidden = true;
    el.victorySignature.textContent = "";
    el.retryRecipe.hidden = false;
    el.playAgain.textContent = "Elegir otro plato";
    el.victoryQrCard.hidden = true;
    renderSecretAchievement(outcome.achievementId);
    const statusByOutcome = { fire: "Incendio en la cocina", raw: "Preparación cruda", timeOut: "Tiempo agotado", burned: "Preparación quemada", spoiled: "Mezcla estropeada", stubborn: "Ingrediente repetido", sweetChaos: "Exceso de dulzor", dairyChaos: "Textura alterada", meatChaos: "Carnes incompatibles", undercooked: "Preparación sin cocción", unstable: "Cocción despareja" };
    el.statusText.textContent = statusByOutcome[type] || "Preparación estropeada";
    el.idleIndicator.hidden = true;
    activateScreen(el.completeScreen);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    state.sessionActive = true;
    armIdleTimer();
  }

  function completeRecipe() {
    state.completed = true;
    window.clearInterval(state.gameTimerId);
    state.ending = false;
    playSuccessSound();
    hideToast();
    stopIdleTimer();
    const current = recipe();

    el.completeScreen.dataset.outcome = "success";
    el.completeScreen.classList.remove("is-failed");
    el.endingEyebrow.textContent = "¡Receta completada!";
    el.achievementLabel.textContent = "Título obtenido";
    el.achievementIcon.textContent = "🏵️";
    el.completeTitle.textContent = "¡El fogón está de fiesta!";
    el.completeMessage.textContent = `Completaste ${current.name} en modo ${DIFFICULTIES[state.difficulty].name} y obtuviste ${state.score} de 1000 puntos.`;
    el.achievementTitle.textContent = state.score >= 970 ? `Campeón/a Olímpico/a de ${current.name}` : state.score >= 850 ? "Gran Maestro/a del Fogón" : current.achievement;
    el.victoryForm.reset();
    el.victoryForm.hidden = false;
    el.competitionOption.hidden = state.difficulty === "easy";
    el.victorySignature.hidden = true;
    el.victorySignature.textContent = "";
    el.retryRecipe.hidden = true;
    el.playAgain.textContent = "Cocinar otra receta";
    el.victoryQrCard.hidden = false;
    renderSecretAchievement(latestSessionAchievement());
    el.statusText.textContent = `${current.name} completada`;
    el.idleIndicator.hidden = true;
    activateScreen(el.completeScreen);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    generateQr();

    state.sessionActive = true;
    armIdleTimer();
  }

  function personalizeVictory(event) {
    event.preventDefault();
    const playerName = el.playerName.value.trim();
    const playerNickname = el.playerNickname.value.trim().replace(/^@+/, "");
    const visitorPlace = el.visitorPlace.value.trim();

    if (!playerName) {
      el.playerName.setCustomValidity("Escribí tu nombre para personalizar el reconocimiento.");
      el.playerName.reportValidity();
      el.playerName.focus();
      return;
    }

    if (el.joinCompetition.checked && state.difficulty !== "easy") {
      if (!playerNickname) {
        el.playerNickname.setCustomValidity("Elegí un nick de juego para participar en la competencia.");
        el.playerNickname.reportValidity();
        el.playerNickname.focus();
        return;
      }
      const category = rankingCategory(recipe());
      const normalizedNick = playerNickname.toLocaleLowerCase("es");
      const nicknameTaken = loadRanking().some((entry) => categoryFromEntry(entry) === category && `${entry.nickname || entry.name}`.toLocaleLowerCase("es") === normalizedNick);
      if (nicknameTaken) {
        el.playerNickname.setCustomValidity(`El nick @${playerNickname} ya participa en esta categoría. Elegí otro para evitar confusiones.`);
        el.playerNickname.reportValidity();
        el.playerNickname.focus();
        return;
      }
    }

    el.playerName.setCustomValidity("");
    el.playerNickname.setCustomValidity("");
    el.completeTitle.textContent = `¡Felicitaciones, ${playerName}!`;
    el.victorySignature.textContent = visitorPlace
      ? `Este reconocimiento celebra a ${playerName}, que nos visita desde ${visitorPlace}.`
      : `Este reconocimiento celebra a ${playerName}.`;
    el.victorySignature.hidden = false;
    if (el.joinCompetition.checked && state.difficulty !== "easy") {
      const result = saveRankingEntry({ name: playerName, nickname: playerNickname, place: visitorPlace || "Sin localidad", recipe: recipe().name, category: rankingCategory(recipe()), difficulty: state.difficulty, score: state.score });
      if (result.position <= 3) {
        const prizes = [
          { icon: "🥇", name: "Medalla virtual de oro" },
          { icon: "🥈", name: "Medalla virtual de plata" },
          { icon: "🥉", name: "Medalla virtual de bronce" }
        ];
        const prize = prizes[result.position - 1];
        el.achievementIcon.textContent = prize.icon;
        el.achievementLabel.textContent = "Premio virtual · posición actual";
        el.achievementTitle.textContent = `${prize.name} en ${result.categoryTitle}`;
        el.victorySignature.textContent += ` ¡Entraste al puesto ${result.position} y recibiste la ${prize.name.toLowerCase()}!`;
      } else {
        el.victorySignature.textContent += ` Tu puntaje quedó en el puesto ${result.position} de ${result.categoryTitle}.`;
      }
      el.joinCompetition.checked = false;
    }
  }

  function loadRanking() {
    try {
      const saved = JSON.parse(window.localStorage.getItem(RANKING_STORAGE_KEY) || "[]");
      return Array.isArray(saved) ? saved : [];
    } catch (_) { return []; }
  }

  function saveRankingEntry(entry) {
    const ranking = loadRanking();
    const createdAt = new Date().toISOString();
    const record = { ...entry, id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`, createdAt };
    ranking.push(record);
    ranking.sort((a, b) => b.score - a.score || Number(b.difficulty === "hard") - Number(a.difficulty === "hard") || a.createdAt.localeCompare(b.createdAt));
    window.localStorage.setItem(RANKING_STORAGE_KEY, JSON.stringify(ranking.slice(0, 200)));
    renderLeaderboard();
    const categoryEntries = ranking.filter((item) => categoryFromEntry(item) === entry.category).sort((a, b) => b.score - a.score || Number(b.difficulty === "hard") - Number(a.difficulty === "hard") || a.createdAt.localeCompare(b.createdAt));
    const position = categoryEntries.findIndex((item) => item.id === record.id) + 1;
    const categoryTitle = { empanadas: "Empanadas", humitas: "Humitas", locro: "Locro", tamales: "Tamales" }[entry.category];
    return { position, categoryTitle };
  }

  function rankingCategory(current) {
    if (current.family === "empanadas") return "empanadas";
    if (current.family === "humita") return "humitas";
    if (current.family === "locro") return "locro";
    return "tamales";
  }

  function categoryFromEntry(entry) {
    if (entry.category) return entry.category;
    const value = `${entry.recipe || ""}`.toLocaleLowerCase("es");
    if (value.includes("empanada")) return "empanadas";
    if (value.includes("humita")) return "humitas";
    if (value.includes("locro")) return "locro";
    return "tamales";
  }

  function renderLeaderboard() {
    const ranking = loadRanking();
    el.leaderboardList.replaceChildren();
    el.leaderboardEmpty.hidden = ranking.length > 0;
    const categories = [
      { id: "empanadas", icon: "🥟", title: "Empanadas" },
      { id: "humitas", icon: "🌽", title: "Humitas" },
      { id: "locro", icon: "🥘", title: "Locro" },
      { id: "tamales", icon: "🫔", title: "Tamales" }
    ];
    categories.forEach((category) => {
      const entries = ranking.filter((entry) => categoryFromEntry(entry) === category.id).sort((a, b) => b.score - a.score || Number(b.difficulty === "hard") - Number(a.difficulty === "hard") || a.createdAt.localeCompare(b.createdAt));
      const section = document.createElement("section");
      section.className = "leaderboard-category";
      section.innerHTML = `<header><span aria-hidden="true">${category.icon}</span><div><strong>${category.title}</strong><small>Podio de tres ganadores</small></div></header>`;
      const list = document.createElement("ol");
      list.className = "leaderboard-list";
      if (!entries.length) {
        const empty = document.createElement("li");
        empty.className = "category-empty";
        empty.textContent = "Sin participantes todavía";
        list.append(empty);
      }
      entries.forEach((entry, index) => {
        const item = document.createElement("li");
        if (index < 3) item.classList.add("is-podium", `is-place-${index + 1}`);
        const displayNick = entry.nickname || entry.name;
        const positionLabel = index < 3 ? ["🥇", "🥈", "🥉"][index] : index + 1;
        item.innerHTML = `<span class="leader-position" aria-label="Puesto ${index + 1}">${positionLabel}</span><div class="leader-person"><strong>${escapeHtml(entry.name)}</strong><b>@${escapeHtml(displayNick)}</b><small>${escapeHtml(entry.place)} · ${escapeHtml(entry.recipe)} · ${entry.difficulty === "hard" ? "Difícil" : "Media"}</small></div><strong class="leader-score">${entry.score}</strong>`;
        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "leader-delete";
        removeButton.dataset.deleteRanking = entry.id || entry.createdAt;
        removeButton.setAttribute("aria-label", `Eliminar a ${entry.name} del ranking`);
        removeButton.title = "Eliminar participante";
        removeButton.textContent = "×";
        item.append(removeButton);
        list.append(item);
      });
      section.append(list);
      el.leaderboardList.append(section);
    });
  }

  function deleteRankingEntry(recordId) {
    const ranking = loadRanking();
    const entry = ranking.find((item) => (item.id || item.createdAt) === recordId);
    if (!entry || !window.confirm(`¿Eliminar a ${entry.name} del ranking? Esta acción no se puede deshacer.`)) return;
    const updated = ranking.filter((item) => (item.id || item.createdAt) !== recordId);
    window.localStorage.setItem(RANKING_STORAGE_KEY, JSON.stringify(updated));
    renderLeaderboard();
  }

  function escapeHtml(value) {
    const node = document.createElement("span");
    node.textContent = String(value);
    return node.innerHTML;
  }

  function exportRankingCsv() {
    const ranking = loadRanking();
    const rows = [["Nombre", "Nick", "Localidad", "Categoría", "Plato", "Dificultad", "Puntos", "Fecha"], ...ranking.map((entry) => [entry.name, entry.nickname || entry.name, entry.place, categoryFromEntry(entry), entry.recipe, entry.difficulty, entry.score, entry.createdAt])];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\r\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }));
    link.download = `ranking-cocina-noa-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }

  function generateQr() {
    const url = DATA.config.recipeBookUrl.trim();
    el.recipeLink.hidden = !url;
    el.qrcode.classList.toggle("is-pending", !url);
    el.qrcode.replaceChildren();

    if (!url) {
      const pending = document.createElement("div");
      pending.className = "qr-pending";
      pending.innerHTML = `<span aria-hidden="true">⌁</span><strong>QR listo para vincular</strong><small>Se activa con la URL final de Vercel</small>`;
      el.qrcode.append(pending);
      return;
    }

    el.recipeLink.href = url;

    if (typeof window.QRCode === "function") {
      new window.QRCode(el.qrcode, {
        text: url,
        width: 190,
        height: 190,
        colorDark: "#241711",
        colorLight: "#fffaf0",
        correctLevel: window.QRCode.CorrectLevel.H
      });
    } else {
      const qrImage = document.createElement("img");
      qrImage.src = "qr-recetario.svg";
      qrImage.alt = "Código QR del recetario digital del proyecto";
      qrImage.width = 190;
      qrImage.height = 190;
      el.qrcode.append(qrImage);
    }
  }

  function showToast(durationMs = 6500, type = "info") {
    window.clearTimeout(state.toastTimer);
    el.cultureToast.classList.remove("is-error", "is-discovery");
    if (type === "error") el.cultureToast.classList.add("is-error");
    if (type === "discovery") el.cultureToast.classList.add("is-discovery");
    el.cultureToast.hidden = false;
    requestAnimationFrame(() => el.cultureToast.classList.add("is-visible"));
    state.toastTimer = window.setTimeout(hideToast, durationMs);
  }

  function hideToast() {
    window.clearTimeout(state.toastTimer);
    el.cultureToast.classList.remove("is-visible");
    window.setTimeout(() => {
      if (!el.cultureToast.classList.contains("is-visible")) el.cultureToast.hidden = true;
    }, 220);
  }

  function scheduleDidYouKnow(delayMs = 6500) {
    window.clearTimeout(state.factTimer);
    if (!DATA.didYouKnow?.length || !el.menuScreen.classList.contains("is-active")) return;
    state.factTimer = window.setTimeout(showDidYouKnow, delayMs);
  }

  function showDidYouKnow() {
    if (!el.menuScreen.classList.contains("is-active") || !DATA.didYouKnow?.length) return;
    const fact = DATA.didYouKnow[state.factIndex % DATA.didYouKnow.length];
    state.factIndex = (state.factIndex + 1) % DATA.didYouKnow.length;
    el.didYouKnowText.textContent = fact;
    el.didYouKnow.hidden = false;
    requestAnimationFrame(() => el.didYouKnow.classList.add("is-visible"));
    window.clearTimeout(state.factHideTimer);
    state.factHideTimer = window.setTimeout(() => hideDidYouKnow(true), 9000);
  }

  function hideDidYouKnow(reschedule = true) {
    window.clearTimeout(state.factTimer);
    window.clearTimeout(state.factHideTimer);
    el.didYouKnow.classList.remove("is-visible");
    window.setTimeout(() => {
      if (!el.didYouKnow.classList.contains("is-visible")) el.didYouKnow.hidden = true;
    }, 240);
    if (reschedule && el.menuScreen.classList.contains("is-active")) scheduleDidYouKnow(18000);
  }

  function resetToMenu({ inactivity = false } = {}) {
    stopIdleTimer();
    window.clearTimeout(state.completionTimer);
    window.clearTimeout(state.toastTimer);
    window.clearInterval(state.gameTimerId);
    cancelDrag();
    hideToast();
    closeFamily();

    state.recipeId = null;
    state.added = new Set();
    state.variationHistory = [];
    state.completed = false;
    state.ending = false;
    state.heat = 45;
    state.wrongAttempts = 0;
    state.wrongIngredients = new Map();
    state.wrongSequence = [];
    state.pantryOrder = [];
    state.heatMoves = 0;
    state.lastHeatDirection = 0;
    state.heatDirectionChanges = 0;
    state.recoveredHeat = false;
    state.sessionAchievements = new Set();
    state.sessionActive = false;
    state.requiredIds = [];
    state.score = 1000;
    state.gameDeadline = 0;
    el.gameTimer.hidden = true;

    activateScreen(el.menuScreen);
    el.menuScreen.scrollTop = 0;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    el.statusText.textContent = "Elegí una receta para comenzar";
    el.idleIndicator.hidden = true;
    el.sessionStatus.classList.remove("is-warning");
    el.qrcode.replaceChildren();
    el.secretAchievement.hidden = true;
    el.completeScreen.classList.remove("is-failed");
    scheduleDidYouKnow(inactivity ? 4500 : 6500);
    renderLeaderboard();

    if (inactivity) {
      el.menuNotice.textContent = "La experiencia se reinició por inactividad. ¡Elegí un plato para volver a cocinar!";
      el.menuNotice.hidden = false;
    } else {
      el.menuNotice.hidden = true;
    }
  }

  function retryCurrentRecipe() {
    if (!state.recipeId) {
      resetToMenu();
      return;
    }
    startRecipe(state.recipeId);
  }

  function armIdleTimer(durationMs = DATA.config.inactivityMs) {
    if (!state.sessionActive) return;
    state.idleDuration = durationMs;
    state.idleDeadline = Date.now() + state.idleDuration;
    el.idleIndicator.hidden = false;
    if (!state.idleTimer) state.idleTimer = window.setInterval(updateIdleTimer, 250);
    updateIdleTimer();
  }

  function noteActivity() {
    if (state.sessionActive) {
      state.idleDeadline = Date.now() + state.idleDuration;
      updateIdleTimer();
    }
  }

  function updateIdleTimer() {
    if (!state.sessionActive) return;
    const remaining = Math.max(0, state.idleDeadline - Date.now());
    const seconds = Math.ceil(remaining / 1000);
    el.idleSeconds.textContent = `${seconds} s`;
    el.sessionStatus.classList.toggle("is-warning", remaining <= DATA.config.warningMs);
    if (remaining <= 0) resetToMenu({ inactivity: true });
  }

  function stopIdleTimer() {
    window.clearInterval(state.idleTimer);
    state.idleTimer = null;
    el.sessionStatus.classList.remove("is-warning");
  }

  function beginDrag(event) {
    const button = event.target.closest("[data-ingredient]");
    if (!button || !state.recipeId) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (event.pointerType !== "mouse") return;

    event.preventDefault();
    const id = button.dataset.ingredient;
    const item = ingredient(id);
    const ghost = document.createElement("div");
    ghost.className = "drag-ghost";
    ghost.innerHTML = `<span>${item.icon}</span><strong>${item.name}</strong>`;
    document.body.append(ghost);

    state.drag = {
      id,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      x: event.clientX,
      y: event.clientY,
      moved: false,
      ghost
    };

    button.setPointerCapture?.(event.pointerId);
    positionGhost(event.clientX, event.clientY);
    el.dropZone.classList.add("is-ready");
  }

  function moveDrag(event) {
    if (!state.drag || state.drag.pointerId !== event.pointerId) return;
    event.preventDefault();
    const distance = Math.hypot(event.clientX - state.drag.startX, event.clientY - state.drag.startY);
    if (distance > 8) state.drag.moved = true;
    state.drag.x = event.clientX;
    state.drag.y = event.clientY;
    positionGhost(event.clientX, event.clientY);
    el.dropZone.classList.toggle("is-over", pointInDropZone(event.clientX, event.clientY));
  }

  function endDrag(event) {
    if (!state.drag || state.drag.pointerId !== event.pointerId) return;
    event.preventDefault();
    const id = state.drag.id;
    const isTap = !state.drag.moved;
    const isDrop = pointInDropZone(event.clientX, event.clientY);
    state.suppressClickUntil = Date.now() + 500;
    cancelDrag();
    if (isTap || isDrop) toggleIngredient(id);
  }

  function cancelDrag() {
    state.drag?.ghost.remove();
    state.drag = null;
    el.dropZone.classList.remove("is-ready", "is-over");
  }

  function positionGhost(x, y) {
    if (!state.drag) return;
    state.drag.ghost.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -115%)`;
  }

  function pointInDropZone(x, y) {
    const rect = el.dropZone.getBoundingClientRect();
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  }

  el.dishMenu.addEventListener("click", (event) => {
    const card = event.target.closest(".dish-card");
    if (!card) return;
    if (card.dataset.family) openFamily(card.dataset.family);
    if (card.dataset.recipe) startRecipe(card.dataset.recipe);
  });

  el.variantOptions.addEventListener("click", (event) => {
    const option = event.target.closest("[data-recipe]");
    if (option) startRecipe(option.dataset.recipe);
  });

  el.variantDialog.addEventListener("click", (event) => {
    if (event.target.closest("[data-close-modal]")) closeFamily();
  });

  el.cookbookNav.addEventListener("click", (event) => {
    const button = event.target.closest("[data-cookbook-target]");
    if (!button) return;
    document.getElementById(button.dataset.cookbookTarget)?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  el.cookbookContent.addEventListener("click", (event) => {
    if (!event.target.closest("[data-cookbook-top]")) return;
    el.recipeLibrary.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  el.ingredientGrid.addEventListener("pointerdown", beginDrag);
  el.ingredientGrid.addEventListener("click", (event) => {
    if (Date.now() < state.suppressClickUntil) return;
    const button = event.target.closest("[data-ingredient]");
    if (button) toggleIngredient(button.dataset.ingredient);
  });
  el.ingredientGrid.addEventListener("scroll", () => {
    state.suppressClickUntil = Date.now() + 220;
  }, { passive: true });

  el.addedChips.addEventListener("click", (event) => {
    const chip = event.target.closest("[data-remove-ingredient]");
    if (chip) removeIngredient(chip.dataset.removeIngredient);
  });

  document.addEventListener("pointermove", moveDrag, { passive: false });
  document.addEventListener("pointerup", endDrag, { passive: false });
  document.addEventListener("pointercancel", cancelDrag);
  document.addEventListener("pointerdown", noteActivity, { capture: true });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") startChiptune();
    noteActivity();
    if (event.key === "Escape" && !el.variantDialog.hidden) closeFamily();
  });

  el.homeButton.addEventListener("click", () => resetToMenu());
  el.playAgain.addEventListener("click", () => resetToMenu());
  el.retryRecipe.addEventListener("click", retryCurrentRecipe);
  el.heatDown.addEventListener("click", () => adjustHeat(-10));
  el.heatUp.addEventListener("click", () => adjustHeat(10));
  el.pantryScrollUp.addEventListener("click", () => el.ingredientGrid.scrollBy({ top: -220, behavior: "smooth" }));
  el.pantryScrollDown.addEventListener("click", () => el.ingredientGrid.scrollBy({ top: 220, behavior: "smooth" }));
  el.difficultyOptions.addEventListener("click", (event) => {
    const button = event.target.closest("[data-difficulty]");
    if (!button) return;
    state.difficulty = button.dataset.difficulty;
    el.difficultyOptions.querySelectorAll("[data-difficulty]").forEach((option) => option.classList.toggle("is-selected", option === button));
  });
  el.victoryForm.addEventListener("submit", personalizeVictory);
  el.playerName.addEventListener("input", () => el.playerName.setCustomValidity(""));
  el.playerNickname.addEventListener("input", () => el.playerNickname.setCustomValidity(""));
  el.toastClose.addEventListener("click", hideToast);
  el.didYouKnowClose.addEventListener("click", () => hideDidYouKnow(true));
  el.exportRanking.addEventListener("click", exportRankingCsv);
  el.leaderboardList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-delete-ranking]");
    if (button) deleteRankingEntry(button.dataset.deleteRanking);
  });
  el.soundToggle.addEventListener("click", toggleSound);
  el.musicSelect.addEventListener("change", changeMusicTrack);
  el.fullscreenToggle.addEventListener("click", toggleFullscreenMode);
  el.scrollTopButton.addEventListener("click", scrollMainPageToTop);
  el.mobileGameNav.addEventListener("click", (event) => {
    const button = event.target.closest("[data-game-jump]");
    if (button) jumpToGameSection(button.dataset.gameJump);
  });
  window.addEventListener("scroll", scheduleScrollTopButtonUpdate, { passive: true });
  el.menuScreen.addEventListener("scroll", scheduleScrollTopButtonUpdate, { passive: true });

  document.addEventListener("pointerdown", startChiptune, { capture: true, passive: true });

  document.addEventListener("contextmenu", (event) => event.preventDefault());
  document.addEventListener("dragstart", (event) => event.preventDefault());
  document.addEventListener("gesturestart", (event) => event.preventDefault());
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopChiptune();
    } else {
      noteActivity();
      if (audioState.enabled) startChiptune();
    }
  });
  document.addEventListener("fullscreenchange", updateFullscreenButton);
  document.addEventListener("webkitfullscreenchange", updateFullscreenButton);

  updateFullscreenButton();
  updateSoundButton();
  if (!CLASSICAL_TRACKS[audioState.trackId]) audioState.trackId = "mozart-turca";
  el.musicSelect.value = audioState.trackId;
  initYaguareteCursor();
  renderCookbook();
  renderLeaderboard();
  resetToMenu();
})();
