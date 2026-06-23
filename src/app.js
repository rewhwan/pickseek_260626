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
const introCompletionStorageKey = "pickseek_intro_completed";
const fairTourCompletionStorageKey = "pickseek_fair_tour_seen";
const missionStorageKey = "pickseek_mission_state";
const missionUnlockStorageKey = "pickseek_mission_unlocked";
const missionIntroStorageKey = "pickseek_mission_intro_seen";
const missions = [
  {
    id: "mission-01",
    chapter: "STAGE 01",
    fragment: "등록",
    title: "책 등록",
    place: "서울국제도서전 또는 별마당 도서관",
    time: "약 5분",
    story: "당신의 책은 정상적으로 등록되었습니다. 하지만 데이터베이스에서 이상 현상이 발견되었습니다.",
    prompt: "오늘 구매한 책의 ISBN을 입력해 첫 번째 기록을 열어주세요.",
    hint: "책 뒤표지나 판권면에서 10자리 또는 13자리 ISBN을 찾을 수 있어요. 하이픈은 있어도 괜찮아요.",
    placeholder: "예: 978-89-12345-67-8",
    validator: { type: "isbn" },
    success: "등록 완료. 사라진 결말의 조각 3개를 찾는 기록 수집가 모드가 시작됐어요."
  },
  {
    id: "mission-02",
    chapter: "STAGE 02",
    fragment: "조각 #1",
    title: "출판인의 흔적",
    place: "국제도서전 출판사 부스",
    time: "약 15분",
    story: "결말을 만든 사람들은 자신들의 흔적을 남겨두었습니다. 첫 번째 조각은 당신의 책을 세상에 내놓은 곳에 있습니다.",
    prompt: "책의 출판사명을 확인하고, 현장에서 부스나 관련 단서를 찾은 뒤 출판사명을 입력하세요.",
    hint: "책 표지, 판권면, 온라인 ISBN 검색 결과에서 출판사명을 확인해요. 부스가 없다면 같은 출판사의 다른 책이나 로고를 찾아도 좋아요.",
    placeholder: "예: 한빛미디어",
    validator: { type: "publisher" },
    success: "조각 #1 획득. 이야기는 누군가의 손에서 시작된다."
  },
  {
    id: "mission-03",
    chapter: "STAGE 03",
    fragment: "조각 #2",
    title: "기억의 서고",
    place: "별마당 도서관",
    time: "약 20분",
    story: "책은 태어난 뒤 수많은 사람들의 기억 속을 여행합니다. 두 번째 조각은 책들이 잠시 쉬어가는 거대한 서고에 숨겨져 있습니다.",
    prompt: "별마당 도서관 지정 포인트에서 QR 단서를 찾고, 표시된 문장을 입력하세요.",
    hint: "1층 중앙, 2층 난간, 포토존처럼 사람들이 이야기를 남기는 지점을 먼저 확인해보세요.",
    placeholder: "QR에 표시된 문장",
    validator: { type: "phrase", value: "이야기는 읽히는 순간 살아난다" },
    success: "조각 #2 획득. 이야기는 읽히는 순간 살아난다."
  },
  {
    id: "mission-04",
    chapter: "STAGE 04",
    fragment: "조각 #3",
    title: "사라진 결말",
    place: "별마당 중앙 집결지",
    time: "약 10분",
    story: "첫 번째 조각은 시작, 두 번째 조각은 기억. 이제 마지막 조각만 남았습니다. 결말은 가장 많은 이야기가 모이는 곳에 숨겨져 있습니다.",
    prompt: "앞선 단서가 가리키는 최종 장소를 입력하세요.",
    hint: "힌트는 `별 + 이야기`예요. 오늘 가장 많은 이야기가 모이는 별마당의 중심을 떠올려보세요.",
    placeholder: "최종 장소",
    validator: { type: "location" },
    success: "조각 #3 획득. 마지막 페이지 복원 좌표가 열렸어요."
  },
  {
    id: "mission-05",
    chapter: "FINAL",
    fragment: "복원",
    title: "마지막 페이지 복원",
    place: "최종 집결지",
    time: "약 5분",
    story: "당신은 잃어버린 책의 마지막 페이지 앞에 도착했습니다.",
    prompt: "마지막 페이지의 결론을 입력하세요.",
    hint: "이 책의 결말은 사실 존재하지 않았습니다. 결말은 오늘 여러분이 만든 이야기입니다.",
    placeholder: "마지막 문장",
    validator: { type: "final" },
    success: "축하합니다. 당신은 잃어버린 책의 마지막 페이지를 복원했습니다."
  }
];
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
const missionDashboardTitle = document.querySelector("#missionDashboardTitle");
const missionLevelText = document.querySelector("#missionLevelText");
const paiMissionTitle = document.querySelector("#paiMissionTitle");
const paiMissionText = document.querySelector("#paiMissionText");
const missionProgressText = document.querySelector("#missionProgressText");
const missionProgressBar = document.querySelector("#missionProgressBar");
const activeMission = document.querySelector("#activeMission");
const missionList = document.querySelector("#missionList");
const missionResetButton = document.querySelector("#missionResetButton");

