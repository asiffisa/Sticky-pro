const { widget } = figma;
const { useSyncedState, usePropertyMenu, AutoLayout, Input, Text, SVG, Frame } = widget;

// Import types
import type { BlockType, TextFormat, TodoItem, Block } from './types';

// Import constants
import { themeColors } from './constants/theme';
import {
  codeIcon,
  getPlusIcon,
  getRotatedPlusIcon,
} from './constants/icons';

// Import utilities
import { generateId } from './utils/helpers';
import { createPropertyMenu, handlePropertyMenuAction } from './utils/propertyMenu';
import { getTextFormat } from './utils/textFormat';

// Import hooks
import { createBlockOperations } from './hooks/useBlockOperations';
import { createFocusManagement } from './hooks/useFocusManagement';

// Import components
import { MainHeading } from './components/MainHeading';
import { CloseButton } from './components/CloseButton';

/**
 * Main Widget Component for Sticky Pro
 * 
 * A versatile Figma widget that supports multiple block types:
 * - Text blocks with formatting (H1, B1, C1)
 * - Code blocks with syntax highlighting
 * - Todo blocks with checkboxes
 * 
 * Features:
 * - Dark/Light theme support
 * - Resizable width (360px or 480px)
 * - Native Figma property menu integration
 * - Focus management for inline editing
 */
