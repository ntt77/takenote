import React from 'react'
import prettier from 'prettier/standalone'
import parserMarkdown from 'prettier/parser-markdown'

import { Folder, Shortcuts } from '@/utils/enums'
import { downloadNotes, getActiveNote, newNoteHandlerHelper } from '@/utils/helpers'
import { useKey } from '@/utils/hooks'
import { NoteItem } from '@/types'
import { useCategoriesStore, useNotesStore, useSettingsStore } from '@/store'

export const KeyboardShortcuts: React.FC = () => {
  // ===========================================================================
  // Stores
  // ===========================================================================

  const { categories, addingTempCategory, setAddingTempCategory } = useCategoriesStore()
  const {
    activeCategoryId,
    activeFolder,
    activeNoteId,
    notes,
    selectedNotesIds,
    addNote,
    swapFolder,
    toggleTrashNotes,
    updateActiveNote,
    updateSelectedNotes,
    updateNote,
  } = useNotesStore()
  const {
    darkTheme,
    previewMarkdown,
    toggleDarkTheme,
    togglePreviewMarkdown,
    updateCodeMirrorOption,
  } = useSettingsStore()

  const activeNote = getActiveNote(notes, activeNoteId)

  const _addNote = (note: NoteItem) => addNote(note)
  const _updateActiveNote = (noteId: string, multiSelect: boolean) =>
    updateActiveNote({ noteId, multiSelect })
  const _updateSelectedNotes = (noteId: string, multiSelect: boolean) =>
    updateSelectedNotes({ noteId, multiSelect })
  const _swapFolder = (folder: Folder) => swapFolder({ folder })
  const _toggleTrashNotes = (noteId: string) => toggleTrashNotes(noteId)
  const _togglePreviewMarkdown = () => togglePreviewMarkdown()
  const _toggleDarkTheme = () => toggleDarkTheme()
  const _updateCodeMirrorOption = (key: string, value: string) =>
    updateCodeMirrorOption({ key, value })

  // ===========================================================================
  // Handlers
  // ===========================================================================

  const newNoteHandler = () =>
    newNoteHandlerHelper(
      activeFolder,
      previewMarkdown,
      activeNote,
      activeCategoryId,
      _swapFolder,
      _togglePreviewMarkdown,
      _addNote,
      _updateActiveNote,
      _updateSelectedNotes
    )
  const newTempCategoryHandler = () => !addingTempCategory && setAddingTempCategory(true)
  const trashNoteHandler = () => _toggleTrashNotes(activeNote!.id)
  const downloadNotesHandler = () => {
    if (!activeNote || selectedNotesIds.length === 0) return
    downloadNotes(
      selectedNotesIds.includes(activeNote.id)
        ? notes.filter((note) => selectedNotesIds.includes(note.id))
        : [activeNote],
      categories
    )
  }
  const togglePreviewMarkdownHandler = () => _togglePreviewMarkdown()
  const toggleDarkThemeHandler = () => {
    _toggleDarkTheme()
    _updateCodeMirrorOption('theme', darkTheme ? 'base16-light' : 'new-moon')
  }
  const prettifyNoteHandler = () => {
    if (activeNote && activeNote.text) {
      const formattedText = prettier.format(activeNote.text, {
        parser: 'markdown',
        plugins: [parserMarkdown],
      })

      const updatedNote = {
        ...activeNote,
        text: formattedText,
      }

      updateNote(updatedNote)
    }
  }

  // ===========================================================================
  // Hooks
  // ===========================================================================

  useKey(Shortcuts.NEW_NOTE, () => newNoteHandler())
  useKey(Shortcuts.NEW_CATEGORY, () => newTempCategoryHandler())
  useKey(Shortcuts.DELETE_NOTE, () => trashNoteHandler())
  useKey(Shortcuts.DOWNLOAD_NOTES, () => downloadNotesHandler())
  useKey(Shortcuts.PREVIEW, () => togglePreviewMarkdownHandler())
  useKey(Shortcuts.TOGGLE_THEME, () => toggleDarkThemeHandler())
  useKey(Shortcuts.PRETTIFY, () => prettifyNoteHandler())

  return null
}