let currentSceneIndex = 0;
let visibleText = "";
let typingTimer = null;
let isTyping = false;
let lastThemeModalFocus = null;
let lastFairTourFocus = null;
let currentFairTourIndex = 0;

function readStorageValue(key) {
  try {
    return window.localStorage.getItem(key) || "";
  } catch (error) {
    return "";
  }
}

function writeStorageValue(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    // Keep the guide usable even when storage is blocked.
  }
}

function removeStorageValue(key) {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    // Keep reset actions non-fatal in restricted browsers.
  }
}

function hasCompletedIntro() {
  return readStorageValue(introCompletionStorageKey) === "true";
}

function markIntroCompleted() {
  writeStorageValue(introCompletionStorageKey, "true");
}

function hasSeenFairTour() {
  return readStorageValue(fairTourCompletionStorageKey) === "true";
}

function markFairTourSeen() {
  writeStorageValue(fairTourCompletionStorageKey, "true");
}

function unlockMissionFromStartLink() {
  const searchParams = new URLSearchParams(window.location.search);

  if (searchParams.get("mission") === "open") {
    writeStorageValue(missionUnlockStorageKey, "true");
    removeStorageValue(missionIntroStorageKey);
  }
}

function isMissionUnlocked() {
  return readStorageValue(missionUnlockStorageKey) === "true";
}

function hasSeenMissionIntro() {
  return readStorageValue(missionIntroStorageKey) === "true";
}

function markMissionIntroSeen() {
  writeStorageValue(missionIntroStorageKey, "true");
}

function getDefaultMissionState() {
  return {
    completedMissionIds: [],
    revealedHintIds: [],
    answers: {},
    currentMissionIndex: 0,
    message: ""
  };
}

function readMissionState() {
  const rawState = readStorageValue(missionStorageKey);

  if (!rawState) {
    return getDefaultMissionState();
  }

  try {
    const parsedState = JSON.parse(rawState);
    return {
      ...getDefaultMissionState(),
      ...parsedState,
      completedMissionIds: Array.isArray(parsedState.completedMissionIds) ? parsedState.completedMissionIds : [],
      revealedHintIds: Array.isArray(parsedState.revealedHintIds) ? parsedState.revealedHintIds : [],
      answers: parsedState.answers && typeof parsedState.answers === "object" ? parsedState.answers : {}
    };
  } catch (error) {
    return getDefaultMissionState();
  }
}

function writeMissionState(state) {
  writeStorageValue(missionStorageKey, JSON.stringify(state));
}

function resetMissionState() {
  removeStorageValue(missionStorageKey);
  removeStorageValue(missionUnlockStorageKey);
  removeStorageValue(missionIntroStorageKey);
  renderMissionDashboard();
}

function normalizeAnswer(value) {
  return value.trim().normalize("NFKC").toLowerCase().replace(/\s+/g, "");
}

function isMissionAnswerCorrect(mission, value) {
  const normalizedAnswer = normalizeAnswer(value);

  if (!normalizedAnswer) {
    return false;
  }

  if (mission.validator.type === "isbn") {
    const digits = value.replace(/\D/g, "");
    return digits.length === 10 || digits.length === 13;
  }

  if (mission.validator.type === "publisher") {
    return value.trim().normalize("NFKC").length >= 2;
  }

  if (mission.validator.type === "phrase") {
    return normalizedAnswer === normalizeAnswer(mission.validator.value);
  }

  if (mission.validator.type === "location") {
    return normalizedAnswer.includes("별마당") && (normalizedAnswer.includes("중앙") || normalizedAnswer.includes("집결"));
  }

  if (mission.validator.type === "final") {
    return normalizedAnswer.includes("결말") && normalizedAnswer.includes("오늘") && normalizedAnswer.includes("이야기");
  }

  return false;
}

function getCurrentMission(state) {
  return missions[Math.min(state.currentMissionIndex, missions.length - 1)];
}

