import React, { useEffect } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { Group, Panel, Separator } from 'react-resizable-panels';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import { AppSidebar } from '@/features/sidebar/AppSidebar';
import { KeyboardShortcuts } from '@/features/settings/KeyboardShortcuts';
import { NoteEditor } from '@/features/editor/NoteEditor';
import { NoteList } from '@/features/notes/NoteList';
import { SettingsModal } from '@/features/settings/SettingsModal';
import { Folder } from '@/utils/enums';
import { getWebsiteTitle, determineAppClass, getActiveCategory, getDayJsLocale } from '@/utils/helpers';
import { useAuthStore, useCategoriesStore, useNotesStore, useSettingsStore } from '@/store';

dayjs.extend(localizedFormat);
dayjs.locale(getDayJsLocale(navigator.language));

export const App: React.FC = () => {
  // Auth Store
  const { loading, login } = useAuthStore();

  // App Stores
  const { darkTheme, sidebarVisible } = useSettingsStore();
  const { activeFolder, activeCategoryId } = useNotesStore();
  const { categories, swapCategories } = useCategoriesStore();

  const activeCategory = getActiveCategory(categories, activeCategoryId);

  useEffect(() => {
    login();
  }, [login]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    if (result.type === 'CATEGORY') {
      swapCategories({ categoryId: source.index, destinationId: destination.index });
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="la-ball-beat">
          <div />
          <div />
          <div />
        </div>
      </div>
    );
  }

  return (
    <>
      <meta charSet="utf-8" />
      <title>{getWebsiteTitle(activeFolder, activeCategory)}</title>
      <link rel="canonical" href="https://takenote.dev" />

      <div className={determineAppClass(darkTheme, sidebarVisible, activeFolder)}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Group orientation="horizontal" id={activeFolder === Folder.SCRATCHPAD ? 'takenote-scratchpad-layout' : 'takenote-main-layout'}>
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
    </>
  );
};
