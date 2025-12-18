import { TextBlock } from './TextBlock';
import { TodoBlock } from './TodoBlock';
import type { Block, TextFormat } from '../types';

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
export function BlockComponent({
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
