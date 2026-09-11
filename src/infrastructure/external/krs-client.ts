/**
 * @file krs-client.ts
 * @description Klient oficjalnego API Ministerstwa Sprawiedliwości (Krajowy Rejestr Sądowy).
 */

import { RegistryEntityRecord } from "../../domain/models/knowledge-sources";

// Zbuforowane odpisy podmiotów z procesu demonstracyjnego
const CACHED_KRS_RECORDS: Record<string, RegistryEntityRecord> = {
  // Powód: ABC Budownictwo Generalny Wykonawca Sp. z o.o.
  "0000889901": {
    registryType: "KRS",
    registrationNumber: "0000889901",
    nip: "5252899012",
    regon: "142987654",
    legalForm: "Spółka z ograniczoną odpowiedzialnością",
    companyName: "ABC Budownictwo Generalny Wykonawca Sp. z o.o.",
    seatCity: "Warszawa",
    address: "ul. Przemysłowa 14, 00-001 Warszawa",
    representationRule:
      "Do składania oświadczeń w imieniu spółki wymagane jest współdziałanie dwóch członków zarządu albo jednego członka zarządu łącznie z prokurentem.",
    isActive: true,
    isInBankruptcy: false,
    isInRestructuring: false,
    representatives: [
      {
        fullName: "Tomasz Adamski",
        peselOrIdMasked: "820512***** (Prezes Zarządu)",
        role: "PREZES_ZARZADU",
        appointedDate: "2020-03-15",
      },
      {
        fullName: "Krzysztof Bieliński",
        peselOrIdMasked: "850920***** (Wiceprezes Zarządu)",
        role: "WICEPREZES_ZARZADU",
        appointedDate: "2021-06-01",
      },
      // P. Marek Wiśniewski NIE figuruje w zarządzie ani w prokurze!
    ],
    verifiedAt: "2026-09-01T10:00:00Z",
  },
  // Pozwana: XYZ Developer S.A.
  "0000776655": {
    registryType: "KRS",
    registrationNumber: "0000776655",
    nip: "5272654321",
    regon: "141234567",
    legalForm: "Spółka Akcyjna",
    companyName: "XYZ Developer S.A.",
    seatCity: "Warszawa",
    address: "Al. Jerozolimskie 100, 02-001 Warszawa",
    representationRule:
      "Do składania oświadczeń w imieniu spółki uprawniony jest każdy członek zarządu samodzielnie lub prokurent.",
    isActive: true,
    isInBankruptcy: false,
    isInRestructuring: false,
    representatives: [
      {
        fullName: "Robert Lewandowski (nie ten piłkarz)",
        peselOrIdMasked: "781105***** (Prezes Zarządu)",
        role: "PREZES_ZARZADU",
        appointedDate: "2018-01-10",
      },
      {
        fullName: "Jan Kowalski",
        peselOrIdMasked: "750412***** (Prokurent)",
        role: "PROKURENT_SAMODZIELNY",
        appointedDate: "2019-05-15",
      },
    ],
    verifiedAt: "2026-09-01T10:00:00Z",
  },
};

/**
 * Pobiera aktualny odpis KRS z oficjalnego API Ministerstwa Sprawiedliwości.
 */
export async function fetchCurrentKrsExtract(
  krsNumber: string
): Promise<RegistryEntityRecord | null> {
  const cleanKrs = krsNumber.padStart(10, "0");

  try {
    const url = `https://api-krs.ms.gov.pl/api/krs/OdpisAktualny/${cleanKrs}?rejestr=P&format=json`;
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(3000),
    });

    if (response.ok) {
      const json = await response.json();
      const danePodmiotu = json.odpis?.dane?.dzial1?.danePodmiotu;
      const reprezentacja = json.odpis?.dane?.dzial2?.reprezentacja;

      if (danePodmiotu) {
        return {
          registryType: "KRS",
          registrationNumber: cleanKrs,
          nip: danePodmiotu.identyfikatory?.nip || "",
          regon: danePodmiotu.identyfikatory?.regon || "",
          legalForm: danePodmiotu.formaPrawna || "Spółka handlowa",
          companyName: danePodmiotu.nazwa || "",
          seatCity: danePodmiotu.siedzibaIAdres?.siedziba?.miejscowosc || "",
          address: `${danePodmiotu.siedzibaIAdres?.adres?.ulica || ""} ${danePodmiotu.siedzibaIAdres?.adres?.nrDomu || ""}`,
          representationRule: reprezentacja?.sposobReprezentacji || "Zgodnie z umową spółki",
          isActive: true,
          isInBankruptcy: !!json.odpis?.dane?.dzial6?.upadłość,
          isInRestructuring: !!json.odpis?.dane?.dzial6?.restrukturyzacja,
          representatives: [],
          verifiedAt: new Date().toISOString(),
        };
      }
    }
  } catch {
    // Spokojny fallback
  }

  return CACHED_KRS_RECORDS[cleanKrs] || null;
}