function StickyProWidget() {
  // ==================== State Management ====================

  /** Main heading text displayed at the top of the widget */
  const [mainHeading, setMainHeading] = useSyncedState<string>('mainHeading', '');

  /** Array of all blocks in the widget */
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

  /** Widget width - either 360px (narrow) or 480px (wide) */
  const [width, setWidth] = useSyncedState<360 | 480>('width', 360);

  /** ID of the currently focused block, null if no block is focused */
  const [focusedBlockId, setFocusedBlockId] = useSyncedState<string | null>('focusedBlockId', null);

  /** ID of the currently focused line within a text block */
  const [focusedLineId, setFocusedLineId] = useSyncedState<string | null>('focusedLineId', null);

  /** ID of the currently focused todo item within a todo block */
  const [focusedTodoId, setFocusedTodoId] = useSyncedState<string | null>('focusedTodoId', null);

  /** Controls visibility of the add block toolbar */
  const [showAddBlockToolbar, setShowAddBlockToolbar] = useSyncedState<boolean>('showAddBlockToolbar', false);

  /** Current theme - 'dark' or 'light' */
  const [theme, setTheme] = useSyncedState<'dark' | 'light'>('theme', 'dark');

  // ==================== Derived State ====================

  /** The currently focused block object, or undefined if no block is focused */
  const focusedBlock = blocks.find((b) => b.id === focusedBlockId);

  // ==================== Custom Hooks ====================

  /** Block operations hook - provides all block manipulation functions */
  const blockOps = createBlockOperations(blocks, setBlocks);

  /** Focus management hook - provides focus state management functions */
  const focusOps = createFocusManagement(
    focusedBlockId,
    setFocusedBlockId,
    focusedLineId,
    setFocusedLineId,
    focusedTodoId,
    setFocusedTodoId
  );

  // ==================== Helper Functions ====================

  /**
   * Toggles the widget width between narrow (360px) and wide (480px)
   */
  const toggleWidth = () => {
    setWidth(width === 360 ? 480 : 360);
  };

  /**
   * Deletes a block and clears focus if the deleted block was focused
   * @param blockId - ID of the block to delete
   */
  const handleDeleteBlock = (blockId: string) => {
    focusOps.clearFocusIfBlock(blockId);
    blockOps.deleteBlock(blockId);
  };

  /**
   * Adds a new block of the specified type and sets focus to it
   * @param type - Type of block to add ('text', 'code', or 'todo')
   */
  const handleAddBlock = (type: BlockType) => {
    const blockId = blockOps.addBlock(type);
    setFocusedBlockId(blockId);
    setShowAddBlockToolbar(false);
  };

  // ==================== Property Menu ====================

  /**
   * Native Figma property menu configuration
   * Note: The position of this menu is controlled by Figma and cannot be changed.
   * The menu shows different options based on the focused block type.
   */
  usePropertyMenu(
    createPropertyMenu(focusedBlockId, focusedBlock, theme, width),
    ({ propertyName }) => {
      handlePropertyMenuAction(
        propertyName,
        focusedBlockId,
        focusedBlock,
        focusedLineId,
        focusedTodoId,
        {
          toggleWidth,
          setTheme,
          updateLineFormat: blockOps.updateLineFormat,
          updateBlockFormat: blockOps.updateBlockFormat,
          updateBlockListType: blockOps.updateBlockListType,
          deleteLineFromBlock: blockOps.deleteLineFromBlock,
          setFocusedLineId,
          deleteTodoItem: blockOps.deleteTodoItem,
          setFocusedTodoId,
        },
        theme
      );
    }
  );

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
          onFocus={() => focusOps.clearFocus()}
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
            onFocus={(opts?: { lineId?: string; todoId?: string }) => focusOps.focusBlock(block.id, opts)}
            onBlur={() => focusOps.clearFocus()}
            onDelete={() => handleDeleteBlock(block.id)}
            onContentChange={(content) => blockOps.updateBlockContent(block.id, content)}
            onInsertAfter={() => blockOps.insertBlockAfter(block.id)}
            onAddLine={(afterLineId) => blockOps.addLineToBlock(block.id, afterLineId)}
            onUpdateLine={(lineId, text) => blockOps.updateLineInBlock(block.id, lineId, text)}
            onUpdateLineFormat={(lineId, format) => blockOps.updateLineFormat(block.id, lineId, format)}
            onDeleteLine={(lineId) => blockOps.deleteLineFromBlock(block.id, lineId)}
            onAddTodo={() => blockOps.addTodoItem(block.id)}
            onUpdateTodo={(todoId, text) => blockOps.updateTodoItem(block.id, todoId, text)}
            onToggleTodo={(todoId) => blockOps.toggleTodoCompletion(block.id, todoId)}
            onInsertTodoAfter={(todoId) => blockOps.insertTodoAfter(block.id, todoId)}
          />
        ))}

        {/* Add Block Button / Close Toolbar Button */}
        <AutoLayout
          direction="horizontal"
          spacing={4}
          padding={{ top: 12, bottom: 0, left: 0, right: 0 }}
          width="hug-contents"
          verticalAlignItems="center"
          onClick={() => setShowAddBlockToolbar(!showAddBlockToolbar)}
        >
          {showAddBlockToolbar ? (
            <>
              <SVG
                src={getRotatedPlusIcon(colors.addButtonText)}
                width={10}
                height={10}
              />
              <Text
                fontSize={12}
                fontFamily="Inter"
                fontWeight={400}
                fill={colors.addButtonText}
                horizontalAlignText="center"
              >
                Close block
              </Text>
            </>
          ) : (
            <>
              <SVG
                src={getPlusIcon(colors.addButtonText)}
                width={10}
                height={10}
              />
              <Text
                fontSize={12}
                fontFamily="Inter"
                fontWeight={400}
                fill={colors.addButtonText}
                horizontalAlignText="center"
              >
                Add new block
              </Text>
            </>
          )}
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
            onAddText={() => handleAddBlock('text')}
            onAddTodo={() => handleAddBlock('todo')}
            onAddCode={() => handleAddBlock('code')}
          />
        </AutoLayout>
      )}
    </AutoLayout>
  );
}

// ==================== Components ====================
// MainHeading, CloseButton imported from ./components