function renderMissionDashboard() {
  if (!activeMission || !missionList) {
    return;
  }

  if (!isMissionUnlocked()) {
    renderMissionWaiting();
    return;
  }

  if (!hasSeenMissionIntro()) {
    renderMissionIntro();
    return;
  }

  const state = readMissionState();
  const completedCount = state.completedMissionIds.length;
  const isAllComplete = completedCount >= missions.length;
  const currentMission = getCurrentMission(state);
  const progressPercent = Math.round((completedCount / missions.length) * 100);

  missionDashboardTitle.textContent = isAllComplete ? "마지막 페이지 복원 완료" : "잃어버린 책의 결말 복구 중";
  missionLevelText.textContent = String(Math.min(completedCount + 1, missions.length)).padStart(2, "0");
  paiMissionTitle.textContent = isAllComplete ? "픽식 기록 복원이 완료됐어요" : `${currentMission.fragment} 단서를 추적 중이에요`;
  paiMissionText.textContent = isAllComplete
    ? "이 책의 결말은 오늘 여러분이 만든 이야기로 저장됐어요."
    : currentMission.story;
  missionProgressText.textContent = `${completedCount} / ${missions.length}`;
  missionProgressBar.style.width = `${progressPercent}%`;

  renderActiveMission(state, isAllComplete);
  renderMissionList(state);
}

function renderMissionWaiting() {
  missionDashboardTitle.textContent = "미션 오픈 대기 중";
  missionLevelText.textContent = "--";
  paiMissionTitle.textContent = "아직 기록 수집가 모드가 잠겨 있어요";
  paiMissionText.textContent = "13:30 프로그램 시작 때 파이가 메인 미션을 열어줄게요.";
  missionProgressText.textContent = "대기 중";
  missionProgressBar.style.width = "0%";
  missionList.innerHTML = missions
    .map((mission) => `
      <article class="mission-card is-locked">
        <span>${mission.chapter} · 대기</span>
        <strong>${mission.title}</strong>
        <p>프로그램 시작 후 확인할 수 있어요.</p>
      </article>
    `)
    .join("");
  activeMission.innerHTML = `
    <div class="mission-waiting">
      <span>STANDBY</span>
      <strong>미션이 열리길 대기 중이에요</strong>
      <p>점심 이후 13:30에 파이가 기록 수집가 모드를 열어줄 예정입니다.</p>
      <p class="mission-status is-muted">지금은 일정과 박람회 정보를 먼저 확인해 주세요.</p>
    </div>
  `;
}

function renderMissionIntro() {
  missionDashboardTitle.textContent = "기록 수집가 모드 활성화";
  missionLevelText.textContent = "00";
  paiMissionTitle.textContent = "파이가 메인 미션을 준비했어요";
  paiMissionText.textContent = "시작 버튼을 누르면 사라진 결말의 조각을 복구하는 첫 미션이 열립니다.";
  missionProgressText.textContent = "준비 완료";
  missionProgressBar.style.width = "0%";
  missionList.innerHTML = missions
    .map((mission, index) => `
      <article class="mission-card ${index === 0 ? "is-current" : "is-locked"}">
        <span>${mission.chapter} · ${index === 0 ? "준비" : "잠김"}</span>
        <strong>${mission.title}</strong>
        <p>${index === 0 ? "파이 인트로가 끝나면 바로 시작돼요." : "앞 단계 완료 후 열립니다."}</p>
      </article>
    `)
    .join("");
  activeMission.innerHTML = `
    <div class="mission-intro">
      <div class="mission-intro-copy">
        <span>PAI TRANSMISSION</span>
        <strong>기록 수집가 모드가 열렸어요</strong>
        <p>당신의 책에서 이상 현상이 발견됐어요. 데이터베이스에 마지막 페이지가 비어 있습니다.</p>
        <p>사라진 결말의 조각을 복구해줘. 첫 번째 단서는 오늘 선택한 책 안에 있어요.</p>
      </div>
      <button class="primary-button" type="button" data-mission-intro-start>미션 시작</button>
    </div>
  `;
}

