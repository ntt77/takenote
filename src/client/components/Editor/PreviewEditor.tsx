import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useDispatch } from 'react-redux'

import { Folder } from '@/utils/enums'
import { updateActiveNote, updateSelectedNotes, pruneNotes, swapFolder } from '@/slices/note'
import { NoteItem } from '@/types'

import { uuidPlugin } from '../../utils/reactMarkdownPlugins'

import NoteLink from './NoteLink'

export interface PreviewEditorProps {
  noteText: string
  directionText: string
  notes: NoteItem[]
}

export const PreviewEditor: React.FC<PreviewEditorProps> = ({ noteText, directionText, notes }) => {
  // ===========================================================================
  // Dispatch
  // ===========================================================================

  const dispatch = useDispatch()

  const _updateSelectedNotes = (noteId: string, multiSelect: boolean) =>
    dispatch(updateSelectedNotes({ noteId, multiSelect }))

  const _updateActiveNote = (noteId: string, multiSelect: boolean) =>
    dispatch(updateActiveNote({ noteId, multiSelect }))

  const _pruneNotes = () => dispatch(pruneNotes())

  const _swapFolder = (folder: Folder) => dispatch(swapFolder({ folder }))

  // ===========================================================================
  // Handlers
  // ===========================================================================

  const handleNoteLinkClick = (e: React.SyntheticEvent, note: NoteItem) => {
    e.preventDefault()

    if (note) {
      _updateActiveNote(note.id, false)
      _updateSelectedNotes(note.id, false)
      _pruneNotes()

      if (note?.favorite) return _swapFolder(Folder.FAVORITES)
      if (note?.scratchpad) return _swapFolder(Folder.SCRATCHPAD)
      if (note?.trash) return _swapFolder(Folder.TRASH)

      return _swapFolder(Folder.ALL)
    }
  }

  const returnNoteLink = (value: string) => {
    return <NoteLink uuid={value} notes={notes} handleNoteLinkClick={handleNoteLinkClick} />
  }

  return (
    <div className={`previewer previewer_direction-${directionText}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, uuidPlugin]}
        components={{
          // @ts-expect-error custom hast element from uuidPlugin
          uuid: ({ value }: { value?: string }) => (value ? returnNoteLink(value) : null),
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {noteText}
      </ReactMarkdown>
    </div>
  )
}
