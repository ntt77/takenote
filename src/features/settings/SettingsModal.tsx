import React, { useEffect, useRef } from 'react'
import { X, Command, Settings, Archive, Edit2, Download, DownloadCloud, UploadCloud } from '@/icons'

import { shortcutMap, notesSortOptions, directionTextOptions } from '@/utils/constants'
import { CategoryItem, NoteItem, ReactMouseEvent } from '@/types'
import { Option } from '@/features/settings/components/Option'
import { Shortcut } from '@/features/settings/components/Shortcut'
import { SelectOptions } from '@/features/settings/components/SelectOptions'
import { IconButton } from '@/features/settings/components/IconButton'
import { NotesSortKey } from '@/utils/enums'
import { backupNotes, downloadNotes } from '@/utils/helpers'
import { Tabs } from '@/components/ui/Tabs/Tabs'
import { TabPanel } from '@/components/ui/Tabs/TabPanel'
import { LabelText } from '@/constants/LabelText'
import { TestID } from '@/constants/TestID'
import { IconButtonUploader } from '@/features/settings/components/IconButtonUploader'
import { useAuthStore, useCategoriesStore, useNotesStore, useSettingsStore } from '@/store'

export const SettingsModal: React.FC = () => {
  // ===========================================================================
  // Stores
  // ===========================================================================

  const {
    codeMirrorOptions,
    isOpen,
    previewMarkdown,
    darkTheme,
    notesSortKey,
    toggleSettingsModal,
    updateCodeMirrorOption,
    togglePreviewMarkdown,
    toggleDarkTheme,
    updateNotesSortStrategy,
  } = useSettingsStore()
  const { currentUser, logout } = useAuthStore()
  const { notes, activeFolder, activeCategoryId, updateNotes, importNotes } = useNotesStore()
  const { categories, importCategories } = useCategoriesStore()

  const _logout = () => logout()
  const _toggleSettingsModal = () => toggleSettingsModal()
  const _togglePreviewMarkdown = () => togglePreviewMarkdown()
  const _toggleDarkTheme = () => toggleDarkTheme()
  const _updateNotesSortStrategy = (sortBy: NotesSortKey) => updateNotesSortStrategy(sortBy)
  const _updateCodeMirrorOption = (key: string, value: any) =>
    updateCodeMirrorOption({ key, value })
  const _updateNotes = (sortOrderKey: NotesSortKey) =>
    updateNotes({ notes, activeFolder, activeCategoryId, sortOrderKey })
  const _importBackup = (importedNotes: NoteItem[], importedCategories: CategoryItem[]) => {
    importNotes(importedNotes)
    importCategories(importedCategories)
  }

  // ===========================================================================
  // Refs
  // ===========================================================================

  const node = useRef<HTMLDivElement>(null)

  // ===========================================================================
  // Handlers
  // ===========================================================================

  const handleDomClick = (event: ReactMouseEvent) => {
    event.stopPropagation()

    if (node.current && node.current.contains(event.target as HTMLDivElement)) return
    if (isOpen) {
      _toggleSettingsModal()
    }
  }

  const togglePreviewMarkdownHandler = () => _togglePreviewMarkdown()
  const toggleDarkThemeHandler = () => {
    _toggleDarkTheme()
    _updateCodeMirrorOption('theme', darkTheme ? 'base16-light' : 'new-moon')
  }
  const toggleLineHighlight = () =>
    _updateCodeMirrorOption('styleActiveLine', !codeMirrorOptions.styleActiveLine)
  const toggleScrollPastEnd = () =>
    _updateCodeMirrorOption('scrollPastEnd', !codeMirrorOptions.scrollPastEnd)
  const toggleLineNumbersHandler = () =>
    _updateCodeMirrorOption('lineNumbers', !codeMirrorOptions.lineNumbers)
  const handleEscPress = (event: KeyboardEvent) => {
    event.stopPropagation()
    if (event.key === 'Escape' && isOpen) {
      _toggleSettingsModal()
    }
  }
  const updateNotesSortStrategyHandler = (selectedOption: any) => {
    _updateNotesSortStrategy(selectedOption.value)
    _updateNotes(selectedOption.value)
  }
  const updateNotesDirectionHandler = (selectedOption: any) => {
    _updateCodeMirrorOption('direction', selectedOption.value)
  }
  const downloadNotesHandler = () => downloadNotes(notes, categories)
  const backupHandler = () => backupNotes(notes, categories)
  const importBackupHandler = async (json: File) => {
    const content = await json.text()
    const { notes: backupNotesData, categories: backupCategoriesData } = JSON.parse(content) as {
      notes: NoteItem[]
      categories: CategoryItem[]
    }

    if (!backupNotesData || !backupCategoriesData) return

    _importBackup(backupNotesData, backupCategoriesData)
  }

  // ===========================================================================
  // Hooks
  // ===========================================================================

  useEffect(() => {
    document.addEventListener('mousedown', handleDomClick)
    document.addEventListener('keydown', handleEscPress)

    return () => {
      document.removeEventListener('mousedown', handleDomClick)
      document.removeEventListener('keydown', handleEscPress)
    }
  })

  return isOpen ? (
    <div className="dimmer">
      <aside ref={node} className="settings-modal">
        <header className="settings-modal-header">
          <div
            className="close-button"
            onClick={() => {
              if (isOpen) _toggleSettingsModal()
            }}
          >
            <X size={20} />
          </div>

          <section className="profile flex">
            <div>
              {currentUser.avatar_url && (
                <img src={currentUser.avatar_url} alt="Profile" className="profile-picture" />
              )}
            </div>
            <div className="profile-details">
              <h3>{currentUser.name}</h3>
              <div className="subtitle">{currentUser.bio}</div>
            </div>
            <button
              onClick={() => {
                _logout()
              }}
            >
              Log out
            </button>
          </section>
        </header>

        <section className="settings-content">
          <Tabs>
            <TabPanel label="Preferences" icon={Settings}>
              <Option
                title="Active line highlight"
                description="Controls whether the editor should highlight the active line"
                toggle={toggleLineHighlight}
                checked={codeMirrorOptions.styleActiveLine}
                testId={TestID.ACTIVE_LINE_HIGHLIGHT_TOGGLE}
              />
              <Option
                title="Display line numbers"
                description="Controls whether the editor should display line numbers"
                toggle={toggleLineNumbersHandler}
                checked={codeMirrorOptions.lineNumbers}
                testId={TestID.DISPLAY_LINE_NUMS_TOGGLE}
              />
              <Option
                title="Scroll past end"
                description="Controls whether the editor will add blank space to the end of all files"
                toggle={toggleScrollPastEnd}
                checked={codeMirrorOptions.scrollPastEnd}
                testId={TestID.SCROLL_PAST_END_TOGGLE}
              />
              <Option
                title="Markdown preview"
                description="Controls whether markdown preview mode is enabled"
                toggle={togglePreviewMarkdownHandler}
                checked={previewMarkdown}
                testId={TestID.MARKDOWN_PREVIEW_TOGGLE}
              />
              <Option
                title="Dark mode"
                description="Controls the theme of the application and editor"
                toggle={toggleDarkThemeHandler}
                checked={darkTheme}
                testId={TestID.DARK_MODE_TOGGLE}
              />
              <SelectOptions
                title="Sort By"
                description="Controls the sort strategy of the notes"
                onChange={updateNotesSortStrategyHandler}
                options={notesSortOptions}
                selectedValue={notesSortKey}
                testId={TestID.SORT_BY_DROPDOWN}
              />
              <SelectOptions
                title="Text direction"
                description="Controls the direction of the text"
                onChange={updateNotesDirectionHandler}
                options={directionTextOptions}
                selectedValue={codeMirrorOptions.direction}
                testId={TestID.TEXT_DIRECTION_DROPDOWN}
              />
            </TabPanel>
            <TabPanel label="Keyboard shortcuts" icon={Command}>
              {shortcutMap.map((shortcut) => (
                <Shortcut action={shortcut.action} letter={shortcut.key} key={shortcut.key} />
              ))}
            </TabPanel>
            <TabPanel label="Data management" icon={Archive}>
              <p>Download all notes as Markdown files in a zip.</p>
              <IconButton
                dataTestID={TestID.SETTINGS_MODAL_DOWNLOAD_NOTES}
                handler={downloadNotesHandler}
                icon={Download}
                text={LabelText.DOWNLOAD_ALL_NOTES}
              />
              <p>Export TakeNote data as JSON.</p>
              <IconButton
                handler={backupHandler}
                icon={DownloadCloud}
                text={LabelText.BACKUP_ALL_NOTES}
              />
              <p>Import TakeNote JSON file.</p>
              <IconButtonUploader
                dataTestID={TestID.UPLOAD_SETTINGS_BACKUP}
                accept=".json"
                handler={importBackupHandler}
                icon={UploadCloud}
                text={LabelText.IMPORT_BACKUP}
              />
            </TabPanel>
            <TabPanel label="About TakeNote" icon={Edit2}>
              <p>
                TakeNote is a minimalist note-taking web app for developers. Write in plain text or
                Markdown in an IDE-like environment.
              </p>
              <p>
                This app has no tracking or analytics and does not retain any user data. Notes are
                persisted in local storage and can be downloaded as Markdown files from the data
                management tab.
              </p>
              <p>
                TakeNote was created by{' '}
                <a href="https://www.taniarascia.com" target="_blank" rel="noreferrer">
                  Tania Rascia
                </a>{' '}
                with the help of{' '}
                <a
                  href="https://github.com/taniarascia/takenote/graphs/contributors"
                  target="_blank"
                  rel="noreferrer"
                >
                  the open-source community
                </a>
                .
              </p>
              <p>
                <a
                  className="button"
                  href="https://github.com/taniarascia/takenote"
                  target="_blank"
                  rel="noreferrer"
                >
                  View source
                </a>
              </p>
            </TabPanel>
          </Tabs>
        </section>
      </aside>
    </div>
  ) : null
}
