import dayjs from 'dayjs'
import React, { useMemo } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { markdown } from '@codemirror/lang-markdown'
import {
  EditorView,
  scrollPastEnd,
  MatchDecorator,
  Decoration,
  ViewPlugin,
  DecorationSet,
  ViewUpdate,
} from '@codemirror/view'

import { getActiveNote } from '@/utils/helpers'
import { NoteMenuBar } from '@/containers/NoteMenuBar'
import { EmptyEditor } from '@/components/Editor/EmptyEditor'
import { PreviewEditor } from '@/components/Editor/PreviewEditor'
import { useNotesStore, useSettingsStore } from '@/store'

const linkMatcher = new MatchDecorator({
  regexp: /\{\{[a-z0-9]{6}\}\}/g,
  decoration: () => Decoration.mark({ class: 'cm-notelink' }),
})

const noteLinkPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet
    constructor(view: EditorView) {
      this.decorations = linkMatcher.createDeco(view)
    }
    update(update: ViewUpdate) {
      this.decorations = linkMatcher.updateDeco(update, this.decorations)
    }
  },
  {
    decorations: (instance) => instance.decorations,
  }
)

export const NoteEditor: React.FC = () => {
  // ===========================================================================
  // Stores
  // ===========================================================================

  const { activeNoteId, loading, notes, updateNote } = useNotesStore()
  const { codeMirrorOptions, previewMarkdown, darkTheme } = useSettingsStore()

  const activeNote = getActiveNote(notes, activeNoteId)

  const extensions = useMemo(() => {
    const list = [markdown(), EditorView.lineWrapping, noteLinkPlugin]
    if (codeMirrorOptions.scrollPastEnd) {
      list.push(scrollPastEnd())
    }
    return list
  }, [codeMirrorOptions.scrollPastEnd])

  const renderEditor = () => {
    if (loading) {
      return <div className="empty-editor v-center">Loading...</div>
    } else if (!activeNote) {
      return <EmptyEditor />
    } else if (previewMarkdown) {
      return (
        <PreviewEditor
          directionText={codeMirrorOptions.direction}
          noteText={activeNote.text}
          notes={notes}
        />
      )
    }

    return (
      <CodeMirror
        data-testid="codemirror-editor"
        className="editor mousetrap"
        value={activeNote.text}
        height="100%"
        theme={darkTheme ? 'dark' : 'light'}
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
          })
        }}
      />
    )
  }

  return (
    <main className="note-editor">
      <NoteMenuBar />
      {renderEditor()}
    </main>
  )
}
