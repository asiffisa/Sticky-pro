const { widget } = figma;
const { useSyncedState, usePropertyMenu, AutoLayout, Input, Text, SVG, Frame } = widget;

// Import types
import type { BlockType, TextFormat, ListType, TodoItem, TextLine, Block } from './types';

// Import constants
import { themeColors } from './constants/theme';
import {
  bulletIcon,
  numberedIcon,
  expandIcon,
  shrinkIcon,
  lightThemeIcon,
  darkThemeIcon,
  codeIcon,
  getPlusIcon
} from './constants/icons';

// Generate unique IDs with counter for guaranteed uniqueness
let idCounter = 0;
function generateId(): string {
  return `${Date.now()}-${(idCounter++).toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
}

// Main Widget Component
function StickyProWidget() {
  const [mainHeading, setMainHeading] = useSyncedState<string>('mainHeading', '');
  const [blocks, setBlocks] = useSyncedState<Block[]>('blocks', [
    {
      id: 'initial-block',
      type: 'text',
      content: '',
      format: 'B1',
      listType: 'none',
      lines: [{ id: 'initial-line', text: '', format: 'B1' }],
    },
  ]);
  const [width, setWidth] = useSyncedState<360 | 480>('width', 360);
  const [focusedBlockId, setFocusedBlockId] = useSyncedState<string | null>('focusedBlockId', null);
  const [focusedLineId, setFocusedLineId] = useSyncedState<string | null>('focusedLineId', null);
  const [showAddBlockToolbar, setShowAddBlockToolbar] = useSyncedState<boolean>('showAddBlockToolbar', false);
  const [showFormatDropdown, setShowFormatDropdown] = useSyncedState<boolean>('showFormatDropdown', false);
  const [theme, setTheme] = useSyncedState<'dark' | 'light'>('theme', 'dark');

  // Get focused block
  const focusedBlock = blocks.find((b) => b.id === focusedBlockId);

  // Get focused line for formatting
  const focusedLine = focusedBlock?.lines?.find((l) => l.id === focusedLineId);

  // Property Menu for native Figma toolbar
  // Note: The position of this menu is controlled by Figma and cannot be changed.
  usePropertyMenu(
    [
      // Text format buttons (only show when a text block is actually focused)
      ...(focusedBlockId && focusedBlock?.type === 'text' ? [
        {
          itemType: 'action' as const,
          tooltip: 'H1',
          propertyName: 'format-h1',
        },
        {
          itemType: 'action' as const,
          tooltip: 'B1',
          propertyName: 'format-b1',
        },
        {
          itemType: 'action' as const,
          tooltip: 'C1',
          propertyName: 'format-c1',
        },
        {
          itemType: 'separator' as const,
        },
        {
          itemType: 'toggle' as const,
          tooltip: 'Bullet List',
          propertyName: 'list-bullet',
          isToggled: (focusedBlock?.listType || 'none') === 'bullet',
          icon: bulletIcon,
        },
        {
          itemType: 'toggle' as const,
          tooltip: 'Numbered List',
          propertyName: 'list-numbered',
          isToggled: (focusedBlock?.listType || 'none') === 'numbered',
          icon: numberedIcon,
        },
        {
          itemType: 'separator' as const,
        },
      ] : []),
      // Theme and Width toggle (always visible)
      {
        itemType: 'action' as const,
        tooltip: theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode',
        propertyName: 'toggle-theme',
        icon: theme === 'dark' ? lightThemeIcon : darkThemeIcon,
      },
      {
        itemType: 'separator' as const,
      },
      {
        itemType: 'action' as const,
        tooltip: width === 360 ? 'Expand Width' : 'Shrink Width',
        propertyName: 'toggle-width',
        icon: width === 360 ? expandIcon : shrinkIcon,
      },
    ],
    ({ propertyName }) => {
      // Handle width toggle
      if (propertyName === 'toggle-width') {
        toggleWidth();
        return;
      }

      // Handle theme toggle
      if (propertyName === 'toggle-theme') {
        setTheme(theme === 'dark' ? 'light' : 'dark');
        return;
      }

      if (!focusedBlockId || !focusedBlock) return;

      // Handle format changes
      if (propertyName === 'format-h1' || propertyName === 'format-b1' || propertyName === 'format-c1') {
        const format = propertyName.split('-')[1].toUpperCase() as TextFormat;
        if (focusedLineId) {
          updateLineFormat(focusedBlockId, focusedLineId, format);
        } else {
          updateBlockFormat(focusedBlockId, format);
        }
      }

      // Handle list type changes
      if (propertyName === 'list-bullet') {
        const newListType = (focusedBlock.listType || 'none') === 'bullet' ? 'none' : 'bullet';
        updateBlockListType(focusedBlockId, newListType);
      }
      if (propertyName === 'list-numbered') {
        const newListType = (focusedBlock.listType || 'none') === 'numbered' ? 'none' : 'numbered';
        updateBlockListType(focusedBlockId, newListType);
      }
    }
  );

  // Handle block deletion
  const deleteBlock = (blockId: string) => {
    // Validate block exists
    const blockExists = blocks.some((b) => b.id === blockId);
    if (!blockExists) {
      console.warn(`[deleteBlock] Block ${blockId} not found`);
      return;
    }

    // Clear focus states FIRST if the deleted block was focused
    // This prevents the toolbar from trying to access a deleted block
    if (focusedBlockId === blockId) {
      setFocusedBlockId(null);
      setFocusedLineId(null);
    }

    // Then delete the block
    const newBlocks = blocks.filter((b) => b.id !== blockId);
    setBlocks(newBlocks);
  };

  // Handle adding new block
  const addBlock = (type: BlockType) => {
    const blockId = generateId();
    const newBlock: Block = {
      id: blockId,
      type,
      content: '',
      ...(type === 'text' && {
        format: 'B1',
        listType: 'none',
        lines: [{ id: generateId(), text: '', format: 'B1' }]
      }),
      ...(type === 'todo' && {
        todos: [{ id: generateId(), text: '', completed: false }]
      }),
    };

    setBlocks([...blocks, newBlock]);
    setFocusedBlockId(blockId);
    setShowAddBlockToolbar(false);
  };

  // Add line to text block
  const addLineToBlock = (blockId: string, afterLineId?: string) => {
    setBlocks(
      blocks.map((b) => {
        if (b.id === blockId && (b.type === 'text' || b.type === 'code')) {
          const lines = b.lines || [{ id: generateId(), text: b.content || '', format: b.format || 'B1' }];
          const newLine: TextLine = {
            id: generateId(),
            text: '',
            format: lines[lines.length - 1]?.format || 'B1',
          };

          if (afterLineId) {
            const index = lines.findIndex(l => l.id === afterLineId);
            const newLines = [
              ...lines.slice(0, index + 1),
              newLine,
              ...lines.slice(index + 1),
            ];
            return { ...b, lines: newLines };
          }

          return { ...b, lines: [...lines, newLine] };
        }
        return b;
      })
    );
  };

  // Update line in text block
  const updateLineInBlock = (blockId: string, lineId: string, text: string) => {
    setBlocks(
      blocks.map((b) => {
        if (b.id === blockId && (b.type === 'text' || b.type === 'code')) {
          const lines = b.lines || [];
          return {
            ...b,
            lines: lines.map(l => l.id === lineId ? { ...l, text } : l)
          };
        }
        return b;
      })
    );
  };

  // Update line format in text block
  const updateLineFormat = (blockId: string, lineId: string, format: TextFormat) => {
    setBlocks(
      blocks.map((b) => {
        if (b.id !== blockId || (b.type !== 'text' && b.type !== 'code')) return b;
        return {
          ...b,
          lines: (b.lines || []).map(l => l.id === lineId ? { ...l, format } : l)
        };
      })
    );
  };

  // Delete line from text block
  const deleteLineFromBlock = (blockId: string, lineId: string) => {
    setBlocks(
      blocks.map((b) => {
        if (b.id !== blockId || (b.type !== 'text' && b.type !== 'code')) return b;

        const lines = (b.lines || []).filter(l => l.id !== lineId);
        // If no lines left, keep at least one empty line
        return {
          ...b,
          lines: lines.length === 0 ? [{ id: generateId(), text: '', format: 'B1' }] : lines
        };
      })
    );
  };

  // Update block content
  const updateBlockContent = (blockId: string, content: string) => {
    setBlocks(blocks.map((b) => b.id === blockId ? { ...b, content } : b));
  };

  // Update block format
  const updateBlockFormat = (blockId: string, format: TextFormat) => {
    setBlocks(blocks.map((b) => b.id === blockId ? { ...b, format } : b));
    setShowFormatDropdown(false);
  };

  // Update block list type
  const updateBlockListType = (blockId: string, listType: ListType) => {
    setBlocks(blocks.map((b) => b.id === blockId ? { ...b, listType } : b));
  };

  // Toggle width
  const toggleWidth = () => {
    setWidth(width === 360 ? 480 : 360);
  };

  // Add todo item
  const addTodoItem = (blockId: string) => {
    setBlocks(
      blocks.map((b) => {
        if (b.id !== blockId || b.type !== 'todo') return b;
        const newTodo: TodoItem = {
          id: generateId(),
          text: '',
          completed: false,
        };
        return { ...b, todos: [...(b.todos || []), newTodo] };
      })
    );
  };

  // Update todo item
  const updateTodoItem = (blockId: string, todoId: string, text: string) => {
    setBlocks(
      blocks.map((b) => {
        if (b.id !== blockId || b.type !== 'todo') return b;
        return {
          ...b,
          todos: (b.todos || []).map((t) => t.id === todoId ? { ...t, text } : t)
        };
      })
    );
  };

  // Toggle todo completion
  const toggleTodoCompletion = (blockId: string, todoId: string) => {
    setBlocks(
      blocks.map((b) => {
        if (b.id !== blockId || b.type !== 'todo') return b;
        return {
          ...b,
          todos: (b.todos || []).map((t) => t.id === todoId ? { ...t, completed: !t.completed } : t)
        };
      })
    );
  };

  // Insert block after a specific block
  const insertBlockAfter = (blockId: string) => {
    const blockIndex = blocks.findIndex((b) => b.id === blockId);
    if (blockIndex === -1) return;

    const newBlock: Block = {
      id: generateId(),
      type: 'text',
      content: '',
      format: 'B1',
      listType: 'none',
      lines: [{ id: generateId(), text: '', format: 'B1' }],
    };

    const newBlocks = [
      ...blocks.slice(0, blockIndex + 1),
      newBlock,
      ...blocks.slice(blockIndex + 1),
    ];
    setBlocks(newBlocks);
  };

  // Insert todo item after a specific todo
  const insertTodoAfter = (blockId: string, todoId: string) => {
    setBlocks(
      blocks.map((b) => {
        if (b.id !== blockId || b.type !== 'todo') return b;

        const todos = b.todos || [];
        const todoIndex = todos.findIndex((t) => t.id === todoId);
        if (todoIndex === -1) return b;

        const newTodo: TodoItem = {
          id: generateId(),
          text: '',
          completed: false,
        };

        return {
          ...b,
          todos: [
            ...todos.slice(0, todoIndex + 1),
            newTodo,
            ...todos.slice(todoIndex + 1),
          ]
        };
      })
    );
  };

  // Get current theme colors
  const colors = themeColors[theme];

  return (
    <AutoLayout
      direction="vertical"
      spacing={0}
      width={width}
      fill={colors.widgetBg}
      cornerRadius={20}
      overflow="visible"
    >
      {/* Main Content Container */}
      <AutoLayout
        direction="vertical"
        spacing={0}
        width={width}
        padding={12}
        fill={colors.widgetBg}
        cornerRadius={20}
        overflow="visible"
      >
        {/* Main Heading */}
        <MainHeading
          value={mainHeading}
          onChange={setMainHeading}
          width={width - 40}
          theme={theme}
          onFocus={() => {
            setFocusedBlockId(null);
            setFocusedLineId(null);
          }}
        />

        {/* Blocks */}
        {blocks.map((block, index) => (
          <BlockComponent
            key={block.id}
            block={block}
            width={width - 24}
            isFirst={index === 0}
            isFocused={focusedBlockId === block.id}
            theme={theme}
            onFocus={() => {
              // Only update if actually changing blocks for better performance
              if (focusedBlockId !== block.id) {
                setFocusedLineId(null);
                setFocusedBlockId(block.id);
              }
            }}
            onBlur={() => setFocusedBlockId(null)}
            onDelete={() => deleteBlock(block.id)}
            onContentChange={(content) => updateBlockContent(block.id, content)}
            onInsertAfter={() => insertBlockAfter(block.id)}
            onAddLine={(afterLineId) => addLineToBlock(block.id, afterLineId)}
            onUpdateLine={(lineId, text) => updateLineInBlock(block.id, lineId, text)}
            onUpdateLineFormat={(lineId, format) => updateLineFormat(block.id, lineId, format)}
            onDeleteLine={(lineId) => deleteLineFromBlock(block.id, lineId)}
            onLineClick={(lineId) => setFocusedLineId(lineId)}
            onAddTodo={() => addTodoItem(block.id)}
            onUpdateTodo={(todoId, text) => updateTodoItem(block.id, todoId, text)}
            onToggleTodo={(todoId) => toggleTodoCompletion(block.id, todoId)}
            onInsertTodoAfter={(todoId) => insertTodoAfter(block.id, todoId)}
          />
        ))}

        {/* Add Block Button */}
        <AutoLayout
          direction="horizontal"
          spacing={6}
          padding={{ top: 12, bottom: 0, left: 0, right: 0 }}
          width="hug-contents"
          onClick={() => setShowAddBlockToolbar(!showAddBlockToolbar)}
        >
          <Text
            fontSize={12}
            fontFamily="Inter"
            fontWeight={400}
            fill={colors.addButtonText}
            horizontalAlignText="center"
          >
            + Add new block
          </Text>
        </AutoLayout>
      </AutoLayout>

      {/* Add Block Menu - Positioned at bottom with 32px gap */}
      {showAddBlockToolbar && (
        <AutoLayout
          direction="horizontal"
          width="hug-contents"
          positioning="absolute"
          y={{ type: 'bottom', offset: -56 }}
          x={{ type: 'center', offset: 0 }}
        >
          <AddBlockMenu
            onAddText={() => addBlock('text')}
            onAddTodo={() => addBlock('todo')}
            onAddCode={() => addBlock('code')}
          />
        </AutoLayout>
      )}
    </AutoLayout>
  );
}

// Main Heading Component
function MainHeading({ value, onChange, width, theme, onFocus }: { value: string; onChange: (v: string) => void; width: number; theme: 'dark' | 'light'; onFocus?: () => void }) {
  const colors = themeColors[theme];

  return (
    <AutoLayout
      direction="horizontal"
      spacing={6}
      padding={{ top: 0, bottom: 12, left: 0, right: 0 }}
      width={width}
      onClick={onFocus}
    >
      <Input
        value={value}
        placeholder="Header"
        onTextEditEnd={(e) => onChange(e.characters)}
        fontSize={16}
        fontFamily="Inter"
        fontWeight={600}
        fill={colors.textPrimary}
        width={width}
        inputFrameProps={{
          fill: '#00000000',
          padding: 0,
        }}
      />
    </AutoLayout>
  );
}

// Block Component
function BlockComponent({
  block,
  width,
  isFirst,
  onFocus,
  onBlur,
  onDelete,
  onContentChange,
  onInsertAfter,
  onAddLine,
  onUpdateLine,
  onUpdateLineFormat,
  onDeleteLine,
  onLineClick,
  onAddTodo,
  onUpdateTodo,
  onToggleTodo,
  onInsertTodoAfter,
  isFocused,
  theme,
}: {
  block: Block;
  width: number;
  isFirst: boolean;
  isFocused?: boolean;
  theme: 'dark' | 'light';
  onFocus: () => void;
  onBlur: () => void;
  onDelete: () => void;
  onContentChange: (content: string) => void;
  onInsertAfter?: () => void;
  onAddLine?: (afterLineId: string) => void;
  onUpdateLine?: (lineId: string, text: string) => void;
  onUpdateLineFormat?: (lineId: string, format: TextFormat) => void;
  onDeleteLine?: (lineId: string) => void;
  onLineClick?: (lineId: string) => void;
  onAddTodo?: () => void;
  onUpdateTodo?: (todoId: string, text: string) => void;
  onToggleTodo?: (todoId: string) => void;
  onInsertTodoAfter?: (todoId: string) => void;
}) {
  if (block.type === 'text' || block.type === 'code') {
    return (
      <TextBlock
        block={block}
        width={width}
        isFirst={isFirst}
        isFocused={!!isFocused}
        theme={theme}
        onFocus={onFocus}
        onBlur={onBlur}
        onDelete={onDelete}
        onContentChange={onContentChange}
        onInsertAfter={onInsertAfter}
        onAddLine={onAddLine}
        onUpdateLine={onUpdateLine}
        onUpdateLineFormat={onUpdateLineFormat}
        onDeleteLine={onDeleteLine}
        onLineClick={onLineClick}
      />
    );
  } else {
    return (
      <TodoBlock
        block={block}
        width={width}
        isFirst={isFirst}
        isFocused={!!isFocused}
        theme={theme}
        onFocus={onFocus}
        onBlur={onBlur}
        onDelete={onDelete}
        onAddTodo={onAddTodo!}
        onUpdateTodo={onUpdateTodo!}
        onToggleTodo={onToggleTodo!}
        onInsertTodoAfter={onInsertTodoAfter!}
      />
    );
  }
}

// Text Block Component
function TextBlock({
  block,
  width,
  isFirst,
  isFocused,
  theme,
  onFocus,
  onBlur,
  onDelete,
  onContentChange,
  onInsertAfter,
  onAddLine,
  onUpdateLine,
  onUpdateLineFormat,
  onDeleteLine,
  onLineClick,
}: {
  block: Block;
  width: number;
  isFirst: boolean;
  isFocused: boolean;
  theme: 'dark' | 'light';
  onFocus: () => void;
  onBlur: () => void;
  onDelete: () => void;
  onContentChange: (content: string) => void;
  onInsertAfter?: () => void;
  onAddLine?: (afterLineId: string) => void;
  onUpdateLine?: (lineId: string, text: string) => void;
  onUpdateLineFormat?: (lineId: string, format: TextFormat) => void;
  onDeleteLine?: (lineId: string) => void;
  onLineClick?: (lineId: string) => void;
}) {
  const colors = themeColors[theme];

  // Code blocks use single multi-line input
  if (block.type === 'code') {
    return (
      <AutoLayout
        direction="horizontal"
        spacing={0}
        width={width}
        padding={{ top: isFirst ? 0 : 8, bottom: 8, left: 0, right: 0 }}
        overflow="visible"
      >
        <AutoLayout
          direction="vertical"
          spacing={4}
          width="fill-parent"
          padding={{ left: 12, right: 12, top: 12, bottom: 12 }}
          fill={colors.blockBg}
          cornerRadius={10}
          overflow="visible"
          onClick={onFocus}
        >
          {/* Close button */}
          {isFocused && <CloseButton onClick={onDelete} />}

          <Input
            inputBehavior="multiline"
            placeholder="<Type code>"
            value={block.content}
            onTextEditEnd={(e) => onContentChange(e.characters)}
            onClick={onFocus}
            fontSize={14}
            fontFamily="IBM Plex Mono"
            fontWeight={400}
            fill={colors.textPrimary}
            width="fill-parent"
            inputFrameProps={{
              fill: '#00000000',
              padding: 0,
            }}
          />
        </AutoLayout>
      </AutoLayout>
    );
  }

  // Text blocks use existing line-based approach
  const lines = block.lines || [{ id: generateId(), text: block.content || '', format: block.format || 'B1' }];
  return (
    <AutoLayout
      direction="horizontal"
      spacing={0}
      width={width}
      padding={{ top: isFirst ? 0 : 8, bottom: 8, left: 0, right: 0 }}
      overflow="visible"
    >
      <AutoLayout
        direction="vertical"
        spacing={4}
        width="fill-parent"
        padding={{ left: 12, right: 12, top: 12, bottom: 12 }}
        fill={colors.blockBg}
        cornerRadius={10}
        overflow="visible"
        onClick={onFocus}
      >
        {/* Close button - positioned outside clickable area */}
        {isFocused && <CloseButton onClick={onDelete} />}

        {/* Clickable area for focusing */}
        <AutoLayout
          direction="vertical"
          spacing={8} // Change this to update gap between text lines
          width="fill-parent"
        >

          {/* Multiple Lines */}
          {lines.map((line, index) => {
            const { fontSize, fontWeight } = getTextFormat(line.format);
            const listType = block.listType || 'none';

            return (
              <AutoLayout
                key={line.id}
                direction="horizontal"
                spacing={8}
                verticalAlignItems="start"
                width="fill-parent"
              >
                {/* List Marker */}
                {listType !== 'none' && (
                  <Text
                    fontSize={fontSize}
                    fontFamily="Inter"
                    fontWeight={fontWeight as 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900}
                    fill={colors.textPrimary}
                    width={24}
                    horizontalAlignText="right"
                  >
                    {listType === 'bullet' ? '•' : `${index + 1}.`}
                  </Text>
                )}

                <AutoLayout
                  width="fill-parent"
                  height="hug-contents"
                >

                  <Input
                    inputBehavior="multiline"
                    placeholder={"Type"}
                    value={line.text}
                    onClick={() => {
                      onFocus();
                      if (onLineClick) onLineClick(line.id);
                    }}
                    onTextEditEnd={(e) => onUpdateLine && onUpdateLine(line.id, e.characters)}
                    fontSize={fontSize}
                    fontFamily={block.type === 'code' ? "IBM Plex Mono" : "Inter"}
                    fontWeight={fontWeight as 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900}
                    fill={colors.textPrimary}
                    width="fill-parent"
                    inputFrameProps={{
                      fill: '#00000000',
                      padding: 0,
                    }}
                  />
                </AutoLayout>
              </AutoLayout>
            );
          })}

          {/* Add line button at bottom */}
          {onAddLine && lines.length > 0 && (
            <AutoLayout
              direction="horizontal"
              spacing={4}
              padding={{ top: 4, bottom: 0, left: 0, right: 0 }}
              verticalAlignItems="center"
              width="hug-contents"
              onClick={() => {
                if (lines.length > 0) {
                  onAddLine(lines[lines.length - 1].id);
                }
              }}
            >
              <SVG
                src={getPlusIcon(colors.addButtonText)}
              />
              <Text fontSize={10} lineHeight={8} fontFamily="Inter" fontWeight={400} fill={colors.addButtonText}>
                {block.listType && block.listType !== 'none' ? 'Next list' : 'Add'}
              </Text>
            </AutoLayout>
          )}
        </AutoLayout>
      </AutoLayout>
    </AutoLayout>
  );
}



// Todo Block Component
function TodoBlock({
  block,
  width,
  isFirst,
  onFocus,
  onBlur,
  onDelete,
  onAddTodo,
  onUpdateTodo,
  onToggleTodo,
  onInsertTodoAfter,
  isFocused,
  theme,
}: {
  block: Block;
  width: number;
  isFirst: boolean;
  isFocused: boolean;
  theme: 'dark' | 'light';
  onFocus: () => void;
  onBlur: () => void;
  onDelete: () => void;
  onAddTodo: () => void;
  onUpdateTodo: (todoId: string, text: string) => void;
  onToggleTodo: (todoId: string) => void;
  onInsertTodoAfter?: (todoId: string) => void;
}) {
  const colors = themeColors[theme];
  const todos = block.todos || [];

  return (
    <AutoLayout
      direction="vertical"
      spacing={0}
      width={width}
      padding={{ top: isFirst ? 0 : 8, bottom: 8, left: 0, right: 0 }}
      overflow="visible"
    >
      <AutoLayout
        direction="vertical"
        spacing={8}
        width={width}
        padding={{ left: 12, right: 12, top: 12, bottom: 12 }}
        fill={colors.blockBg}
        cornerRadius={10}
        overflow="visible"
        onClick={onFocus}
      >
        {/* Close button */}
        {isFocused && <CloseButton onClick={onDelete} />}

        {/* Todo Items */}
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            width={width - 36}
            theme={theme}
            onUpdate={(text) => onUpdateTodo(todo.id, text)}
            onToggle={() => onToggleTodo(todo.id)}
            onFocus={onFocus}
          />
        ))}

        {/* Add Todo Button */}
        {(isFocused || (todos.length > 0 && todos[todos.length - 1].text.length > 0)) && (
          <AutoLayout
            direction="horizontal"
            spacing={4}
            padding={{ top: 4, bottom: 0, left: 0, right: 0 }}
            verticalAlignItems="center"
            width="hug-contents"
            onClick={onAddTodo}
          >
            <SVG
              src={getPlusIcon(colors.addButtonText)}
            />
            <Text fontSize={10} lineHeight={12} fontFamily="Inter" fontWeight={400} fill={colors.addButtonText}>
              Add list
            </Text>
          </AutoLayout>
        )}
      </AutoLayout>
    </AutoLayout>
  );
}

// Todo Item Component
function TodoItem({
  todo,
  width,
  theme,
  onUpdate,
  onToggle,
  onFocus,
}: {
  todo: TodoItem;
  width: number;
  theme: 'dark' | 'light';
  onUpdate: (text: string) => void;
  onToggle: () => void;
  onFocus?: () => void;
}) {
  const colors = themeColors[theme];

  return (
    <AutoLayout
      direction="horizontal"
      spacing={12}
      width={width}
      verticalAlignItems="center"
    >
      {/* Checkbox */}
      <AutoLayout
        width={16}
        height={16}
        fill={todo.completed ? colors.checkboxFilled : '#00000000'}
        stroke={todo.completed ? colors.checkboxFilled : colors.checkboxStroke}
        strokeWidth={1.6}
        cornerRadius={4}
        horizontalAlignItems="center"
        verticalAlignItems="center"
        onClick={onToggle}
      >
        {todo.completed && (
          <SVG
            src={`<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10 3L4.5 8.5L2 6" stroke="black" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`}
          />
        )}
      </AutoLayout>

      {/* Todo Text */}
      <Input
        value={todo.text}
        placeholder={`To do`}
        onClick={() => {
          if (onFocus) onFocus();
        }}
        onTextEditEnd={(e) => onUpdate(e.characters)}
        fontSize={14}
        fontFamily="Inter"
        fontWeight={400}
        textDecoration={todo.completed ? 'strikethrough' : 'none'}
        fill={todo.completed ? colors.todoCompleted : colors.textPrimary}
        width={width - 24}
        inputFrameProps={{
          fill: '#00000000',
          padding: 0,
        }}
      />
    </AutoLayout>
  );
}



