import React from 'react';
import { Tooltip } from '@radix-ui/themes';
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
        <Tooltip content="Bold (**text**)">
          <button type="button" className="editor-toolbar-button" onClick={() => handleAction((v) => toggleInlineWrap(v, '**', 'bold text'))} disabled={disabled} aria-label="Bold">
            <Bold size={17} aria-hidden="true" />
          </button>
        </Tooltip>
        <Tooltip content="Italic (*text*)">
          <button
            type="button"
            className="editor-toolbar-button"
            onClick={() => handleAction((v) => toggleInlineWrap(v, '*', 'italic text'))}
            disabled={disabled}
            aria-label="Italic">
            <Italic size={17} aria-hidden="true" />
          </button>
        </Tooltip>
        <Tooltip content="Strikethrough (~~text~~)">
          <button
            type="button"
            className="editor-toolbar-button"
            onClick={() => handleAction((v) => toggleInlineWrap(v, '~~', 'strikethrough text'))}
            disabled={disabled}
            aria-label="Strikethrough">
            <Strikethrough size={17} aria-hidden="true" />
          </button>
        </Tooltip>
      </div>

      <span className="editor-toolbar-divider" aria-hidden="true" />

      <div className="editor-toolbar-group">
        <Tooltip content="Heading (# H1 / ## H2 / ### H3)">
          <button type="button" className="editor-toolbar-button" onClick={() => handleAction(toggleHeading)} disabled={disabled} aria-label="Heading">
            <Heading size={17} aria-hidden="true" />
          </button>
        </Tooltip>
        <Tooltip content="Quote (> quote)">
          <button type="button" className="editor-toolbar-button" onClick={() => handleAction(toggleBlockquote)} disabled={disabled} aria-label="Quote">
            <QuoteLeft size={17} aria-hidden="true" />
          </button>
        </Tooltip>
        <Tooltip content="Inline Code (`code`)">
          <button
            type="button"
            className="editor-toolbar-button"
            onClick={() => handleAction((v) => toggleInlineWrap(v, '`', 'code'))}
            disabled={disabled}
            aria-label="Inline Code">
            <Code size={17} aria-hidden="true" />
          </button>
        </Tooltip>
        <Tooltip content="Code Block (```)">
          <button type="button" className="editor-toolbar-button" onClick={() => handleAction(insertCodeBlock)} disabled={disabled} aria-label="Code Block">
            <CodeBlock size={17} aria-hidden="true" />
          </button>
        </Tooltip>
      </div>

      <span className="editor-toolbar-divider" aria-hidden="true" />

      <div className="editor-toolbar-group">
        <Tooltip content="Bulleted List (- item)">
          <button type="button" className="editor-toolbar-button" onClick={() => handleAction(toggleBulletList)} disabled={disabled} aria-label="Bulleted List">
            <ListUl size={17} aria-hidden="true" />
          </button>
        </Tooltip>
        <Tooltip content="Numbered List (1. item)">
          <button type="button" className="editor-toolbar-button" onClick={() => handleAction(toggleNumberedList)} disabled={disabled} aria-label="Numbered List">
            <ListOl size={17} aria-hidden="true" />
          </button>
        </Tooltip>
        <Tooltip content="Task List (- [ ] task)">
          <button type="button" className="editor-toolbar-button" onClick={() => handleAction(toggleTaskList)} disabled={disabled} aria-label="Task List">
            <CheckboxChecked size={17} aria-hidden="true" />
          </button>
        </Tooltip>
      </div>

      <span className="editor-toolbar-divider" aria-hidden="true" />

      <div className="editor-toolbar-group">
        <Tooltip content="Insert Link ([title](url))">
          <button type="button" className="editor-toolbar-button" onClick={() => handleAction(insertLink)} disabled={disabled} aria-label="Insert Link">
            <Link size={17} aria-hidden="true" />
          </button>
        </Tooltip>
        <Tooltip content="Insert Table">
          <button type="button" className="editor-toolbar-button" onClick={() => handleAction(insertTable)} disabled={disabled} aria-label="Insert Table">
            <Table size={17} aria-hidden="true" />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};
