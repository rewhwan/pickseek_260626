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
    text: "좋아, 이제 다시 안내를 이어갈게. 오늘의 픽식 진행장소는 코엑스 서울국제도서전과 별마당 도서관이야.",
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

let currentSceneIndex = 0;
let visibleText = "";
let typingTimer = null;
let isTyping = false;

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
    openingScreen.classList.add("is-hidden");
    homeScreen.classList.remove("is-hidden");
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

function isCorrectAnswer() {
  const answer = authInput.value.trim().normalize("NFKC").toLowerCase();
  return answer === "콜리스" || answer === "callis";
}

function setAuthChallengeVisible(isVisible) {
  authChallenge.classList.toggle("is-hidden", !isVisible);
}

nextButton.addEventListener("click", goToNextScene);
previousButton.addEventListener("click", goToPreviousScene);
authPreviousButton.addEventListener("click", goToPreviousScene);
backToOpeningButton.addEventListener("click", resetOpening);
authForm.addEventListener("submit", (event) => {
  event.preventDefault();
  goToNextScene();
});

window.addEventListener("keydown", (event) => {
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

renderScene();
