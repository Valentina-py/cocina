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
    fullscreenToggle: document.querySelector("#fullscreen-toggle"),
    fullscreenIcon: document.querySelector("#fullscreen-icon"),
    fullscreenLabel: document.querySelector("#fullscreen-label"),
    soundToggle: document.querySelector("#sound-toggle"),
    soundIcon: document.querySelector("#sound-icon"),
    soundLabel: document.querySelector("#sound-label"),
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
    achievementTitle: document.querySelector("#achievement-title"),
    playAgain: document.querySelector("#play-again"),
    qrcode: document.querySelector("#qrcode"),
    recipeLink: document.querySelector("#recipe-link"),
    recipeLibrary: document.querySelector("#recipe-library"),
    cookbookNav: document.querySelector("#cookbook-nav"),
    cookbookContent: document.querySelector("#cookbook-content"),
    scrollTopButton: document.querySelector("#scroll-top"),
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
    completed: false
  };

  const audioState = {
    context: null,
    master: null,
    music: null,
    effects: null,
    noiseBuffer: null,
    enabled: true,
    sequenceTimer: null,
    nextStepAt: 0,
    step: 0
  };

  const CHIPTUNE_STEP_SECONDS = 0.16;
  const CHIPTUNE_SEQUENCE = [
    { lead: 69, bass: 45 }, { lead: 72 }, { lead: 76 }, { lead: null },
    { lead: 74, bass: 40 }, { lead: 72 }, { lead: 69 }, { lead: 67 },
    { lead: 64, bass: 41 }, { lead: 67 }, { lead: 71 }, { lead: 69 },
    { lead: 67, bass: 43 }, { lead: 64 }, { lead: 62 }, { lead: null },
    { lead: 69, bass: 45 }, { lead: 71 }, { lead: 72 }, { lead: 76 },
    { lead: 79, bass: 40 }, { lead: 76 }, { lead: 74 }, { lead: 72 },
    { lead: 74, bass: 41 }, { lead: 72 }, { lead: 69 }, { lead: 67 },
    { lead: 64, bass: 43 }, { lead: 67 }, { lead: 69 }, { lead: null }
  ];

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

  function scheduleMusicStep(stepIndex, start) {
    const step = CHIPTUNE_SEQUENCE[stepIndex];
    if (step.lead) {
      scheduleTone({
        frequency: noteFrequency(step.lead),
        start,
        duration: CHIPTUNE_STEP_SECONDS * 0.78,
        type: "square",
        volume: 0.075,
        destination: audioState.music
      });
    }
    if (step.bass) {
      scheduleTone({
        frequency: noteFrequency(step.bass),
        start,
        duration: CHIPTUNE_STEP_SECONDS * 3.2,
        type: "triangle",
        volume: 0.095,
        destination: audioState.music
      });
    }
    if (stepIndex % 4 === 2 && step.lead) {
      scheduleTone({
        frequency: noteFrequency(step.lead - 12),
        start: start + 0.018,
        duration: CHIPTUNE_STEP_SECONDS * 0.48,
        type: "square",
        volume: 0.025,
        destination: audioState.music
      });
    }
  }

  function scheduleChiptune() {
    const context = audioState.context;
    if (!context || !audioState.enabled) return;
    while (audioState.nextStepAt < context.currentTime + 0.28) {
      scheduleMusicStep(audioState.step, audioState.nextStepAt);
      audioState.step = (audioState.step + 1) % CHIPTUNE_SEQUENCE.length;
      audioState.nextStepAt += CHIPTUNE_STEP_SECONDS;
    }
  }

  function startChiptune() {
    const context = ensureAudio();
    if (!context || !audioState.enabled || audioState.sequenceTimer) return;
    const begin = () => {
      audioState.music.gain.cancelScheduledValues(context.currentTime);
      audioState.music.gain.setTargetAtTime(0.22, context.currentTime, 0.04);
      audioState.nextStepAt = context.currentTime + 0.06;
      scheduleChiptune();
      audioState.sequenceTimer = window.setInterval(scheduleChiptune, 90);
    };
    if (context.state === "suspended") {
      context.resume().then(begin).catch(() => {});
    } else {
      begin();
    }
  }

  function stopChiptune() {
    window.clearInterval(audioState.sequenceTimer);
    audioState.sequenceTimer = null;
    if (audioState.context && audioState.music) {
      audioState.music.gain.cancelScheduledValues(audioState.context.currentTime);
      audioState.music.gain.setTargetAtTime(0.0001, audioState.context.currentTime, 0.025);
    }
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
    state.sessionActive = true;
    el.menuNotice.hidden = true;
    activateScreen(el.gameScreen);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    renderGame();
    armIdleTimer();
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
  }

  function renderPantry(current) {
    el.ingredientGrid.replaceChildren();

    current.pantry.forEach((id) => {
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

  function renderChecklist(current) {
    el.checklist.replaceChildren();
    current.required.forEach((id) => {
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
    const completed = current.required.filter((id) => state.added.has(id)).length;
    const total = current.required.length;
    const percent = total ? Math.round((completed / total) * 100) : 0;
    el.progressLabel.textContent = `${completed} de ${total}`;
    el.progressBar.style.width = `${percent}%`;
  }

  function addIngredient(id) {
    if (!state.recipeId || state.completed || state.added.has(id) || !ingredient(id)) return;

    noteActivity();
    const current = recipe();
    const variation = current.variations.find((rule) => rule.anyOf.includes(id));
    const belongsToRecipe = current.required.includes(id);
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
      state.completionTimer = window.setTimeout(checkCompletion, 1350);
    } else {
      renderGame();
      state.completionTimer = window.setTimeout(checkCompletion, 420);
    }
  }

  function toggleIngredient(id) {
    if (state.added.has(id)) {
      removeIngredient(id);
    } else {
      addIngredient(id);
    }
  }

  function removeIngredient(id) {
    if (!state.recipeId || state.completed || !state.added.has(id)) return;

    noteActivity();
    window.clearTimeout(state.completionTimer);
    state.added.delete(id);

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

    playErrorSound();
    el.toastTitle.textContent = "Ese ingrediente no va en esta receta";
    el.toastMessage.textContent = `${rejected.name} marca error en ${current.name}. ${explanation} No perdiste ningún avance.`;
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
    if (!current || state.completed) return;
    if (current.required.every((id) => state.added.has(id))) completeRecipe();
  }

  function completeRecipe() {
    state.completed = true;
    playSuccessSound();
    hideToast();
    stopIdleTimer();
    const current = recipe();

    el.completeTitle.textContent = "¡El fogón está de fiesta!";
    el.completeMessage.textContent = `Completaste ${current.name}. Cada ingrediente cuenta una historia de territorio, intercambio y memoria.`;
    el.achievementTitle.textContent = current.achievement;
    el.statusText.textContent = `${current.name} completada`;
    el.idleIndicator.hidden = true;
    activateScreen(el.completeScreen);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    generateQr();

    state.sessionActive = true;
    armIdleTimer();
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

  function resetToMenu({ inactivity = false } = {}) {
    stopIdleTimer();
    window.clearTimeout(state.completionTimer);
    window.clearTimeout(state.toastTimer);
    cancelDrag();
    hideToast();
    closeFamily();

    state.recipeId = null;
    state.added = new Set();
    state.variationHistory = [];
    state.completed = false;
    state.sessionActive = false;

    activateScreen(el.menuScreen);
    el.menuScreen.scrollTop = 0;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    el.statusText.textContent = "Elegí una receta para comenzar";
    el.idleIndicator.hidden = true;
    el.sessionStatus.classList.remove("is-warning");
    el.qrcode.replaceChildren();

    if (inactivity) {
      el.menuNotice.textContent = "La experiencia se reinició por inactividad. ¡Elegí un plato para volver a cocinar!";
      el.menuNotice.hidden = false;
    } else {
      el.menuNotice.hidden = true;
    }
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
  el.toastClose.addEventListener("click", hideToast);
  el.soundToggle.addEventListener("click", toggleSound);
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
      if (audioState.enabled && audioState.context) startChiptune();
    }
  });
  document.addEventListener("fullscreenchange", updateFullscreenButton);
  document.addEventListener("webkitfullscreenchange", updateFullscreenButton);

  updateFullscreenButton();
  updateSoundButton();
  initYaguareteCursor();
  renderCookbook();
  resetToMenu();
})();
