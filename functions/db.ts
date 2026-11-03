/// <reference types="@cloudflare/workers-types" />

export interface Env {
  DB: D1Database;
}

export interface NoteRow {
  id: string;
  text: string;
  created: string;
  last_updated: string;
  category: string;
  scratchpad: number;
  trash: number;
  favorite: number;
}

export interface CategoryRow {
  id: string;
  name: string;
  dragged_over: number;
}

export const ensureTables = async (db: D1Database) => {
  try {
    await db.batch([
      db.prepare(`
        CREATE TABLE IF NOT EXISTS categories (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          dragged_over INTEGER DEFAULT 0
        );
      `),
      db.prepare(`
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
      `),
      db.prepare(`CREATE INDEX IF NOT EXISTS idx_notes_last_updated ON notes(last_updated DESC);`),
      db.prepare(`CREATE INDEX IF NOT EXISTS idx_notes_category ON notes(category);`),
    ]);
  } catch (err) {
    console.error('Failed to auto-create tables in D1:', err);
  }
};

export const noteRowToNoteItem = (row: NoteRow) => ({
  id: row.id,
  text: row.text,
  created: row.created,
  lastUpdated: row.last_updated,
  category: row.category || '',
  scratchpad: Boolean(row.scratchpad),
  trash: Boolean(row.trash),
  favorite: Boolean(row.favorite),
});

export const jsonResponse = (data: unknown, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};

export const optionsResponse = () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};

