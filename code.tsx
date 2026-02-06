const { widget } = figma;
const { useSyncedState, usePropertyMenu, AutoLayout, Text, SVG } = widget;

// Import types
import type { BlockType, Block } from './types';

// Import constants
import { themeColors } from './constants/theme';
import {
  getPlusIcon,
  getRotatedPlusIcon,
} from './constants/icons';

// Import utilities
import { createPropertyMenu, handlePropertyMenuAction } from './utils/propertyMenu';

// Import hooks
import { createBlockOperations } from './hooks/useBlockOperations';
import { createFocusManagement } from './hooks/useFocusManagement';

// Import components
import { MainHeading } from './components/MainHeading';
import { BlockComponent } from './components/BlockComponent';
import { AddBlockMenu } from './components/AddBlockMenu';

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

// ==================== Widget Registration ====================

widget.register(StickyProWidget);
