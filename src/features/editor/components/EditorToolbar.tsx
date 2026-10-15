import React from 'react';
import type { EditorView } from '@codemirror/view';
import { Bold, Italic, Strikethrough, Heading, QuoteLeft, Code, CodeBlock, ListUl, ListOl, CheckboxChecked, Link, Table } from '@/icons';
import {
  toggleInlineWrap,
  toggleHeading,
  toggleBlockquote,
  toggleBulletList,
  toggleNumberedList,
  toggleTaskList,
  insertCodeBlock,
  insertLink,
  insertTable,
} from '@/features/editor/utils/markdownCommands';

export interface EditorToolbarProps {
  getView: () => EditorView | undefined;
  disabled?: boolean;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ getView, disabled = false }) => {
  const handleAction = (action: (view: EditorView) => void) => {
    const view = getView();
    if (!view || disabled) return;
    action(view);
  };

  return (
    <div className="editor-toolbar" role="toolbar" aria-label="Markdown formatting" data-testid="editor-toolbar">
      <div className="editor-toolbar-group">
        <button
          type="button"
          className="editor-toolbar-button"
          onClick={() => handleAction((v) => toggleInlineWrap(v, '**', 'bold text'))}
          disabled={disabled}
          title="Bold (**text**)"
          aria-label="Bold">
          <Bold size={17} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="editor-toolbar-button"
          onClick={() => handleAction((v) => toggleInlineWrap(v, '*', 'italic text'))}
          disabled={disabled}
          title="Italic (*text*)"
          aria-label="Italic">
          <Italic size={17} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="editor-toolbar-button"
          onClick={() => handleAction((v) => toggleInlineWrap(v, '~~', 'strikethrough text'))}
          disabled={disabled}
          title="Strikethrough (~~text~~)"
          aria-label="Strikethrough">
          <Strikethrough size={17} aria-hidden="true" />
        </button>
      </div>

      <span className="editor-toolbar-divider" aria-hidden="true" />

      <div className="editor-toolbar-group">
        <button
          type="button"
          className="editor-toolbar-button"
          onClick={() => handleAction(toggleHeading)}
          disabled={disabled}
          title="Heading (# H1 / ## H2 / ### H3)"
          aria-label="Heading">
          <Heading size={17} aria-hidden="true" />
        </button>
        <button type="button" className="editor-toolbar-button" onClick={() => handleAction(toggleBlockquote)} disabled={disabled} title="Quote (> quote)" aria-label="Quote">
          <QuoteLeft size={17} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="editor-toolbar-button"
          onClick={() => handleAction((v) => toggleInlineWrap(v, '`', 'code'))}
          disabled={disabled}
          title="Inline Code (`code`)"
          aria-label="Inline Code">
          <Code size={17} aria-hidden="true" />
        </button>
        <button type="button" className="editor-toolbar-button" onClick={() => handleAction(insertCodeBlock)} disabled={disabled} title="Code Block (```)" aria-label="Code Block">
          <CodeBlock size={17} aria-hidden="true" />
        </button>
      </div>

      <span className="editor-toolbar-divider" aria-hidden="true" />

      <div className="editor-toolbar-group">
        <button
          type="button"
          className="editor-toolbar-button"
          onClick={() => handleAction(toggleBulletList)}
          disabled={disabled}
          title="Bulleted List (- item)"
          aria-label="Bulleted List">
          <ListUl size={17} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="editor-toolbar-button"
          onClick={() => handleAction(toggleNumberedList)}
          disabled={disabled}
          title="Numbered List (1. item)"
          aria-label="Numbered List">
          <ListOl size={17} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="editor-toolbar-button"
          onClick={() => handleAction(toggleTaskList)}
          disabled={disabled}
          title="Task List (- [ ] task)"
          aria-label="Task List">
          <CheckboxChecked size={17} aria-hidden="true" />
        </button>
      </div>

      <span className="editor-toolbar-divider" aria-hidden="true" />

      <div className="editor-toolbar-group">
        <button
          type="button"
          className="editor-toolbar-button"
          onClick={() => handleAction(insertLink)}
          disabled={disabled}
          title="Insert Link ([title](url))"
          aria-label="Insert Link">
          <Link size={17} aria-hidden="true" />
        </button>
        <button type="button" className="editor-toolbar-button" onClick={() => handleAction(insertTable)} disabled={disabled} title="Insert Table" aria-label="Insert Table">
          <Table size={17} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
