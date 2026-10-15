import type { EditorView } from '@codemirror/view';
import { undo as cmUndo, redo as cmRedo, indentMore as cmIndentMore, indentLess as cmIndentLess } from '@codemirror/commands';

/**
 * Helper to wrap or unwrap the current selection with inline markdown/HTML markers.
 */
export function toggleInlineWrap(view: EditorView, openMarker: string, placeholder = 'text', closeMarker = openMarker): void {
  const { from, to } = view.state.selection.main;
  const openLen = openMarker.length;
  const closeLen = closeMarker.length;

  if (from !== to) {
    const selected = view.state.sliceDoc(from, to);

    // Check if the selection itself starts and ends with the markers
    if (selected.startsWith(openMarker) && selected.endsWith(closeMarker) && selected.length >= openLen + closeLen) {
      const unwrapped = selected.slice(openLen, selected.length - closeLen);
      view.dispatch({
        changes: { from, to, insert: unwrapped },
        selection: { anchor: from, head: from + unwrapped.length },
        scrollIntoView: true,
      });
      view.focus();
      return;
    }

    // Check if the surrounding characters match the marker
    const docLen = view.state.doc.length;
    const hasSurrounding =
      from >= openLen && to + closeLen <= docLen && view.state.sliceDoc(from - openLen, from) === openMarker && view.state.sliceDoc(to, to + closeLen) === closeMarker;

    if (hasSurrounding) {
      view.dispatch({
        changes: [
          { from: from - openLen, to: from, insert: '' },
          { from: to, to: to + closeLen, insert: '' },
        ],
        selection: { anchor: from - openLen, head: to - openLen },
        scrollIntoView: true,
      });
      view.focus();
      return;
    }

    // Wrap the selected text
    const wrapped = `${openMarker}${selected}${closeMarker}`;
    view.dispatch({
      changes: { from, to, insert: wrapped },
      selection: { anchor: from + openLen, head: from + openLen + selected.length },
      scrollIntoView: true,
    });
  } else {
    // Collapsed cursor: insert placeholder and select it
    const inserted = `${openMarker}${placeholder}${closeMarker}`;
    view.dispatch({
      changes: { from, to, insert: inserted },
      selection: { anchor: from + openLen, head: from + openLen + placeholder.length },
      scrollIntoView: true,
    });
  }
  view.focus();
}

/**
 * Set explicit Heading level on selected line(s):
 * level 0 = normal paragraph (remove #), level 1..6 = # .. ######
 */