function renderActiveMission(state, isAllComplete) {
  if (isAllComplete) {
    activeMission.innerHTML = `
      <div class="active-mission-header">
        <span>COMPLETE</span>
        <strong>잃어버린 책의 마지막 페이지</strong>
      </div>
      <p class="active-mission-story">축하합니다. 당신은 잃어버린 책의 마지막 페이지를 복원했습니다. 이 책의 결말은 사실 존재하지 않았습니다. 결말은 오늘 여러분이 만든 이야기입니다.</p>
      <p class="mission-status is-success">모든 미션이 완료됐어요. 최종 집결지에서 함께 기록을 나눠요.</p>
    `;
    return;
  }

  const mission = getCurrentMission(state);
  const isHintVisible = state.revealedHintIds.includes(mission.id);
  const savedAnswer = state.answers[mission.id] || "";
  const messageClass = state.message.startsWith("좋아") || state.message.startsWith("조각") ? " is-success" : "";

  activeMission.innerHTML = `
    <div class="active-mission-header">
      <span>${mission.chapter}</span>
      <strong>${mission.title}</strong>
    </div>
    <div class="mission-meta" aria-label="현재 미션 정보">
      <span>${mission.place}</span>
      <span>${mission.time}</span>
    </div>
    <p class="active-mission-story">${mission.story}</p>
    <p class="active-mission-prompt">${mission.prompt}</p>
    <form class="mission-form" id="missionForm">
      <label for="missionAnswer">정답 입력</label>
      <input id="missionAnswer" name="missionAnswer" type="text" autocomplete="off" placeholder="${mission.placeholder}" value="${savedAnswer}" />
      <div class="mission-actions">
        <button class="ghost-button" type="button" data-mission-hint="${mission.id}">힌트</button>
        <button class="primary-button" type="submit">확인</button>
      </div>
    </form>
    <p class="mission-hint${isHintVisible ? "" : " is-hidden"}" id="missionHint">${mission.hint}</p>
    <p class="mission-status${messageClass}" aria-live="assertive">${state.message}</p>
  `;
}

function renderMissionList(state) {
  missionList.innerHTML = missions
    .map((mission, index) => {
      const isComplete = state.completedMissionIds.includes(mission.id);
      const isCurrent = index === state.currentMissionIndex && !isComplete;
      const isLocked = index > state.currentMissionIndex;
      const stateLabel = isComplete ? "완료" : isCurrent ? "진행 중" : "잠김";

      return `
        <article class="mission-card ${isComplete ? "is-complete" : ""} ${isCurrent ? "is-current" : ""} ${isLocked ? "is-locked" : ""}">
          <span>${mission.chapter} · ${stateLabel}</span>
          <strong>${mission.title}</strong>
          <p>${mission.place}</p>
        </article>
      `;
    })
    .join("");
}

function submitMissionAnswer(event) {
  event.preventDefault();
  const state = readMissionState();
  const mission = getCurrentMission(state);
  const formData = new FormData(event.target);
  const answer = String(formData.get("missionAnswer") || "");

  state.answers[mission.id] = answer;

  if (!isMissionAnswerCorrect(mission, answer)) {
    state.message = "아직 신호가 맞지 않아요. 문제 문구와 현장 단서를 다시 확인해줘.";
    writeMissionState(state);
    renderMissionDashboard();
    return;
  }

  if (!state.completedMissionIds.includes(mission.id)) {
    state.completedMissionIds.push(mission.id);
  }

  state.currentMissionIndex = Math.min(state.currentMissionIndex + 1, missions.length);
  state.message = mission.success;
  writeMissionState(state);
  renderMissionDashboard();
}

function revealMissionHint(missionId) {
  const state = readMissionState();

  if (!state.revealedHintIds.includes(missionId)) {
    state.revealedHintIds.push(missionId);
  }

  state.message = "힌트를 열었어요. 현장에서 보이는 단서부터 차근차근 확인해봐.";
  writeMissionState(state);
  renderMissionDashboard();
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
  renderMissionDashboard();
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
if (activeMission) {
  activeMission.addEventListener("submit", (event) => {
    if (event.target && event.target.id === "missionForm") {
      submitMissionAnswer(event);
    }
  });

  activeMission.addEventListener("click", (event) => {
    const introStartButton = event.target instanceof Element ? event.target.closest("[data-mission-intro-start]") : null;
    const hintButton = event.target instanceof Element ? event.target.closest("[data-mission-hint]") : null;

    if (introStartButton) {
      markMissionIntroSeen();
      renderMissionDashboard();
      return;
    }

    if (hintButton) {
      revealMissionHint(hintButton.dataset.missionHint);
    }
  });
}
if (missionResetButton) {
  missionResetButton.addEventListener("click", () => {
    const shouldReset = window.confirm("미션 진행 상태를 초기화할까요?");

    if (shouldReset) {
      resetMissionState();
    }
  });
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
  unlockMissionFromStartLink();
  showHomeScreen();
} else {
  unlockMissionFromStartLink();
  renderScene();
}
