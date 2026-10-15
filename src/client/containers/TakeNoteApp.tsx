import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { Group, Panel, Separator } from 'react-resizable-panels'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'

import { AppSidebar } from '@/containers/AppSidebar'
import { KeyboardShortcuts } from '@/containers/KeyboardShortcuts'
import { NoteEditor } from '@/containers/NoteEditor'
import { NoteList } from '@/containers/NoteList'
import { SettingsModal } from '@/containers/SettingsModal'
import { TempStateProvider } from '@/contexts/TempStateContext'
import { Folder } from '@/utils/enums'
import {
  getWebsiteTitle,
  determineAppClass,
  getActiveCategory,
  getDayJsLocale,
} from '@/utils/helpers'
import { loadCategories, swapCategories } from '@/slices/category'
import { loadNotes } from '@/slices/note'
import { loadSettings } from '@/slices/settings'
import { getSettings, getNotes, getCategories } from '@/selectors'

dayjs.extend(localizedFormat)
dayjs.locale(getDayJsLocale(navigator.language))

export const TakeNoteApp: React.FC = () => {
  // ===========================================================================
  // Selectors
  // ===========================================================================

  const { darkTheme, sidebarVisible } = useSelector(getSettings)
  const { activeFolder, activeCategoryId, notes, loading: notesLoading } = useSelector(getNotes)
  const { categories, loading: categoriesLoading } = useSelector(getCategories)

  const activeCategory = getActiveCategory(categories, activeCategoryId)

  // ===========================================================================
  // Dispatch
  // ===========================================================================

  const dispatch = useDispatch()

  const _swapCategories = (categoryId: number, destinationId: number) =>
    dispatch(swapCategories({ categoryId, destinationId }))

  // ===========================================================================
  // Handlers
  // ===========================================================================

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result

    if (!destination) return

    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    if (result.type === 'CATEGORY') {
      _swapCategories(source.index, destination.index)
    }
  }

  // ===========================================================================
  // Hooks
  // ===========================================================================

  useEffect(() => {
    dispatch(loadNotes())
    dispatch(loadCategories())
    dispatch(loadSettings())
  }, [dispatch])

  // Auto-save notes to localStorage
  useEffect(() => {
    if (!notesLoading) {
      localStorage.setItem('notes', JSON.stringify(notes))
    }
  }, [notes, notesLoading])

  // Auto-save categories to localStorage
  useEffect(() => {
    if (!categoriesLoading) {
      localStorage.setItem('categories', JSON.stringify(categories))
    }
  }, [categories, categoriesLoading])

  return (
    <>
      <meta charSet="utf-8" />
      <title>{getWebsiteTitle(activeFolder, activeCategory)}</title>
      <link rel="canonical" href="https://takenote.dev" />

      <TempStateProvider>
        <div className={determineAppClass(darkTheme, sidebarVisible, activeFolder)}>
          <DragDropContext onDragEnd={onDragEnd}>
            <Group
              orientation="horizontal"
              id={
                activeFolder === Folder.SCRATCHPAD
                  ? 'takenote-scratchpad-layout'
                  : 'takenote-main-layout'
              }
            >
              <Panel id="sidebar" defaultSize={240} minSize={150} maxSize={500}>
                <AppSidebar />
              </Panel>
              <Separator className="Resizer vertical" />
              {activeFolder !== Folder.SCRATCHPAD && (
                <>
                  <Panel id="notes" defaultSize={330} minSize={200} maxSize={600}>
                    <NoteList />
                  </Panel>
                  <Separator className="Resizer vertical" />
                </>
              )}
              <Panel id="editor" minSize={300}>
                <NoteEditor />
              </Panel>
            </Group>
          </DragDropContext>
          <KeyboardShortcuts />
          <SettingsModal />
        </div>
      </TempStateProvider>
    </>
  )
}
