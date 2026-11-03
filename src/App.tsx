import { useEffect } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { Group, Panel, Separator } from 'react-resizable-panels';
import { MantineProvider, Box } from '@mantine/core';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import { theme } from '@/theme';
import { AppSidebar } from '@/features/sidebar/AppSidebar';
import { KeyboardShortcuts } from '@/features/settings/KeyboardShortcuts';
import { NoteEditor } from '@/features/editor/NoteEditor';
import { NoteList } from '@/features/notes/NoteList';
import { SettingsModal } from '@/features/settings/SettingsModal';
import { Folder } from '@/utils/enums';
import { getWebsiteTitle, getActiveCategory, getDayJsLocale } from '@/utils/helpers';
import { useCategoriesStore, useNotesStore, useSettingsStore } from '@/store';

dayjs.extend(localizedFormat);
dayjs.locale(getDayJsLocale(navigator.language));

export const App = () => {
  const { sidebarVisible } = useSettingsStore();
  const { activeFolder, activeCategoryId, syncNotesWithD1 } = useNotesStore();
  const { categories, swapCategories, syncCategoriesWithD1 } = useCategoriesStore();

  useEffect(() => {
    syncNotesWithD1();
    syncCategoriesWithD1();
  }, [syncNotesWithD1, syncCategoriesWithD1]);

  const activeCategory = getActiveCategory(categories, activeCategoryId);

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    if (result.type === 'CATEGORY') {
      swapCategories({ categoryId: source.index, destinationId: destination.index });
    }
  };

  return (
    <MantineProvider theme={theme} forceColorScheme="light">
      <meta charSet="utf-8" />
      <title>{getWebsiteTitle(activeFolder, activeCategory)}</title>
      <link rel="canonical" href="https://takenote.dev" />

      <Box style={{ height: '100vh', position: 'relative', overflowY: 'hidden' }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Group orientation="horizontal" id={activeFolder === Folder.SCRATCHPAD ? 'takenote-scratchpad-layout' : 'takenote-main-layout'}>
            {sidebarVisible && (
              <>
                <Panel id="sidebar" defaultSize={240} minSize={150} maxSize={500}>
                  <AppSidebar />
                </Panel>
                <Separator
                  style={{
                    width: 3,
                    backgroundColor: 'rgba(0, 0, 0, 0.15)',
                    cursor: 'col-resize',
                    zIndex: 1,
                  }}
                />
              </>
            )}
            {activeFolder !== Folder.SCRATCHPAD && (
              <>
                <Panel id="notes" defaultSize={330} minSize={200} maxSize={600}>
                  <NoteList />
                </Panel>
                <Separator
                  style={{
                    width: 3,
                    backgroundColor: 'rgba(0, 0, 0, 0.15)',
                    cursor: 'col-resize',
                    zIndex: 1,
                  }}
                />
              </>
            )}
            <Panel id="editor" minSize={300}>
              <NoteEditor />
            </Panel>
          </Group>
        </DragDropContext>
        <KeyboardShortcuts />
        <SettingsModal />
      </Box>
    </MantineProvider>
  );
};
