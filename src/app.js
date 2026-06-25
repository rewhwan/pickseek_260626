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

const missionOpeningScenes = [
  {
    id: "mission-opening-01",
    speaker: "파이",
    emotion: "happy",
    text: "좋아, 메인 미션이 열렸어요. 지금부터 내가 읽고 싶은 책을 찾는 여정을 함께 안내할게요.",
    action: "next"
  },
  {
    id: "mission-opening-02",
    speaker: "파이",
    emotion: "thinking",
    text: "오늘 고르는 책 한 권이 마지막 페이지를 복구하는 첫 단서가 됩니다.",
    action: "next"
  },
  {
    id: "mission-opening-03",
    speaker: "파이",
    emotion: "happy",
    text: "책장을 천천히 살피고, 마음이 먼저 반응하는 책을 찾아봐요. 준비됐다면 미션을 시작해요.",
    action: "missionStart",
    buttonLabel: "미션 시작"
  }
];

const missionCompletionScenes = [
  {
    id: "mission-complete-01",
    speaker: "파이",
    emotion: "happy",
    text: "모든 미션을 클리어했어요! 축하해요!",
    action: "next"
  },
  {
    id: "mission-complete-02",
    speaker: "파이",
    emotion: "happy",
    text: "오늘 픽식을 통해서 읽고 싶은 책을 찾았기를 바라요.",
    action: "next"
  },
  {
    id: "mission-complete-03",
    speaker: "파이",
    emotion: "normal",
    text: "데릭에게 픽챗 혹은 콜리스를 사용하여 미션을 완료하였다고 알려주세요.",
    action: "next"
  },
  {
    id: "mission-complete-04",
    speaker: "파이",
    emotion: "normal",
    text: "남은 시간동안은 마저 박람회를 둘러보거나 코엑스를 둘러보며 쉬는 시간을 가져보세요.",
    action: "missionComplete",
    buttonLabel: "확인"
  }
];

