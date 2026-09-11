/**
 * Katalog wszystkich aktów prawnych dostępnych przez ISAP ELI API.
 * Nie przechowuje tekstów — tylko identyfikatory.
 * Pełne teksty pobierane są na żywo przez IsapClient.
 * ELI zweryfikowane live 12.09.2026.
 */
import type { StatuteCatalogEntry } from "./statute-types";

export const STATUTE_CATALOG: StatuteCatalogEntry[] = [
  // ──────────────────────────────────────────────────────────
  // PRAWO CYWILNE I PROCESOWE
  // ──────────────────────────────────────────────────────────
  {
    eli: "DU/1964/93",
    displayAddress: "Dz.U. 1964 nr 16 poz. 93",
    title: "Ustawa z dnia 23 kwietnia 1964 r. — Kodeks cywilny",
    shortName: "KC",
    description: "Podstawowy akt prawa cywilnego: zobowiązania, umowy, odszkodowania, przedawnienie, prawo rzeczowe, spadki.",
    legalAreas: ["ZOBOWIAZANIA_CYWILNE", "PRAWO_GOSPODARCZE"],
    relatedEuCelexIds: ["32000L0031", "32020L1828"],
    latestConsolidatedEli: "DU/2026/795",
    lastKnownChangeDate: "2026-06-25",
  },
  {
    eli: "DU/1964/296",
    displayAddress: "Dz.U. 1964 nr 43 poz. 296",
    title: "Ustawa z dnia 17 listopada 1964 r. — Kodeks postępowania cywilnego",
    shortName: "KPC",
    description: "Procedura cywilna: pozew, dowody, postępowanie nakazowe i upominawcze, wyrok, egzekucja.",
    legalAreas: ["PRAWO_PROCESOWE"],
    relatedEuCelexIds: ["32012R1215"],
    latestConsolidatedEli: null,
    lastKnownChangeDate: null,
  },
  {
    eli: "DU/1964/59",
    displayAddress: "Dz.U. 1964 nr 9 poz. 59",
    title: "Ustawa z dnia 25 lutego 1964 r. — Kodeks rodzinny i opiekuńczy",
    shortName: "KRO",
    description: "Małżeństwo, stosunki majątkowe, władza rodzicielska, alimenty, przysposobienie.",
    legalAreas: ["PRAWO_RODZINNE"],
    relatedEuCelexIds: [],
    latestConsolidatedEli: null,
    lastKnownChangeDate: null,
  },
  // ──────────────────────────────────────────────────────────
  // PRAWO HANDLOWE / GOSPODARCZE
  // ──────────────────────────────────────────────────────────
  {
    eli: "DU/2000/1037",
    displayAddress: "Dz.U. 2000 nr 94 poz. 1037",
    title: "Ustawa z dnia 15 września 2000 r. — Kodeks spółek handlowych",
    shortName: "KSH",
    description: "Spółki osobowe i kapitałowe, reprezentacja, zarząd, prokura, odpowiedzialność członków zarządu.",
    legalAreas: ["PRAWO_GOSPODARCZE"],
    relatedEuCelexIds: ["32017L1132"],
    latestConsolidatedEli: null,
    lastKnownChangeDate: null,
  },
  {
    eli: "DU/2013/403",
    displayAddress: "Dz.U. 2013 poz. 403",
    title: "Ustawa z dnia 8 marca 2013 r. o przeciwdziałaniu nadmiernym opóźnieniom w transakcjach handlowych",
    shortName: "UTH",
    description: "Terminy zapłaty B2B i B2G, odsetki ustawowe za opóźnienie, rekompensata 40/70/100 EUR, zatory płatnicze.",
    legalAreas: ["PRAWO_GOSPODARCZE", "ZOBOWIAZANIA_CYWILNE"],
    relatedEuCelexIds: ["32011L0007"],
    latestConsolidatedEli: "DU/2023/1790",
    lastKnownChangeDate: "2026-06-26",
  },
  {
    eli: "DU/1993/211",
    displayAddress: "Dz.U. 1993 nr 47 poz. 211",
    title: "Ustawa z dnia 16 kwietnia 1993 r. o zwalczaniu nieuczciwej konkurencji",
    shortName: "ZNK",
    description: "Czyny nieuczciwej konkurencji: kopiowanie produktów, wprowadzanie w błąd, tajemnica przedsiębiorstwa, reklama.",
    legalAreas: ["OCHRONA_KONKURENCJI", "PRAWO_GOSPODARCZE"],
    relatedEuCelexIds: ["32016L0943"],
    latestConsolidatedEli: null,
    lastKnownChangeDate: null,
  },
  {
    eli: "DU/2007/1095",
    displayAddress: "Dz.U. 2007 nr 50 poz. 331",
    title: "Ustawa z dnia 16 lutego 2007 r. o ochronie konkurencji i konsumentów",
    shortName: "UOKIK",
    description: "Praktyki ograniczające konkurencję, nadużycie pozycji dominującej, koncentracje, ochrona konsumentów.",
    legalAreas: ["OCHRONA_KONKURENCJI"],
    relatedEuCelexIds: ["32003R0001", "32004R0139"],
    latestConsolidatedEli: null,
    lastKnownChangeDate: null,
  },
  {
    eli: "DU/1997/1118",
    displayAddress: "Dz.U. 1997 nr 133 poz. 882",
    title: "Ustawa z dnia 29 sierpnia 1997 r. — Prawo bankowe",
    shortName: "PrBank",
    description: "Działalność banków, umowa kredytu, tajemnica bankowa, zabezpieczenia bankowe, nadzór KNF.",
    legalAreas: ["PRAWO_BANKOWE"],
    relatedEuCelexIds: ["32013L0036"],
    latestConsolidatedEli: null,
    lastKnownChangeDate: null,
  },
  {
    eli: "DU/2011/1507",
    displayAddress: "Dz.U. 2011 nr 199 poz. 1175",
    title: "Ustawa z dnia 19 sierpnia 2011 r. o usługach płatniczych",
    shortName: "USP",
    description: "Instytucje płatnicze, rachunki płatnicze, transakcje, odpowiedzialność za nieautoryzowane operacje.",
    legalAreas: ["PRAWO_BANKOWE"],
    relatedEuCelexIds: ["32015L2366"],
    latestConsolidatedEli: null,
    lastKnownChangeDate: null,
  },
  // ──────────────────────────────────────────────────────────
  // PRAWO PRACY
  // ──────────────────────────────────────────────────────────
  {
    eli: "DU/1974/141",
    displayAddress: "Dz.U. 1974 nr 24 poz. 141",
    title: "Ustawa z dnia 26 czerwca 1974 r. — Kodeks pracy",
    shortName: "KP",
    description: "Stosunek pracy, wynagrodzenia, czas pracy, urlopy, rozwiązanie umowy, odpowiedzialność, dyskryminacja, BHP.",
    legalAreas: ["PRAWO_PRACY"],
    relatedEuCelexIds: ["32019L1152", "31992L0085", "32000L0078"],
    latestConsolidatedEli: "DU/2025/277",
    lastKnownChangeDate: "2026-08-18",
  },
  {
    eli: "DU/2002/1679",
    displayAddress: "Dz.U. 2002 nr 200 poz. 1679",
    title: "Ustawa z dnia 10 października 2002 r. o minimalnym wynagrodzeniu za pracę",
    shortName: "UMW",
    description: "Minimalne wynagrodzenie za pracę i minimalna stawka godzinowa — mechanizm corocznej waloryzacji.",
    legalAreas: ["PRAWO_PRACY"],
    relatedEuCelexIds: ["32022L2041"],
    latestConsolidatedEli: null,
    lastKnownChangeDate: null,
  },
  {
    eli: "DU/1998/1118",
    displayAddress: "Dz.U. 1998 nr 137 poz. 887",
    title: "Ustawa z dnia 13 października 1998 r. o systemie ubezpieczeń społecznych",
    shortName: "USU",
    description: "ZUS, składki ubezpieczeniowe, podstawy wymiaru, egzekucja należności, odpowiedzialność.",
    legalAreas: ["PRAWO_PRACY"],
    relatedEuCelexIds: [],
    latestConsolidatedEli: null,
    lastKnownChangeDate: null,
  },
  // ──────────────────────────────────────────────────────────
  // PRAWO UPADŁOŚCIOWE I RESTRUKTURYZACYJNE
  // ──────────────────────────────────────────────────────────
  {
    eli: "DU/2003/535",
    displayAddress: "Dz.U. 2003 nr 60 poz. 535",
    title: "Ustawa z dnia 28 lutego 2003 r. — Prawo upadłościowe",
    shortName: "PU",
    description: "Ogłoszenie upadłości, masa upadłości, wierzytelności, plan spłaty, upadłość konsumencka.",
    legalAreas: ["PRAWO_UPADLOSCIOWE"],
    relatedEuCelexIds: ["32015R0848"],
    latestConsolidatedEli: null,
    lastKnownChangeDate: null,
  },
  {
    eli: "DU/2015/978",
    displayAddress: "Dz.U. 2015 poz. 978",
    title: "Ustawa z dnia 15 maja 2015 r. — Prawo restrukturyzacyjne",
    shortName: "PR",
    description: "Postępowania restrukturyzacyjne: układowe, sanacyjne, zatwierdzenie układu. Alternatywa dla upadłości.",
    legalAreas: ["PRAWO_UPADLOSCIOWE"],
    relatedEuCelexIds: ["32019L1023"],
    latestConsolidatedEli: null,
    lastKnownChangeDate: null,
  },
  // ──────────────────────────────────────────────────────────
  // PRAWO BUDOWLANE I NIERUCHOMOŚCI
  // ──────────────────────────────────────────────────────────
  {
    eli: "DU/1994/414",
    displayAddress: "Dz.U. 1994 nr 89 poz. 414",
    title: "Ustawa z dnia 7 lipca 1994 r. — Prawo budowlane",
    shortName: "PrBud",
    description: "Pozwolenia budowlane, samowola budowlana, odbiory, odpowiedzialność uczestników procesu budowlanego.",
    legalAreas: ["PRAWO_BUDOWLANE"],
    relatedEuCelexIds: [],
    latestConsolidatedEli: null,
    lastKnownChangeDate: null,
  },
  {
    eli: "DU/1997/741",
    displayAddress: "Dz.U. 1997 nr 115 poz. 741",
    title: "Ustawa z dnia 21 sierpnia 1997 r. o gospodarce nieruchomościami",
    shortName: "UGN",
    description: "Wycena nieruchomości, obrót nieruchomościami publicznymi, wywłaszczenie, użytkowanie wieczyste.",
    legalAreas: ["PRAWO_NIERUCHOMOSCI"],
    relatedEuCelexIds: [],
    latestConsolidatedEli: null,
    lastKnownChangeDate: null,
  },
  {
    eli: "DU/2021/1177",
    displayAddress: "Dz.U. 2021 poz. 1177",
    title: "Ustawa z dnia 20 maja 2021 r. o ochronie praw nabywcy lokalu mieszkalnego lub domu jednorodzinnego oraz Deweloperskim Funduszu Gwarancyjnym",
    shortName: "UstDeweloper",
    description: "Umowy deweloperskie, rachunek powierniczy, DFG, prawa nabywców lokali.",
    legalAreas: ["PRAWO_NIERUCHOMOSCI", "ZOBOWIAZANIA_CYWILNE"],
    relatedEuCelexIds: [],
    latestConsolidatedEli: null,
    lastKnownChangeDate: null,
  },
  // ──────────────────────────────────────────────────────────
  // PRAWO PODATKOWE
  // ──────────────────────────────────────────────────────────
  {
    eli: "DU/1992/74",
    displayAddress: "Dz.U. 1992 nr 21 poz. 86",
    title: "Ustawa z dnia 15 lutego 1992 r. o podatku dochodowym od osób prawnych",
    shortName: "CIT",
    description: "Podatek dochodowy od osób prawnych, koszty uzyskania przychodu, ceny transferowe, WHT.",
    legalAreas: ["PRAWO_PODATKOWE"],
    relatedEuCelexIds: ["32016L1164", "32017L0952"],
    latestConsolidatedEli: null,
    lastKnownChangeDate: null,
  },
  {
    eli: "DU/1991/350",
    displayAddress: "Dz.U. 1991 nr 80 poz. 350",
    title: "Ustawa z dnia 26 lipca 1991 r. o podatku dochodowym od osób fizycznych",
    shortName: "PIT",
    description: "Podatek dochodowy od osób fizycznych, przychody z pracy, działalności, najmu, kapitałów.",
    legalAreas: ["PRAWO_PODATKOWE"],
    relatedEuCelexIds: [],
    latestConsolidatedEli: null,
    lastKnownChangeDate: null,
  },
  {
    eli: "DU/2004/177",
    displayAddress: "Dz.U. 2004 nr 54 poz. 535",
    title: "Ustawa z dnia 11 marca 2004 r. o podatku od towarów i usług",
    shortName: "VATU",
    description: "Podatek VAT: przedmiot opodatkowania, stawki, odliczenia, faktury, JPK, kasy fiskalne.",
    legalAreas: ["PRAWO_PODATKOWE"],
    relatedEuCelexIds: ["32006L0112"],
    latestConsolidatedEli: null,
    lastKnownChangeDate: null,
  },
  {
    eli: "DU/1997/926",
    displayAddress: "Dz.U. 1997 nr 137 poz. 926",
    title: "Ustawa z dnia 29 sierpnia 1997 r. — Ordynacja podatkowa",
    shortName: "OrdPod",
    description: "Zobowiązania podatkowe, postępowanie podatkowe, odwołania, przedawnienie, odpowiedzialność podatkowa.",
    legalAreas: ["PRAWO_PODATKOWE"],
    relatedEuCelexIds: [],
    latestConsolidatedEli: null,
    lastKnownChangeDate: null,
  },
  {
    eli: "DU/1994/121",
    displayAddress: "Dz.U. 1994 nr 121 poz. 591",
    title: "Ustawa z dnia 29 września 1994 r. o rachunkowości",
    shortName: "URach",
    description: "Zasady rachunkowości, sprawozdania finansowe, rewizja finansowa, odpowiedzialność za księgi.",
    legalAreas: ["PRAWO_GOSPODARCZE", "PRAWO_PODATKOWE"],
    relatedEuCelexIds: ["32013L0034"],
    latestConsolidatedEli: null,
    lastKnownChangeDate: null,
  },
  // ──────────────────────────────────────────────────────────
  // PRAWO KARNE GOSPODARCZE
  // ──────────────────────────────────────────────────────────
  {
    eli: "DU/1997/88",
    displayAddress: "Dz.U. 1997 nr 88 poz. 553",
    title: "Ustawa z dnia 6 czerwca 1997 r. — Kodeks karny",
    shortName: "KK",
    description: "Przestępstwa gospodarcze: oszustwo (art. 286), przywłaszczenie (art. 284), pranie pieniędzy (art. 299), działanie na szkodę spółki (art. 296).",
    legalAreas: ["PRAWO_KARNE_GOSPODARCZE"],
    relatedEuCelexIds: [],
    latestConsolidatedEli: null,
    lastKnownChangeDate: null,
  },
  {
    eli: "DU/1999/930",
    displayAddress: "Dz.U. 1999 nr 83 poz. 930",
    title: "Ustawa z dnia 10 września 1999 r. — Kodeks karny skarbowy",
    shortName: "KKS",
    description: "Przestępstwa i wykroczenia skarbowe: uszczuplenie podatku, przemyt, fałszowanie faktur.",
    legalAreas: ["PRAWO_KARNE_GOSPODARCZE", "PRAWO_PODATKOWE"],
    relatedEuCelexIds: [],
    latestConsolidatedEli: null,
    lastKnownChangeDate: null,
  },
  // ──────────────────────────────────────────────────────────
  // OCHRONA DANYCH I CYBERBEZPIECZEŃSTWO
  // ──────────────────────────────────────────────────────────
  {
    eli: "DU/2018/1000",
    displayAddress: "Dz.U. 2018 poz. 1000",
    title: "Ustawa z dnia 10 maja 2018 r. o ochronie danych osobowych",
    shortName: "UODO",
    description: "Implementacja RODO: UODO, inspektor ochrony danych, rejestr czynności, naruszenia.",
    legalAreas: ["OCHRONA_DANYCH"],
    relatedEuCelexIds: ["32016R0679"],
    latestConsolidatedEli: null,
    lastKnownChangeDate: null,
  },
  // ──────────────────────────────────────────────────────────
  // PRAWO WŁASNOŚCI INTELEKTUALNEJ
  // ──────────────────────────────────────────────────────────
  {
    eli: "DU/1994/24",
    displayAddress: "Dz.U. 1994 nr 24 poz. 83",
    title: "Ustawa z dnia 4 lutego 1994 r. o prawie autorskim i prawach pokrewnych",
    shortName: "PrAut",
    description: "Ochrona utworów, prawa majątkowe i osobiste, licencje, dozwolony użytek, naruszenia.",
    legalAreas: ["PRAWO_AUTORSKIE"],
    relatedEuCelexIds: ["32019L0790", "32001L0029"],
    latestConsolidatedEli: null,
    lastKnownChangeDate: null,
  },
  {
    eli: "DU/2001/49",
    displayAddress: "Dz.U. 2001 nr 49 poz. 508",
    title: "Ustawa z dnia 30 czerwca 2000 r. — Prawo własności przemysłowej",
    shortName: "PWP",
    description: "Patenty, znaki towarowe, wzory przemysłowe, oznaczenia geograficzne — ochrona i naruszenia.",
    legalAreas: ["PRAWO_AUTORSKIE", "OCHRONA_KONKURENCJI"],
    relatedEuCelexIds: ["32017R1001"],
    latestConsolidatedEli: null,
    lastKnownChangeDate: null,
  },
  // ──────────────────────────────────────────────────────────
  // ZAMÓWIENIA PUBLICZNE
  // ──────────────────────────────────────────────────────────
  {
    eli: "DU/2019/2019",
    displayAddress: "Dz.U. 2019 poz. 2019",
    title: "Ustawa z dnia 11 września 2019 r. — Prawo zamówień publicznych",
    shortName: "PZP",
    description: "Przetargi, tryby udzielania zamówień, odwołania do KIO, umowy o zamówienie, klauzule niedozwolone.",
    legalAreas: ["PRAWO_ZAMOWIEN"],
    relatedEuCelexIds: ["32014L0024", "32014L0025"],
    latestConsolidatedEli: null,
    lastKnownChangeDate: null,
  },
  // ──────────────────────────────────────────────────────────
  // PRAWO ADMINISTRACYJNE
  // ──────────────────────────────────────────────────────────
  {
    eli: "DU/1960/30",
    displayAddress: "Dz.U. 1960 nr 30 poz. 168",
    title: "Ustawa z dnia 14 czerwca 1960 r. — Kodeks postępowania administracyjnego",
    shortName: "KPA",
    description: "Postępowanie administracyjne, decyzje, odwołania, skarga do sądu administracyjnego.",
    legalAreas: ["PRAWO_BUDOWLANE", "PRAWO_PODATKOWE"],
    relatedEuCelexIds: [],
    latestConsolidatedEli: null,
    lastKnownChangeDate: null,
  },
];

/** Szybkie wyszukiwanie wpisu katalogu po shortName lub ELI */
export function findInCatalog(query: string): StatuteCatalogEntry | undefined {
  const q = query.trim().toLowerCase();
  return STATUTE_CATALOG.find(
    (e) =>
      e.shortName.toLowerCase() === q ||
      e.eli.toLowerCase() === q ||
      e.displayAddress.toLowerCase().includes(q)
  );
}

/** Wszystkie akty w danym obszarze prawa */
export function getByLegalArea(area: import("./statute-types").LegalArea): StatuteCatalogEntry[] {
  return STATUTE_CATALOG.filter((e) => e.legalAreas.includes(area));
}