export function setHeadingLevel(view: EditorView, level: number): void {
  const { from, to } = view.state.selection.main;
  const doc = view.state.doc;
  const startLine = doc.lineAt(from);
  const endLine = doc.lineAt(to);

  const changes: { from: number; to: number; insert: string }[] = [];

  for (let lineNo = startLine.number; lineNo <= endLine.number; lineNo++) {
    const line = doc.line(lineNo);
    const text = line.text;
    const cleaned = text.replace(/^#{1,6}\s*/, '');

    if (level === 0) {
      // Normal paragraph
      changes.push({ from: line.from, to: line.to, insert: cleaned });
    } else {
      changes.push({ from: line.from, to: line.to, insert: `${'#'.repeat(level)} ${cleaned}` });
    }
  }

  view.dispatch({ changes, scrollIntoView: true });
  view.focus();
}

/**
 * Toggle prefix on line(s) (e.g. blockquote '> ', bullet list '- ', checklist '- [ ] ')
 */
function toggleLinePrefix(view: EditorView, prefix: string, regexToRemove: RegExp, numbered = false): void {
  const { from, to } = view.state.selection.main;
  const doc = view.state.doc;
  const startLine = doc.lineAt(from);
  const endLine = doc.lineAt(to);

  const changes: { from: number; to: number; insert: string }[] = [];

  // Check if all lines already start with this prefix
  let allHavePrefix = true;
  for (let lineNo = startLine.number; lineNo <= endLine.number; lineNo++) {
    const line = doc.line(lineNo);
    if (!line.text.startsWith(prefix) && !(numbered && /^\d+\.\s/.test(line.text))) {
      allHavePrefix = false;
      break;
    }
  }

  let index = 1;
  for (let lineNo = startLine.number; lineNo <= endLine.number; lineNo++) {
    const line = doc.line(lineNo);
    const text = line.text;

    if (allHavePrefix) {
      const stripped = text.replace(regexToRemove, '');
      changes.push({ from: line.from, to: line.to, insert: stripped });
    } else {
      const cleaned = text.replace(regexToRemove, '');
      const currentPrefix = numbered ? `${index}. ` : prefix;
      changes.push({ from: line.from, to: line.to, insert: `${currentPrefix}${cleaned}` });
      index++;
    }
  }

  view.dispatch({ changes, scrollIntoView: true });
  view.focus();
}

export function toggleBlockquote(view: EditorView): void {
  toggleLinePrefix(view, '> ', /^>\s?/);
}

export function toggleBulletList(view: EditorView): void {
  toggleLinePrefix(view, '- ', /^([-*+]|\d+\.|- \[[ xX]\])\s?/);
}

export function toggleNumberedList(view: EditorView): void {
  toggleLinePrefix(view, '1. ', /^([-*+]|\d+\.|- \[[ xX]\])\s?/, true);
}

export function toggleTaskList(view: EditorView): void {
  toggleLinePrefix(view, '- [ ] ', /^([-*+]|\d+\.|- \[[ xX]\])\s?/);
}

/**
 * Insert or wrap Code Block
 */
export function insertCodeBlock(view: EditorView): void {
  const { from, to } = view.state.selection.main;
  const doc = view.state.doc;

  if (from !== to) {
    const selected = doc.sliceString(from, to);
    const needsPrefixNewline = from > 0 && doc.sliceString(from - 1, from) !== '\n' ? '\n' : '';
    const needsSuffixNewline = to < doc.length && doc.sliceString(to, to + 1) !== '\n' ? '\n' : '';
    const replacement = `${needsPrefixNewline}\`\`\`\n${selected}\n\`\`\`${needsSuffixNewline}`;

    view.dispatch({
      changes: { from, to, insert: replacement },
      selection: { anchor: from + needsPrefixNewline.length + 4, head: from + needsPrefixNewline.length + 4 + selected.length },
      scrollIntoView: true,
    });
  } else {
    const needsPrefixNewline = from > 0 && doc.sliceString(from - 1, from) !== '\n' ? '\n' : '';
    const text = `${needsPrefixNewline}\`\`\`\ncode\n\`\`\`\n`;
    view.dispatch({
      changes: { from, to, insert: text },
      selection: {
        anchor: from + needsPrefixNewline.length + 4,
        head: from + needsPrefixNewline.length + 8,
      },
      scrollIntoView: true,
    });
  }
  view.focus();
}

/**
 * Insert or wrap Link: [text](url)
 */
export function insertLink(view: EditorView): void {
  const { from, to } = view.state.selection.main;
  const doc = view.state.doc;

  if (from !== to) {
    const selected = doc.sliceString(from, to).trim();
    const isUrl = /^https?:\/\//i.test(selected);

    if (isUrl) {
      const insert = `[title](${selected})`;
      view.dispatch({
        changes: { from, to, insert },
        selection: { anchor: from + 1, head: from + 6 },
        scrollIntoView: true,
      });
    } else {
      const insert = `[${selected}](url)`;
      view.dispatch({
        changes: { from, to, insert },
        selection: { anchor: from + selected.length + 3, head: from + selected.length + 6 },
        scrollIntoView: true,
      });
    }
  } else {
    const insert = '[title](url)';
    view.dispatch({
      changes: { from, to, insert },
      selection: { anchor: from + 7, head: from + 10 },
      scrollIntoView: true,
    });
  }
  view.focus();
}

/**
 * Insert a Markdown Table template
 */
export function insertTable(view: EditorView): void {
  const { from, to } = view.state.selection.main;
  const doc = view.state.doc;

  const needsPrefixNewline = from > 0 && doc.sliceString(from - 1, from) !== '\n' ? '\n\n' : '';
  const table = `${needsPrefixNewline}| Header 1 | Header 2 | Header 3 |\n| -------- | -------- | -------- |\n| Cell 1   | Cell 2   | Cell 3   |\n`;

  view.dispatch({
    changes: { from, to, insert: table },
    selection: {
      anchor: from + needsPrefixNewline.length + 2,
      head: from + needsPrefixNewline.length + 10,
    },
    scrollIntoView: true,
  });
  view.focus();
}

/**
 * Remove markdown inline markers from selection
 */
export function clearFormatting(view: EditorView): void {
  const { from, to } = view.state.selection.main;
  if (from === to) return;

  const doc = view.state.doc;
  const selected = doc.sliceString(from, to);

  // Strip common markdown & HTML inline formatting
  const stripped = selected
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .replace(/~~(.*?)~~/g, '$1')
    .replace(/==(.*?)==/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/<\/?(u|sup|sub|mark|code|strong|em|s|del)>/gi, '');

  view.dispatch({
    changes: { from, to, insert: stripped },
    selection: { anchor: from, head: from + stripped.length },
    scrollIntoView: true,
  });
  view.focus();
}

/**
 * Insert Horizontal Rule (---)
 */
export function insertHorizontalRule(view: EditorView): void {
  const { from } = view.state.selection.main;
  const doc = view.state.doc;
  const line = doc.lineAt(from);
  const prefix = line.length > 0 ? '\n\n' : '';
  const insert = `${prefix}---\n\n`;

  view.dispatch({
    changes: { from: line.to, insert },
    selection: { anchor: line.to + insert.length },
    scrollIntoView: true,
  });
  view.focus();
}

/**
 * Insert current Date / Timestamp at cursor
 */
export function insertDateTime(view: EditorView): void {
  const { from, to } = view.state.selection.main;
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

  view.dispatch({
    changes: { from, to, insert: dateStr },
    selection: { anchor: from + dateStr.length },
    scrollIntoView: true,
  });
  view.focus();
}

/**
 * Undo last action
 */
export function executeUndo(view: EditorView): void {
  cmUndo(view);
  view.focus();
}

/**
 * Redo last undone action
 */
export function executeRedo(view: EditorView): void {
  cmRedo(view);
  view.focus();
}

/**
 * Indent current line(s) / nested list
 */
export function executeIndent(view: EditorView): void {
  cmIndentMore(view);
  view.focus();
}

/**
 * Outdent current line(s)
 */
export function executeOutdent(view: EditorView): void {
  cmIndentLess(view);
  view.focus();
}
