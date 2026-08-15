import type { GeneratedComic } from "./types";

/** Simple in-memory session store. Metadata only — never raw photos. */
type Meta = {
  userId: string;
  email: string;
  themeId?: string;
  comic?: GeneratedComic;
  consentAt?: string;
  createdAt: string;
  expiresAt: string;
};

const store = new Map<string, Meta>();

const TTL_MS = 24 * 60 * 60 * 1000;

export function createSessionMeta(userId: string, email: string): Meta {
  const now = Date.now();
  const meta: Meta = {
    userId,
    email,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + TTL_MS).toISOString(),
  };
  store.set(userId, meta);
  return meta;
}

export function getSessionMeta(userId: string): Meta | undefined {
  const meta = store.get(userId);
  if (!meta) return undefined;
  if (Date.now() > Date.parse(meta.expiresAt)) {
    store.delete(userId);
    return undefined;
  }
  return meta;
}

export function saveComicMeta(userId: string, comic: GeneratedComic): void {
  const meta = getSessionMeta(userId);
  if (!meta) return;
  meta.comic = comic;
  meta.themeId = comic.themeId;
  store.set(userId, meta);
}

export function purgeExpired(): number {
  const now = Date.now();
  let n = 0;
  for (const [id, meta] of store) {
    if (now > Date.parse(meta.expiresAt)) {
      store.delete(id);
      n += 1;
      console.info(`[purge] session ${id} purged at ${new Date().toISOString()}`);
    }
  }
  return n;
}