/**
 * Block Component Router
 * 
 * Routes to the appropriate block component based on block type.
 * Handles text, code, and todo blocks.
 * 
 * @param block - The block data object
 * @param width - Width of the block
 * @param isFirst - Whether this is the first block (affects top padding)
 * @param isFocused - Whether this block is currently focused
 * @param theme - Current theme
 * @param onFocus - Callback when block gains focus
 * @param onBlur - Callback when block loses focus
 * @param onDelete - Callback to delete the block
 * @param onContentChange - Callback when block content changes
 * @param onInsertAfter - Callback to insert a new block after this one
 * @param onAddLine - Callback to add a new line (text blocks)
 * @param onUpdateLine - Callback to update a line (text blocks)
 * @param onUpdateLineFormat - Callback to update line format (text blocks)
 * @param onDeleteLine - Callback to delete a line (text blocks)
 * @param onAddTodo - Callback to add a todo item (todo blocks)
 * @param onUpdateTodo - Callback to update a todo item (todo blocks)
 * @param onToggleTodo - Callback to toggle todo completion (todo blocks)
 * @param onInsertTodoAfter - Callback to insert a todo after another (todo blocks)
 */
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
  onFocus: (opts?: { lineId?: string; todoId?: string }) => void;
  onBlur: () => void;
  onDelete: () => void;
  onContentChange: (content: string) => void;
  onInsertAfter?: () => void;
  onAddLine?: (afterLineId: string) => void;
  onUpdateLine?: (lineId: string, text: string) => void;
  onUpdateLineFormat?: (lineId: string, format: TextFormat) => void;
  onDeleteLine?: (lineId: string) => void;
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

/**
 * Text Block Component
 * 
 * Displays a text or code block with support for:
 * - Multiple lines with individual formatting
 * - List types (bullet, numbered)
 * - Code syntax highlighting
 * - Inline editing
 * 
 * @param block - The block data object
 * @param width - Width of the block
 * @param isFirst - Whether this is the first block
 * @param theme - Current theme
 * @param onFocus - Callback when block or line gains focus
 * @param onBlur - Callback when block loses focus
 * @param onDelete - Callback to delete the block
 * @param onContentChange - Callback when content changes (code blocks)
 * @param onInsertAfter - Callback to insert block after this one
 * @param onAddLine - Callback to add a new line
 * @param onUpdateLine - Callback to update a line
 * @param onUpdateLineFormat - Callback to update line format
 * @param onDeleteLine - Callback to delete a line
 */
