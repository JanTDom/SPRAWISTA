/**
 * Klient Gemini AI — Google Generative Language API (REST, bez SDK).
 * Używa natywnego fetch — zero dodatkowych zależności npm.
 *
 * Model: gemini-2.5-flash — szybki, obsługuje 1M tokenów kontekstu,
 * doskonały do analizy długich tekstów prawnych (całe kodeksy).
 *
 * Klucz: GEMINI_API_KEY w .env.local (nigdy po stronie klienta).
 * Wywołanie wyłącznie z Route Handlerów (server-side).
 */

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta";
const DEFAULT_MODEL = "gemini-2.5-flash";

// ──────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────

interface GeminiContent {
  role: "user" | "model";
  parts: Array<{ text: string }>;
}

interface GeminiRequest {
  contents: GeminiContent[];
  generationConfig?: {
    temperature?: number;
    maxOutputTokens?: number;
    responseMimeType?: string;
  };
  systemInstruction?: { parts: Array<{ text: string }> };
}

interface GeminiResponse {
  candidates: Array<{
    content: { parts: Array<{ text: string }>; role: string };
    finishReason: string;
  }>;
  usageMetadata?: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

// ──────────────────────────────────────────────────────────────────────────
// Core
// ──────────────────────────────────────────────────────────────────────────

function getApiKey(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY nie jest ustawiony w zmiennych środowiskowych");
  return key;
}

async function geminiGenerate(
  prompt: string,
  options: {
    systemPrompt?: string;
    temperature?: number;
    maxTokens?: number;
    model?: string;
    jsonMode?: boolean;
  } = {}
): Promise<string> {
  const {
    systemPrompt,
    temperature = 0.1,
    maxTokens = 4096,
    model = DEFAULT_MODEL,
    jsonMode = false,
  } = options;

  const apiKey = getApiKey();
  const url = `${GEMINI_BASE}/models/${model}:generateContent?key=${apiKey}`;

  const body: GeminiRequest = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature,
      maxOutputTokens: maxTokens,
      ...(jsonMode ? { responseMimeType: "application/json" } : {}),
    },
  };

  if (systemPrompt) {
    body.systemInstruction = { parts: [{ text: systemPrompt }] };
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API ${res.status}: ${errText.slice(0, 300)}`);
  }

  const data: GeminiResponse = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  if (!text) throw new Error("Gemini zwrócił pustą odpowiedź");
  return text;
}

// ──────────────────────────────────────────────────────────────────────────
// System prompt — rola eksperta prawnego
// ──────────────────────────────────────────────────────────────────────────

const LEGAL_SYSTEM_PROMPT = `Jesteś ekspertem prawa polskiego i prawa Unii Europejskiej, wspierającym pracę radców prawnych i adwokatów w polskich kancelariach. Specjalizujesz się w prawie cywilnym, handlowym, pracy, podatkowym i postępowaniu cywilnym.

Zasady Twojej pracy:
1. Odpowiadasz wyłącznie po polsku, używając precyzyjnej terminologii prawnej.
2. Powołujesz się wyłącznie na rzeczywiste, zweryfikowane przepisy — nigdy nie wymyślasz artykułów ani sygnatur orzeczeń.
3. Gdy nie jesteś pewien aktualnego brzmienia przepisu, informujesz o tym wprost.
4. Zawsze wskazujesz podstawę prawną (numer artykułu, ustawa, ELI).
5. Odpowiedzi są zwięzłe i skoncentrowane na praktycznym aspekcie pytania.
6. Nie udzielasz porad prawnych — analizujesz przepisy i pomagasz prawnikom w pracy badawczej.`;

// ──────────────────────────────────────────────────────────────────────────
// Public functions
// ──────────────────────────────────────────────────────────────────────────

/**
 * Wyciąga konkretny artykuł z pełnego tekstu HTML aktu prawnego.
 * Gemini 2.5 Flash obsługuje 1M tokenów — cały kodeks cywilny mieści się w kontekście.
 */
export async function extractArticleFromActHtml(params: {
  htmlText: string;
  articleQuery: string;  // np. "art. 481", "art. 481 § 2", "art. 647"
  actShortName: string;  // np. "KC", "KPC"
}): Promise<{
  articleNumber: string;
  content: string;
  found: boolean;
}> {
  const { htmlText, articleQuery, actShortName } = params;

  // Usuń tagi HTML, zostaw sam tekst
  const plainText = htmlText
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s{3,}/g, "\n\n")
    .trim();

  const prompt = `Z poniższego tekstu aktu prawnego (${actShortName}) wyciągnij treść ${articleQuery}.

Zwróć TYLKO JSON w formacie:
{
  "articleNumber": "art. X",
  "content": "Pełna treść artykułu wraz z paragrafami i punktami",
  "found": true
}

Jeśli artykuł nie istnieje w tekście: { "articleNumber": "${articleQuery}", "content": "", "found": false }

TEKST AKTU:
${plainText.slice(0, 800_000)}`; // Bezpieczny limit

  const raw = await geminiGenerate(prompt, {
    systemPrompt: LEGAL_SYSTEM_PROMPT,
    temperature: 0,
    maxTokens: 2048,
    jsonMode: true,
  });

  try {
    return JSON.parse(raw);
  } catch {
    return { articleNumber: articleQuery, content: raw, found: true };
  }
}

/**
 * Analizuje zapytanie prawne w języku naturalnym i sugeruje:
 * - które artykuły KC/KPC/KP/UTH/KSH przeszukać
 * - jakie słowa kluczowe wpisać w SAOS
 * - jakie dyrektywy UE mogą mieć znaczenie
 */
export async function analyzeLegalQuery(query: string): Promise<{
  interpretation: string;
  suggestedArticles: Array<{ actEli: string; actShortName: string; articles: string[] }>;
  saosKeywords: string[];
  relevantEuCelexIds: string[];
  practicalSummary: string;
}> {
  const prompt = `Przeanalizuj to pytanie prawne i wskaż gdzie szukać odpowiedzi:

PYTANIE: ${query}

Zwróć JSON:
{
  "interpretation": "Co prawnik chce wiedzieć (1-2 zdania)",
  "suggestedArticles": [
    { "actEli": "DU/1964/93", "actShortName": "KC", "articles": ["art. 481", "art. 455"] }
  ],
  "saosKeywords": ["słowa kluczowe do SAOS np. odsetki ustawowe za opóźnienie"],
  "relevantEuCelexIds": ["32011L0007"],
  "practicalSummary": "Krótkie streszczenie stanu prawnego (3-5 zdań)"
}

Możliwe ELI polskich aktów: DU/1964/93 (KC), DU/1964/296 (KPC), DU/1974/141 (KP), DU/2000/1037 (KSH), DU/2013/403 (UTH), DU/2003/535 (PU), DU/1994/414 (PrBud), DU/2004/177 (VATU), DU/1997/926 (OrdPod), DU/1997/88 (KK).`;

  const raw = await geminiGenerate(prompt, {
    systemPrompt: LEGAL_SYSTEM_PROMPT,
    temperature: 0.1,
    maxTokens: 2048,
    jsonMode: true,
  });

  try {
    return JSON.parse(raw);
  } catch {
    return {
      interpretation: query,
      suggestedArticles: [],
      saosKeywords: [query],
      relevantEuCelexIds: [],
      practicalSummary: raw,
    };
  }
}

/**
 * Na podstawie faktów sprawy (MatterFullAggregate) automatycznie
 * proponuje właściwe przepisy i orzeczenia do powołania w piśmie.
 */
export async function suggestLegalProvisions(params: {
  matterDescription: string;  // krótki opis sprawy
  claimType: string;          // "zapłata z umowy", "odszkodowanie" itp.
  contractDate?: string;
  claimAmountPln?: number;
  keyFacts: string[];
}): Promise<{
  primaryProvisions: Array<{
    actShortName: string;
    article: string;
    eli: string;
    reason: string;
  }>;
  proceduralProvisions: Array<{
    actShortName: string;
    article: string;
    eli: string;
    reason: string;
  }>;
  saosSearchSuggestions: string[];
  analysisNote: string;
}> {
  const factsText = params.keyFacts.map((f, i) => `${i + 1}. ${f}`).join("\n");

  const prompt = `Sprawa: ${params.claimType}
${params.contractDate ? `Data umowy: ${params.contractDate}` : ""}
${params.claimAmountPln ? `Kwota roszczenia: ${params.claimAmountPln.toLocaleString("pl-PL")} zł` : ""}

Opis: ${params.matterDescription}

Kluczowe fakty:
${factsText}

Jako ekspert prawa cywilnego i handlowego wskaż przepisy kluczowe dla obrony/roszczenia. Zwróć JSON:
{
  "primaryProvisions": [
    { "actShortName": "KC", "article": "art. 481 § 1", "eli": "DU/1964/93", "reason": "dlaczego ten przepis" }
  ],
  "proceduralProvisions": [
    { "actShortName": "KPC", "article": "art. 493 § 1", "eli": "DU/1964/296", "reason": "dlaczego" }
  ],
  "saosSearchSuggestions": ["frazy do wyszukania w SAOS"],
  "analysisNote": "Ogólna uwaga o stanie prawnym sprawy (2-4 zdania)"
}`;

  const raw = await geminiGenerate(prompt, {
    systemPrompt: LEGAL_SYSTEM_PROMPT,
    temperature: 0.1,
    maxTokens: 3000,
    jsonMode: true,
  });

  try {
    return JSON.parse(raw);
  } catch {
    return {
      primaryProvisions: [],
      proceduralProvisions: [],
      saosSearchSuggestions: [],
      analysisNote: raw,
    };
  }
}

/**
 * Streszcza wyrok SN / wyrok TSUE do jednozdaniowej tezy prawnej.
 * Używane do wyciągania tez z pełnych tekstów orzeczeń SAOS.
 */
export async function summarizeJudgment(params: {
  fullText: string;
  caseNumber: string;
  courtName: string;
}): Promise<{ thesis: string; legalBases: string[]; practicalNote: string }> {
  const prompt = `Wyrok ${params.courtName}, sygn. ${params.caseNumber}.

Tekst orzeczenia (fragment):
${params.fullText.slice(0, 15_000)}

Zwróć JSON:
{
  "thesis": "Jednozdaniowa teza prawna wyroku",
  "legalBases": ["art. X ustawy Y", "art. Z ustawy W"],
  "practicalNote": "Praktyczne znaczenie dla kancelarii (1-2 zdania)"
}`;

  const raw = await geminiGenerate(prompt, {
    systemPrompt: LEGAL_SYSTEM_PROMPT,
    temperature: 0,
    maxTokens: 1024,
    jsonMode: true,
  });

  try {
    return JSON.parse(raw);
  } catch {
    return { thesis: raw.slice(0, 200), legalBases: [], practicalNote: "" };
  }
}

/**
 * Odpowiada na swobodne pytanie prawne — asystent badawczy.
 * Nie jest to porada prawna — to pomoc badawcza dla prawnika.
 */
export async function legalAssistantChat(params: {
  question: string;
  context?: string;  // opcjonalny kontekst (np. fragment aktu który był otwarty)
}): Promise<string> {
  const contextSection = params.context
    ? `\n\nKONTEKST (fragment aktu prawnego):\n${params.context.slice(0, 50_000)}`
    : "";

  const prompt = `${params.question}${contextSection}`;

  return geminiGenerate(prompt, {
    systemPrompt: LEGAL_SYSTEM_PROMPT,
    temperature: 0.2,
    maxTokens: 4096,
  });
}
