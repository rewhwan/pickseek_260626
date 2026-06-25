const KAKAO_BOOK_SEARCH_URL = "https://dapi.kakao.com/v3/search/book";
const NAVER_BOOK_SEARCH_URL = "https://openapi.naver.com/v1/search/book.json";

function normalizeIsbn(value) {
  return String(value || "").replace(/\D/g, "");
}

function isValidIsbn(value) {
  const isbn = normalizeIsbn(value);
  return isbn.length === 10 || isbn.length === 13;
}

function stripTags(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

function normalizeList(value) {
  if (Array.isArray(value)) {
    return value.map(stripTags).filter(Boolean);
  }

  return String(value || "")
    .split(/[,|]/)
    .map(stripTags)
    .filter(Boolean);
}

function splitIsbn(value) {
  const candidates = String(value || "")
    .split(/\s+/)
    .map(normalizeIsbn)
    .filter(Boolean);

  return {
    isbn10: candidates.find((candidate) => candidate.length === 10) || "",
    isbn13: candidates.find((candidate) => candidate.length === 13) || ""
  };
}

function normalizeKakaoDate(value) {
  const date = String(value || "").slice(0, 10);
  return {
    publishedDate: date,
    publishedYear: date.slice(0, 4)
  };
}

function normalizeNaverDate(value) {
  const date = String(value || "");

  if (!/^\d{8}$/.test(date)) {
    return {
      publishedDate: "",
      publishedYear: ""
    };
  }

  return {
    publishedDate: `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`,
    publishedYear: date.slice(0, 4)
  };
}

function normalizeKakaoBook(book) {
  const isbn = splitIsbn(book.isbn);
  const date = normalizeKakaoDate(book.datetime);

  return {
    title: stripTags(book.title),
    authors: normalizeList(book.authors),
    translators: normalizeList(book.translators),
    publisher: stripTags(book.publisher),
    publishedDate: date.publishedDate,
    publishedYear: date.publishedYear,
    isbn10: isbn.isbn10,
    isbn13: isbn.isbn13,
    thumbnail: String(book.thumbnail || ""),
    description: stripTags(book.contents),
    pageCount: null,
    sourceUrl: String(book.url || ""),
    source: "kakao"
  };
}

function normalizeNaverBook(book) {
  const isbn = splitIsbn(book.isbn);
  const date = normalizeNaverDate(book.pubdate);

  return {
    title: stripTags(book.title),
    authors: normalizeList(book.author),
    translators: [],
    publisher: stripTags(book.publisher),
    publishedDate: date.publishedDate,
    publishedYear: date.publishedYear,
    isbn10: isbn.isbn10,
    isbn13: isbn.isbn13,
    thumbnail: String(book.image || ""),
    description: stripTags(book.description),
    pageCount: null,
    sourceUrl: String(book.link || ""),
    source: "naver"
  };
}

async function searchKakaoBook(isbn, options) {
  const { env, fetchImpl } = options;

  if (!env.KAKAO_REST_API_KEY) {
    return null;
  }

  const params = new URLSearchParams({
    query: isbn,
    target: "isbn",
    size: "1"
  });
  const response = await fetchImpl(`${KAKAO_BOOK_SEARCH_URL}?${params.toString()}`, {
    headers: {
      Authorization: `KakaoAK ${env.KAKAO_REST_API_KEY}`
    }
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  const book = data.documents && data.documents[0];

  return book ? normalizeKakaoBook(book) : null;
}

async function searchNaverBook(isbn, options) {
  const { env, fetchImpl } = options;

  if (!env.NAVER_CLIENT_ID || !env.NAVER_CLIENT_SECRET) {
    return null;
  }

  const params = new URLSearchParams({
    query: isbn,
    display: "1"
  });
  const response = await fetchImpl(`${NAVER_BOOK_SEARCH_URL}?${params.toString()}`, {
    headers: {
      "X-Naver-Client-Id": env.NAVER_CLIENT_ID,
      "X-Naver-Client-Secret": env.NAVER_CLIENT_SECRET
    }
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  const book = data.items && data.items[0];

  return book ? normalizeNaverBook(book) : null;
}

async function lookupBookByIsbn(rawIsbn, options = {}) {
  const isbn = normalizeIsbn(rawIsbn);

  if (!isValidIsbn(isbn)) {
    return null;
  }

  const lookupOptions = {
    env: options.env || process.env,
    fetchImpl: options.fetchImpl || fetch
  };

  const kakaoBook = await searchKakaoBook(isbn, lookupOptions);

  if (kakaoBook) {
    return kakaoBook;
  }

  return searchNaverBook(isbn, lookupOptions);
}

function sendJson(response, statusCode, payload) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.end(JSON.stringify(payload));
}

async function handler(request, response) {
  response.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (request.method === "OPTIONS") {
    response.statusCode = 204;
    response.end();
    return;
  }

  if (request.method !== "GET") {
    sendJson(response, 405, {
      ok: false,
      error: "METHOD_NOT_ALLOWED",
      message: "GET /api/book?isbn=... 형식으로 호출해 주세요."
    });
    return;
  }

  const url = new URL(request.url, "http://localhost");
  const isbn = normalizeIsbn(url.searchParams.get("isbn"));

  if (!isValidIsbn(isbn)) {
    sendJson(response, 400, {
      ok: false,
      error: "INVALID_ISBN",
      message: "ISBN은 숫자 기준 10자리 또는 13자리여야 합니다."
    });
    return;
  }

  try {
    const book = await lookupBookByIsbn(isbn);

    if (!book) {
      sendJson(response, 200, {
        ok: false,
        error: "BOOK_NOT_FOUND",
        manualRequired: true,
        isbn,
        message: "책 정보를 찾지 못했습니다. ISBN을 다시 확인해 주세요."
      });
      return;
    }

    sendJson(response, 200, {
      ok: true,
      manualRequired: false,
      isbn,
      book
    });
  } catch (error) {
    sendJson(response, 500, {
      ok: false,
      error: "BOOK_LOOKUP_FAILED",
      manualRequired: true,
      isbn,
      message: "책 정보 조회 중 오류가 발생했습니다. 직접 입력으로 진행해 주세요."
    });
  }
}

module.exports = handler;
module.exports.normalizeIsbn = normalizeIsbn;
module.exports.normalizeKakaoBook = normalizeKakaoBook;
module.exports.normalizeNaverBook = normalizeNaverBook;
module.exports.lookupBookByIsbn = lookupBookByIsbn;
