/// <reference types="@cloudflare/workers-types" />

export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
  APP_PASSWORD?: string;
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

// =============================================================================
// Helper Functions
// =============================================================================

export const sha256 = async (text: string): Promise<string> => {
  const msgUint8 = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

export const verifyPassword = async (input: string, expected?: string): Promise<boolean> => {
  if (!expected) return true;
  if (!input) return false;
  const cleanExpected = expected.trim().toLowerCase();
  const inputHash = await sha256(input);
  return inputHash === cleanExpected || input.toLowerCase() === cleanExpected;
};

export const isAuthorized = async (request: Request, env: Env): Promise<boolean> => {
  if (!env.APP_PASSWORD) return true;
  const provided = request.headers.get('x-app-password') || '';
  return verifyPassword(provided, env.APP_PASSWORD);
};

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
      'Access-Control-Allow-Headers': 'Content-Type, x-app-password',
    },
  });
};

export const optionsResponse = () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-app-password',
    },
  });
};

// =============================================================================
// Route Handlers
// =============================================================================

async function handleAuth(request: Request, env: Env): Promise<Response> {
  if (request.method === 'OPTIONS') return optionsResponse();

  if (request.method === 'GET') {
    return jsonResponse({ required: Boolean(env.APP_PASSWORD) });
  }

  if (request.method === 'POST') {
    if (!env.APP_PASSWORD) {
      return jsonResponse({ success: true, required: false });
    }
    const body: any = await request.json().catch(() => ({}));
    const password = body?.password ?? '';
    const valid = await verifyPassword(password, env.APP_PASSWORD);
    if (valid) {
      return jsonResponse({ success: true });
    }
    return jsonResponse({ error: 'Incorrect password' }, 401);
  }

  return jsonResponse({ error: 'Method not allowed' }, 405);
}

async function handleNotes(request: Request, env: Env): Promise<Response> {
  if (request.method === 'OPTIONS') return optionsResponse();

  if (!(await isAuthorized(request, env))) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  const db = env.DB;
  if (!db) {
    return jsonResponse({ error: 'D1 database binding "DB" not found' }, 500);
  }
  await ensureTables(db);

  if (request.method === 'GET') {
    try {
      const result = await db.prepare('SELECT * FROM notes ORDER BY last_updated DESC').all<NoteRow>();
      const notes = (result.results || []).map(noteRowToNoteItem);
      return jsonResponse({ notes });
    } catch (err: any) {
      return jsonResponse({ error: err.message || 'Failed to fetch notes' }, 500);
    }
  }

  if (request.method === 'POST') {
    try {
      const body: any = await request.json().catch(() => ({}));
      const notesToSave: any[] = Array.isArray(body) ? body : body.notes || [body];
      if (notesToSave.length === 0) {
        return jsonResponse({ success: true, count: 0 });
      }

      const upsertSql = `
        INSERT INTO notes (id, text, created, last_updated, category, scratchpad, trash, favorite)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          text = excluded.text,
          last_updated = excluded.last_updated,
          category = excluded.category,
          scratchpad = excluded.scratchpad,
          trash = excluded.trash,
          favorite = excluded.favorite;
      `;

      const stmts = notesToSave.map((note) =>
        db.prepare(upsertSql).bind(
          note.id,
          note.text ?? '',
          note.created ?? new Date().toISOString(),
          note.lastUpdated ?? new Date().toISOString(),
          note.category ?? '',
          note.scratchpad ? 1 : 0,
          note.trash ? 1 : 0,
          note.favorite ? 1 : 0
        )
      );

      await db.batch(stmts);
      return jsonResponse({ success: true, count: notesToSave.length });
    } catch (err: any) {
      return jsonResponse({ error: err.message || 'Failed to save notes' }, 500);
    }
  }

  if (request.method === 'DELETE') {
    try {
      let ids: string[] = [];
      const url = new URL(request.url);
      const queryId = url.searchParams.get('id');
      if (queryId) {
        ids = [queryId];
      } else {
        const body: any = await request.json().catch(() => ({}));
        if (Array.isArray(body)) ids = body;
        else if (Array.isArray(body?.ids)) ids = body.ids;
        else if (body?.id) ids = [body.id];
      }

      if (ids.length === 0) return jsonResponse({ success: true, deleted: 0 });

      const stmts = ids.map((id) => db.prepare('DELETE FROM notes WHERE id = ?').bind(id));
      await db.batch(stmts);
      return jsonResponse({ success: true, deleted: ids.length });
    } catch (err: any) {
      return jsonResponse({ error: err.message || 'Failed to delete notes' }, 500);
    }
  }

  return jsonResponse({ error: 'Method not allowed' }, 405);
}

async function handleCategories(request: Request, env: Env): Promise<Response> {
  if (request.method === 'OPTIONS') return optionsResponse();

  if (!(await isAuthorized(request, env))) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  const db = env.DB;
  if (!db) {
    return jsonResponse({ error: 'D1 database binding "DB" not found' }, 500);
  }
  await ensureTables(db);

  if (request.method === 'GET') {
    try {
      const result = await db.prepare('SELECT * FROM categories').all<CategoryRow>();
      const categories = (result.results || []).map((row) => ({
        id: row.id,
        name: row.name,
        draggedOver: Boolean(row.dragged_over),
      }));
      return jsonResponse({ categories });
    } catch (err: any) {
      return jsonResponse({ error: err.message || 'Failed to fetch categories' }, 500);
    }
  }

  if (request.method === 'POST') {
    try {
      const body: any = await request.json().catch(() => ({}));
      const categoriesToSave: any[] = Array.isArray(body) ? body : body.categories || [body];
      if (categoriesToSave.length === 0) {
        return jsonResponse({ success: true, count: 0 });
      }

      const upsertSql = `
        INSERT INTO categories (id, name, dragged_over)
        VALUES (?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          name = excluded.name,
          dragged_over = excluded.dragged_over;
      `;

      const stmts = categoriesToSave.map((cat) =>
        db.prepare(upsertSql).bind(cat.id, cat.name, cat.draggedOver ? 1 : 0)
      );

      await db.batch(stmts);
      return jsonResponse({ success: true, count: categoriesToSave.length });
    } catch (err: any) {
      return jsonResponse({ error: err.message || 'Failed to save categories' }, 500);
    }
  }

  if (request.method === 'DELETE') {
    try {
      const url = new URL(request.url);
      const queryId = url.searchParams.get('id');
      let id = queryId;
      if (!id) {
        const body: any = await request.json().catch(() => ({}));
        id = body?.id;
      }

      if (!id) return jsonResponse({ error: 'Missing category id' }, 400);

      await db.prepare('DELETE FROM categories WHERE id = ?').bind(id).run();
      return jsonResponse({ success: true, deleted: id });
    } catch (err: any) {
      return jsonResponse({ error: err.message || 'Failed to delete category' }, 500);
    }
  }

  return jsonResponse({ error: 'Method not allowed' }, 405);
}

// =============================================================================
// Cloudflare Worker Default Export
// =============================================================================

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // API routes
    if (url.pathname === '/api/auth') {
      return handleAuth(request, env);
    }
    if (url.pathname === '/api/notes' || url.pathname.startsWith('/api/notes/')) {
      return handleNotes(request, env);
    }
    if (url.pathname === '/api/categories' || url.pathname.startsWith('/api/categories/')) {
      return handleCategories(request, env);
    }

    // Static assets fallback (SPA routing)
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not found', { status: 404 });
  },
};

