-- Cloudflare D1 Schema for Takenote

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  dragged_over INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL DEFAULT '',
  created TEXT NOT NULL,
  last_updated TEXT NOT NULL,
  category TEXT DEFAULT '',
  scratchpad INTEGER DEFAULT 0,
  trash INTEGER DEFAULT 0,
  favorite INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_notes_last_updated ON notes(last_updated DESC);
CREATE INDEX IF NOT EXISTS idx_notes_category ON notes(category);