function TextBlock({
  block,
  width,
  isFirst,
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
}: {
  block: Block;
  width: number;
  isFirst: boolean;
  theme: 'dark' | 'light';
  onFocus: (opts?: { lineId?: string; todoId?: string }) => void;
  onBlur: () => void;
  onDelete: () => void;
  onContentChange: (content: string) => void;
  onInsertAfter?: () => void;
  onAddLine?: (afterLineId: string) => void;
  onUpdateLine?: (lineId: string, text: string) => void;
  onUpdateLineFormat?: (lineId: string, format: TextFormat) => void;
  onDeleteLine?: (lineId: string) => void;
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
          width="fill-parent"
          overflow="visible"
        >
          {/* Outer Container - Acts as the Stroke */}
          <AutoLayout
            direction="horizontal"
            spacing={0}
            width="fill-parent"
            fill={colors.codeBlockStroke}
            cornerRadius={10}
            padding={{ left: 1.2, right: 0, top: 0, bottom: 0 }}
            onClick={() => onFocus()}
          >
            {/* Inner Container - Actual Block Content */}
            <AutoLayout
              direction="vertical"
              width="fill-parent"
              fill={colors.blockBg}
              cornerRadius={{
                topLeft: 8.8,
                bottomLeft: 8.8,
                topRight: 10,
                bottomRight: 10,
              }}
              padding={{ left: 11, right: 12, top: 12, bottom: 12 }}
            >
              <Input
                inputBehavior="multiline"
                placeholder="<Type code>"
                value={block.content}
                onTextEditEnd={(e) => onContentChange(e.characters)}
                onClick={() => onFocus()}
                fontSize={14}
                fontFamily="Source Code Pro"
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

          {/* Close button - show when focused OR when it's the initial default block */}
          <CloseButton onClick={onDelete} />
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
        onClick={() => onFocus()}
      >
        {/* Close button - show when focused OR when it's the initial default block */}
        <CloseButton onClick={onDelete} />

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
                  onClick={() => {
                    onFocus({ lineId: line.id });
                  }}
                >

                  <Input
                    inputBehavior="multiline"
                    placeholder={"Type"}
                    value={line.text}
                    onTextEditEnd={(e) => onUpdateLine && onUpdateLine(line.id, e.characters)}
                    fontSize={fontSize}
                    fontFamily={block.type === 'code' ? "Source Code Pro" : "Inter"}
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



/**
 * Todo Block Component
 * 
 * Displays a todo list block with checkboxes.
 * Supports adding, editing, and completing todo items.
 * 
 * @param block - The block data object
 * @param width - Width of the block
 * @param isFirst - Whether this is the first block
 * @param isFocused - Whether this block is currently focused
 * @param theme - Current theme
 * @param onFocus - Callback when block or todo gains focus
 * @param onBlur - Callback when block loses focus
 * @param onDelete - Callback to delete the block
 * @param onAddTodo - Callback to add a new todo item
 * @param onUpdateTodo - Callback to update a todo item
 * @param onToggleTodo - Callback to toggle todo completion
 * @param onInsertTodoAfter - Callback to insert todo after another
 */
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
  onFocus: (opts?: { lineId?: string; todoId?: string }) => void;
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
        onClick={() => onFocus()}
      >
        {/* Close button - show when focused OR when it's the initial default block */}
        <CloseButton onClick={onDelete} />

        {/* Todo Items */}
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            width={width - 36}
            theme={theme}
            onUpdate={(text) => onUpdateTodo(todo.id, text)}
            onToggle={() => onToggleTodo(todo.id)}
            onFocus={(opts) => onFocus(opts)}
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

/**
 * Todo Item Component
 * 
 * Displays a single todo item with checkbox and text input.
 * 
 * @param todo - The todo item data
 * @param width - Width of the todo item
 * @param theme - Current theme
 * @param onUpdate - Callback when todo text is updated
 * @param onToggle - Callback when checkbox is toggled
 * @param onFocus - Callback when todo gains focus
 */
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
  onFocus?: (opts?: { todoId?: string }) => void;
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
<path d="M10 3L4.5 8.5L2 6" stroke="${colors.checkboxTick}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`}
          />
        )}
      </AutoLayout>


      {/* Todo Text */}
      <AutoLayout
        width={width - 24}
        height="hug-contents"
        onClick={() => {
          if (onFocus) onFocus({ todoId: todo.id });
        }}
      >
        <Input
          value={todo.text}
          placeholder={`To do`}
          onTextEditEnd={(e) => onUpdate(e.characters)}
          fontSize={14}
          fontFamily="Inter"
          fontWeight={400}
          textDecoration={todo.completed ? 'strikethrough' : 'none'}
          fill={todo.completed ? colors.todoCompleted : colors.textPrimary}
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



/**
 * Add Block Menu Component
 * 
 * Displays a floating menu with options to add different block types.
 * Appears at the bottom of the widget when triggered.
 * 
 * @param onAddText - Callback to add a text block
 * @param onAddTodo - Callback to add a todo block
 * @param onAddCode - Callback to add a code block
 */
function AddBlockMenu({ onAddText, onAddTodo, onAddCode }: { onAddText: () => void; onAddTodo: () => void; onAddCode: () => void }) {
  return (
    <AutoLayout
      name="AddBlock"
      cornerRadius={10}
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
          right: 10,
          bottom: 8,
          left: 8,
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
          right: 10,
          bottom: 8,
          left: 10,
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
          right: 8,
          bottom: 8,
          left: 10,
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

// ==================== Widget Registration ====================

widget.register(StickyProWidget);