// Add Block Menu Component
function AddBlockMenu({ onAddText, onAddTodo, onAddCode }: { onAddText: () => void; onAddTodo: () => void; onAddCode: () => void }) {
  return (
    <AutoLayout
      name="AddBlock"
      cornerRadius={8}
      verticalAlignItems="center"
      effect={{
        type: 'drop-shadow',
        color: { r: 0, g: 0, b: 0, a: 0.2 },
        offset: { x: 0, y: 4 },
        blur: 12,
      }}
    >
      <SVG
        name="Vector 3372"
        height="fill-parent"
        src={`<svg height='40' viewBox='0 0 0 40' fill='none' xmlns='http://www.w3.org/2000/svg'>
<path d='M0 0V40' stroke='#363636' stroke-width='2'/>
</svg>`}
      />
      <AutoLayout
        name="Notes section"
        fill="#151515"
        overflow="visible"
        spacing={11}
        padding={{
          top: 8,
          right: 12,
          bottom: 8,
          left: 12,
        }}
        verticalAlignItems="center"
      >
        <AutoLayout
          name="Notes button"
          fill="#2D2D2D"
          cornerRadius={4}
          overflow="visible"
          spacing={4}
          padding={{
            vertical: 4,
            horizontal: 8,
          }}
          height={24}
          horizontalAlignItems="center"
          verticalAlignItems="center"
          onClick={onAddText}
          hoverStyle={{ fill: "#3D3D3D" }}
        >
          <Frame
            name="Notes"
            width={12}
            height={12}
          >
            <SVG
              name="notes icon"
              width={12}
              height={12}
              src={`<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.42576 1.76407C8.55708 1.63275 8.71301 1.52858 8.88461 1.45751C9.05613 1.38644 9.24003 1.34985 9.42581 1.34985C9.61151 1.34985 9.79541 1.38644 9.96693 1.45751C10.1385 1.52858 10.2945 1.63275 10.4258 1.76407C10.5571 1.8954 10.6613 2.05129 10.7323 2.22288C10.8034 2.39445 10.84 2.57835 10.84 2.76407C10.84 2.94979 10.8034 3.13368 10.7323 3.30527C10.6613 3.47685 10.5571 3.63275 10.4258 3.76407L4.55078 9.63908L1.80078 10.3891L2.55078 7.63905L8.42576 1.76407Z" stroke="#7BA7AA" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`}
            />
          </Frame>
          <Text
            name="Notes"
            fill="#FFF"
            verticalAlignText="center"
            lineHeight={24}
            fontFamily="Inter"
            fontSize={12}
            letterSpacing={0.5}
            fontWeight={500}
          >
            Notes
          </Text>
        </AutoLayout>
      </AutoLayout>
      <SVG
        name="divider"
        height="fill-parent"
        src={`<svg height='40' viewBox='0 0 0 40' fill='none' xmlns='http://www.w3.org/2000/svg'>
<path d='M0 0V40' stroke='#363636' stroke-width='2'/>
</svg>`}
      />
      <AutoLayout
        name="To-do section"
        fill="#151515"
        overflow="visible"
        spacing={11}
        padding={{
          top: 8,
          right: 12,
          bottom: 8,
          left: 12,
        }}
        verticalAlignItems="center"
      >
        <AutoLayout
          name="To do button"
          fill="#2D2D2D"
          cornerRadius={4}
          overflow="visible"
          spacing={8}
          padding={{
            vertical: 4,
            horizontal: 8,
          }}
          height={24}
          horizontalAlignItems="center"
          verticalAlignItems="center"
          onClick={onAddTodo}
          hoverStyle={{ fill: "#3D3D3D" }}
        >
          <Frame
            name="to do icon"
            width={12}
            height={12}
          >
            <SVG
              name="Tick_box"
              height={12}
              width={12}
              src={`<svg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'>
<path d='M4 5.29087C4.89297 5.98352 5.36411 6.40284 6.09919 7.25455C7.40407 5.49014 9.0131 3.551 10.5 2' stroke='#7BA7AA' stroke-width='1.13455' stroke-linecap='round' stroke-linejoin='round'/>
<path d='M7.5 1.5H3.3C2.30589 1.5 1.5 2.30589 1.5 3.3V8.7C1.5 9.69411 2.30589 10.5 3.3 10.5H8.7C9.69411 10.5 10.5 9.69411 10.5 8.7V5.5' stroke='#7BA7AA' stroke-width='0.9' stroke-linecap='round'/>
</svg>`}
            />
          </Frame>
          <Text
            name="To-do"
            fill="#FFF"
            verticalAlignText="center"
            lineHeight={24}
            fontFamily="Inter"
            fontSize={12}
            letterSpacing={0.5}
            fontWeight={500}
          >
            To-do
          </Text>
        </AutoLayout>
      </AutoLayout>
      <SVG
        name="divider-2"
        height="fill-parent"
        src={`<svg height='40' viewBox='0 0 0 40' fill='none' xmlns='http://www.w3.org/2000/svg'>
<path d='M0 0V40' stroke='#363636' stroke-width='2'/>
</svg>`}
      />
      <AutoLayout
        name="Code section"
        fill="#151515"
        overflow="visible"
        spacing={11}
        padding={{
          top: 8,
          right: 12,
          bottom: 8,
          left: 12,
        }}
        verticalAlignItems="center"
      >
        <AutoLayout
          name="Code button"
          fill="#2D2D2D"
          cornerRadius={4}
          overflow="visible"
          spacing={8}
          padding={{
            vertical: 4,
            horizontal: 8,
          }}
          height={24}
          horizontalAlignItems="center"
          verticalAlignItems="center"
          onClick={onAddCode}
          hoverStyle={{ fill: "#3D3D3D" }}
        >
          <Frame
            name="code icon"
            width={12}
            height={12}
          >
            <SVG
              name="code-icon"
              height={12}
              width={12}
              src={codeIcon}
            />
          </Frame>
          <Text
            name="Code"
            fill="#FFF"
            verticalAlignText="center"
            lineHeight={24}
            fontFamily="Inter"
            fontSize={12}
            letterSpacing={0.5}
            fontWeight={500}
          >
            Code
          </Text>
        </AutoLayout>
      </AutoLayout>
    </AutoLayout>
  );
}



