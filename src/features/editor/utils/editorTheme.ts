import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';
import { EditorView } from '@codemirror/view';

/**
 * Custom Markdown syntax highlighting:
 * Enhances editor readability with proportional heading sizes, bold font weights,
 * and highlighted inline code / links.
 */
export const markdownHighlightStyle = HighlightStyle.define([
  {
    tag: t.heading1,
    fontSize: '1.55em',
    fontWeight: '700',
    color: 'var(--cm-heading-color, inherit)',
  },
  {
    tag: t.heading2,
    fontSize: '1.35em',
    fontWeight: '700',
    color: 'var(--cm-heading-color, inherit)',
  },
  {
    tag: t.heading3,
    fontSize: '1.2em',
    fontWeight: '600',
    color: 'var(--cm-heading-color, inherit)',
  },
  {
    tag: [t.heading4, t.heading5, t.heading6],
    fontSize: '1.1em',
    fontWeight: '600',
    color: 'var(--cm-heading-color, inherit)',
  },
  {
    tag: t.strong,
    fontWeight: '700',
  },
  {
    tag: t.emphasis,
    fontStyle: 'italic',
  },
  {
    tag: t.strikethrough,
    textDecoration: 'line-through',
  },
  {
    tag: t.monospace,
    fontFamily: 'Menlo, Monaco, Consolas, "Liberation Mono", monospace',
    borderRadius: '3px',
    padding: '1px 4px',
    backgroundColor: 'var(--cm-code-bg, rgba(0, 0, 0, 0.05))',
    color: 'var(--cm-code-color, inherit)',
  },
  {
    tag: t.quote,
    fontStyle: 'italic',
    color: 'var(--cm-quote-color, #707070)',
  },
  {
    tag: t.link,
    textDecoration: 'underline',
    color: 'var(--cm-link-color, #5183f5)',
  },
  {
    tag: t.url,
    textDecoration: 'underline',
    opacity: '0.8',
  },
]);

/**
 * Base editor theme for CodeMirror 6 with refined typography, smooth scrolling,
 * and consistent line padding.
 */
export const editorBaseTheme = EditorView.theme({
  '&': {
    height: '100%',
    outline: 'none',
  },
  '&.cm-focused': {
    outline: 'none',
  },
  '.cm-scroller': {
    fontFamily: 'Menlo, Monaco, Consolas, "Liberation Mono", monospace',
    fontSize: '15px',
    lineHeight: '1.6',
    padding: '1rem 1rem 3.5rem',
  },
  '.cm-line': {
    padding: '1px 0',
  },
  '.cm-gutters': {
    borderRight: '1px solid var(--border-color, #e0e0e0)',
    backgroundColor: 'transparent',
    color: 'var(--cm-gutter-color, #999)',
  },
});

export const markdownEditorExtensions = [editorBaseTheme, syntaxHighlighting(markdownHighlightStyle)];
