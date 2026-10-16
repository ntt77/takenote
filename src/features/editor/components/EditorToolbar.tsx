import React from 'react';
import { Tooltip, Toolbar, Menu } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';
import type { EditorView } from '@codemirror/view';
import prettier from 'prettier/standalone';
import parserMarkdown from 'prettier/parser-markdown';
import {
  MdUndo,
  MdRedo,
  MdAutoAwesome,
  MdTitle,
  MdArrowDropDown,
  MdFormatBold,
  MdFormatItalic,
  MdFormatStrikethrough,
  MdFormatClear,
  MdFormatQuote,
  MdCode,
  MdIntegrationInstructions,
  MdHorizontalRule,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdChecklist,
  MdFormatIndentIncrease,
  MdFormatIndentDecrease,
  MdInsertLink,
  MdTableChart,
  MdCalendarToday,
  MdMoreHoriz,
} from 'react-icons/md';
import { useNotesStore } from '@/store';
import {
  toggleInlineWrap,
  setHeadingLevel,
  toggleBlockquote,
  toggleBulletList,
  toggleNumberedList,
  toggleTaskList,
  insertCodeBlock,
  insertLink,
  insertTable,
  clearFormatting,
  insertHorizontalRule,
  insertDateTime,
  executeUndo,
  executeRedo,
  executeIndent,
  executeOutdent,
} from '@/features/editor/utils/markdownCommands';

export interface EditorToolbarProps {
  getView: () => EditorView | undefined;
  disabled?: boolean;
}

