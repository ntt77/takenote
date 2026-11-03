/// <reference types="@cloudflare/workers-types" />
import { Env, jsonResponse, optionsResponse, verifyPassword } from '../db';

export const onRequestOptions = async () => optionsResponse();

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const isRequired = Boolean(context.env.APP_PASSWORD);
  return jsonResponse({ required: isRequired });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const expected = context.env.APP_PASSWORD;

  if (!expected) {
    return jsonResponse({ success: true, required: false });
  }

  try {
    const body: any = await context.request.json().catch(() => ({}));
    const password = body?.password ?? '';

    const valid = await verifyPassword(password, expected);
    if (valid) {
      return jsonResponse({ success: true });
    }

    return jsonResponse({ error: 'Incorrect password' }, 401);
  } catch (err: any) {
    return jsonResponse({ error: err.message || 'Authentication error' }, 500);
  }
};

