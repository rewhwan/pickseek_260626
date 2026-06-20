const openingScenes = [
  {
    id: "opening-01",
    speaker: "파이",
    emotion: "happy",
    text: "안녕 나는 픽스커뮤니케이션의 AI 파이야!",
    action: "next"
  },
  {
    id: "opening-02",
    speaker: "파이",
    emotion: "normal",
    text: "오늘은 내가 픽식 진행을 서포트하면서 일정, 장소, 박람회 정보를 차례대로 안내할게.",
    action: "next"
  },
  {
    id: "opening-03",
    speaker: "파이",
    emotion: "thinking",
    text: "시작하기 전에 짧은 퀴즈를 낼게.",
    action: "next"
  },
  {
    id: "opening-04",
    speaker: "파이",
    emotion: "thinking",
    text: "솔루션 퀴즈",
    action: "auth",
    buttonLabel: "정답 확인"
  },
  {
    id: "opening-05",
    speaker: "파이",
    emotion: "happy",
    text: "좋아, 이제 다시 안내를 이어갈게. 픽식 진행장소는 코엑스 서울국제도서전과 별마당 도서관이야.",
    action: "next"
  },
  {
    id: "opening-06",
    speaker: "파이",
    emotion: "normal",
    text: "서울국제도서전은 출판사와 독자가 만나 책과 이야기를 나누는 국내 대표 책 박람회야.",
    action: "next"
  },
  {
    id: "opening-07",
    speaker: "파이",
    emotion: "thinking",
    text: "이제 메인 페이지로 돌아가 박람회 정보와 오늘 일정을 확인해보자.",
    action: "next"
  },
  {
    id: "opening-08",
    speaker: "파이",
    emotion: "happy",
    text: "메인 페이지에서 일정과 관람정보를 살펴보면 오늘 동선이 더 선명해질 거야.",
    action: "start",
    buttonLabel: "메인 페이지로 이동"
  }
];

const typingDelay = 34;
const introCompletionCookieName = "pickseek_intro_completed";
const introCompletionMaxAge = 60 * 60 * 24 * 180;
const fairTourCompletionCookieName = "pickseek_fair_tour_seen";
const fairTourCompletionMaxAge = 60 * 60 * 24 * 180;
const fairTourSteps = [
  {
    target: "#fairIntroSection",
    title: "도서전 소개",
    text: "여기서는 서울국제도서전이 어떤 책 축제인지 먼저 알려줄게요."
  },
  {
    target: "#fairThemeSection",
    title: "주제",
    text: "올해 공식 주제문은 이 버튼을 누르면 팝업으로 길게 읽어볼 수 있어요."
  },
  {
    target: "#fairMissionSection",
    title: "오늘의 미션",
    text: "오늘은 마음이 움직이는 책을 찾고 박람회 또는 도서관에서 1권 구매하는 게 핵심이에요."
  },
  {
    target: "#fairLinksSection",
    title: "공식 링크",
    text: "부스, 전시, 일정, 특별 프로그램은 여기에서 공식 사이트로 바로 확인할 수 있어요."
  }
];

const openingScreen = document.querySelector("#openingScreen");
const homeScreen = document.querySelector("#homeScreen");
const speakerName = document.querySelector("#speakerName");
const dialogueText = document.querySelector("#dialogueText");
const authChallenge = document.querySelector("#authChallenge");
const authForm = document.querySelector("#authForm");
const authInput = document.querySelector("#authInput");
const authMessage = document.querySelector("#authMessage");
const authHint = document.querySelector("#authHint");
const nextButton = document.querySelector("#nextButton");
const previousButton = document.querySelector("#previousButton");
const authPreviousButton = document.querySelector("#authPreviousButton");
const backToOpeningButton = document.querySelector("#backToOpeningButton");
const tabButtons = document.querySelectorAll("[data-tab-target]");
const tabPanels = document.querySelectorAll("[data-tab-panel]");
const themeModalOpen = document.querySelector("#themeModalOpen");
const themeModal = document.querySelector("#themeModal");
const themeModalCloseButtons = document.querySelectorAll("[data-theme-modal-close]");
const fairTourReplayButton = document.querySelector("#fairTourReplayButton");
const fairTour = document.querySelector("#fairTour");
const fairTourStep = document.querySelector("#fairTourStep");
const fairTourTitle = document.querySelector("#fairTourTitle");
const fairTourText = document.querySelector("#fairTourText");
const fairTourPrevButton = document.querySelector("[data-fair-tour-prev]");
const fairTourNextButton = document.querySelector("[data-fair-tour-next]");
const fairTourCloseButtons = document.querySelectorAll("[data-fair-tour-close]");

let currentSceneIndex = 0;
let visibleText = "";
let typingTimer = null;
let isTyping = false;
let lastThemeModalFocus = null;
let lastFairTourFocus = null;
let currentFairTourIndex = 0;

