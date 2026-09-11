/**
 * Plikowy cache wiedzy prawnej z TTL.
 * Przechowuje odpowiedzi z ISAP, SAOS i EUR-Lex, aby nie bombardować API.
 * Pliki cache w katalogu .legal-cache/ (gitignore).
 * Bezpieczny na Next.js — działa po stronie serwera (Node.js fs).
 */
import fs from "fs";
import path from "path";

const CACHE_DIR = path.join(process.cwd(), ".legal-cache");

interface CacheEntry<T> {
  data: T;
  fetchedAt: string;  // ISO 8601
  expiresAt: string;  // ISO 8601
}

function ensureCacheDir(): void {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

function cacheFilePath(key: string): string {
  // Sanitize key so it's a safe filename
  const safe = key.replace(/[^a-zA-Z0-9_\-]/g, "_");
  return path.join(CACHE_DIR, `${safe}.json`);
}

export function cacheGet<T>(key: string): T | null {
  try {
    ensureCacheDir();
    const filePath = cacheFilePath(key);
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, "utf-8");
    const entry: CacheEntry<T> = JSON.parse(raw);
    if (new Date() > new Date(entry.expiresAt)) {
      fs.unlinkSync(filePath);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

export function cacheSet<T>(key: string, data: T, ttlHours: number): void {
  try {
    ensureCacheDir();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + ttlHours * 3_600_000);
    const entry: CacheEntry<T> = {
      data,
      fetchedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };
    fs.writeFileSync(cacheFilePath(key), JSON.stringify(entry, null, 2), "utf-8");
  } catch {
    // Cache write failure is non-fatal — silently ignore
  }
}

export function cacheInvalidate(key: string): void {
  try {
    const filePath = cacheFilePath(key);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch {
    // Non-fatal
  }
}

export function cacheInvalidateAll(): void {
  try {
    ensureCacheDir();
    for (const file of fs.readdirSync(CACHE_DIR)) {
      if (file.endsWith(".json")) {
        fs.unlinkSync(path.join(CACHE_DIR, file));
      }
    }
  } catch {
    // Non-fatal
  }
}

export function cacheStats(): { fileCount: number; totalBytes: number } {
  try {
    ensureCacheDir();
    const files = fs.readdirSync(CACHE_DIR).filter((f) => f.endsWith(".json"));
    const totalBytes = files.reduce((sum, f) => {
      return sum + fs.statSync(path.join(CACHE_DIR, f)).size;
    }, 0);
    return { fileCount: files.length, totalBytes };
  } catch {
    return { fileCount: 0, totalBytes: 0 };
  }
}
