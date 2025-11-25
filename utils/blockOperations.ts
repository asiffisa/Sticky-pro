// Block operation functions - pure business logic separated from state management
import type { Block, BlockType, TextFormat, ListType, TodoItem, TextLine } from './types';
import { generateId } from './utils/helpers';

/**
 * Validates if a block exists in the blocks array
 * @param blocks - Array of blocks
 * @param blockId - ID of the block to validate
 * @returns true if block exists, false otherwise
 */
export function validateBlockExists(blocks: Block[], blockId: string): boolean {
    return blocks.some((b) => b.id === blockId);
}

/**
 * Creates a new block with the specified type
 * @param type - Type of block to create (text, todo, or code)
 * @returns New block object
 */
export function createBlock(type: BlockType): Block {
    const blockId = generateId();
    const newBlock: Block = {
        id: blockId,
        type,
        content: '',
        ...(type === 'text' && {
            format: 'B1' as TextFormat,
            listType: 'none' as ListType,
            lines: [{ id: generateId(), text: '', format: 'B1' as TextFormat }]
        }),
        ...(type === 'code' && {
            format: 'B1' as TextFormat,
            listType: 'none' as ListType,
            lines: [{ id: generateId(), text: '', format: 'B1' as TextFormat }]
        }),
        ...(type === 'todo' && {
            todos: [{ id: generateId(), text: '', completed: false }]
        }),
    };
    return newBlock;
}

/**
 * Creates a new text line
 * @param format - Text format for the line
 * @returns New text line object
 */
export function createTextLine(format: TextFormat = 'B1'): TextLine {
    return {
        id: generateId(),
        text: '',
        format,
    };
}

/**
 * Creates a new todo item
 * @returns New todo item object
 */
export function createTodoItem(): TodoItem {
    return {
        id: generateId(),
        text: '',
        completed: false,
    };
}

/**
 * Filters out a block from the blocks array
 * @param blocks - Array of blocks
 * @param blockId - ID of block to remove
 * @returns New array without the specified block
 */
export function removeBlock(blocks: Block[], blockId: string): Block[] {
    return blocks.filter((b) => b.id !== blockId);
}

/**
 * Updates a block's content
 * @param blocks - Array of blocks
 * @param blockId - ID of block to update
 * @param content - New content
 * @returns New array with updated block
 */
export function updateBlockContent(blocks: Block[], blockId: string, content: string): Block[] {
    return blocks.map((b) => b.id === blockId ? { ...b, content } : b);
}

/**
 * Updates a block's format
 * @param blocks - Array of blocks
 * @param blockId - ID of block to update
 * @param format - New format
 * @returns New array with updated block
 */
export function updateBlockFormat(blocks: Block[], blockId: string, format: TextFormat): Block[] {
    return blocks.map((b) => b.id === blockId ? { ...b, format } : b);
}

/**
 * Updates a block's list type
 * @param blocks - Array of blocks
 * @param blockId - ID of block to update
 * @param listType - New list type
 * @returns New array with updated block
 */
export function updateBlockListType(blocks: Block[], blockId: string, listType: ListType): Block[] {
    return blocks.map((b) => b.id === blockId ? { ...b, listType } : b);
}