function getCookieValue(name) {
  const encodedName = `${encodeURIComponent(name)}=`;
  const cookie = document.cookie.split("; ").find((item) => item.startsWith(encodedName));

  if (!cookie) {
    return "";
  }

  return decodeURIComponent(cookie.slice(encodedName.length));
}

function setCookieValue(name, value, maxAge) {
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function hasCompletedIntro() {
  return getCookieValue(introCompletionCookieName) === "true";
}

function markIntroCompleted() {
  setCookieValue(introCompletionCookieName, "true", introCompletionMaxAge);
}

function hasSeenFairTour() {
  return getCookieValue(fairTourCompletionCookieName) === "true";
}

function markFairTourSeen() {
  setCookieValue(fairTourCompletionCookieName, "true", fairTourCompletionMaxAge);
}

function getCurrentScene() {
  return openingScenes[currentSceneIndex];
}

function updateSceneMeta(scene) {
  speakerName.textContent = scene.speaker;
  nextButton.textContent = scene.buttonLabel || (scene.action === "start" ? "메인 페이지로 이동" : "다음");
  previousButton.disabled = currentSceneIndex === 0;
  setAuthChallengeVisible(false);
  authMessage.textContent = "";
  authHint.classList.add("is-hidden");
  authInput.removeAttribute("aria-invalid");
  openingScreen.dataset.emotion = scene.emotion;
  openingScreen.dataset.action = scene.action;

  if (scene.action === "auth") {
    authInput.value = "";
  }
}

function stopTyping() {
  if (typingTimer) {
    window.clearInterval(typingTimer);
    typingTimer = null;
  }
  isTyping = false;
}

function showFullText() {
  stopTyping();
  visibleText = getCurrentScene().text;
  dialogueText.textContent = visibleText;
  setAuthChallengeVisible(getCurrentScene().action === "auth");
}

function typeSceneText(scene) {
  stopTyping();
  visibleText = "";
  dialogueText.textContent = "";
  isTyping = true;
  setAuthChallengeVisible(false);

  let letterIndex = 0;
  typingTimer = window.setInterval(() => {
    visibleText += scene.text[letterIndex];
    dialogueText.textContent = visibleText;
    letterIndex += 1;

    if (letterIndex >= scene.text.length) {
      stopTyping();
      setAuthChallengeVisible(scene.action === "auth");
    }
  }, typingDelay);
}

function renderScene() {
  const scene = getCurrentScene();
  updateSceneMeta(scene);

  if (scene.action === "auth") {
    stopTyping();
    visibleText = scene.text;
    dialogueText.textContent = scene.text;
    setAuthChallengeVisible(true);
    return;
  }

  typeSceneText(scene);
}

function goToNextScene() {
  const scene = getCurrentScene();

  if (isTyping) {
    showFullText();
    return;
  }

  if (scene.action === "auth" && !isCorrectAnswer()) {
    authMessage.textContent = "아직 정답이 아니에요. 힌트를 보고 다시 떠올려봐.";
    authHint.classList.remove("is-hidden");
    authInput.setAttribute("aria-invalid", "true");
    authInput.focus();
    return;
  }

  if (scene.action === "start") {
    markIntroCompleted();
    showHomeScreen();
    return;
  }

  currentSceneIndex += 1;
  renderScene();
}

function goToPreviousScene() {
  if (currentSceneIndex === 0) {
    return;
  }

  currentSceneIndex -= 1;
  renderScene();
}

function resetOpening() {
  stopTyping();
  currentSceneIndex = 0;
  homeScreen.classList.add("is-hidden");
  openingScreen.classList.remove("is-hidden");
  renderScene();
}

function showHomeScreen() {
  stopTyping();
  openingScreen.classList.add("is-hidden");
  homeScreen.classList.remove("is-hidden");
  setActiveTab("home");
}

function isCorrectAnswer() {
  const answer = authInput.value.trim().normalize("NFKC").toLowerCase();
  return answer === "콜리스" || answer === "callis";
}

function setAuthChallengeVisible(isVisible) {
  authChallenge.classList.toggle("is-hidden", !isVisible);
}

function setActiveTab(tabName) {
  tabButtons.forEach((button) => {
    const isActive = button.dataset.tabTarget === tabName;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  tabPanels.forEach((panel) => {
    const isActive = panel.dataset.tabPanel === tabName;
    panel.classList.toggle("is-active", isActive);
    panel.toggleAttribute("hidden", !isActive);
  });

  if (tabName === "fair") {
    showFairTourIfNeeded();
  } else {
    closeFairTour({ shouldMarkSeen: false, shouldRestoreFocus: false });
  }
}

function openThemeModal() {
  if (!themeModal) {
    return;
  }

  lastThemeModalFocus = document.activeElement;
  themeModal.hidden = false;
  themeModal.classList.remove("is-hidden");
  document.body.classList.add("has-modal-open");
  const closeButton = themeModal.querySelector(".theme-modal-close");

  if (closeButton) {
    closeButton.focus();
  }
}

function closeThemeModal() {
  if (!themeModal) {
    return;
  }

  themeModal.hidden = true;
  themeModal.classList.add("is-hidden");
  document.body.classList.remove("has-modal-open");

  if (lastThemeModalFocus && typeof lastThemeModalFocus.focus === "function") {
    lastThemeModalFocus.focus();
  }
}

function showFairTourIfNeeded() {
  if (!fairTour || hasSeenFairTour()) {
    return;
  }

  openFairTour({ shouldMarkSeen: false });
}

function openFairTour({ shouldMarkSeen = false } = {}) {
  if (!fairTour) {
    return;
  }

  if (shouldMarkSeen) {
    markFairTourSeen();
  }

  lastFairTourFocus = document.activeElement;
  currentFairTourIndex = 0;
  fairTour.hidden = false;
  fairTour.classList.remove("is-hidden");
  document.body.classList.add("has-fair-tour");
  renderFairTourStep();

  if (fairTourNextButton) {
    fairTourNextButton.focus();
  }
}

function closeFairTour({ shouldMarkSeen = true, shouldRestoreFocus = true } = {}) {
  if (!fairTour) {
    return;
  }

  if (shouldMarkSeen) {
    markFairTourSeen();
  }

  fairTour.hidden = true;
  fairTour.classList.add("is-hidden");
  document.body.classList.remove("has-fair-tour");
  clearFairTourTarget();

  if (shouldRestoreFocus && lastFairTourFocus && typeof lastFairTourFocus.focus === "function") {
    lastFairTourFocus.focus();
  }
}

function clearFairTourTarget() {
  document.querySelectorAll(".is-tour-target").forEach((target) => {
    target.classList.remove("is-tour-target");
  });
}

function renderFairTourStep() {
  const step = fairTourSteps[currentFairTourIndex];
  const target = document.querySelector(step.target);
  clearFairTourTarget();

  if (target) {
    target.classList.add("is-tour-target");
    window.setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  }

  if (fairTourStep) {
    fairTourStep.textContent = `${currentFairTourIndex + 1} / ${fairTourSteps.length}`;
  }

  if (fairTourTitle) {
    fairTourTitle.textContent = step.title;
  }

  if (fairTourText) {
    fairTourText.textContent = step.text;
  }

  if (fairTourPrevButton) {
    fairTourPrevButton.disabled = currentFairTourIndex === 0;
  }

  if (fairTourNextButton) {
    const isLastStep = currentFairTourIndex === fairTourSteps.length - 1;
    fairTourNextButton.textContent = ">>";
    fairTourNextButton.setAttribute("aria-label", isLastStep ? "도움말 완료" : "다음 안내");
  }
}

function goToNextFairTourStep() {
  if (currentFairTourIndex >= fairTourSteps.length - 1) {
    closeFairTour();
    return;
  }

  currentFairTourIndex += 1;
  renderFairTourStep();
}

function goToPreviousFairTourStep() {
  if (currentFairTourIndex === 0) {
    return;
  }

  currentFairTourIndex -= 1;
  renderFairTourStep();
}

nextButton.addEventListener("click", goToNextScene);
previousButton.addEventListener("click", goToPreviousScene);
authPreviousButton.addEventListener("click", goToPreviousScene);
backToOpeningButton.addEventListener("click", resetOpening);
if (themeModalOpen) {
  themeModalOpen.addEventListener("click", openThemeModal);
}
if (fairTourReplayButton) {
  fairTourReplayButton.addEventListener("click", () => {
    openFairTour({ shouldMarkSeen: true });
  });
}
themeModalCloseButtons.forEach((button) => {
  button.addEventListener("click", closeThemeModal);
});
fairTourCloseButtons.forEach((button) => {
  button.addEventListener("click", () => closeFairTour());
});
if (fairTourNextButton) {
  fairTourNextButton.addEventListener("click", goToNextFairTourStep);
}
if (fairTourPrevButton) {
  fairTourPrevButton.addEventListener("click", goToPreviousFairTourStep);
}
tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveTab(button.dataset.tabTarget);
  });
});
authForm.addEventListener("submit", (event) => {
  event.preventDefault();
  goToNextScene();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && fairTour && !fairTour.hidden) {
    closeFairTour();
    return;
  }

  if (event.key === "Escape" && themeModal && !themeModal.hidden) {
    closeThemeModal();
    return;
  }

  if (event.target === authInput) {
    return;
  }

  if (event.key === "Enter" || event.key === " ") {
    const isOpeningVisible = !openingScreen.classList.contains("is-hidden");
    if (isOpeningVisible) {
      event.preventDefault();
      goToNextScene();
    }
  }
});

if (hasCompletedIntro()) {
  showHomeScreen();
} else {
  renderScene();
}
