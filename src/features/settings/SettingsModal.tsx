import type { FC } from 'react';
import { X, Command, Settings, Archive, Edit2, Download, DownloadCloud, UploadCloud } from '@/icons';

import { shortcutMap, notesSortOptions, directionTextOptions } from '@/utils/constants';
import { CategoryItem, NoteItem } from '@/types';
import { Option } from '@/features/settings/components/Option';
import { Shortcut } from '@/features/settings/components/Shortcut';
import { SelectOptions } from '@/features/settings/components/SelectOptions';
import { IconButton } from '@/features/settings/components/IconButton';
import { NotesSortKey } from '@/utils/enums';
import { backupNotes, downloadNotes } from '@/utils/helpers';
import { Dialog, Tabs } from '@radix-ui/themes';
import { LabelText } from '@/constants/LabelText';
import { TestID } from '@/constants/TestID';
import { IconButtonUploader } from '@/features/settings/components/IconButtonUploader';
import { useCategoriesStore, useNotesStore, useSettingsStore } from '@/store';

export const SettingsModal: FC = () => {
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
  } = useSettingsStore();
  const { notes, activeFolder, activeCategoryId, updateNotes, importNotes } = useNotesStore();
  const { categories, importCategories } = useCategoriesStore();

  const _toggleSettingsModal = () => toggleSettingsModal();
  const _togglePreviewMarkdown = () => togglePreviewMarkdown();
  const _toggleDarkTheme = () => toggleDarkTheme();
  const _updateNotesSortStrategy = (sortBy: NotesSortKey) => updateNotesSortStrategy(sortBy);
  const _updateCodeMirrorOption = (key: string, value: any) => updateCodeMirrorOption({ key, value });
  const _updateNotes = (sortOrderKey: NotesSortKey) => updateNotes({ notes, activeFolder, activeCategoryId, sortOrderKey });
  const _importBackup = (importedNotes: NoteItem[], importedCategories: CategoryItem[]) => {
    importNotes(importedNotes);
    importCategories(importedCategories);
  };

  // ===========================================================================
  // Handlers
  // ===========================================================================

  const togglePreviewMarkdownHandler = () => _togglePreviewMarkdown();
  const toggleDarkThemeHandler = () => {
    _toggleDarkTheme();
    _updateCodeMirrorOption('theme', darkTheme ? 'base16-light' : 'new-moon');
  };
  const toggleLineHighlight = () => _updateCodeMirrorOption('styleActiveLine', !codeMirrorOptions.styleActiveLine);
  const toggleScrollPastEnd = () => _updateCodeMirrorOption('scrollPastEnd', !codeMirrorOptions.scrollPastEnd);
  const toggleLineNumbersHandler = () => _updateCodeMirrorOption('lineNumbers', !codeMirrorOptions.lineNumbers);
  const updateNotesSortStrategyHandler = (selectedOption: any) => {
    _updateNotesSortStrategy(selectedOption.value);
    _updateNotes(selectedOption.value);
  };
  const updateNotesDirectionHandler = (selectedOption: any) => {
    _updateCodeMirrorOption('direction', selectedOption.value);
  };
  const downloadNotesHandler = () => downloadNotes(notes, categories);
  const backupHandler = () => backupNotes(notes, categories);
  const importBackupHandler = async (json: File) => {
    const content = await json.text();
    const { notes: backupNotesData, categories: backupCategoriesData } = JSON.parse(content) as {
      notes: NoteItem[];
      categories: CategoryItem[];
    };

    if (!backupNotesData || !backupCategoriesData) return;

    _importBackup(backupNotesData, backupCategoriesData);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && _toggleSettingsModal()}>
      <Dialog.Content className="settings-modal" style={{ maxWidth: 850, padding: 0 }}>
        <Dialog.Title className="sr-only">Settings</Dialog.Title>
        <Dialog.Description className="sr-only">TakeNote application settings</Dialog.Description>
        <header className="settings-modal-header">
          <div className="close-button" onClick={_toggleSettingsModal}>
            <X size={20} />
          </div>

          <h2>Settings</h2>
        </header>

        <section className="settings-content">
          <Tabs.Root defaultValue="preferences" orientation="vertical" className="tabs">
            <Tabs.List className="tab-list">
              <Tabs.Trigger value="preferences" className="tab">
                <Settings size={18} aria-hidden="true" />
                <span>Preferences</span>
              </Tabs.Trigger>
              <Tabs.Trigger value="shortcuts" className="tab">
                <Command size={18} aria-hidden="true" />
                <span>Keyboard shortcuts</span>
              </Tabs.Trigger>
              <Tabs.Trigger value="data" className="tab">
                <Archive size={18} aria-hidden="true" />
                <span>Data management</span>
              </Tabs.Trigger>
              <Tabs.Trigger value="about" className="tab">
                <Edit2 size={18} aria-hidden="true" />
                <span>About TakeNote</span>
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="preferences" className="tab-content">
              <h3>Preferences</h3>
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
            </Tabs.Content>

            <Tabs.Content value="shortcuts" className="tab-content">
              <h3>Keyboard shortcuts</h3>
              {shortcutMap.map((shortcut) => (
                <Shortcut action={shortcut.action} letter={shortcut.key} key={shortcut.key} />
              ))}
            </Tabs.Content>

            <Tabs.Content value="data" className="tab-content">
              <h3>Data management</h3>
              <p>Download all notes as Markdown files in a zip.</p>
              <IconButton dataTestID={TestID.SETTINGS_MODAL_DOWNLOAD_NOTES} handler={downloadNotesHandler} icon={Download} text={LabelText.DOWNLOAD_ALL_NOTES} />
              <p>Export TakeNote data as JSON.</p>
              <IconButton handler={backupHandler} icon={DownloadCloud} text={LabelText.BACKUP_ALL_NOTES} />
              <p>Import TakeNote JSON file.</p>
              <IconButtonUploader dataTestID={TestID.UPLOAD_SETTINGS_BACKUP} accept=".json" handler={importBackupHandler} icon={UploadCloud} text={LabelText.IMPORT_BACKUP} />
            </Tabs.Content>

            <Tabs.Content value="about" className="tab-content">
              <h3>About TakeNote</h3>
              <p>TakeNote is a minimalist note-taking web app for developers. Write in plain text or Markdown in an IDE-like environment.</p>
              <p>
                This app has no tracking or analytics and does not retain any user data. Notes are persisted in local storage and can be downloaded as Markdown files from the data
                management tab.
              </p>
              <p>
                TakeNote was created by{' '}
                <a href="https://www.taniarascia.com" target="_blank" rel="noreferrer">
                  Tania Rascia
                </a>{' '}
                with the help of{' '}
                <a href="https://github.com/taniarascia/takenote/graphs/contributors" target="_blank" rel="noreferrer">
                  the open-source community
                </a>
                .
              </p>
              <p>
                <a className="button" href="https://github.com/taniarascia/takenote" target="_blank" rel="noreferrer">
                  View source
                </a>
              </p>
            </Tabs.Content>
          </Tabs.Root>
        </section>
      </Dialog.Content>
    </Dialog.Root>
  );
};
