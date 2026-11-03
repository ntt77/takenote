/// <reference types="@cloudflare/workers-types" />
import { Env, CategoryRow, ensureTables, isAuthorized, jsonResponse, optionsResponse } from '../db';

interface CategoryPayload {
  id: string;
  name: string;
  draggedOver?: boolean;
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
    const categoriesToSave: CategoryPayload[] = Array.isArray(body)
      ? body
      : (body as { categories?: CategoryPayload[] }).categories || [body as CategoryPayload];

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
    const url = new URL(context.request.url);
    const queryId = url.searchParams.get('id');

    let id = queryId;
    if (!id) {
      const body: any = await context.request.json().catch(() => ({}));
      id = body?.id;
    }

    if (!id) {
      return jsonResponse({ error: 'Missing category id' }, 400);
    }

    await db.prepare('DELETE FROM categories WHERE id = ?').bind(id).run();

    return jsonResponse({ success: true, deleted: id });
  } catch (err: any) {
    return jsonResponse({ error: err.message || 'Failed to delete category' }, 500);
  }
};

