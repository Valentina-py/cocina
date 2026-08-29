(() => {
  "use strict";

  const DATA = window.KITCHEN_DATA;
  const screens = [...document.querySelectorAll(".screen")];

  const el = {
    homeButton: document.querySelector("#home-button"),
    menuScreen: document.querySelector("#menu-screen"),
    gameScreen: document.querySelector("#game-screen"),
    completeScreen: document.querySelector("#complete-screen"),
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
    recipeLink: document.querySelector("#recipe-link")
  };

  const state = {
    recipeId: null,
    added: new Set(),
    drag: null,
    idleDeadline: 0,
    idleTimer: null,
    completionTimer: null,
    toastTimer: null,
    sessionActive: false,
    suppressClickUntil: 0,
    completed: false
  };

  function activateScreen(target) {
    screens.forEach((screen) => {
      const active = screen === target;
      screen.hidden = !active;
      screen.classList.toggle("is-active", active);
    });
  }

  function recipe() {
    return DATA.recipes[state.recipeId];
  }

  function ingredient(id) {
    return DATA.ingredients[id];
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

  function startRecipe(recipeId) {
    if (!DATA.recipes[recipeId]) return;

    closeFamily();
    state.recipeId = recipeId;
    state.added = new Set();
    state.completed = false;
    state.sessionActive = true;
    el.menuNotice.hidden = true;
    activateScreen(el.gameScreen);
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
      button.disabled = added;
      button.setAttribute("aria-label", added ? `${item.name}, ya agregado` : `Agregar ${item.name}`);
      button.innerHTML = `<span aria-hidden="true">${item.icon}</span><strong>${item.name}</strong><small>${added ? "Agregado ✓" : "Tocar o mover"}</small>`;
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
    el.dropInstruction.textContent = state.added.size ? "¡Seguí así! Elegí otro ingrediente" : "Soltá aquí los ingredientes";
    el.vesselContent.replaceChildren();
    el.addedChips.replaceChildren();

    [...state.added].slice(-8).forEach((id, index) => {
      const item = ingredient(id);
      if (!item) return;

      const piece = document.createElement("span");
      piece.textContent = item.icon;
      piece.style.setProperty("--piece-index", index);
      el.vesselContent.append(piece);

      const chip = document.createElement("span");
      chip.textContent = `${item.icon} ${item.name}`;
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

    if (!belongsToRecipe && !variation) {
      rejectIngredient(id, current);
      return;
    }

    state.added.add(id);
    spawnIngredientBurst(id);

    if (variation && DATA.recipes[variation.target]) {
      transformRecipe(variation, id);
      state.completionTimer = window.setTimeout(checkCompletion, 1350);
    } else {
      renderGame();
      state.completionTimer = window.setTimeout(checkCompletion, 420);
    }
  }

  function rejectIngredient(id, current) {
    const rejected = ingredient(id);
    const token = el.ingredientGrid.querySelector(`[data-ingredient="${id}"]`);

    el.toastTitle.textContent = "Ese ingrediente no va en esta receta";
    el.toastMessage.textContent = `${rejected.name} no forma parte de ${current.name}. Mirá la comanda y probá con otro ingrediente; no perdiste ningún avance.`;
    el.dropZone.classList.remove("is-rejected");
    token?.classList.remove("is-rejected");
    void el.dropZone.offsetWidth;
    el.dropZone.classList.add("is-rejected");
    token?.classList.add("is-rejected");
    window.setTimeout(() => {
      el.dropZone.classList.remove("is-rejected");
      token?.classList.remove("is-rejected");
    }, 720);
    showToast();
  }

  function transformRecipe(variation, triggerId) {
    const trigger = ingredient(triggerId);
    state.recipeId = variation.target;
    renderGame();

    el.dropZone.classList.add("is-transforming");
    window.setTimeout(() => el.dropZone.classList.remove("is-transforming"), 900);

    const transformed = recipe();
    el.toastTitle.textContent = `¡Ahora es ${transformed.name}!`;
    el.toastMessage.textContent = `Le agregaste ${trigger.name.toLowerCase()}. Tu preparación acaba de transformarse. ${variation.message}`;
    showToast();
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
    hideToast();
    stopIdleTimer();
    const current = recipe();

    el.completeTitle.textContent = "¡El fogón está de fiesta!";
    el.completeMessage.textContent = `Completaste ${current.name}. Cada ingrediente cuenta una historia de territorio, intercambio y memoria.`;
    el.achievementTitle.textContent = current.achievement;
    el.statusText.textContent = `${current.name} completada`;
    el.idleIndicator.hidden = true;
    activateScreen(el.completeScreen);
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

  function showToast() {
    window.clearTimeout(state.toastTimer);
    el.cultureToast.hidden = false;
    requestAnimationFrame(() => el.cultureToast.classList.add("is-visible"));
    state.toastTimer = window.setTimeout(hideToast, 6500);
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
    state.completed = false;
    state.sessionActive = false;

    activateScreen(el.menuScreen);
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

  function armIdleTimer() {
    if (!state.sessionActive) return;
    state.idleDeadline = Date.now() + DATA.config.inactivityMs;
    el.idleIndicator.hidden = false;
    if (!state.idleTimer) state.idleTimer = window.setInterval(updateIdleTimer, 250);
    updateIdleTimer();
  }

  function noteActivity() {
    if (state.sessionActive) {
      state.idleDeadline = Date.now() + DATA.config.inactivityMs;
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
    if (!button || button.disabled || !state.recipeId) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;

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
    if (isTap || isDrop) addIngredient(id);
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

  el.ingredientGrid.addEventListener("pointerdown", beginDrag);
  el.ingredientGrid.addEventListener("click", (event) => {
    if (Date.now() < state.suppressClickUntil) return;
    const button = event.target.closest("[data-ingredient]");
    if (button && event.detail === 0) addIngredient(button.dataset.ingredient);
  });

  document.addEventListener("pointermove", moveDrag, { passive: false });
  document.addEventListener("pointerup", endDrag, { passive: false });
  document.addEventListener("pointercancel", cancelDrag);
  document.addEventListener("pointerdown", noteActivity, { capture: true });
  document.addEventListener("keydown", (event) => {
    noteActivity();
    if (event.key === "Escape" && !el.variantDialog.hidden) closeFamily();
  });

  el.homeButton.addEventListener("click", () => resetToMenu());
  el.playAgain.addEventListener("click", () => resetToMenu());
  el.toastClose.addEventListener("click", hideToast);

  document.addEventListener("contextmenu", (event) => event.preventDefault());
  document.addEventListener("dragstart", (event) => event.preventDefault());
  document.addEventListener("gesturestart", (event) => event.preventDefault());
  document.addEventListener("touchmove", (event) => {
    const standMode = window.matchMedia("(pointer: coarse) and (min-width: 700px)").matches;
    if (standMode) event.preventDefault();
  }, { passive: false });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) noteActivity();
  });

  resetToMenu();
})();