// Close Button Component
function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <AutoLayout
      width={16}
      height={16}
      fill="#00000000"
      positioning="absolute"
      x={{ type: 'right', offset: -6 }}
      y={-6}
      onClick={onClick}
      horizontalAlignItems="center"
      verticalAlignItems="center"
    >
      <SVG
        src={`<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="12" height="12" rx="6" fill="black"/>
<path d="M5.9999 6.70039L3.5499 9.15039C3.45824 9.24206 3.34157 9.28789 3.1999 9.28789C3.05824 9.28789 2.94157 9.24206 2.8499 9.15039C2.75824 9.05872 2.7124 8.94206 2.7124 8.80039C2.7124 8.65872 2.75824 8.54206 2.8499 8.45039L5.2999 6.00039L2.8499 3.55039C2.75824 3.45872 2.7124 3.34206 2.7124 3.20039C2.7124 3.05872 2.75824 2.94206 2.8499 2.85039C2.94157 2.75872 3.05824 2.71289 3.1999 2.71289C3.34157 2.71289 3.45824 2.75872 3.5499 2.85039L5.9999 5.30039L8.4499 2.85039C8.54157 2.75872 8.65824 2.71289 8.7999 2.71289C8.94157 2.71289 9.05824 2.75872 9.1499 2.85039C9.24157 2.94206 9.2874 3.05872 9.2874 3.20039C9.2874 3.34206 9.24157 3.45872 9.1499 3.55039L6.6999 6.00039L9.1499 8.45039C9.24157 8.54206 9.2874 8.65872 9.2874 8.80039C9.2874 8.94206 9.24157 9.05872 9.1499 9.15039C9.05824 9.24206 8.94157 9.28789 8.7999 9.28789C8.65824 9.28789 8.54157 9.24206 8.4499 9.15039L5.9999 6.70039Z" fill="white"/>
</svg>`}
      />
    </AutoLayout>
  );
}


// Helper Functions
function getTextFormat(format: TextFormat): { fontSize: number; fontWeight: number; lineHeight: number } {
  switch (format) {
    case 'H1':
      return { fontSize: 16, fontWeight: 700, lineHeight: 24 };
    case 'B1':
      return { fontSize: 14, fontWeight: 400, lineHeight: 22 };
    case 'C1':
      return { fontSize: 10, fontWeight: 400, lineHeight: 17 };
  }
}



widget.register(StickyProWidget);
