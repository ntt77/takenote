import React from 'react'
import { Plus } from '@/icons'

import { LabelText } from '@resources/LabelText'
import { TestID } from '@resources/TestID'
import { ActionButton } from '@/components/AppSidebar/ActionButton'
import { FolderOption } from '@/components/AppSidebar/FolderOption'
import { ScratchpadOption } from '@/components/AppSidebar/ScratchpadOption'
import { Folder } from '@/utils/enums'
import { CategoryList } from '@/containers/CategoryList'
import { NoteItem } from '@/types'
import { newNoteHandlerHelper, getActiveNote } from '@/utils/helpers'
import { useNotesStore, useSettingsStore } from '@/store'

export const AppSidebar: React.FC = () => {
  // ===========================================================================
  // Stores
  // ===========================================================================

  const {
    activeCategoryId,
    activeFolder,
    activeNoteId,
    notes,
    addNote,
    swapFolder,
    updateActiveNote,
    assignFavoriteToNotes,
    assignTrashToNotes,
    updateSelectedNotes,
    unassignTrashFromNotes,
  } = useNotesStore()
  const { previewMarkdown, notesSortKey, togglePreviewMarkdown } = useSettingsStore()

  const activeNote = getActiveNote(notes, activeNoteId)

  const _addNote = (note: NoteItem) => addNote(note)
  const _updateActiveNote = (noteId: string, multiSelect: boolean) =>
    updateActiveNote({ noteId, multiSelect })
  const _updateSelectedNotes = (noteId: string, multiSelect: boolean) =>
    updateSelectedNotes({ noteId, multiSelect })
  const _swapFolder = (folder: Folder) =>
    swapFolder({ folder, sortOrderKey: notesSortKey })
  const _togglePreviewMarkdown = () => togglePreviewMarkdown()
  const _assignTrashToNotes = (noteId: string) => assignTrashToNotes(noteId)
  const _unassignTrashFromNotes = (noteId: string) => unassignTrashFromNotes(noteId)
  const _assignFavoriteToNotes = (noteId: string) => assignFavoriteToNotes(noteId)

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

  return (
    <aside className="app-sidebar">
      <ActionButton
        dataTestID={TestID.SIDEBAR_ACTION_CREATE_NEW_NOTE}
        handler={newNoteHandler}
        icon={Plus}
        label={LabelText.CREATE_NEW_NOTE}
        text={LabelText.NEW_NOTE}
      />
      <section className="app-sidebar-main">
        <ScratchpadOption
          active={activeFolder === Folder.SCRATCHPAD}
          swapFolder={_swapFolder}
        />
        <FolderOption
          active={activeFolder === Folder.ALL}
          swapFolder={_swapFolder}
          text={LabelText.NOTES}
          dataTestID={TestID.FOLDER_NOTES}
          folder={Folder.ALL}
          addNoteType={_unassignTrashFromNotes}
        />
        <FolderOption
          active={activeFolder === Folder.FAVORITES}
          text={LabelText.FAVORITES}
          dataTestID={TestID.FOLDER_FAVORITES}
          folder={Folder.FAVORITES}
          swapFolder={_swapFolder}
          addNoteType={_assignFavoriteToNotes}
        />
        <FolderOption
          active={activeFolder === Folder.TRASH}
          text={LabelText.TRASH}
          dataTestID={TestID.FOLDER_TRASH}
          folder={Folder.TRASH}
          swapFolder={_swapFolder}
          addNoteType={_assignTrashToNotes}
        />
        <CategoryList />
      </section>
    </aside>
  )
}