const typingDelay = 34;
const introCompletionStorageKey = "pickseek_intro_completed";
const fairTourCompletionStorageKey = "pickseek_fair_tour_seen";
const missionStorageKey = "pickseek_mission_state";
const missionUnlockStorageKey = "pickseek_mission_unlocked";
const missionIntroStorageKey = "pickseek_mission_intro_seen";
const missionCompletionStorageKey = "pickseek_mission_completion_seen";
const missionFlowVersion = 7;
const missions = [
  {
    id: "mission-01",
    chapter: "STAGE 01",
    fragment: "ISBN",
    title: "책 등록과 정보 조회",
    place: "서울국제도서전 또는 별마당 도서관",
    time: "약 5분",
    story: "마음에 드는 책을 고르고 구매한 뒤, 책 안의 ISBN 신호를 파이에게 알려주세요.",
    prompt: "별마당 도서관 혹은 도서전에서 마음에 드는 책을 구매한 뒤 ISBN을 입력하세요.",
    hint: "책 뒤표지나 판권면에서 10자리 또는 13자리 ISBN을 찾을 수 있어요. 하이픈은 있어도 괜찮습니다.",
    placeholder: "",
    validator: { type: "isbnLookup" },
    success: "파이가 책 정보 데이터베이스를 조회했어요."
  },
  {
    id: "mission-02",
    chapter: "STAGE 02",
    fragment: "TITLE",
    title: "책 정보 확정",
    place: "현재 위치",
    time: "약 3분",
    story: "조회된 책 정보가 맞는지 확인합니다.",
    prompt: "아래 책 정보가 오늘 구매한 책과 맞으면 확인을 누르세요. 틀리면 다시입력으로 ISBN을 다시 입력합니다.",
    hint: "제목, 저자, 출판사, 출간연도를 실물 책과 비교해 주세요.",
    placeholder: "",
    validator: { type: "bookConfirm" },
    success: "책의 기본 정보가 확정되었습니다. 제목 신호가 저장됐어요."
  },
  {
    id: "mission-03",
    chapter: "STAGE 03",
    fragment: "CALL",
    title: "콜리스 장애 기록",
    place: "현재 위치",
    time: "약 10분",
    story: "콜리스에 문제가 생겼습니다. 파이가 남긴 교환대 기록에서 어긋난 지점을 찾아야 합니다.",
    prompt: "콜리스에 문제가 생겼습니다. 아래 기록을 보고 어디에 문제가 있는지 적어주세요.",
    hint: "전화는 모두 다른 곳에서 왔지만, 문 하나는 두 번 열렸습니다.",
    placeholder: "",
    validator: { type: "switchboardCode" },
    success: "교환대 기록이 해독되었습니다.",
    clueRows: [
      ["제이슨", "070-5235-8001", "3004"],
      ["시몬", "070-5235-8002", "3002"],
      ["맛나", "070-5235-8003", "3003"],
      ["라이언", "070-5235-8004", "3004"],
      ["지미", "070-5235-8005", "3100"],
      ["단테", "070-5235-8006", "3101"],
      ["데릭", "070-5235-8007", "3102"],
      ["바라", "070-5235-8008", "3103"],
      ["크롬", "070-5235-8009", "3005, 3006"]
    ]
  },
  {
    id: "mission-04",
    chapter: "FINAL",
    fragment: "TRACE",
    title: "책의 문패와 시간",
    place: "최종 집결지",
    time: "약 10분",
    story: "처음 등록한 책에는 두 개의 흔적이 남아 있습니다.",
    prompt: "하나는 책을 세상에 내보낸 문패, 다른 하나는 그 책이 처음 시간을 얻은 해입니다. 문패의 글자 수를 먼저 적고, 시간의 마지막 두 조각을 이어 적어주세요.",
    hint: "문패는 이름이고, 시간은 네 자리 숫자로 남아 있습니다.",
    placeholder: "",
    validator: { type: "bookTraceCode" },
    success: "마지막 페이지가 복원되었습니다. 오늘 선택한 책의 흔적이 결말을 열었어요."
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
const homeTabPanel = document.querySelector("#homeTabPanel");
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
const activeMission = document.querySelector("#activeMission");
const missionList = document.querySelector("#missionList");
const missionResetButton = document.querySelector("#missionResetButton");

let currentSceneIndex = 0;
let activeOpeningScenes = openingScenes;
let visibleText = "";
let typingTimer = null;
let isTyping = false;
let lastThemeModalFocus = null;
let lockedThemeModalScrollY = 0;
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

function hasSeenMissionCompletion() {
  return readStorageValue(missionCompletionStorageKey) === "true";
}

function markMissionCompletionSeen() {
  writeStorageValue(missionCompletionStorageKey, "true");
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
    missionFlowVersion,
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

    if (parsedState.missionFlowVersion !== missionFlowVersion) {
      return getDefaultMissionState();
    }

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
  removeStorageValue(missionCompletionStorageKey);
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

function getCompactedLength(value) {
  return normalizeComparableAnswer(value).length;
}

function getFirstCompactedChar(value) {
  return normalizeComparableAnswer(value).slice(0, 1);
}

function getBookTraceCode(bookSignals) {
  const publisherLength = getCompactedLength(bookSignals.publisher);
  const yearTail = String(bookSignals.publishedYear || "").slice(-2);

  return `${publisherLength}${yearTail}`;
}

function getSwitchboardCode() {
  return "3004";
}

function getSwitchboardAnswers() {
  return ["제이슨", "라이언", getSwitchboardCode()];
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

  if (mission.validator.type === "switchboardCode") {
    const expected = getSwitchboardCode();
    const isCorrect = getSwitchboardAnswers()
      .some((answer) => normalizedAnswer === normalizeComparableAnswer(answer));

    if (isCorrect) {
      state.bookSignals.intermediateCode = expected;
    }

    return isCorrect;
  }

  if (mission.validator.type === "bookTraceCode") {
    const expected = getBookTraceCode(state.bookSignals);
    const isCorrect = normalizedAnswer === normalizeComparableAnswer(expected);

    if (isCorrect) {
      state.bookSignals.intermediateCode = expected;
    }

    return isCorrect;
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

  homeTabPanel.classList.remove("is-mission-waiting");
  homeTabPanel.classList.add("is-mission-open");
  missionDashboardTitle.textContent = isAllComplete ? "마지막 페이지 복원 완료" : "잃어버린 책의 결말 복구 중";
  missionLevelText.textContent = String(Math.min(completedCount + 1, missions.length)).padStart(2, "0");
  paiMissionTitle.textContent = isAllComplete ? "픽식 기록 복원이 완료됐어요" : `${currentMission.fragment} 단서를 추적 중이에요`;
  paiMissionText.textContent = isAllComplete
    ? "이 책의 결말은 오늘 여러분이 만든 이야기로 저장됐어요."
    : currentMission.story;

  renderActiveMission(state, isAllComplete);
  renderCurrentMissionCard(currentMission, isAllComplete ? "완료" : "진행 중", isAllComplete ? "모든 미션이 완료됐어요." : currentMission.place);
}

function renderMissionWaiting() {
  homeTabPanel.classList.add("is-mission-waiting");
  homeTabPanel.classList.remove("is-mission-open");
  missionDashboardTitle.textContent = "미션 진행 전";
  missionLevelText.textContent = "--";
  paiMissionTitle.textContent = "미션 준비중";
  paiMissionText.textContent = "아직 미션 진행 전입니다.";
  missionList.innerHTML = "";
  activeMission.innerHTML = "";
}

function renderMissionIntro() {
  homeTabPanel.classList.remove("is-mission-waiting");
  homeTabPanel.classList.add("is-mission-open");
  missionDashboardTitle.textContent = "기록 수집가 모드 활성화";
  missionLevelText.textContent = "00";
  paiMissionTitle.textContent = "파이가 메인 미션을 준비했어요";
  paiMissionText.textContent = "시작 버튼을 누르면 사라진 결말의 조각을 복구하는 첫 미션이 열립니다.";
  renderCurrentMissionCard(missions[0], "준비", "파이 인트로가 끝나면 바로 시작돼요.", "is-current");
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

function renderCurrentMissionCard(mission, stateLabel, description, stateClass = "") {
  missionList.innerHTML = `
    <article class="mission-card ${stateClass}">
      <span>${escapeHtml(mission.chapter)} · ${escapeHtml(stateLabel)}</span>
      <strong>${escapeHtml(mission.title)}</strong>
      <p>${escapeHtml(description)}</p>
    </article>
  `;
}

function renderActiveMission(state, isAllComplete) {
  if (isAllComplete) {
    activeMission.innerHTML = `
      <div class="active-mission-header">
        <span>COMPLETE</span>
        <strong>미션 클리어</strong>
      </div>
      <div class="mission-complete-summary" aria-label="미션 완료 안내">
        <div class="mission-complete-pai">
          <img src="assets/pai-cutout-clean.png" alt="파이" />
          <div>
            <span>파이</span>
            <strong>모든 미션을 클리어했어요! 축하해요!</strong>
            <p>데릭에게 픽챗 혹은 콜리스로 미션 완료를 알려주세요.</p>
          </div>
        </div>
        <div class="mission-next-schedule" aria-label="다음 타임테이블">
          <span>다음 타임테이블</span>
          <strong>15:30 - 16:30</strong>
          <p>카페 모임 및 소감 공유</p>
          <small>국제도서전 관람 후기를 함께 나눠요.</small>
          <small>모이는 장소는 데릭이 알려줄 예정이에요.</small>
        </div>
      </div>
    `;
    return;
  }

  const mission = getCurrentMission(state);
  const isHintVisible = state.revealedHintIds.includes(mission.id);
  const savedAnswer = state.answers[mission.id] || "";
  const successPrefixes = ["좋아", "조각", "ISBN", "책", "출판사", "중간", "마지막"];
  const messageClass = successPrefixes.some((prefix) => state.message.startsWith(prefix)) ? " is-success" : "";
  const missionControl = mission.validator.type === "bookConfirm"
    ? `
      <div class="mission-answer-dock">
        <div class="mission-actions">
          <button class="primary-button" type="button" data-book-confirm>확인</button>
          <button class="ghost-button" type="button" data-book-retry>다시입력</button>
        </div>
      </div>
    `
    : `
      <div class="mission-answer-dock">
        <form class="mission-form" id="missionForm">
          <label for="missionAnswer">정답 입력</label>
          <input id="missionAnswer" name="missionAnswer" type="text" autocomplete="off" placeholder="${escapeAttribute(mission.placeholder)}" value="${escapeAttribute(savedAnswer)}" />
          <div class="mission-actions">
            <button class="ghost-button" type="button" data-mission-hint="${mission.id}">힌트</button>
            <button class="primary-button" type="submit">확인</button>
          </div>
        </form>
      </div>
    `;

  activeMission.innerHTML = `
    <div class="active-mission-header">
      <span>${escapeHtml(mission.chapter)}</span>
      <strong>${escapeHtml(mission.title)}</strong>
    </div>
    <div class="pai-stage-guide" aria-label="파이 미션 가이드">
      <img src="assets/pai-cutout-clean.png" alt="" />
      <div>
        <span>파이 가이드</span>
        <p>${escapeHtml(mission.story)}</p>
      </div>
    </div>
    <p class="active-mission-prompt">${escapeHtml(mission.prompt)}</p>
    ${renderMissionCluePanel(mission)}
    ${renderBookSignalPanel(state, mission)}
    ${missionControl}
    <p class="mission-hint${isHintVisible ? "" : " is-hidden"}" id="missionHint">${escapeHtml(mission.hint)}</p>
    <p class="mission-status${messageClass}" aria-live="assertive">${escapeHtml(state.message)}</p>
  `;
}

function renderMissionCluePanel(mission) {
  if (!Array.isArray(mission.clueRows) || mission.clueRows.length === 0) {
    return "";
  }

  return `
    <div class="mission-clue-panel" aria-label="교환대 기록">
      <table>
        <thead>
          <tr>
            <th scope="col">구분</th>
            <th scope="col">전화번호</th>
            <th scope="col">내선번호</th>
          </tr>
        </thead>
        <tbody>
          ${mission.clueRows
            .map((row) => `
              <tr>
                <th scope="row">${escapeHtml(row[0])}</th>
                <td>${escapeHtml(row[1])}</td>
                <td>${escapeHtml(row[2])}</td>
              </tr>
            `)
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderBookSignalPanel(state, mission) {
  const bookSignals = state.bookSignals;

  if (mission.validator.type !== "bookConfirm" || (!bookSignals.title && !bookSignals.manualRequired)) {
    return "";
  }

  const authorText = bookSignals.authors.length ? bookSignals.authors.join(", ") : "미확정";
  const statusText = bookSignals.manualRequired
    ? "ISBN 조회 결과가 없거나 정보가 부족해요. 다시입력으로 ISBN을 확인해 주세요."
    : "조회된 책 정보입니다.";

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

function confirmFetchedBook() {
  const state = readMissionState();
  const mission = getCurrentMission(state);

  if (mission.validator.type !== "bookConfirm" || !hasRequiredBookSignals(state.bookSignals)) {
    state.message = "확정할 책 정보가 아직 없어요. ISBN을 다시 입력해 주세요.";
    writeMissionState(state);
    renderMissionDashboard();
    return;
  }

  state.bookSignals.confirmed = true;
  state.answers[mission.id] = state.bookSignals.title;
  markMissionComplete(state, mission);
  writeMissionState(state);
  renderMissionDashboard();
}

function retryIsbnLookup() {
  const state = readMissionState();

  state.completedMissionIds = state.completedMissionIds.filter((missionId) => missionId !== "mission-01" && missionId !== "mission-02");
  delete state.answers["mission-01"];
  delete state.answers["mission-02"];
  state.currentMissionIndex = 0;
  state.bookSignals = getDefaultBookSignals();
  state.message = "ISBN을 다시 입력해 주세요.";
  writeMissionState(state);
  renderMissionDashboard();
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
      state.bookSignals = {
        ...getDefaultBookSignals(),
        lookupStatus: "incomplete",
        manualRequired: true,
        isbn: answer,
        isbnDigits,
        isbnLast4: isbnDigits.slice(-4)
      };
      state.message = "책 정보 일부가 비어 있어요. ISBN을 다시 확인해 주세요.";
      writeMissionState(state);
      renderMissionDashboard();
      return;
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
    state.message = "ISBN 조회 결과가 없어요. ISBN을 다시 확인해 주세요.";
    writeMissionState(state);
    renderMissionDashboard();
    return;
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

  state.answers[mission.id] = answer;

  markMissionComplete(state, mission);
  writeMissionState(state);

  if (state.completedMissionIds.length >= missions.length) {
    showMissionCompletionOpening();
    return;
  }

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
  return activeOpeningScenes[currentSceneIndex];
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

  if (scene.action === "missionStart") {
    markIntroCompleted();
    markMissionIntroSeen();
    showHomeScreen();
    return;
  }

  if (scene.action === "missionComplete") {
    markMissionCompletionSeen();
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
  activeOpeningScenes = openingScenes;
  homeScreen.classList.add("is-hidden");
  openingScreen.classList.remove("is-hidden");
  renderScene();
}

function shouldShowMissionOpening() {
  return isMissionUnlocked() && !hasSeenMissionIntro();
}

function shouldShowMissionCompletionOpening() {
  const state = readMissionState();
  return isMissionUnlocked() && state.completedMissionIds.length >= missions.length && !hasSeenMissionCompletion();
}

function showMissionOpening() {
  stopTyping();
  currentSceneIndex = 0;
  activeOpeningScenes = missionOpeningScenes;
  homeScreen.classList.add("is-hidden");
  openingScreen.classList.remove("is-hidden");
  renderScene();
}

function showMissionCompletionOpening() {
  stopTyping();
  currentSceneIndex = 0;
  activeOpeningScenes = missionCompletionScenes;
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
  lockedThemeModalScrollY = window.scrollY || document.documentElement.scrollTop || 0;
  document.documentElement.style.setProperty("--modal-scroll-y", `${lockedThemeModalScrollY}px`);
  themeModal.hidden = false;
  themeModal.classList.remove("is-hidden");
  document.documentElement.classList.add("has-modal-open");
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
  document.documentElement.classList.remove("has-modal-open");
  document.body.classList.remove("has-modal-open");
  document.documentElement.style.removeProperty("--modal-scroll-y");
  window.scrollTo(0, lockedThemeModalScrollY);

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
    const bookConfirmButton = event.target instanceof Element ? event.target.closest("[data-book-confirm]") : null;
    const bookRetryButton = event.target instanceof Element ? event.target.closest("[data-book-retry]") : null;
    const hintButton = event.target instanceof Element ? event.target.closest("[data-mission-hint]") : null;

    if (introStartButton) {
      markMissionIntroSeen();
      renderMissionDashboard();
      return;
    }

    if (bookConfirmButton) {
      confirmFetchedBook();
      return;
    }

    if (bookRetryButton) {
      retryIsbnLookup();
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

unlockMissionFromStartLink();

if (shouldShowMissionOpening()) {
  showMissionOpening();
} else if (shouldShowMissionCompletionOpening()) {
  showMissionCompletionOpening();
} else if (hasCompletedIntro()) {
  showHomeScreen();
} else {
  activeOpeningScenes = openingScenes;
  renderScene();
}
