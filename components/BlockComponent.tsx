import { TextBlock } from './TextBlock';
import { TodoBlock } from './TodoBlock';
import type { Block } from '../types';

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
 * @param onDelete - Callback to delete the block
 * @param onContentChange - Callback when block content changes
 * @param onAddLine - Callback to add a new line (text blocks)
 * @param onUpdateLine - Callback to update a line (text blocks)
 * @param onAddTodo - Callback to add a todo item (todo blocks)
 * @param onUpdateTodo - Callback to update a todo item (todo blocks)
 * @param onToggleTodo - Callback to toggle todo completion (todo blocks)
 */
export function BlockComponent({
    block,
    width,
    isFirst,
    onFocus,
    onDelete,
    onContentChange,
    onAddLine,
    onUpdateLine,
    onAddTodo,
    onUpdateTodo,
    onToggleTodo,
    isFocused,
    theme,
}: {
    block: Block;
    width: number;
    isFirst: boolean;
    isFocused?: boolean;
    theme: 'dark' | 'light';
    onFocus: (opts?: { lineId?: string; todoId?: string }) => void;
    onDelete: () => void;
    onContentChange: (content: string) => void;
    onAddLine?: (afterLineId: string) => void;
    onUpdateLine?: (lineId: string, text: string) => void;
    onAddTodo?: () => void;
    onUpdateTodo?: (todoId: string, text: string) => void;
    onToggleTodo?: (todoId: string) => void;
}) {
    if (block.type === 'text' || block.type === 'code') {
        return (
            <TextBlock
                block={block}
                width={width}
                isFirst={isFirst}
                theme={theme}
                onFocus={onFocus}
                onDelete={onDelete}
                onContentChange={onContentChange}
                onAddLine={onAddLine}
                onUpdateLine={onUpdateLine}
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
                onDelete={onDelete}
                onAddTodo={onAddTodo!}
                onUpdateTodo={onUpdateTodo!}
                onToggleTodo={onToggleTodo!}
            />
        );
    }
}
