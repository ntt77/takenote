import { FC, useEffect, useRef } from 'react';
import { Modal, Tabs, Button } from '@mantine/core';
import { FcSettings, FcTodoList, FcDatabase, FcInfo, FcDownload, FcExport, FcImport } from 'react-icons/fc';

import { shortcutMap, notesSortOptions, directionTextOptions } from '@/utils/constants';
import { CategoryItem, NoteItem } from '@/types';
import { Option } from '@/features/settings/components/Option';
import { Shortcut } from '@/features/settings/components/Shortcut';
import { SelectOptions } from '@/features/settings/components/SelectOptions';
import { IconButton } from '@/features/settings/components/IconButton';
import { NotesSortKey } from '@/utils/enums';
import { backupNotes, downloadNotes } from '@/utils/helpers';
import { IconButtonUploader } from '@/features/settings/components/IconButtonUploader';
import { useCategoriesStore, useNotesStore, useSettingsStore } from '@/store';

export const SettingsModal: FC = () => {
  // ===========================================================================
  // Stores
  // ===========================================================================

  const { codeMirrorOptions, isOpen, previewMarkdown, notesSortKey, toggleSettingsModal, updateCodeMirrorOption, togglePreviewMarkdown, updateNotesSortStrategy } =
    useSettingsStore();
  const { notes, activeFolder, activeCategoryId, updateNotes, importNotes } = useNotesStore();
  const { categories, importCategories } = useCategoriesStore();

  const _toggleSettingsModal = () => toggleSettingsModal();
  const _togglePreviewMarkdown = () => togglePreviewMarkdown();
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

  const initialSettingsRef = useRef<{
    codeMirrorOptions: typeof codeMirrorOptions;
    previewMarkdown: boolean;
    notesSortKey: NotesSortKey;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      initialSettingsRef.current = {
        codeMirrorOptions: { ...codeMirrorOptions },
        previewMarkdown,
        notesSortKey,
      };
    }
  }, [isOpen]);

  const handleCancel = () => {
    if (initialSettingsRef.current) {
      const init = initialSettingsRef.current;
      Object.entries(init.codeMirrorOptions).forEach(([key, value]) => {
        _updateCodeMirrorOption(key, value);
      });
      if (previewMarkdown !== init.previewMarkdown) {
        _togglePreviewMarkdown();
      }
      if (notesSortKey !== init.notesSortKey) {
        _updateNotesSortStrategy(init.notesSortKey);
        _updateNotes(init.notesSortKey);
      }
    }
    _toggleSettingsModal();
  };

  const handleOk = () => {
    _toggleSettingsModal();
  };

  return (
    <Modal
      opened={isOpen}
      onClose={handleCancel}
      title="Settings"
      size={700}
      centered
      padding="md"
      styles={{
        content: {
          width: 700,
          maxWidth: '94vw',
          height: 660,
          maxHeight: 'calc(100dvh - 2.5rem)',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '12px',
          overflow: 'hidden',
        },
        header: {
          flexShrink: 0,
        },
        body: {
          padding: '0.75rem 1.25rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
        },
      }}>
      <div className="settings-content" style={{ display: 'flex', flex: 1, minHeight: 0, height: '100%', overflow: 'hidden' }}>
        <Tabs
          defaultValue="preferences"
          orientation="vertical"
          variant="pills"
          style={{ display: 'flex', flex: 1, height: '100%', minHeight: 0, overflow: 'hidden' }}
          styles={{
            tab: {
              justifyContent: 'flex-start',
              textAlign: 'left',
              padding: '9px 12px',
              borderRadius: '8px',
            },
            tabSection: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 20,
              minWidth: 20,
              marginRight: 10,
              flexShrink: 0,
            },
            tabLabel: {
              textAlign: 'left',
              fontWeight: 500,
            },
          }}>
          <Tabs.List style={{ width: 210, minWidth: 210, flexShrink: 0, borderRight: '1px solid #e9ecef', paddingRight: '0.75rem', gap: 4, overflowY: 'auto' }}>
            <Tabs.Tab value="preferences" leftSection={<FcSettings size={20} aria-hidden="true" />}>
              Preferences
            </Tabs.Tab>
            <Tabs.Tab value="shortcuts" leftSection={<FcTodoList size={20} aria-hidden="true" />}>
              Keyboard shortcuts
            </Tabs.Tab>
            <Tabs.Tab value="data" leftSection={<FcDatabase size={20} aria-hidden="true" />}>
              Data management
            </Tabs.Tab>
            <Tabs.Tab value="about" leftSection={<FcInfo size={20} aria-hidden="true" />}>
              About TakeNote
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="preferences" style={{ flex: 1, height: '100%', minHeight: 0, overflowY: 'auto', paddingLeft: '1.5rem', paddingRight: '0.5rem' }}>
            <h3 className="settings-panel-title">Preferences</h3>
            <Option
              title="Active line highlight"
              description="Controls whether the editor should highlight the active line"
              toggle={toggleLineHighlight}
              checked={codeMirrorOptions.styleActiveLine}
            />
            <Option
              title="Display line numbers"
              description="Controls whether the editor should display line numbers"
              toggle={toggleLineNumbersHandler}
              checked={codeMirrorOptions.lineNumbers}
            />
            <Option
              title="Scroll past end"
              description="Controls whether the editor will add blank space to the end of all files"
              toggle={toggleScrollPastEnd}
              checked={codeMirrorOptions.scrollPastEnd}
            />
            <Option title="Markdown preview" description="Controls whether markdown preview mode is enabled" toggle={togglePreviewMarkdownHandler} checked={previewMarkdown} />
            <SelectOptions
              title="Sort By"
              description="Controls the sort strategy of the notes"
              onChange={updateNotesSortStrategyHandler}
              options={notesSortOptions}
              selectedValue={notesSortKey}
            />
            <SelectOptions
              title="Text direction"
              description="Controls the direction of the text"
              onChange={updateNotesDirectionHandler}
              options={directionTextOptions}
              selectedValue={codeMirrorOptions.direction}
            />
          </Tabs.Panel>

          <Tabs.Panel value="shortcuts" style={{ flex: 1, height: '100%', minHeight: 0, overflowY: 'auto', paddingLeft: '1.5rem', paddingRight: '0.5rem' }}>
            <h3 className="settings-panel-title">Keyboard shortcuts</h3>
            {shortcutMap.map((shortcut) => (
              <Shortcut action={shortcut.action} letter={shortcut.key} key={shortcut.key} />
            ))}
          </Tabs.Panel>

          <Tabs.Panel value="data" style={{ flex: 1, height: '100%', minHeight: 0, overflowY: 'auto', paddingLeft: '1.5rem', paddingRight: '0.5rem' }}>
            <h3 className="settings-panel-title">Data management</h3>
            <div style={{ padding: '0.5rem 0', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#24292e', marginBottom: 2 }}>Download all notes</div>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.825rem', color: '#6a737d' }}>Download all notes as Markdown files packaged in a single zip archive.</p>
              <IconButton handler={downloadNotesHandler} icon={FcDownload} text="Download all notes (.zip)" />
            </div>
            <div style={{ padding: '0.75rem 0', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#24292e', marginBottom: 2 }}>Export TakeNote data</div>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.825rem', color: '#6a737d' }}>Export all your notes, categories, and settings as a JSON backup file.</p>
              <IconButton handler={backupHandler} icon={FcExport} text="Export backup (.json)" />
            </div>
            <div style={{ padding: '0.75rem 0' }}>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#24292e', marginBottom: 2 }}>Import backup</div>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.825rem', color: '#6a737d' }}>Restore your notes and categories from an exported TakeNote JSON backup.</p>
              <IconButtonUploader accept=".json" handler={importBackupHandler} icon={FcImport} text="Import backup (.json)" />
            </div>
          </Tabs.Panel>

          <Tabs.Panel value="about" style={{ flex: 1, height: '100%', minHeight: 0, overflowY: 'auto', paddingLeft: '1.5rem', paddingRight: '0.5rem' }}>
            <h3 className="settings-panel-title">About TakeNote</h3>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#444' }}>
              TakeNote is a minimalist note-taking web app for developers. Write in plain text or Markdown in an IDE-like environment.
            </p>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#444' }}>
              This app has no tracking or analytics and does not retain any user data. Notes are persisted in local storage and can be downloaded as Markdown files from the data
              management tab.
            </p>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#444' }}>
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
            <div style={{ marginTop: '1.25rem' }}>
              <Button component="a" href="https://github.com/taniarascia/takenote" target="_blank" rel="noreferrer" variant="light" color="blue">
                View source on GitHub
              </Button>
            </div>
          </Tabs.Panel>
        </Tabs>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '0.75rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid #e9ecef',
          marginTop: '0.5rem',
          flexShrink: 0,
        }}>
        <Button variant="default" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="filled" color="takenoteBlue" onClick={handleOk}>
          OK
        </Button>
      </div>
    </Modal>
  );
};
