/// <reference types="@cloudflare/workers-types" />
import { Env, NoteRow, ensureTables, isAuthorized, jsonResponse, noteRowToNoteItem, optionsResponse } from '../db';

interface NotePayload {
  id: string;
  text?: string;
  created?: string;
  lastUpdated?: string;
  category?: string;
  scratchpad?: boolean;
  trash?: boolean;
  favorite?: boolean;
}

export const onRequestOptions = async () => optionsResponse();

export const onRequestGet: PagesFunction<Env> = async (context) => {
  if (!(await isAuthorized(context.request, context.env))) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  const db = context.env.DB;
  if (!db) {
    return jsonResponse({ error: 'D1 database binding "DB" not found' }, 500);
  }

  await ensureTables(db);

  try {
    const result = await db.prepare('SELECT * FROM notes ORDER BY last_updated DESC').all<NoteRow>();
    const notes = (result.results || []).map(noteRowToNoteItem);
    return jsonResponse({ notes });
  } catch (err: any) {
    return jsonResponse({ error: err.message || 'Failed to fetch notes' }, 500);
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  if (!(await isAuthorized(context.request, context.env))) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  const db = context.env.DB;
  if (!db) {
    return jsonResponse({ error: 'D1 database binding "DB" not found' }, 500);
  }

  await ensureTables(db);

  try {
    const body: unknown = await context.request.json();
    const notesToSave: NotePayload[] = Array.isArray(body) ? body : (body as { notes?: NotePayload[] }).notes || [body as NotePayload];

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
      db
        .prepare(upsertSql)
        .bind(
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

    // D1 allows batch executions
    await db.batch(stmts);

    return jsonResponse({ success: true, count: notesToSave.length });
  } catch (err: any) {
    return jsonResponse({ error: err.message || 'Failed to save notes' }, 500);
  }
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  if (!(await isAuthorized(context.request, context.env))) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  const db = context.env.DB;
  if (!db) {
    return jsonResponse({ error: 'D1 database binding "DB" not found' }, 500);
  }

  await ensureTables(db);

  try {
    let ids: string[] = [];

    const url = new URL(context.request.url);
    const queryId = url.searchParams.get('id');

    if (queryId) {
      ids = [queryId];
    } else {
      const body: any = await context.request.json().catch(() => ({}));
      if (Array.isArray(body)) {
        ids = body;
      } else if (Array.isArray(body?.ids)) {
        ids = body.ids;
      } else if (body?.id) {
        ids = [body.id];
      }
    }

    if (ids.length === 0) {
      return jsonResponse({ success: true, deleted: 0 });
    }

    const stmts = ids.map((id) => db.prepare('DELETE FROM notes WHERE id = ?').bind(id));
    await db.batch(stmts);

    return jsonResponse({ success: true, deleted: ids.length });
  } catch (err: any) {
    return jsonResponse({ error: err.message || 'Failed to delete notes' }, 500);
  }
};

