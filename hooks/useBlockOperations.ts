import type { Block, BlockType, TextFormat, ListType, TodoItem, TextLine } from '../types';
import { generateId } from '../utils/helpers';

/**
 * Custom hook for block operations
 * 
 * Provides a comprehensive set of functions for managing blocks in the widget.
 * All operations are centralized here to ensure consistency and reduce code duplication.
 * 
 * @param blocks - Current array of blocks
 * @param setBlocks - State setter function for blocks
 * @returns Object containing all block operation functions
 * 
 * @example
 * ```typescript
 * const blockOps = createBlockOperations(blocks, setBlocks);
 * blockOps.addBlock('text');
 * blockOps.deleteBlock('block-id');
 * ```
 */
export function createBlockOperations(
    blocks: Block[],
    setBlocks: (blocks: Block[]) => void
) {
    /**
     * Updates a block by ID using a mapper function
     * This is a reusable helper to avoid repetitive map operations
     */
    const updateBlock = (blockId: string, updater: (block: Block) => Block) => {
        setBlocks(blocks.map((block) => block.id === blockId ? updater(block) : block));
    };

    /**
     * Deletes a block by ID with validation
     */
    const deleteBlock = (blockId: string): boolean => {
        const blockExists = blocks.some((b) => b.id === blockId);
        if (!blockExists) {
            console.warn(`[deleteBlock] Block ${blockId} not found`);
            return false;
        }
        setBlocks(blocks.filter((b) => b.id !== blockId));
        return true;
    };

    /**
     * Adds a new block of the specified type
     */
    const addBlock = (type: BlockType): string => {
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
        return blockId;
    };

    /**
     * Adds a line to a text/code block
     */
    const addLineToBlock = (blockId: string, afterLineId?: string) => {
        updateBlock(blockId, (block) => {
            if (block.type !== 'text' && block.type !== 'code') return block;

            const lines = block.lines || [{ id: generateId(), text: block.content || '', format: block.format || 'B1' }];
            const newLine: TextLine = {
                id: generateId(),
                text: '',
                format: lines[lines.length - 1]?.format || 'B1',
            };

            if (afterLineId) {
                const index = lines.findIndex(l => l.id === afterLineId);
                if (index === -1) return block; // Validation

                const newLines = [
                    ...lines.slice(0, index + 1),
                    newLine,
                    ...lines.slice(index + 1),
                ];
                return { ...block, lines: newLines };
            }

            return { ...block, lines: [...lines, newLine] };
        });
    };

    /**
     * Updates a line in a text/code block
     */
    const updateLineInBlock = (blockId: string, lineId: string, text: string) => {
        updateBlock(blockId, (block) => {
            if (block.type !== 'text' && block.type !== 'code') return block;

            const lines = block.lines || [];
            return {
                ...block,
                lines: lines.map(l => l.id === lineId ? { ...l, text } : l)
            };
        });
    };

    /**
     * Updates line format in a text/code block
     */
    const updateLineFormat = (blockId: string, lineId: string, format: TextFormat) => {
        updateBlock(blockId, (block) => {
            if (block.type !== 'text' && block.type !== 'code') return block;

            return {
                ...block,
                lines: (block.lines || []).map(l => l.id === lineId ? { ...l, format } : l)
            };
        });
    };

    /**
     * Deletes a line from a text/code block
     */
    const deleteLineFromBlock = (blockId: string, lineId: string) => {
        updateBlock(blockId, (block) => {
            if (block.type !== 'text' && block.type !== 'code') return block;

            const lines = (block.lines || []).filter(l => l.id !== lineId);
            // Keep at least one empty line
            return {
                ...block,
                lines: lines.length === 0 ? [{ id: generateId(), text: '', format: 'B1' }] : lines
            };
        });
    };

    /**
     * Updates block content
     */
    const updateBlockContent = (blockId: string, content: string) => {
        updateBlock(blockId, (block) => ({ ...block, content }));
    };

    /**
     * Updates block format
     */
    const updateBlockFormat = (blockId: string, format: TextFormat) => {
        updateBlock(blockId, (block) => ({ ...block, format }));
    };

    /**
     * Updates block list type
     */
    const updateBlockListType = (blockId: string, listType: ListType) => {
        updateBlock(blockId, (block) => ({ ...block, listType }));
    };

    /**
     * Adds a todo item to a todo block
     */
    const addTodoItem = (blockId: string) => {
        updateBlock(blockId, (block) => {
            if (block.type !== 'todo') return block;

            const newTodo: TodoItem = {
                id: generateId(),
                text: '',
                completed: false,
            };
            return { ...block, todos: [...(block.todos || []), newTodo] };
        });
    };

    /**
     * Updates a todo item
     */
    const updateTodoItem = (blockId: string, todoId: string, text: string) => {
        updateBlock(blockId, (block) => {
            if (block.type !== 'todo') return block;

            return {
                ...block,
                todos: (block.todos || []).map((t) => t.id === todoId ? { ...t, text } : t)
            };
        });
    };

    /**
     * Toggles todo completion status
     */
    const toggleTodoCompletion = (blockId: string, todoId: string) => {
        updateBlock(blockId, (block) => {
            if (block.type !== 'todo') return block;

            return {
                ...block,
                todos: (block.todos || []).map((t) => t.id === todoId ? { ...t, completed: !t.completed } : t)
            };
        });
    };

    /**
     * Deletes a todo item
     */
    const deleteTodoItem = (blockId: string, todoId: string) => {
        updateBlock(blockId, (block) => {
            if (block.type !== 'todo') return block;

            const todos = (block.todos || []).filter(t => t.id !== todoId);
            // Keep at least one empty todo
            return {
                ...block,
                todos: todos.length === 0 ? [{ id: generateId(), text: '', completed: false }] : todos
            };
        });
    };

    /**
     * Inserts a block after a specific block
     */
    const insertBlockAfter = (blockId: string): boolean => {
        const blockIndex = blocks.findIndex((b) => b.id === blockId);
        if (blockIndex === -1) {
            console.warn(`[insertBlockAfter] Block ${blockId} not found`);
            return false;
        }

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
        return true;
    };

    /**
     * Inserts a todo item after a specific todo
     */
    const insertTodoAfter = (blockId: string, todoId: string) => {
        updateBlock(blockId, (block) => {
            if (block.type !== 'todo') return block;

            const todos = block.todos || [];
            const todoIndex = todos.findIndex((t) => t.id === todoId);
            if (todoIndex === -1) {
                console.warn(`[insertTodoAfter] Todo ${todoId} not found`);
                return block;
            }

            const newTodo: TodoItem = {
                id: generateId(),
                text: '',
                completed: false,
            };

            return {
                ...block,
                todos: [
                    ...todos.slice(0, todoIndex + 1),
                    newTodo,
                    ...todos.slice(todoIndex + 1),
                ]
            };
        });
    };

    return {
        updateBlock,
        deleteBlock,
        addBlock,
        addLineToBlock,
        updateLineInBlock,
        updateLineFormat,
        deleteLineFromBlock,
        updateBlockContent,
        updateBlockFormat,
        updateBlockListType,
        addTodoItem,
        updateTodoItem,
        toggleTodoCompletion,
        deleteTodoItem,
        insertBlockAfter,
        insertTodoAfter,
    };
}
