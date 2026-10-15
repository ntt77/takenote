import dayjs from 'dayjs';
import { useMemo, useRef, useCallback } from 'react';
import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { EditorView, scrollPastEnd, MatchDecorator, Decoration, ViewPlugin, DecorationSet, ViewUpdate } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { indentUnit } from '@codemirror/language';
import { Center, Loader, Box } from '@mantine/core';

import { getActiveNote } from '@/utils/helpers';
import { NoteMenuBar } from '@/features/editor/NoteMenuBar';
import { EmptyEditor } from '@/features/editor/components/EmptyEditor';
import { PreviewEditor } from '@/features/editor/components/PreviewEditor';
import { EditorToolbar } from '@/features/editor/components/EditorToolbar';
import { bbedit } from '@uiw/codemirror-theme-bbedit';
import { useNotesStore, useSettingsStore } from '@/store';

const linkMatcher = new MatchDecorator({
  regexp: /\{\{[a-z0-9]{6}\}\}/g,
  decoration: () => Decoration.mark({ class: 'cm-notelink' }),
});

const noteLinkPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;
    constructor(view: EditorView) {
      this.decorations = linkMatcher.createDeco(view);
    }
    update(update: ViewUpdate) {
      this.decorations = linkMatcher.updateDeco(update, this.decorations);
    }
  },
  {
    decorations: (instance) => instance.decorations,
  }
);

const editorBaseTheme = EditorView.theme({
  '&': {
    height: '100%',
    flex: 1,
    overflowY: 'auto',
  },
  '.cm-editor': {
    height: '100%',
  },
  '.cm-scroller': {
    paddingBottom: '4rem',
  },
  '.cm-notelink': {
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: '#0daba3',
  },
});

export const NoteEditor = () => {
  // ===========================================================================
  // Stores
  // ===========================================================================

  const { activeNoteId, loading, notes, updateNote } = useNotesStore();
  const { codeMirrorOptions, previewMarkdown } = useSettingsStore();

  const activeNote = getActiveNote(notes, activeNoteId);

  const editorRef = useRef<ReactCodeMirrorRef>(null);
  const getView = useCallback(() => editorRef.current?.view, []);

  const extensions = useMemo(() => {
    const currentFontSize = codeMirrorOptions.fontSize || '14px';
    const currentTabSize = Number(codeMirrorOptions.tabSize) || 4;

    const fontSizeTheme = EditorView.theme({
      '&': { fontSize: currentFontSize },
      '.cm-content': { fontSize: currentFontSize },
      '.cm-gutters': { fontSize: currentFontSize },
    });

    const list = [markdown(), noteLinkPlugin, editorBaseTheme, fontSizeTheme, EditorState.tabSize.of(currentTabSize), indentUnit.of(' '.repeat(currentTabSize))];

    if (codeMirrorOptions.lineWrapping) {
      list.push(EditorView.lineWrapping);
    }

    if (codeMirrorOptions.scrollPastEnd) {
      list.push(scrollPastEnd());
    }

    return list;
  }, [codeMirrorOptions.fontSize, codeMirrorOptions.tabSize, codeMirrorOptions.lineWrapping, codeMirrorOptions.scrollPastEnd]);

  const renderEditor = () => {
    if (loading) {
      return (
        <Center style={{ flex: 1, height: '100%' }}>
          <Loader size="md" />
        </Center>
      );
    } else if (!activeNote) {
      return <EmptyEditor />;
    } else if (previewMarkdown) {
      return <PreviewEditor noteText={activeNote.text} notes={notes} />;
    }

    return (
      <CodeMirror
        ref={editorRef}
        className="editor mousetrap"
        value={activeNote.text}
        height="100%"
        theme={bbedit}
        basicSetup={{
          lineNumbers: !!codeMirrorOptions.lineNumbers,
          highlightActiveLine: !!codeMirrorOptions.styleActiveLine,
          foldGutter: false,
          dropCursor: false,
          allowMultipleSelections: true,
          indentOnInput: true,
        }}
        extensions={extensions}
        onChange={(value) => {
          updateNote({
            id: activeNote.id,
            text: value,
            created: activeNote.created,
            lastUpdated: dayjs().format(),
          });
        }}
      />
    );
  };

  return (
    <Box
      component="main"
      style={{
        position: 'relative',
        minWidth: 300,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}>
      {activeNote && !previewMarkdown && <EditorToolbar getView={getView} />}
      <NoteMenuBar />
      {renderEditor()}
    </Box>
  );
};
