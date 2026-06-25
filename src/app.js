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
    fragment: "ISBN",
    title: "책 등록과 정보 조회",
    place: "서울국제도서전 또는 별마당 도서관",
    time: "약 5분",
    story: "당신의 책에서 마지막 페이지 신호를 찾기 위해 ISBN 데이터베이스에 접속합니다.",
    prompt: "오늘 구매한 책의 ISBN을 입력하세요. 조회 결과가 없으면 다음 단계에서 직접 책 정보를 확정할 수 있어요.",
    hint: "책 뒤표지나 판권면에서 10자리 또는 13자리 ISBN을 찾을 수 있어요. 하이픈은 있어도 괜찮습니다.",
    placeholder: "예: 978-89-12345-67-8",
    validator: { type: "isbnLookup" },
    success: "ISBN 신호를 확인했습니다. 파이가 책 정보 데이터베이스를 조회했어요."
  },
  {
    id: "mission-02",
    chapter: "STAGE 02",
    fragment: "TITLE",
    title: "책 정보 확정",
    place: "현재 위치",
    time: "약 3분",
    story: "조회된 책 정보가 맞는지 확인합니다. 마지막 퍼즐은 여기서 확정한 제목을 재료로 사용합니다.",
    prompt: "조회된 책이 맞다면 책 제목을 그대로 입력하세요. 정보가 없거나 다르면 `제목 / 저자 / 출판사 / 출간연도` 형식으로 입력하세요.",
    hint: "예: 미움받을 용기 / 기시미 이치로 / 인플루엔셜 / 2014",
    placeholder: "책 제목 또는 제목 / 저자 / 출판사 / 출간연도",
    validator: { type: "bookConfirm" },
    success: "책의 기본 정보가 확정되었습니다. 제목 신호가 저장됐어요."
  },
  {
    id: "mission-03",
    chapter: "STAGE 03",
    fragment: "PUBLISHER",
    title: "출판사의 문",
    place: "책 표지 또는 판권면",
    time: "약 5분",
    story: "책을 세상에 내보낸 이름이 두 번째 신호입니다.",
    prompt: "확정된 책 정보 또는 실물 책에서 출판사명을 찾아 입력하세요.",
    hint: "공백은 달라도 괜찮아요. 예를 들어 `한빛 미디어`와 `한빛미디어`는 같은 답으로 판단합니다.",
    placeholder: "출판사명",
    validator: { type: "bookMeta", field: "publisher" },
    success: "출판사 신호가 저장되었습니다."
  },
  {
    id: "mission-04",
    chapter: "STAGE 04",
    fragment: "DECODE",
    title: "책 정보 해독",
    place: "현재 위치",
    time: "약 10분",
    story: "책 정보 안에 숨은 숫자를 계산해 중간 암호를 엽니다.",
    prompt: "ISBN 마지막 4자리 숫자 합에 출판사명 글자 수와 출간연도 마지막 두 자리, 첫 저자명 글자 수를 모두 더하세요.",
    hint: "공백을 뺀 출판사명과 첫 저자명을 기준으로 계산합니다. 예: ISBN 끝 1234면 숫자 합은 10입니다.",
    placeholder: "예: 42",
    validator: { type: "derivedPuzzle" },
    success: "중간 암호가 해독되었습니다."
  },
  {
    id: "mission-05",
    chapter: "FINAL",
    fragment: "CODE",
    title: "복구 코드와 마지막 페이지",
    place: "최종 집결지",
    time: "약 10분",
    story: "마지막 페이지는 앞서 입력한 제목, 출판사, 중간 암호가 맞물릴 때 복원됩니다.",
    prompt: "중간 암호, 책 제목의 첫 글자, 출판사명 글자 수를 하이픈으로 이어 입력하세요.",
    hint: "예: 중간 암호가 42, 책 제목이 미움받을 용기, 출판사명이 인플루엔셜이면 `42-미-5`입니다. 공백은 무시됩니다.",
    placeholder: "예: 42-미-5",
    validator: { type: "recoveryCode" },
    success: "마지막 페이지가 복원되었습니다. 오늘 선택한 책의 신호가 결말을 열었어요."
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

  if (searchParams.get("mission") === "derrick9508") {
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

function getDefaultBookSignals() {
  return {
    lookupStatus: "idle",
    lookupSource: "",
    manualRequired: false,
    confirmed: false,
    isbn: "",
    isbnDigits: "",
    isbnLast4: "",
    title: "",
    authors: [],
    translators: [],
    publisher: "",
    publishedDate: "",
    publishedYear: "",
    thumbnail: "",
    description: "",
    sourceUrl: "",
    intermediateCode: ""
  };
}

function getDefaultMissionState() {
  return {
    completedMissionIds: [],
    revealedHintIds: [],
    answers: {},
    currentMissionIndex: 0,
    message: "",
    bookSignals: getDefaultBookSignals()
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
      answers: parsedState.answers && typeof parsedState.answers === "object" ? parsedState.answers : {},
      bookSignals: {
        ...getDefaultBookSignals(),
        ...(parsedState.bookSignals && typeof parsedState.bookSignals === "object" ? parsedState.bookSignals : {}),
        authors: Array.isArray(parsedState.bookSignals && parsedState.bookSignals.authors) ? parsedState.bookSignals.authors : [],
        translators: Array.isArray(parsedState.bookSignals && parsedState.bookSignals.translators) ? parsedState.bookSignals.translators : []
      }
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

function normalizeComparableAnswer(value) {
  return String(value || "").trim().normalize("NFKC").toLowerCase().replace(/\s+/g, "");
}

function normalizeIsbnDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

function isValidIsbnDigits(value) {
  const digits = normalizeIsbnDigits(value);
  return digits.length === 10 || digits.length === 13;
}

function normalizeTextList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item || "").trim()).filter(Boolean);
  }

  return String(value || "")
    .split(/[,|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getBookIsbn(book, fallbackIsbn) {
  return book.isbn13 || book.isbn10 || fallbackIsbn || "";
}

function getYearFromValue(value) {
  const yearMatch = String(value || "").match(/\d{4}/);
  return yearMatch ? yearMatch[0] : "";
}

function createBookSignalsFromBook(book, fallbackIsbn) {
  const isbnDigits = normalizeIsbnDigits(getBookIsbn(book, fallbackIsbn));

  return {
    ...getDefaultBookSignals(),
    lookupStatus: "found",
    lookupSource: book.source || "",
    manualRequired: false,
    isbn: getBookIsbn(book, fallbackIsbn),
    isbnDigits,
    isbnLast4: isbnDigits.slice(-4),
    title: String(book.title || "").trim(),
    authors: normalizeTextList(book.authors),
    translators: normalizeTextList(book.translators),
    publisher: String(book.publisher || "").trim(),
    publishedDate: String(book.publishedDate || "").trim(),
    publishedYear: getYearFromValue(book.publishedYear || book.publishedDate),
    thumbnail: String(book.thumbnail || ""),
    description: String(book.description || ""),
    sourceUrl: String(book.sourceUrl || "")
  };
}

function parseManualBookInput(value, currentSignals) {
  const parts = String(value || "")
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length < 4) {
    return null;
  }

  const [title, authorText, publisher, yearText] = parts;
  const publishedYear = getYearFromValue(yearText);

  if (!title || !publisher || !publishedYear) {
    return null;
  }

  const isbnDigits = currentSignals.isbnDigits || normalizeIsbnDigits(currentSignals.isbn);

  return {
    ...currentSignals,
    lookupStatus: currentSignals.lookupStatus === "found" ? "corrected" : "manual",
    manualRequired: false,
    confirmed: true,
    isbnDigits,
    isbnLast4: isbnDigits.slice(-4),
    title,
    authors: normalizeTextList(authorText),
    publisher,
    publishedYear,
    publishedDate: currentSignals.publishedDate || publishedYear,
    lookupSource: currentSignals.lookupSource || "manual"
  };
}

function getCompactedLength(value) {
  return normalizeComparableAnswer(value).length;
}

function getFirstCompactedChar(value) {
  return normalizeComparableAnswer(value).slice(0, 1);
}

function getPrimaryAuthor(bookSignals) {
  return bookSignals.authors[0] || "";
}

function getDerivedPuzzleAnswer(bookSignals) {
  const isbnDigitSum = String(bookSignals.isbnLast4 || "")
    .split("")
    .reduce((sum, digit) => sum + Number(digit || 0), 0);
  const publisherLength = getCompactedLength(bookSignals.publisher);
  const yearTail = Number(String(bookSignals.publishedYear || "").slice(-2) || 0);
  const authorLength = getCompactedLength(getPrimaryAuthor(bookSignals));

  return String(isbnDigitSum + publisherLength + yearTail + authorLength);
}

function getRecoveryCode(bookSignals) {
  const intermediateCode = bookSignals.intermediateCode || getDerivedPuzzleAnswer(bookSignals);
  const titleSignal = getFirstCompactedChar(bookSignals.title);
  const publisherLength = getCompactedLength(bookSignals.publisher);

  return `${intermediateCode}-${titleSignal}-${publisherLength}`;
}

function hasRequiredBookSignals(bookSignals) {
  return Boolean(bookSignals.title && bookSignals.publisher && bookSignals.publishedYear);
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

async function lookupBookByIsbn(isbnDigits) {
  try {
    const response = await fetch(`/api/book?isbn=${encodeURIComponent(isbnDigits)}`);

    if (!response.ok) {
      return null;
    }

    const payload = await response.json();
    return payload && payload.ok ? payload.book : null;
  } catch (error) {
    return null;
  }
}

function isMissionAnswerCorrect(mission, value, state) {
  const normalizedAnswer = normalizeComparableAnswer(value);

  if (!normalizedAnswer) {
    return false;
  }

  if (mission.validator.type === "isbnLookup") {
    return isValidIsbnDigits(value);
  }

  if (mission.validator.type === "bookConfirm") {
    const manualSignals = parseManualBookInput(value, state.bookSignals);

    if (manualSignals) {
      state.bookSignals = manualSignals;
      return true;
    }

    if (!state.bookSignals.title || !hasRequiredBookSignals(state.bookSignals)) {
      return false;
    }

    if (normalizedAnswer === normalizeComparableAnswer(state.bookSignals.title)) {
      state.bookSignals.confirmed = true;
      return true;
    }

    return false;
  }

  if (mission.validator.type === "bookMeta") {
    const expected = state.bookSignals[mission.validator.field] || "";
    return Boolean(expected) && normalizedAnswer === normalizeComparableAnswer(expected);
  }

  if (mission.validator.type === "derivedPuzzle") {
    const expected = getDerivedPuzzleAnswer(state.bookSignals);
    const isCorrect = normalizedAnswer === normalizeComparableAnswer(expected);

    if (isCorrect) {
      state.bookSignals.intermediateCode = expected;
    }

    return isCorrect;
  }

  if (mission.validator.type === "recoveryCode") {
    return normalizedAnswer === normalizeComparableAnswer(getRecoveryCode(state.bookSignals));
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
  const successPrefixes = ["좋아", "조각", "ISBN", "책", "출판사", "중간", "마지막"];
  const messageClass = successPrefixes.some((prefix) => state.message.startsWith(prefix)) ? " is-success" : "";

  activeMission.innerHTML = `
    <div class="active-mission-header">
      <span>${escapeHtml(mission.chapter)}</span>
      <strong>${escapeHtml(mission.title)}</strong>
    </div>
    <div class="mission-meta" aria-label="현재 미션 정보">
      <span>${escapeHtml(mission.place)}</span>
      <span>${escapeHtml(mission.time)}</span>
    </div>
    ${renderBookSignalPanel(state, mission)}
    <p class="active-mission-story">${escapeHtml(mission.story)}</p>
    <p class="active-mission-prompt">${escapeHtml(mission.prompt)}</p>
    <form class="mission-form" id="missionForm">
      <label for="missionAnswer">정답 입력</label>
      <input id="missionAnswer" name="missionAnswer" type="text" autocomplete="off" placeholder="${escapeAttribute(mission.placeholder)}" value="${escapeAttribute(savedAnswer)}" />
      <div class="mission-actions">
        <button class="ghost-button" type="button" data-mission-hint="${mission.id}">힌트</button>
        <button class="primary-button" type="submit">확인</button>
      </div>
    </form>
    <p class="mission-hint${isHintVisible ? "" : " is-hidden"}" id="missionHint">${escapeHtml(mission.hint)}</p>
    <p class="mission-status${messageClass}" aria-live="assertive">${escapeHtml(state.message)}</p>
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

function renderBookSignalPanel(state, mission) {
  const bookSignals = state.bookSignals;

  if (mission.validator.type === "isbnLookup" || (!bookSignals.title && !bookSignals.manualRequired)) {
    return "";
  }

  const authorText = bookSignals.authors.length ? bookSignals.authors.join(", ") : "미확정";
  const statusText = bookSignals.manualRequired
    ? "ISBN 조회 결과가 없거나 정보가 부족해요. 직접 책 정보를 입력해 주세요."
    : "파이가 현재 저장한 책 정보입니다.";

  return `
    <div class="book-signal-panel" aria-label="저장된 책 정보">
      <span>${escapeHtml(statusText)}</span>
      <dl>
        <div>
          <dt>제목</dt>
          <dd>${escapeHtml(bookSignals.title || "미확정")}</dd>
        </div>
        <div>
          <dt>저자</dt>
          <dd>${escapeHtml(authorText)}</dd>
        </div>
        <div>
          <dt>출판사</dt>
          <dd>${escapeHtml(bookSignals.publisher || "미확정")}</dd>
        </div>
        <div>
          <dt>출간연도</dt>
          <dd>${escapeHtml(bookSignals.publishedYear || "미확정")}</dd>
        </div>
        <div>
          <dt>ISBN 끝 4자리</dt>
          <dd>${escapeHtml(bookSignals.isbnLast4 || "미확정")}</dd>
        </div>
      </dl>
    </div>
  `;
}

function markMissionComplete(state, mission) {
  if (!state.completedMissionIds.includes(mission.id)) {
    state.completedMissionIds.push(mission.id);
  }

  state.currentMissionIndex = Math.min(state.currentMissionIndex + 1, missions.length);
  state.message = mission.success;
}

async function submitIsbnLookupMission(state, mission, answer) {
  const isbnDigits = normalizeIsbnDigits(answer);

  state.answers[mission.id] = answer;

  if (!isValidIsbnDigits(isbnDigits)) {
    state.message = "ISBN은 숫자만 기준으로 10자리 또는 13자리여야 해요.";
    writeMissionState(state);
    renderMissionDashboard();
    return;
  }

  state.bookSignals = {
    ...getDefaultBookSignals(),
    lookupStatus: "loading",
    isbn: answer,
    isbnDigits,
    isbnLast4: isbnDigits.slice(-4)
  };
  state.message = "ISBN 데이터베이스를 조회하고 있어요.";
  writeMissionState(state);
  renderMissionDashboard();

  const book = await lookupBookByIsbn(isbnDigits);

  if (book) {
    state.bookSignals = createBookSignalsFromBook(book, isbnDigits);

    if (!hasRequiredBookSignals(state.bookSignals)) {
      state.bookSignals.manualRequired = true;
      state.message = "책 정보 일부가 비어 있어요. 다음 단계에서 직접 정보를 보완해 주세요.";
    } else {
      state.message = mission.success;
    }
  } else {
    state.bookSignals = {
      ...getDefaultBookSignals(),
      lookupStatus: "not-found",
      manualRequired: true,
      isbn: answer,
      isbnDigits,
      isbnLast4: isbnDigits.slice(-4)
    };
    state.message = "ISBN 조회 결과가 없어요. 다음 단계에서 책 정보를 직접 입력해 주세요.";
  }

  if (!state.completedMissionIds.includes(mission.id)) {
    state.completedMissionIds.push(mission.id);
  }

  state.currentMissionIndex = Math.min(state.currentMissionIndex + 1, missions.length);
  writeMissionState(state);
  renderMissionDashboard();
}

async function submitMissionAnswer(event) {
  event.preventDefault();
  const state = readMissionState();
  const mission = getCurrentMission(state);
  const formData = new FormData(event.target);
  const answer = String(formData.get("missionAnswer") || "");

  if (mission.validator.type === "isbnLookup") {
    await submitIsbnLookupMission(state, mission, answer);
    return;
  }

  if (!isMissionAnswerCorrect(mission, answer, state)) {
    state.message = "아직 신호가 맞지 않아요. 문제 문구와 현장 단서를 다시 확인해줘.";
    writeMissionState(state);
    renderMissionDashboard();
    return;
  }

  if (mission.validator.type === "bookConfirm") {
    state.answers[mission.id] = state.bookSignals.title;
  } else if (mission.validator.type === "bookMeta") {
    state.answers[mission.id] = state.bookSignals[mission.validator.field] || answer;
  } else {
    state.answers[mission.id] = answer;
  }

  markMissionComplete(state, mission);
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