interface ToolDef {
  id: string;
  label: string;
  tooltip: string;
  width: number;
  priority: number;
  group: number;
  category: string;
  icon: React.ReactNode;
  menuIcon: React.ReactNode;
  action?: (view: EditorView) => void;
  customAction?: () => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ getView, disabled = false }) => {
  const { ref, width } = useElementSize();
  const { notes, activeNoteId, updateNote } = useNotesStore();
  const activeNote = notes.find((note) => note.id === activeNoteId);

  const handleAction = (action: (view: EditorView) => void) => {
    const view = getView();
    if (!view || disabled) return;
    action(view);
  };

  const handlePrettify = () => {
    if (!activeNote || !activeNote.text || disabled) return;
    try {
      const formattedText = prettier.format(activeNote.text, {
        parser: 'markdown',
        plugins: [parserMarkdown],
      });
      updateNote({
        ...activeNote,
        text: formattedText,
      });
    } catch {
      // Ignore format errors
    }
  };

  // Define all toolbar tools with natural groups and priority (higher priority stays on toolbar longer)
  const tools: ToolDef[] = React.useMemo(
    () => [
      // Group 1: History & Formatting Action
      {
        id: 'undo',
        label: 'Undo',
        tooltip: 'Undo (Ctrl+Z)',
        width: 40,
        priority: 100,
        group: 1,
        category: 'Actions',
        icon: <MdUndo size={20} />,
        menuIcon: <MdUndo size={20} />,
        action: executeUndo,
      },
      {
        id: 'redo',
        label: 'Redo',
        tooltip: 'Redo (Ctrl+Y)',
        width: 40,
        priority: 99,
        group: 1,
        category: 'Actions',
        icon: <MdRedo size={20} />,
        menuIcon: <MdRedo size={20} />,
        action: executeRedo,
      },
      {
        id: 'prettify',
        label: 'Prettify Note',
        tooltip: 'Prettify note (Format Markdown)',
        width: 40,
        priority: 10,
        group: 1,
        category: 'Actions',
        icon: <MdAutoAwesome size={20} />,
        menuIcon: <MdAutoAwesome size={20} />,
        customAction: handlePrettify,
      },

      // Group 2: Headings & Typography
      {
        id: 'bold',
        label: 'Bold',
        tooltip: 'Bold (**text**)',
        width: 40,
        priority: 90,
        group: 2,
        category: 'Formatting',
        icon: <MdFormatBold size={20} />,
        menuIcon: <MdFormatBold size={20} />,
        action: (v) => toggleInlineWrap(v, '**', 'bold text'),
      },
      {
        id: 'italic',
        label: 'Italic',
        tooltip: 'Italic (*text*)',
        width: 40,
        priority: 85,
        group: 2,
        category: 'Formatting',
        icon: <MdFormatItalic size={20} />,
        menuIcon: <MdFormatItalic size={20} />,
        action: (v) => toggleInlineWrap(v, '*', 'italic text'),
      },
      {
        id: 'strikethrough',
        label: 'Strikethrough',
        tooltip: 'Strikethrough (~~text~~)',
        width: 40,
        priority: 65,
        group: 2,
        category: 'Formatting',
        icon: <MdFormatStrikethrough size={20} />,
        menuIcon: <MdFormatStrikethrough size={20} />,
        action: (v) => toggleInlineWrap(v, '~~', 'strikethrough text'),
      },
      {
        id: 'clearFormatting',
        label: 'Clear formatting',
        tooltip: 'Clear formatting',
        width: 40,
        priority: 15,
        group: 2,
        category: 'Actions',
        icon: <MdFormatClear size={20} />,
        menuIcon: <MdFormatClear size={20} />,
        action: clearFormatting,
      },

      // Group 3: Blocks & Code
      {
        id: 'quote',
        label: 'Quote',
        tooltip: 'Quote (> quote)',
        width: 40,
        priority: 60,
        group: 3,
        category: 'Blocks & Code',
        icon: <MdFormatQuote size={20} />,
        menuIcon: <MdFormatQuote size={20} />,
        action: toggleBlockquote,
      },
      {
        id: 'code',
        label: 'Inline Code',
        tooltip: 'Inline Code (`code`)',
        width: 40,
        priority: 55,
        group: 3,
        category: 'Blocks & Code',
        icon: <MdCode size={20} />,
        menuIcon: <MdCode size={20} />,
        action: (v) => toggleInlineWrap(v, '`', 'code'),
      },
      {
        id: 'codeBlock',
        label: 'Code Block',
        tooltip: 'Code Block (```)',
        width: 40,
        priority: 45,
        group: 3,
        category: 'Blocks & Code',
        icon: <MdIntegrationInstructions size={20} />,
        menuIcon: <MdIntegrationInstructions size={20} />,
        action: insertCodeBlock,
      },
      {
        id: 'horizontalRule',
        label: 'Horizontal Divider',
        tooltip: 'Horizontal Divider (---)',
        width: 40,
        priority: 35,
        group: 3,
        category: 'Insert & Layout',
        icon: <MdHorizontalRule size={20} />,
        menuIcon: <MdHorizontalRule size={20} />,
        action: insertHorizontalRule,
      },

      // Group 4: Lists & Indentation
      {
        id: 'bulletList',
        label: 'Bulleted List',
        tooltip: 'Bulleted List (- item)',
        width: 40,
        priority: 80,
        group: 4,
        category: 'Lists',
        icon: <MdFormatListBulleted size={20} />,
        menuIcon: <MdFormatListBulleted size={20} />,
        action: toggleBulletList,
      },
      {
        id: 'numberedList',
        label: 'Numbered List',
        tooltip: 'Numbered List (1. item)',
        width: 40,
        priority: 50,
        group: 4,
        category: 'Lists',
        icon: <MdFormatListNumbered size={20} />,
        menuIcon: <MdFormatListNumbered size={20} />,
        action: toggleNumberedList,
      },
      {
        id: 'taskList',
        label: 'Task List',
        tooltip: 'Task List (- [ ] task)',
        width: 40,
        priority: 70,
        group: 4,
        category: 'Lists',
        icon: <MdChecklist size={20} />,
        menuIcon: <MdChecklist size={20} />,
        action: toggleTaskList,
      },
      {
        id: 'indent',
        label: 'Indent (Shift right)',
        tooltip: 'Indent (Shift right)',
        width: 40,
        priority: 30,
        group: 4,
        category: 'Insert & Layout',
        icon: <MdFormatIndentIncrease size={20} />,
        menuIcon: <MdFormatIndentIncrease size={20} />,
        action: executeIndent,
      },
      {
        id: 'outdent',
        label: 'Outdent (Shift left)',
        tooltip: 'Outdent (Shift left)',
        width: 40,
        priority: 25,
        group: 4,
        category: 'Insert & Layout',
        icon: <MdFormatIndentDecrease size={20} />,
        menuIcon: <MdFormatIndentDecrease size={20} />,
        action: executeOutdent,
      },

      // Group 5: Insertions & Timestamp
      {
        id: 'link',
        label: 'Insert Link',
        tooltip: 'Insert Link ([title](url))',
        width: 40,
        priority: 75,
        group: 5,
        category: 'Insert & Layout',
        icon: <MdInsertLink size={20} />,
        menuIcon: <MdInsertLink size={20} />,
        action: insertLink,
      },
      {
        id: 'table',
        label: 'Insert Table',
        tooltip: 'Insert Table',
        width: 40,
        priority: 40,
        group: 5,
        category: 'Insert & Layout',
        icon: <MdTableChart size={20} />,
        menuIcon: <MdTableChart size={20} />,
        action: insertTable,
      },
      {
        id: 'dateTime',
        label: 'Insert Date & Time',
        tooltip: 'Insert Current Date & Time',
        width: 40,
        priority: 20,
        group: 5,
        category: 'Insert & Layout',
        icon: <MdCalendarToday size={20} />,
        menuIcon: <MdCalendarToday size={20} />,
        action: insertDateTime,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeNote]
  );

  // Dynamic calculation: exactly calculate what fits on screen, push any overflowing button to "..."
  const { visibleIds, overflowItems } = React.useMemo(() => {
    // Heading dropdown button width (~74px) + Dividers (approx 4 * 17px = 68px) + Padding (16px)
    const headingsWidth = 74;
    const baseFixedOverhead = headingsWidth + 68 + 16;
    const totalToolsWidth = tools.reduce((acc, t) => acc + t.width, 0);
    const fullRequiredWidth = totalToolsWidth + baseFixedOverhead;

    // If toolbar is wide enough for everything, show all on toolbar
    if (width >= fullRequiredWidth) {
      return {
        visibleIds: new Set(tools.map((t) => t.id)),
        overflowItems: [] as ToolDef[],
      };
    }

    // When space is constrained, reserve space for the "..." button (44px)
    const moreBtnWidth = 44;
    let availableSpace = (width > 0 ? width : 1000) - (baseFixedOverhead + moreBtnWidth);

    // Sort by priority descending: higher priority stays on toolbar, lower priority moves to "..."
    const sortedByPriority = [...tools].sort((a, b) => b.priority - a.priority);
    const visible = new Set<string>();
    const overflow: ToolDef[] = [];

    for (const tool of sortedByPriority) {
      if (availableSpace >= tool.width) {
        visible.add(tool.id);
        availableSpace -= tool.width;
      } else {
        overflow.push(tool);
      }
    }

    // Keep overflow list sorted by natural group order for a clean menu experience
    overflow.sort((a, b) => a.group - b.group || b.priority - a.priority);

    return { visibleIds: visible, overflowItems: overflow };
  }, [width, tools]);

  const hasOverflow = overflowItems.length > 0;

  // Group overflow items by category for clear dropdown presentation
  const groupedOverflow = React.useMemo(() => {
    const groups: { [cat: string]: ToolDef[] } = {};
    for (const item of overflowItems) {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    }
    return groups;
  }, [overflowItems]);

  const renderToolButton = (tool: ToolDef) => (
    <Tooltip key={tool.id} label={tool.tooltip} withArrow position="bottom">
      <Toolbar.Toggle
        onClick={() => {
          if (tool.customAction) {
            tool.customAction();
          } else if (tool.action) {
            handleAction(tool.action);
          }
        }}
        disabled={disabled || (tool.id === 'prettify' && !activeNote)}
        aria-label={tool.label}>
        {tool.icon}
      </Toolbar.Toggle>
    </Tooltip>
  );

  return (
    <div ref={ref} style={{ width: '100%', minWidth: 0, overflow: 'hidden' }}>
      <Toolbar
        className="editor-toolbar"
        size="lg"
        aria-label="Markdown formatting"
        style={{
          height: 46,
          minHeight: 46,
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#fafafa',
          padding: '0 0.5rem',
          overflowX: 'hidden',
          overflowY: 'hidden',
          userSelect: 'none',
          width: '100%',
          borderRadius: 0,
        }}>
        {/* Group 1: History & Prettify */}
        <Toolbar.Group>{tools.filter((t) => t.group === 1 && visibleIds.has(t.id)).map(renderToolButton)}</Toolbar.Group>

        <Toolbar.Divider />

        {/* Group 2: Headings & Typography */}
        <Toolbar.Group>
          <Menu shadow="md" width={220} position="bottom-start" withArrow withinPortal>
            <Menu.Target>
              <Tooltip label="Headings" withArrow position="bottom">
                <Toolbar.Toggle
                  disabled={disabled}
                  aria-label="Headings"
                  className="heading-toggle"
                  style={{ width: 'auto', padding: '0 8px', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <MdTitle size={20} />
                  <MdArrowDropDown size={20} />
                </Toolbar.Toggle>
              </Tooltip>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Text Style</Menu.Label>
              <Menu.Item onClick={() => handleAction((v) => setHeadingLevel(v, 0))}>
                <span style={{ fontSize: '0.9rem' }}>Normal text (Paragraph)</span>
              </Menu.Item>
              <Menu.Divider />
              <Menu.Label>Headings</Menu.Label>
              <Menu.Item onClick={() => handleAction((v) => setHeadingLevel(v, 1))}>
                <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>H1 Heading 1</span>
              </Menu.Item>
              <Menu.Item onClick={() => handleAction((v) => setHeadingLevel(v, 2))}>
                <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>H2 Heading 2</span>
              </Menu.Item>
              <Menu.Item onClick={() => handleAction((v) => setHeadingLevel(v, 3))}>
                <span style={{ fontSize: '1rem', fontWeight: 600 }}>H3 Heading 3</span>
              </Menu.Item>
              <Menu.Item onClick={() => handleAction((v) => setHeadingLevel(v, 4))}>
                <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>H4 Heading 4</span>
              </Menu.Item>
              <Menu.Item onClick={() => handleAction((v) => setHeadingLevel(v, 5))}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>H5 Heading 5</span>
              </Menu.Item>
              <Menu.Item onClick={() => handleAction((v) => setHeadingLevel(v, 6))}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>H6 Heading 6</span>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
          {tools.filter((t) => t.group === 2 && visibleIds.has(t.id)).map(renderToolButton)}
        </Toolbar.Group>

        {/* Group 3: Blocks & Code */}
        {tools.some((t) => t.group === 3 && visibleIds.has(t.id)) && (
          <>
            <Toolbar.Divider />
            <Toolbar.Group>{tools.filter((t) => t.group === 3 && visibleIds.has(t.id)).map(renderToolButton)}</Toolbar.Group>
          </>
        )}

        {/* Group 4: Lists & Indentation */}
        {tools.some((t) => t.group === 4 && visibleIds.has(t.id)) && (
          <>
            <Toolbar.Divider />
            <Toolbar.Group>{tools.filter((t) => t.group === 4 && visibleIds.has(t.id)).map(renderToolButton)}</Toolbar.Group>
          </>
        )}

        {/* Group 5: Insertions & Timestamp */}
        {tools.some((t) => t.group === 5 && visibleIds.has(t.id)) && (
          <>
            <Toolbar.Divider />
            <Toolbar.Group>{tools.filter((t) => t.group === 5 && visibleIds.has(t.id)).map(renderToolButton)}</Toolbar.Group>
          </>
        )}

        {/* Dynamic More (...) Menu: Renders any buttons that don't fit on the toolbar */}
        {hasOverflow && (
          <>
            <Toolbar.Divider />
            <Toolbar.Group>
              <Menu shadow="md" width={230} position="bottom-end" withArrow withinPortal>
                <Menu.Target>
                  <Tooltip label="More tools" withArrow position="bottom">
                    <Toolbar.Toggle disabled={disabled} aria-label="More tools" style={{ width: 'auto', padding: '0 8px', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <MdMoreHoriz size={20} />
                    </Toolbar.Toggle>
                  </Tooltip>
                </Menu.Target>
                <Menu.Dropdown>
                  {Object.entries(groupedOverflow).map(([category, items], catIdx) => (
                    <React.Fragment key={category}>
                      {catIdx > 0 && <Menu.Divider />}
                      <Menu.Label>{category}</Menu.Label>
                      {items.map((item) => (
                        <Menu.Item
                          key={item.id}
                          leftSection={item.menuIcon}
                          disabled={disabled || (item.id === 'prettify' && !activeNote)}
                          onClick={() => {
                            if (item.customAction) {
                              item.customAction();
                            } else if (item.action) {
                              handleAction(item.action);
                            }
                          }}>
                          {item.label}
                        </Menu.Item>
                      ))}
                    </React.Fragment>
                  ))}
                </Menu.Dropdown>
              </Menu>
            </Toolbar.Group>
          </>
        )}
      </Toolbar>
    </div>
  );
};
